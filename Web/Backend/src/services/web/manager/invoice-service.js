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

var invoiceModel = require('../../../models/web/manager/invoice-model')
var jwt = require('jsonwebtoken')
var message = require('../../../constants/message')
var code = require('../../../constants/code')
var key = require('../../../config/key-config')
var timer  = require('../../../constants/timer')
var authHelper = require('../../../helper/authHelper')
const stripeHelper = require('../../../helper/stripeHelper')

var invoiceService = {
    getInvoiceOrder: getInvoiceOrder,
    getInvoiceAddon: getInvoiceAddon,
    downloadInvoiceAddon: downloadInvoiceAddon,
    downloadInvoiceOrder: downloadInvoiceOrder
}

/**
 * Function that get invoice list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getInvoiceOrder(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasInvoicePermission(userdata, [code.SEE_PERMISSION, code.EDIT_PERMISSION]).then((response) => {
            invoiceModel.getInvoiceOrder(data).then((invoiceList) => {
                let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })
                resolve({ code: code.OK, message: '', data: { 'token': token, 'invoicelist': invoiceList } })
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
 * Function that get invoice
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getInvoiceAddon(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasInvoicePermission(userdata, [code.SEE_PERMISSION, code.EDIT_PERMISSION]).then((response) => {
            invoiceModel.getInvoiceAddon(data).then((invoice) => {
                let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })
                resolve({ code: code.OK, message: '', data: { 'token': token, 'invoice': invoice } })
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
 * Function that download invoice order
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function downloadInvoiceOrder(uid, userdata, data, res) {
    return new Promise((resolve, reject) => {
        authHelper.hasInvoicePermission(userdata, [code.SEE_PERMISSION, code.EDIT_PERMISSION]).then((response) => {
            invoiceModel.downloadInvoiceOrder(data, res).then((invoiceList) => {
                let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })
                resolve({ code: code.OK, message: '', data: { 'token': token, 'invoicelist': invoiceList } })
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
 * Function that download invoice addon
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function downloadInvoiceAddon(uid, userdata, data, res) {
    return new Promise((resolve, reject) => {
        authHelper.hasInvoicePermission(userdata, [code.SEE_PERMISSION, code.EDIT_PERMISSION]).then((response) => {
            invoiceModel.downloadInvoiceAddon(data, res).then((invoiceList) => {
                let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })
                resolve({ code: code.OK, message: '', data: { 'token': token, 'invoicelist': invoiceList } })
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

module.exports = invoiceService
