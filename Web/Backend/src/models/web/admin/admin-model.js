/**
 * Auth model file
 *
 * @package   backend/src/models
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var db = require('../../../database/database')
var message  = require('../../../constants/message')
var bcrypt = require('bcrypt-nodejs')
var table  = require('../../../constants/table')
const s3Helper = require('../../../helper/s3helper')
const s3buckets = require('../../../constants/s3buckets')
const timeHelper = require('../../../helper/timeHelper')
const {sendMail} = require('../../../helper/mailHelper')
var mail = require('../../../constants/mail')
var randtoken = require('rand-token');
var code = require('../../../constants/code')

var adminModel = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    getUserList: getUserList,
    checkDuplicateUser: checkDuplicateUser,
    createUserInfo: createUserInfo,
    getUser: getUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    deleteAllUser: deleteAllUser,
}

/**
 * get profile data for user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getProfile(uid) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + table.USERS + ' WHERE userID = ? and permission = "active" and status = "active"'
        let query_role = 'SELECT * from ' + table.ROLE + ' where userID = ?'

        db.query(query, [ uid ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length == 0) {
                    reject({ message: message.USER_DELETED })
                } else {
                    db.query(query_role, [ uid ], (error, rows_role, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            let response = rows[0]
                            for (var i = 0 ; i < rows_role.length ; i++ ) {
                                response[rows_role[i].role_name] = rows_role[i].permission
                            }
                            resolve(response)
                        }
                    })
                }
            }
        })
    })
}

/**
 * update profile data for user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateProfile(uid, data, file) {
    return new Promise(async function(resolve, reject) {
        let file_name = ""
        if (file)  {
            uploadS3 = await s3Helper.uploadLogoS3(file, s3buckets.AVATAR)
            file_name = uploadS3.Location
        }

        if (data.new_password === "" || data.new_password === undefined) {
            if (file_name === "") {
                let query = 'UPDATE ' + table.USERS + ' SET lastname = ?, firstname = ?, email = ?, phone = ? WHERE userID = ?'
                db.query(query, [ data.lastname, data.firstname, data.email, data.phone, uid], (error, rows, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                    } else {
                        resolve(uid)
                    }
                })
            } else {
                let query = 'UPDATE ' + table.USERS + ' SET lastname = ?, firstname = ?, email = ?, phone = ?, photo_url = ? WHERE userID = ?'
                db.query(query, [ data.lastname, data.firstname, data.email, data.phone, file_name, uid], (error, rows, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                    } else {
                        resolve(uid)
                    }
                })
            }
        } else {
            getProfile(uid).then((profile) => {
                if (profile) {
                    let hash_database_old_password = profile.password
                    let hash_new_password = bcrypt.hashSync(data.new_password)
                    bcrypt.compare(data.old_password, hash_database_old_password, function(error, result) {
                        if (error) {
                            reject({ message: message.INVALID_PASSWORD })
                        } else {
                            if (result) {
                                if (file_name === "") {
                                    let query = 'UPDATE ' + table.USERS + ' SET lastname = ?, firstname = ?, email = ?, phone = ?, password = ? WHERE userID = ?'
                                    db.query(query, [ data.lastname, data.firstname, data.email, data.phone, hash_new_password, uid ], (error, rows, fields) => {
                                        if (error) {
                                            reject({ message: message.INTERNAL_SERVER_ERROR })
                                        } else {
                                            resolve(profile)
                                        }
                                    })
                                } else {
                                    let query = 'UPDATE ' + table.USERS + ' SET lastname = ?, firstname = ?, email = ?, phone = ?, password = ?, photo_url = ? WHERE userID = ?'
                                    db.query(query, [ data.lastname, data.firstname, data.email, data.phone, hash_new_password, file_name, uid ], (error, rows, fields) => {
                                        if (error) {
                                            reject({ message: message.INTERNAL_SERVER_ERROR })
                                        } else {
                                            resolve(profile)
                                        }
                                    })
                                }
                            } else {
                                reject({ message: message.INVALID_PASSWORD })
                            }
                        }
                    })
                } else {
                    reject({ message: message.INTERNAL_SERVER_ERROR})
                }
            })
        }
    })
}

/**
 * get user list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getUserList(data) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT *, userID ID FROM ' + table.USERS + ' WHERE (lastname like ? or firstname like ?) and ( usertype = "admin" or usertype = "superadmin") and permission = ?'
        sort_column = Number(data.sort_column);
        row_count = Number(data.row_count);
        page_num = Number(data.page_num);
        search_key = '%' + data.search_key + '%'
        if (sort_column === -1)
            query += ' order by userID desc';
        else {
            if (sort_column === 0)
                query += ' order by lastname ';
            else if (sort_column === 1)
                query += ' order by firstname ';
            else if (sort_column === 2)
                query += ' order by email ';
            else if (sort_column === 3)
                query += ' order by phone ';

            query += data.sort_method;
        }
        if (row_count !== -1) {
            query += ' limit ' + page_num * row_count + ',' + row_count
        }
        db.query(query, [ search_key, search_key, data.status ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                getCountUserList(data).then((data) => {
                    resolve({rows: rows, count: data});
                })

            }
        })
    })
}

/**
 * get count for user list for search filter
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getCountUserList(data) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT count(*) count FROM ' + table.USERS + ' WHERE (lastname like ? or firstname like ?) and ( usertype = "admin" or usertype = "superadmin") and permission = ?'
        search_key = '%' + data.search_key + '%'

        db.query(query, [ search_key, search_key, data.status ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows[0].count)
            }
        })
    })
}


/**
 * confirm exist user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object company
 * @return  object If success returns object else returns message
 */
function checkDuplicateUser(data) {
    return new Promise((resolve, reject) => {

        let query = 'Select * from ' + table.USERS + ' where email = ?'

        db.query(query, [ data.email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length > 0)
                    reject({ message: message.USER_EMAIL_DUPLICATED })
                else
                    resolve("ok")
            }
        })
    })
}

/**
 * create user data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createUserInfo(uid, data, file) {
    return new Promise(async (resolve, reject) => {

        let file_name = ""
        if (file)  {
            uploadS3 = await s3Helper.uploadLogoS3(file, s3buckets.AVATAR)
            file_name = uploadS3.Location
        }
    
        let randomPassword = randtoken.generate(15);
        let randomToken = randtoken.generate(50);
        let password = bcrypt.hashSync(randomPassword)
        let query
        let params = []
        if (file_name == "") {
            query = 'Insert into ' + table.USERS + ' (usertype, firstname, lastname, email, password, phone,  created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )';
            params = ["admin", data.firstname, data.lastname, data.email, password, data.phone, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()]
        } else {
            query = 'Insert into ' + table.USERS + ' (usertype, firstname, lastname, email, password, phone, photo_url, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            params = ["admin", data.firstname, data.lastname, data.email, password, data.phone, file_name, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()]
        }
        db.query(query, params, (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                let query = 'select * from ' + table.USERS + ' where email = ?'
                db.query(query, [data.email], (error, rows, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR})
                    } else {
                        let userID = rows[0].userID;
                        let query = `Insert into ` + table.USER_RELATIONSHIP + ` (userID, type, relationID) Values ?`
                        let companyID = JSON.parse(data.companyID);
                        let param = [];
                        for (let i in companyID) {
                            param.push([userID,"company", companyID[i]])
                        }
                        db.query(query, [param], (error, rows, fields) => {
                            if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR })
                            } else {
                                let query = 'insert into ' + table.ROLE + ' (userID, role_name, permission) values ?'
                                let permission_info = JSON.parse(data.permission_info);
                                let params = []
                                for (let i in permission_info) {
                                    params.push([userID, permission_info[i].role_name, permission_info[i].permission])
                                }
                                db.query(query, [params], (error, rows, fields) => {
                                    if (error) {
                                        reject({ message: message.INTERNAL_SERVER_ERROR })
                                    } else {
                                        sendMail(mail.TITLE_ADMIN_CREATE, data.email, mail.TYPE_ADMIN_CREATE, randomPassword, randomToken)
                                            .then((response) => {
                                                resolve("OK")
                                            })
                                            .catch((err) => {
                                                if(err.message.statusCode == code.BAD_REQUEST){
                                                    resolve("OK")
                                                } else {
                                                    resolve("OK")
                                                }
                                            })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
}

/**
 * get manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getUser(uid) {
    return new Promise((resolve, reject) => {
        let query = 'Select * from ' + table.USERS + ' where userID = ?' 
        
        db.query(query, [ uid ], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length == 0)
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                else {
                    let query = 'Select * from ' + table.ROLE + ' where userID = ?'
                    db.query(query, [uid], (error, roles, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            let response = rows[0]
                            for (let i = 0 ; i < roles.length ; i++ ) {
                                response[roles[i].role_name] = roles[i].permission
                            }
                            let query = 'Select * from ' + table.USER_RELATIONSHIP + ' where userID = ?'
                            db.query(query, [uid], (error, rows1, fields) => {
                              if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR});
                              } else {
                                resolve({user: response, companyList: rows1})
                              }
                            })
                        }
                    })
                }     
            }
        })
    })
  }

/**
 * update user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateUser( id, data, file) {
    return new Promise( async (resolve, reject) => {
        let file_name = ""
        let query
        let params = []
        if (file)  {
          uploadS3 = await s3Helper.uploadLogoS3(file, s3buckets.AVATAR)
          file_name = uploadS3.Location
        }
        if (file_name == "") {
            query = 'UPDATE ' + table.USERS + ' SET firstname = ?, lastname = ?, email = ?, phone = ?, updated_at = ? WHERE userID = ?'
            params = [ data.firstname, data.lastname, data.email, data.phone, timeHelper.getCurrentTime(), id ]
        } else {
            query = 'UPDATE ' + table.USERS + ' SET firstname = ?, lastname = ?, email = ?, phone = ?, photo_url = ?, updated_at = ? WHERE userID = ?'
            params = [  data.firstname, data.lastname, data.email, data.phone,  file_name, timeHelper.getCurrentTime(), id ]
        }
  
        db.query(query, params, (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
              let query = 'Delete from ' + table.ROLE + ' where userID = ?' 
              db.query(query, [id], async (error, rows, fields)     => {
                if (error) {
                  reject({ message: message.INTERNAL_SERVER_ERROR });
                } else {
                  let query = `Delete from ` + table.USER_RELATIONSHIP + ` where userID = ?`
                  db.query(query, [id], (error, rows, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                    } else {
                        let userID = id;
                        let query = `Insert into ` + table.USER_RELATIONSHIP + ` (userID, type, relationID) Values ?`
                        let companyID = JSON.parse(data.companyID);
                        let param = [];
                        for (let i in companyID) {
                            param.push([userID,"company", companyID[i]])
                        }
                        db.query(query, [param], (error, rows, fields) => {
                            if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR })
                            } else {
                                let query = 'insert into ' + table.ROLE + ' (userID, role_name, permission) values ?'
                                let permission_info = JSON.parse(data.permission_info);
                                let params = []
                                for (let i in permission_info) {
                                    params.push([userID, permission_info[i].role_name, permission_info[i].permission])
                                }
                                db.query(query, [params], (error, rows, fields) => {
                                    if (error) {
                                        reject({ message: message.INTERNAL_SERVER_ERROR })
                                    } else {
                                        resolve("ok");
                                    }
                                })
                            }
                        })
                    }
                  })
                }
              })
            }
        })
    })
  }

/**
 * delete user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteUser(uid, id, data) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.USERS + ' SET  permission = ?, deleted_by = ?, deleted_at = ? where userID = ?'

        db.query(query, [ data.status, uid, timeHelper.getCurrentTime(), id ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("ok")
            }
        })
    })
}

/**
 * delete trased all user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteAllUser(data) {
    return new Promise((resolve, reject) => {
        let list = data.list
        let query = 'Delete from ' + table.USERS + ' where userID = ?'
        for (let i in list) {
            db.query(query, [list[i]], (error, rows, fields) => {
                if (error) {
                    reject({ message: message.INTERNAL_SERVER_ERROR})
                } else {
                    let query = 'Delete from ' + table.USER_RELATIONSHIP + ' where userID = ?'
                    db.query(query, [list[i]], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR})
                        } else {
                            let query = 'Delete from ' + table.ROLE + ' where userID = ?'
                            db.query(query, [list[i]], (error, rows, fields) => {
                                if (error) {
                                    reject({ message: message.INTERNAL_SERVER_ERROR })
                                }
                            })
                        }
                    })
                }
            })
        }
        resolve("OK")
    })
}

module.exports = adminModel
