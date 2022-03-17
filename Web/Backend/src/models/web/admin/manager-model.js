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

var managerModel = {

  getManagerList: getManagerList,
  getCountManagerList: getCountManagerList,
  checkDuplicateManager: checkDuplicateManager,
  createManager: createManager,
  getManager: getManager,
  updateManager: updateManager,
  updateManagerStatus: updateManagerStatus,
  deleteManager: deleteManager,
  deleteAllManager: deleteAllManager
}


/**
 * get company list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getManagerList(uid, data) {
    return new Promise((resolve, reject) => {
      let query = `SELECT
      ifnull(sum(a.count), 0) count, u.userID ID, u.firstname, u.lastname, u.email, u.phone, get_daily_time(u.userID) daily_time, get_month_connection(u.userID) month_connection
      FROM
      (select * from users where permission = ?) u 
      LEFT JOIN user_relationship r on u.userID = r.userID
      LEFT JOIN buildings b ON b.buildingID = r.relationID and b.permission = "active"
      LEFT JOIN companies c ON c.companyID = b.companyID and c.permission = "active"
      LEFT JOIN (select count(*) count, buildingID, permission from apartments where permission = "active" group by buildingID) a ON b.buildingID = a.buildingID 
      WHERE
      u.firstname like ? and u.lastname like ? and u.created_by = ?
      AND u.usertype = "manager" `
      
      search_key = '%' + data.search_key + '%'
      let params = [ data.status, search_key, search_key, uid];
      if (data.buildingID != -1) {
        query += ` and b.buildingID = ?`
        params.push(data.buildingID)
      } else if (data.companyID != -1) {
        query += ` and c.companyID = ?`
        params.push(data.companyID)
      }

      query += ` GROUP BY u.userID `

      sort_column = Number(data.sort_column);
      row_count = Number(data.row_count);
      page_num = Number(data.page_num);
      
      if (sort_column === -1)
        query += ' order by u.userID desc';
      else {
          if (sort_column === 0)
            query += ' order by u.firstname ';
          else if (sort_column === 1) 
            query += ' order by u.lastname ';
          else if (sort_column === 2)
            query += ' order by u.email ';
          else if (sort_column === 3) {
            query += ' order by u.userID ';
          }
          else if (sort_column === 4) {
            query += ' order by daily_time ';
          }
          else if (sort_column === 5) {
            query += ' order by count '
          }
          query += data.sort_method;
      }
      query += ' limit ' + page_num * row_count + ',' + row_count
      db.query(query, params, async (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve(rows);
        }
      })
    })
  }

/**
 * get count for building list for search filter
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getCountManagerList(uid, data) {
    return new Promise((resolve, reject) => {
      let query = `SELECT
      sum(a.count) count, u.userID, u.firstname, u.lastname, u.email
      FROM
      (select * from users where permission = ?) u 
      LEFT JOIN user_relationship r on u.userID = r.userID 
      LEFT JOIN buildings b ON b.buildingID = r.relationID and b.permission = "active"
      LEFT JOIN companies c ON c.companyID = b.companyID and c.permission = "active"
      LEFT JOIN (select count(*) count, buildingID, permission from apartments where permission = "active" group by buildingID) a ON b.buildingID = a.buildingID 
      WHERE
      u.firstname like ? and u.lastname like ? and u.created_by = ? 
      AND u.usertype = "manager" `
      
      search_key = '%' + data.search_key + '%'
      let params = [ data.status, search_key, search_key, uid];
      if (data.buildingID != -1) {
        query += ` and b.buildingID = ?`
        params.push(data.buildingID)
      } else if (data.companyID != -1) {
        query += ` and c.companyID = ?`
        params.push(data.companyID)
      }

      query += ` GROUP BY u.userID `
      query = `Select count(*) count, sum(t.count) sum from (` + query + `) t`;
      db.query(query, params , (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR })
        } else {
          resolve({count: rows[0].count, sum: rows[0].sum})  
        }
      })
    })
  }

  
/**
 * verify duplicate manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function checkDuplicateManager(data) {
  return new Promise((resolve, reject) => {
    let confirm_query = 'Select * from ' + table.USERS + ' where email = ?';

    db.query(confirm_query, [data.email], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        if (rows.length > 0)
          reject({ message: message.MANAGER_ALREADY_EXIST })
        else {
          resolve("ok")
        }
      }
    })
  })
}

/**
 * create manager data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createManager(uid, data, file) {
  return new Promise( async (resolve, reject) => {
    let file_name
    let query
    let params = []
    let randomPassword = randtoken.generate(15);
    let randomToken = randtoken.generate(50);
    let password = bcrypt.hashSync(randomPassword)
    if (file)  {
      uploadS3 = await s3Helper.uploadLogoS3(file, s3buckets.AVATAR)
      file_name = uploadS3.Location
    }
    if (file_name == "") {
      query = 'Insert into ' + table.USERS + ' (usertype, firstname, lastname, email, password, phone, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      params = [ "manager", data.firstname, data.lastname, data.email, password, data.phone, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()]
    } else {
      query = 'Insert into ' + table.USERS + ' (usertype, firstname, lastname, email, password, phone, photo_url, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      params =[ "manager", data.firstname, data.lastname, data.email, password, data.phone, file_name, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()]
    }
    
    db.query(query, params, (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
      } else {
        let query = 'select * from ' + table.USERS + ' where email = ?'
        db.query(query, [data.email], async (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR})
          } else {
            let managerID = rows[0].userID;
            let query = `Insert into ` + table.USER_RELATIONSHIP + ` (userID, type, relationID) Values ?`
            let buildingID = JSON.parse(data.buildingID);
            let param = [];
            for (let i in buildingID) {
              param.push([managerID,"building", buildingID[i]])
            }
            db.query(query, [param], (error, rows, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
              } else {
                let query = 'insert into ' + table.ROLE + ' (userID, role_name, permission) values ?'
                let permission_info = JSON.parse(data.permission_info);
                let params = []
                for (let i in permission_info) {
                  params.push([managerID, permission_info[i].role_name, permission_info[i].permission])
                }
                db.query(query, [params], (error, rows, fields) => {
                  if (error) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                  } else {
                    sendMail(mail.TITLE_MANAGER_CREATE, data.email, mail.TYPE_MANAGER_CREATE, randomPassword, randomToken)
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
function getManager(uid, id) {
    return new Promise((resolve, reject) => {
      let query = `SELECT
      u.*,
      ifnull( sum( a.count ), 0 ) count, get_daily_time(u.userID) daily_time, get_month_connection(u.userID) month_connection
      FROM
      users u
      LEFT JOIN user_relationship r ON u.userID = r.userID 
      AND u.permission = "active"
      LEFT JOIN buildings b ON b.buildingID = r.relationID AND b.permission = "active"
      LEFT JOIN companies c on b.companyID = c.companyID AND c.permission = "active"
      LEFT JOIN ( SELECT count( * ) count, buildingID, permission FROM apartments WHERE permission = "active" GROUP BY buildingID ) a ON b.buildingID = a.buildingID 
      WHERE
      u.userID = ?	 
      AND u.created_by = ?`
      db.query(query, [ id, uid ], (error, result, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
              if (result.length == 0)
                  reject({ message: message.INTERNAL_SERVER_ERROR })
              else {
                  let query = `Select b.companyID from users u left join user_relationship r on u.userID = r.userID left join buildings b on b.buildingID = r.relationID where u.userID = ?`
                  db.query(query, [id], (error, rows, fields) => {
                    if (error) {
                      reject({ message: message.INTERNAL_SERVER_ERROR })
                    } else {
                      if (rows.length == 0)
                        reject({ message: message.INTERNAL_SERVER_ERROR})
                      else {
                        let response = result[0]
                        response['companyID'] = rows[0].companyID
                        let query = 'Select * from ' + table.ROLE + ' where userID = ?'
                        db.query(query, [id], (error, roles, fields) => {
                            if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR })
                            } else {
                                
                                for (let i = 0 ; i < roles.length ; i++ ) {
                                    response[roles[i].role_name] = roles[i].permission
                                }
                                let query = 'Select * from ' + table.USER_RELATIONSHIP + ' where userID = ?'
                                db.query(query, [id], (error, rows1, fields) => {
                                  if (error) {
                                    reject({ message: message.INTERNAL_SERVER_ERROR});
                                  } else {
                                    resolve({user: response, buildingList: rows1})
                                  }
                                })
                            }
                        })
                      }
                      
                    }
                  })
                  
              }     
          }
      })
    })
}

/**
 * update manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateManager( id, data, file) {
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
        params = [ data.firstname, data.lastname, data.email, data.phone, file_name, timeHelper.getCurrentTime(), id ]
      }

      db.query(query, params,   (error, rows, fields) => {
          if (error) {
            reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
            let query = 'Delete from ' + table.ROLE + ' where userID = ?' 
            db.query(query, [id], async (error, rows, fields) => {
              if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR });
              } else {
                let query = `Delete from ` + table.USER_RELATIONSHIP + ` where userID = ?`
                db.query(query, [id], (error, rows, fields) => {
                  if (error) {
                      reject({ message: message.INTERNAL_SERVER_ERROR })
                  } else {
                    let managerID = id;
                    let query = `Insert into ` + table.USER_RELATIONSHIP + ` (userID, type, relationID) Values ?`
                    let buildingID = JSON.parse(data.buildingID);
                    let param = [];
                    for (let i in buildingID) {
                      param.push([managerID,"building", buildingID[i]])
                    }
                    db.query(query, [param], (error, rows, fields) => {
                      if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                      } else {
                        let query = 'insert into ' + table.ROLE + ' (userID, role_name, permission) values ?'
                        let permission_info = JSON.parse(data.permission_info);
                        let params = []
                        for (let i in permission_info) {
                          params.push([managerID, permission_info[i].role_name, permission_info[i].permission])
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
 * update manager status
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateManagerStatus(id, data) {
  return new Promise((resolve, reject) => {
      let query = 'UPDATE ' + table.USERS + ' SET  status = ? where userID = ?'

      db.query(query, [ data.status, id ], (error, rows, fields) => {
          if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR })
          } else {
              resolve("ok")
          }
      })
  })
}

/**
 * delete manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteManager(uid, id, data) {
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
function deleteAllManager(data) {
  return new Promise((resolve, reject) => {
    let users = data.list
    
    let query = 'Delete from ' + table.USERS + ' where userID = ?'
    for (let i in users) {
      db.query(query, [users[i]], (error, rows, fields) => {
        if (error) {
          reject({ message: message.INTERNAL_SERVER_ERROR})
        } else {
          let query = 'Delete from ' + table.USER_RELATIONSHIP + ' where userID = ?'
          db.query(query, [users[i]], (error, rows, fields) => {
            if (error) {
              reject({ message: message.INTERNAL_SERVER_ERROR})
            } else {
              let query = 'Delete from ' + table.ROLE + ' where userID = ?'
              db.query(query, [users[i]], (error, rows, fields) => {
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


module.exports = managerModel
