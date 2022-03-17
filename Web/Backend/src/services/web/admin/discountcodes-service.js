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

var discountCodesModel = require('../../../models/web/admin/discountcodes-model')
var jwt = require('jsonwebtoken')
var message = require('../../../constants/message')
var code = require('../../../constants/code')
var key = require('../../../config/key-config')
var timer  = require('../../../constants/timer')
var authHelper = require('../../../helper/authHelper')

var discountCodesService = {
    getDiscountCodeList: getDiscountCodeList,
    createDiscountCode: createDiscountCode,
    getDiscountCode: getDiscountCode,
    updateDiscountCode: updateDiscountCode,
    updateDiscountCodeStatus: updateDiscountCodeStatus,
    deleteDiscountCode: deleteDiscountCode,
    deleteAllDiscountCode: deleteAllDiscountCode,
}

/**
 * Function that get discountCodes list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getDiscountCodeList(uid, userdata ,data) {
    return new Promise((resolve, reject) => {
        authHelper.hasDiscountCodePermission(userdata, [code.SEE_PERMISSION, code.EDIT_PERMISSION]).then((response) => {
            discountCodesModel.getDiscountCodeList(uid, data).then((discountCodesList) => {
                if (discountCodesList) {
                    discountCodesModel.getCountDiscountCodeList(uid, data).then((discountCodesCount) => {
                        let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                            expiresIn: timer.TOKEN_EXPIRATION
                        })
                        resolve({ code: code.OK, message: '', data: { 'token': token, 'totalpage': Math.ceil(discountCodesCount / Number(data.row_count)), 'discountCodeslist': discountCodesList, 'totalcount': discountCodesCount} })
                    })

                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that create discountCodes
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function createDiscountCode(uid, userdata ,data) {
    return new Promise((resolve, reject) => {
        authHelper.hasDiscountCodePermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            discountCodesModel.createDiscountCode(uid, data).then((response) => {
                let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })
                resolve({ code: code.OK, message: '', data: { 'token': token} })
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that get discountCodes
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getDiscountCode(uid, userdata, id) {
    return new Promise((resolve, reject) => {
        authHelper.hasDiscountCodePermission(userdata, [code.EDIT_PERMISSION, code.SEE_PERMISSION]).then((response) => {
            discountCodesModel.getDiscountCode(uid, id).then((discountCodes) => {
                if (discountCodes) {
                        let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                            expiresIn: timer.TOKEN_EXPIRATION
                        })
                        resolve({ code: code.OK, message: '', data: { 'token': token, 'discountCodes': discountCodes} })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that update discountCodes
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function updateDiscountCode(uid, userdata, data, id) {
    return new Promise((resolve, reject) => {
        authHelper.hasDiscountCodePermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            discountCodesModel.updateDiscountCode(id, data).then((response) => {
                let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })
                resolve({ code: code.OK, message: '', data: { 'token': token} }) 
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that update DiscountCode status
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function updateDiscountCodeStatus(uid, userdata, data, id) {
    return new Promise((resolve, reject) => {
        authHelper.hasDiscountCodePermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            discountCodesModel.updateDiscountCodeStatus(id, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that delete DiscountCode data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function deleteDiscountCode(uid, id, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasDiscountCodePermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            discountCodesModel.deleteDiscountCode(uid, id, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that delete DiscountCode data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function deleteAllDiscountCode(uid, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasDiscountCodePermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            discountCodesModel.deleteAllDiscountCode().then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

module.exports = discountCodesService
