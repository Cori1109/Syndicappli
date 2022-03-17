/**
 * Auth router file
 *
 * @package   backend/src/routes
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth
 */

var express = require('express')
var router = express.Router()
var authService = require('../services/auth-service')
var authMiddleware = require('../middleware/auth-middleware')
const {validate} = require('express-validation')
var authValidation = require('../validator/auth-validation')

/**
 * Login api
 */
router.post('/firstLogin', validate(authValidation.login, {}, {}), firstLogin)
router.post('/login', validate(authValidation.login, {}, {}), login)
router.post('/login_as', authMiddleware.checkToken, login_as)

/**
 * Forgot Password
 */
router.post('/forgotPassword', validate(authValidation.forgotPassword, {}, {}), forgotPassword)
router.post('/verifyToken', validate(authValidation.verifyToken, {}, {}), verifyToken)
router.post('/resetPassword', validate(authValidation.resetPassword, {}, {}), resetPassword)

/**
 * Verification API
 */
router.post('/verifySMS', validate(authValidation.verifySMS, {}, {}), verifySMS)

/**
 * logout
 */
router.post('/logout', authMiddleware.checkToken, logout)

/**
 * Function that check user first login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function firstLogin(req, res) {
    let email = req.body.email
    let password = req.body.password

    var authData = {
        email: email,
        password: password,
    }

    authService.firstLogin(authData).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function login(req, res) {
    let email = req.body.email
    let password = req.body.password

    var authData = {
        email: email,
        password: password,
    }

    authService.login(authData).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that check user login as manager or owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function login_as(req, res) {
    let userID = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    authService.login_as(userID, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that recovery the user password with email and token
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function forgotPassword(req, res) {
    let email = req.body.email

    authService.forgotPassword(email).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that verifies the user token to reset the password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function verifyToken(req, res) {
    let token = req.body.token

    authService.verifyToken(token).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that resets the user password with token
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function resetPassword(req, res) {
    let new_password = req.body.password
    let token = req.body.token

    authService.resetPassword(token, new_password).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that check user SMS code with email
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function verifySMS(req, res){
    let email = req.body.email
    let code = req.body.code

    authService.verifySMS(email, code).then((result) => {
        console.log(result)
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function to logout
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function logout(req, res) {
    // let userId = req.decoded.uid
    authService.logout().then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

module.exports = router
