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
const adminCompanyModel = require('../admin/company-model')
var adminModel = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    getCompany: getCompany,
    updateCompany: updateCompany,
    updateBankInformation: updateBankInformation,
    getBankInformation: getBankInformation
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
function updateProfile(uid, data, file) {
    return new Promise(async function(resolve, reject) {
        await stripeHelper.updateCustomer(data.stripe_customerID, {email: data.email, name: data.data.name, description: 'company'})
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

/**
 * get company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getCompany(uid) {
    return new Promise((resolve, reject) => {
        let query = `select b.companyID from ` + table.USER_RELATIONSHIP + ` ur left join ` + table.BUILDINGS + ` b on b.buildingID = ur.relationID where b.permission = 'active' and ur.type = 'building' and ur.userID = ? limit 1`
        let get_company_query = `select * from ` + table.COMPANIES + ` where companyID = ? and permission = 'active'`
        db.query(query, [ uid ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if(rows.length > 0){
                    db.query(get_company_query, [ rows[0].companyID ], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            if(rows.length > 0){
                                resolve(rows[0])
                            }else {
                                reject({ message: message.COMPANY_NOT_EXIST })
                            }
                        }
                    })
                } else {
                    reject({ message: message.COMPANY_NOT_EXIST })
                }
            }
        })
    })
}

/**
 * update company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateCompany(uid, data, file) {
    return new Promise(async (resolve, reject) => {
        await stripeHelper.updateCustomer(data.stripe_customerID, {email: data.email, name: data.name, description: 'company'})
        var file_name = ""

        if(file) {
            uploadS3 = await s3Helper.uploadLogoS3(file, s3buckets.COMPANY_LOGO)
            file_name = uploadS3.Location
        }

        let query = ''
        if(file_name == ""){
            query = 'UPDATE ' + table.COMPANIES + ' SET name = ?, email = ?, phone = ?, address = ? WHERE companyID = ?'
        } else {
            query = 'UPDATE ' + table.COMPANIES + ' SET name = ?, email = ?, logo_url = ?, phone = ?, address = ? WHERE companyID = ?'
        }

        db.query(query, file_name == "" ? [ data.name, data.email, data.phone, data.address, data.companyID ] : [ data.name, data.email, file_name, data.phone, data.address, data.companyID ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("OK")
            }
        })
    })
}

/**
 * update Bank Information of company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateBankInformation(data) {
    return new Promise(async (resolve, reject) => {
        company = await adminCompanyModel.getCompany(null, data.companyID)
        if (company.stripe_sourceID !== null && company.stripe_sourceID !== "" && company.stripe_sourceID !== undefined)
            await stripeHelper.deleteCardSource(company.stripe_customerID, company.stripe_sourceID)
        var response = await stripeHelper.createCardSource(company.stripe_customerID, data.id)
        let query = 'Update ' + table.COMPANIES + ' SET account_holdername = ?, account_address = ?, account_IBAN = ?, stripe_sourceID = ? where companyID = ?';
        params = [data.account_holdername, data.account_address, data.account_IBAN, response.id, data.companyID]
        db.query(query, params, (error, rows, fields) => {
            if (error) {
                reject({message: message.INTERNAL_SERVER_ERROR})
            } else {
                resolve("OK")
            }
        })
    })
}

/**
 * get bank information
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getBankInformation(data) {
    return new Promise((resolve, reject) => {
        let query = 'Select account_holdername, account_address, account_IBAN from ' + table.COMPANIES + ' where companyID = ?';
        params = [data.companyID]
        db.query(query, params, (error, rows, fields) => {
            if (error) {
                reject({message: message.INTERNAL_SERVER_ERROR})
            } else {
                resolve(rows[0])
            }
        })
    })
}

module.exports = adminModel
