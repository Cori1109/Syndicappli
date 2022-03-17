/**
 * Auth service file
 *
 * @package   backend/src/services
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth/
 */

var adminWebModel = require('../../../models/web/manager/admin-model')
var jwt = require('jsonwebtoken')
var message = require('../../../constants/message')
var code = require('../../../constants/code')
var key = require('../../../config/key-config')
var timer  = require('../../../constants/timer')
var authHelper = require('../../../helper/authHelper')

var webService = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    getCompany: getCompany,
    updateCompany: updateCompany,
    getBankInformation: getBankInformation,
    updateBankInformation: updateBankInformation,
}


/**
 * Function that get profile data with uID
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getProfile(uid) {
    return new Promise((resolve, reject) => {
        adminWebModel.getProfile(uid).then((data) => {
            if (data) {
                let userId = data.userID
                let token = jwt.sign({ uid: data.userID, userdata: data }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })

                resolve({ code: code.OK, message: '', data: { 'token': token,  profile: data} })
            }
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that update profile with uID
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function updateProfile(uid, data, file, userdata) {
    return new Promise((resolve, reject) => {
        adminWebModel.updateProfile(uid, data, file).then((data) => {
            if (data) {
                let token = jwt.sign({ uid: uid, userdata:userdata }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })

                resolve({ code: code.OK, message: '', data: { 'token': token} })
            }
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that get company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getCompany(uid, userdata) {
    return new Promise((resolve, reject) => {
        adminWebModel.getCompany(uid).then((data) => {
            if (data) {
                let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })

                resolve({ code: code.OK, message: '', data: { 'token': token,  profile: data} })
            }
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that update company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function updateCompany(uid, data, file, userdata) {
    return new Promise((resolve, reject) => {
        adminWebModel.updateCompany(uid, data, file).then((data) => {
            if (data) {
                let token = jwt.sign({ uid: uid, userdata:userdata }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })

                resolve({ code: code.OK, message: '', data: { 'token': token} })
            }
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that updates Bank Information of company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getBankInformation(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasPaymentPermission(userdata, [code.SEE_PERMISSION, code.EDIT_PERMISSION]).then((response) => {
            adminWebModel.getBankInformation(data).then((data) => {
                if (data) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token, 'bank': data} })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((err) => {
            reject({ code: code.BAD_REQUEST, message: message.HAS_NO_PERMISSION, data: {} })
        })
    })
}

/**
 * Function that updates Bank Information of company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function updateBankInformation(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasPaymentPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            adminWebModel.updateBankInformation(data).then((data) => {
                if (data) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: message.COMPANY_UPDATE_SUCCESSFULLY, data: { 'token': token} })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((err) => {
            reject({ code: code.BAD_REQUEST, message: message.HAS_NO_PERMISSION, data: {} })
        })
    })
}

module.exports = webService
