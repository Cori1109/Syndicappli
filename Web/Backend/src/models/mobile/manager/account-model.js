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

var accountModel = {
    getProfile: getProfile,
    updateProfile: updateProfile
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
        let query = 'SELECT * FROM ' + table.USERS + ' WHERE userID = ? and permission = "active"'
        let query_role = 'SELECT r.* FROM user_role ur LEFT JOIN role r ON ur.roleID=r.roleID WHERE ur.userID=?'

        db.query(query, [ uid ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
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
        var file_name = ""
        if(file){
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


module.exports = accountModel