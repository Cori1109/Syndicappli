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

var db = require('../database/database')
var message = require('../constants/message')
var bcrypt = require('bcrypt-nodejs')
var table = require('../constants/table')
var jwt = require('jsonwebtoken')
var key = require('../config/key-config')
var randtoken = require('rand-token');
var timeHelper = require('../helper/timeHelper')
var authModel = {
    login: login,
    login_as: login_as,
    saveSMS: saveSMS,
    verifySMS: verifySMS,
    verifyUser: verifyUser,
    saveToken: saveToken,
    saveRandomPassword: saveRandomPassword,
    saveRefreshToken: saveRefreshToken,
    verifyToken: verifyToken,
    resetPassword: resetPassword,
    logout: logout,
}


/**
 * Check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function login(authData) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + table.USERS + ' WHERE email = ? and permission = "active" and status = "active"'

        db.query(query, [authData.email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length > 0) {
                    bcrypt.compare(authData.password, rows[0].password, function (error, result) {
                        if (error) {
                            reject({ message: message.INVALID_PASSWORD })
                        } else {
                            if (result) {
                                let query = 'Insert into logs (userID, login_time, logout_time) values (?,?,?)'
                                db.query(query, [rows[0].userID, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()], (error, rows1, fields) => {
                                    if (error) {
                                        reject({ message: message.INTERNAL_SERVER_ERROR })
                                    } else {
                                        let update_query = 'UPDATE ' + table.USERS + ' SET invitation_status = ? WHERE email = ?'
                                        db.query(update_query, ["accepted",authData.email], (error, result, fields) => {
                                            if (error) {
                                                reject({ message: message.INTERNAL_SERVER_ERROR })
                                            } else {
                                                resolve(rows[0])
                                            }
                                        })
                                    }
                                })
                            } else {
                                reject({ message: message.INVALID_PASSWORD })
                            }
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
 * Check user login status with user ID
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function login_as(data) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + table.USERS + ' WHERE userID = ? and permission = "active" and status = "active"'

        db.query(query, [data.userID], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                let query = 'Insert into logs (userID, login_time, logout_time) values (?,?,?)'
                db.query(query, [rows[0].userID, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()], (error, rows1, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                    } else {
                        if (rows.length > 0) {
                            resolve(rows[0])
                        } else {
                            reject({ message: message.ACCOUNT_NOT_EXIST })
                        }
                    }
                })
                
            }
        })
    })
}

/**
 * Save user SMS verification code
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function saveSMS(email, smsCode) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.USERS + ' SET sms_code = ? WHERE email = ?'

        db.query(query, [smsCode, email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("Ok")
            }
        })
    })
}

/**
 * Save user SMS verification code
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function verifySMS(email, code) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + table.USERS + ' WHERE email = ?'

        db.query(query, [email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length > 0) {
                    jwt.verify(rows[0].sms_code, key.JWT_SECRET_KEY, function (err, decoded) {
                        if (err) {
                            if (err.name == "TokenExpiredError") {
                                reject({ message: message.EXPIRED_SMS_CODE })
                            } else {
                                reject({ message: err.name })
                            }
                        } else {
                            if (decoded.smsCode == code) {
                                resolve(rows[0])
                            } else {
                                reject({ message: message.INVALID_SMS_CODE })
                            }
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
 * Save user SMS verification code
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function verifyUser(email) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * from ' + table.USERS + ' where email = ?'

        db.query(query, [email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length > 0) {
                    resolve("Ok")
                } else {
                    reject({ message: message.ACCOUNT_NOT_EXIST })
                }
            }
        })
    })
}

/**
 * Save user Token
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function saveToken(email, token) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.USERS + ' SET token = ? WHERE email = ?'

        db.query(query, [token, email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("Ok")
            }
        })
    })
}

/**
 * Save random token
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function saveRandomPassword(email) {
    return new Promise((resolve, reject) => {
        let randomPassword = randtoken.generate(15);
        let new_pass = bcrypt.hashSync(randomPassword)
        let query = 'UPDATE ' + table.USERS + ' SET password = ? WHERE email = ?'

        db.query(query, [new_pass, email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(randomPassword)
            }
        })
    })
}

/**
 * Save user Refresh token
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function saveRefreshToken(token, refresh_reset_token) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + table.USERS + ' WHERE token = ?'
        db.query(query, [token], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length > 0) {
                    let update_query = 'UPDATE ' + table.USERS + ' SET token = ? WHERE userID = ?'
                    db.query(update_query, [refresh_reset_token, rows[0].userID], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            resolve("Ok")
                        }
                    })
                } else {
                    reject({ message: message.INVALID_TOKEN })
                }
            }
        })
    })
}

/**
 * Verify Token
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + table.USERS + ' WHERE token = ?'
        jwt.verify(token, key.JWT_SECRET_KEY, function (err, decoded) {
            if (err) {
                if(err.name == "TokenExpiredError"){
                    reject({ message: message.EXPIRED_TOKEN_CODE })
                } else {
                    reject({ message: err.name })
                }
            } else {
                db.query(query, [ token ], (error, rows, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                    } else {
                        if(rows.length > 0){
                            resolve("OK!")
                        }else{
                            reject({ message: message.INVALID_TOKEN })
                        }
                    }
                })
            }
        })
    })
}

/**
 * Reset Password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   string email, string new_password
 * @return  object If success returns object else returns message
 */
function resetPassword(token, new_password) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + table.USERS + ' WHERE token = ?'

        jwt.verify(token, key.JWT_SECRET_KEY, function (err, decoded) {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    reject({ message: message.EXPIRED_TOKEN_CODE })
                } else {
                    reject({ message: err.name })
                }
            } else {
                db.query(query, [token], (error, rows, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                    } else {
                        if (rows.length > 0) {
                            bcrypt.compare(new_password, rows[0].password, function (error, result) {
                                if (error) {
                                    reject({ message: message.INTERNAL_SERVER_ERROR })
                                } else {
                                    if (result) {
                                        reject({ message: message.INVALID_NEW_PASSWORD })
                                    } else {
                                        let query = 'UPDATE ' + table.USERS + ' SET password = ? WHERE token = ?'
                                        let new_pass = bcrypt.hashSync(new_password)
                                        db.query(query, [new_pass, token], (error, rows, fields) => {
                                            if (error) {
                                                reject({ message: message.INTERNAL_SERVER_ERROR })
                                            } else {
                                                resolve("OK")
                                            }
                                        })
                                    }
                                }
                            })
                        } else {
                            reject({ message: message.INVALID_TOKEN })
                        }
                    }
                })
            }
        })

    })
}

function logout() {
    return new Promise((resolve, reject) => {
        resolve()
    })
}

module.exports = authModel
