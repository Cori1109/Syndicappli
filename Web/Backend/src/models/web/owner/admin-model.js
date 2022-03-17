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
const stripeHelper = require('../../../helper/stripeHelper')
var adminModel = {
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
        let query_role = 'SELECT * from ' + table.ROLE + ' where userID = ?'

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
function updateProfile(uid, data, files) {
    return new Promise(async function(resolve, reject) {
        await stripeHelper.updateCustomer(data.stripe_customerID, {email: data.email, name: data.firstname + ' ' + data.lastname, description: 'owner'})
        let photo_url = ""
        let id_front = ""
        let id_back = ""
        if (files.avatar) {
            uploadS3 = await s3Helper.uploadLogoS3(files.avatar[0], s3buckets.AVATAR)
            photo_url = uploadS3.Location
        }
        if (files.id_card_front) {
            uploadS3 = await s3Helper.uploadLogoS3(files.id_card_front[0], s3buckets.IDENTITY_IMAGE)
            id_front = uploadS3.Location
        }
        if (files.id_card_back) {
            uploadS3 = await s3Helper.uploadLogoS3(files.id_card_back[0], s3buckets.IDENTITY_IMAGE)
            id_back = uploadS3.Location
        }

        if (data.new_password === "" || data.new_password === undefined) {
            getProfile(uid).then((profile) => {
                if(profile){
                    if (photo_url == "")
                        photo_url = profile.photo_url
                    if (id_front == "")
                        id_front = profile.identity_card_front
                    if (id_back == "")
                        id_back = profile.identity_card_back

                    let query = 'UPDATE ' + table.USERS + ' SET lastname = ?, firstname = ?, firstname_1 = ?, lastname_1 = ?, email = ?, phone = ?, address = ?, photo_url = ?, identity_card_front = ?, identity_card_back = ?, code_postal = ?, city = ? WHERE userID = ?'
                    db.query(query, [ data.lastname, data.firstname, data.firstname_1, data.lastname_1, data.email, data.phone, data.address, photo_url, id_front, id_back, data.code_postal, data.city, uid], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            resolve(uid)
                        }
                    })
                } else {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                }
            })
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
                                if (photo_url == "")
                                    photo_url = profile.photo_url
                                if (id_front == "")
                                    id_front = profile.identity_card_front
                                if (id_back == "")
                                    id_back = profile.identity_card_back

                                let query = 'UPDATE ' + table.USERS + ' SET lastname = ?, firstname = ?, lastname_1 = ?, firstname_1 = ?, email = ?, phone = ?, password = ?, address = ?, photo_url = ?, identity_card_front = ?, identity_card_back = ? WHERE userID = ?'
                                db.query(query, [ data.lastname, data.firstname, data.lastname_1, data.firstname_1, data.email, data.phone, hash_new_password, data.address, photo_url, id_front, id_back, uid ], (error, rows, fields) => {
                                    if (error) {
                                        reject({ message: message.INTERNAL_SERVER_ERROR })
                                    } else {
                                        resolve(profile)
                                    }
                                })

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

module.exports = adminModel
