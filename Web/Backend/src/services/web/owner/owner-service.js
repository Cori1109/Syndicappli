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

var ownerModel = require('../../../models/web/owner/owner-model')
var jwt = require('jsonwebtoken')
var message = require('../../../constants/message')
var code = require('../../../constants/code')
var key = require('../../../config/key-config')
var timer = require('../../../constants/timer')
var authHelper = require('../../../helper/authHelper')
var randtoken = require('rand-token');
var authModel = require('../../../models/auth-model')

var ownerService = {
    getOwnerList: getOwnerList,
    createOwner: createOwner,
    getOwner: getOwner,
    deleteOwner: deleteOwner,
    acceptInvitation: acceptInvitation,
    reinviteOwner: reinviteOwner,
    getBuildingListByOwner: getBuildingListByOwner
}

/**
 * Function that get owner list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getOwnerList(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        ownerModel.getOwnerList(uid).then((ownerList) => {
            let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                expiresIn: timer.TOKEN_EXPIRATION
            })
            resolve({ code: code.OK, message: '', data: { 'token': token, 'ownerlist': ownerList } })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that get owner list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getBuildingListByOwner(uid, userdata) {
    return new Promise((resolve, reject) => {
        ownerModel.getBuildingListByOwner(uid).then((ownerList) => {
            let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                expiresIn: timer.TOKEN_EXPIRATION
            })
            resolve({ code: code.OK, message: '', data: { 'token': token, 'buildinglist': ownerList } })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that create owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function createOwner(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        ownerModel.createOwner_info(uid, data).then((response) => {
            let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                expiresIn: timer.TOKEN_EXPIRATION
            })

            resolve({ code: code.OK, message: '', data: { 'token': token } })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that get owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getOwner(uid, userdata, data, id) {
    return new Promise((resolve, reject) => {
        ownerModel.getOwner(uid, data, id).then((owner) => {
            if (owner) {
                let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                    expiresIn: timer.TOKEN_EXPIRATION
                })
                resolve({ code: code.OK, message: '', data: { 'token': token, 'owner': owner } })
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
 * Function that delete Owner data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function deleteOwner(uid, id, userdata) {
    return new Promise((resolve, reject) => {
        ownerModel.deleteOwner(uid, id).then((result) => {
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

    })
}

/**
 * Function that delete Owner data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function acceptInvitation(data) {
    return new Promise((resolve, reject) => {
            ownerModel.acceptInvitation(data.token).then((result) => {
                resolve({ code: code.OK, message: message.SUBACCOUNT_HAS_BEEN_UPDATED_STATUS, data: {} })
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
    })
}

/**
 * Function that reinvite Owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function reinviteOwner(uid, userdata, id) {
    return new Promise((resolve, reject) => {
        ownerModel.reinviteOwner(id).then((result) => {
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

    })
}
module.exports = ownerService
