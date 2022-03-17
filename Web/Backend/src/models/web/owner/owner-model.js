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

var ownerModel = {
    getOwnerList: getOwnerList,
    createOwner_info: createOwner_info,
    getOwner: getOwner,
    deleteOwner: deleteOwner,
    acceptInvitation: acceptInvitation,
    reinviteOwner: reinviteOwner,
    getBuildingListByOwner: getBuildingListByOwner
}

/**
 * get company list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getOwnerList(uid) {
    return new Promise((resolve, reject) => {
        let query = `select * from users where created_by = ?`

        db.query(query, [uid], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows);
            }
        })
    })
}

/**
 * get company list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getBuildingListByOwner(uid) {
    return new Promise((resolve, reject) => {
        let query = `select * from users u left join user_relationship r on u.userID = r.userID and r.type="building" left join buildings b on r.relationID = b.buildingID and b.permission = "active" where u.userID = ?`

        db.query(query, [uid], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows);
            }
        })
    })
}

/**
 * create Owner only owner table
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createOwner_info(uid, data) {
    return new Promise((resolve, reject) => {
        let query = `Select * from ` + table.USERS + ` where email = ?`;
        db.query(query, [data.email], function (error, result, fields) {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR });
            } else {
                if (result.length == 0) {
                    let randomPassword = randtoken.generate(15);
                    let randomToken = randtoken.generate(50);
                    let password = bcrypt.hashSync(randomPassword)
                    let query = `Insert into ` + table.USERS + ` (usertype, type, owner_role, firstname, lastname, firstname_1, lastname_1, owner_company_name, address, password, email, phone, status, permission, created_by, created_at, updated_at, token, invitation_status, code_postal, city) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
                    db.query(query, ["owner", "Mr & Mrs", "subaccount", data.firstname, data.lastname, data.firstname_1, data.lastname_1, "",data.address, password, data.email, data.phone, "active", "active", uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime(), randomToken, "invited", data.code_postal, data.city], function (error, rows, fields)  {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            let query = `Select * from ` + table.USERS + ` where email = ?`;
                            db.query(query, [data.email], function (error, rows, fields) {
                                if (error)
                                    reject({ message: message.INTERNAL_SERVER_ERROR })
                                else {
                                    let query = `Insert into user_relationship (userID, type, relationID) values (?, ?, ?)`
                                    db.query(query, [rows[0].userID, "building", data.buildingID], (error, result, fields) => {
                                        if (error) {
                                            reject({ message: message.INTERNAL_SERVER_ERROR });
                                        } else {
                                            sendMail(mail.TITLE_OWNER_CREATE, data.email, mail.TYPE_OWNER_CREATE, randomPassword, randomToken)
                                            .then((response) => {
                                                resolve("OK")
                                            })
                                            .catch((err) => {
                                                if(err.message.statusCode == code.BAD_REQUEST){
                                                    reject({ message: message.EMIL_IS_NOT_EXIST })
                                                } else {
                                                    reject({ message: message.EMIL_IS_NOT_EXIST })
                                                }
                                            })
                                        }
                                    })    
                                }
                            })
                                                      
                        }
                    })
                } else {
                    reject({ message: message.OWNER_ALREADY_EXIST });
                }
            }
        })
    })
}



/**
 * get owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getOwner(uid, data, id) {
    return new Promise((resolve, reject) => {
        let query = 'Select * from users left join user_relationship r on users.userID = r.userID and r.type="building" where users.userID = ?'
        
        db.query(query, [ id ],   (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length == 0) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                } else {
                    resolve(rows[0]);
                }
            }
        })
    })
}




/**
 * delete owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteOwner(uid, id) {
    return new Promise((resolve, reject) => {
        let query = 'Delete from ' + table.USERS + ' where userID = ?'
  
        db.query(query, [ id ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                let query = 'Delete from ' + table.USER_RELATIONSHIP + ' where userID = ?'
                db.query(query, [id], (error, rows, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                    } 
                    else 
                        resolve("ok")
                })
            }
        })
    })
  }

  /**
 * Accept Invitation
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function acceptInvitation(token) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + table.USERS + ' WHERE token = ?'
        db.query(query, [token], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if(rows.length > 0){
                    let update_query = 'UPDATE ' + table.USERS + ' SET invitation_status = ? WHERE token = ?'
                    db.query(update_query, ["accepted",token], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            resolve("OK")
                        }
                    })
                } else {
                    reject({ message: message.ACCOUNT_NOT_EXIST })
                }
            }
        })        
    })
  }

  /**
 * resend email
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function reinviteOwner(id) {
    return new Promise((resolve, reject) => {
        let query = 'Select * from users where userID = ?'
        
        db.query(query, [ id ],   (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length == 0) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                } else {
                    let email = rows[0].email
                    let randomPassword = randtoken.generate(15);
                    let randomToken = randtoken.generate(50);
                    let password = bcrypt.hashSync(randomPassword)
                    let query = `Update ` + table.USERS + ` Set password = ?, updated_at = ?, token = ? where email = ?`
                    db.query(query, [password, timeHelper.getCurrentTime(), randomToken, email], function (error, rows, fields)  {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            sendMail(mail.TITLE_OWNER_CREATE, email, mail.TYPE_OWNER_CREATE, randomPassword, randomToken)
                            .then((response) => {
                                resolve("OK")
                            })
                            .catch((err) => {
                                if(err.message.statusCode == code.BAD_REQUEST){
                                    reject({ message: message.EMIL_IS_NOT_EXIST })
                                } else {
                                    reject({ message: message.EMIL_IS_NOT_EXIST })
                                }
                            })
                        }
                    })
                }
            }
        })
    })
}
module.exports = ownerModel
