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

var companyModel = require('../../../models/web/admin/company-model')
var jwt = require('jsonwebtoken')
var message = require('../../../constants/message')
var code = require('../../../constants/code')
var key = require('../../../config/key-config')
var timer  = require('../../../constants/timer')
var authHelper = require('../../../helper/authHelper')
var stripeHelper = require('../../../helper/stripeHelper')

var companyService = {
    getCompanyList: getCompanyList,
    createCompany: createCompany,
    updateCompany: updateCompany,
    updateBankInformation: updateBankInformation,
    getCompany: getCompany,
    deleteCompany: deleteCompany,
    deleteAllCompany: deleteAllCompany,

    getCardList: getCardList,
    createCard: createCard,
    getCard: getCard,
    updateCard: updateCard,
    deleteCard: deleteCard,
}

/**
 * Function that get building list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getCompanyList(uid, data, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.SEE_PERMISSION, code.EDIT_PERMISSION]).then((response) => {
            companyModel.getCompanyList(uid, data).then((companyList) => {
                if (companyList) {
                    companyModel.getCountCompanyList(uid, data).then((companyCount) => {
                        let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                            expiresIn: timer.TOKEN_EXPIRATION
                        })
                        resolve({ code: code.OK, message: '', data: { 'token': token, 'totalpage': Math.ceil(companyCount / Number(data.row_count)), 'companylist': companyList } })
                    })

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
 * Function that create company data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function createCompany(uid, userdata, data, file) {
    return new Promise(async (resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.EDIT_PERMISSION]).then(async (response) => {
            var response = await stripeHelper.createCustomer({email: data.email, name: data.name, description: 'company'})
            data.customer_id = response.id
            companyModel.createCompany(uid, data, file).then((data) => {
                if (data) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: message.COMPANY_ADD_SUCCESSFULLY, data: { 'token': token} })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else if (err.message === message.COMPANY_ALREADY_EXIST)
                    reject({ code: code.ALREADY_EXIST, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((err) => {
            reject({ code: code.BAD_REQUEST, message: message.HAS_NO_PERMISSION, data: {} })
        })
    })
}

/**
 * Function that updates company data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function updateCompany(companyID, uid, userdata, data, file) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            companyModel.updateCompany(companyID, uid, data, file).then((data) => {
                if (data) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: message.COMPANY_UPDATE_SUCCESSFULLY, data: { 'token': token} })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else if (err.message === message.COMPANY_ALREADY_EXIST)
                    reject({ code: code.ALREADY_EXIST, message: err.message, data: {} })
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
function updateBankInformation(companyID, uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            companyModel.updateBankInformation(companyID, data).then((data) => {
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

/**
 * Function that get company data by id
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getCompany(uid, userdata, companyID) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.SEE_PERMISSION, code.EDIT_PERMISSION]).then((response) => {
            companyModel.getCompany(uid, companyID).then((data) => {
                if (data) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token, 'company': data} })
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
 * delete company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteCompany(uid, id, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            companyModel.deleteCompany(uid, id, data).then((result) => {
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
        }).catch((err) => {
            reject({ code: code.BAD_REQUEST, message: message.HAS_NO_PERMISSION, data: {} })
        })
    })
}

/**
 * Function that delete All trashed company data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function deleteAllCompany(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            companyModel.deleteAllCompany(data).then((result) => {
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
            reject({ code: code.BAD_REQUEST, message: message.HAS_NO_PERMISSION, data: {} })
        })
    })
}

/**
 * Function that get Card List
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getCardList(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.SEE_PERMISSION, code.EDIT_PERMISSION]).then((response) => {
            companyModel.getCardList(data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token, 'cardlist': result } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: message.HAS_NO_PERMISSION, data: {} })
        })
    })
}

/**
 * Function that create card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function createCard(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            companyModel.createCard(data, uid).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: message.CARD_ADD_SUCCESSFULLY, data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: message.HAS_NO_PERMISSION, data: {} })
        })
    })
}

/**
 * Function that get card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getCard(uid, userdata, id) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.SEE_PERMISSION,code.EDIT_PERMISSION]).then((response) => {
            companyModel.getCard(id).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token, 'card': result } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: message.HAS_NO_PERMISSION, data: {} })
        })
    })
}

/**
 * Function that update card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function updateCard(uid, userdata, id, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            companyModel.updateCard(id, data, uid).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: message.CARD_UPDATE_SUCCESSFULLY, data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: message.HAS_NO_PERMISSION, data: {} })
        })
    })
}

/**
 * Function that delete card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function deleteCard(uid, userdata, id) {
    return new Promise((resolve, reject) => {
        authHelper.hasCompanyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            companyModel.deleteCard(id).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token, 'card': result } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: message.HAS_NO_PERMISSION, data: {} })
        })
    })
}

module.exports = companyService
