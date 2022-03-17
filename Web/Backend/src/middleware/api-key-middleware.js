const keyConfig = require("../config/key-config")
const message  = require('../constants/message')
const code  = require('../constants/code')

var authModel = require('../models/auth-model')

/**
 * API KEY middleware file
 *
 * @package   backend/src/middleware
 * @author    Zecharias <zecharias.a@turing.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

/**
 * Function that check api key
 *
 * @author  Zecharias <zecharias.a@turing.com>
 * @param   object req
 * @param   object res
 * @param   object next
 * @return  json if auth token is invalid returns json else go to next()
 */
function checkApiKey(req, res, next) {
  let token = req.headers['api-key']

  if (token !== undefined) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from token if it exists
      token = token.slice(7, token.length)
    }
    authModel.apiKeyExists(token).then((result) => {
      if (result) {
        next()
      } else {
        return res.json({
          code: code.UNAUTHORIZED,
          message: message.INVALID_AUTH_TOKEN,
          data: {}
        })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR) {
        return res.json({
          code: code.INTERNAL_SERVER_ERROR,
          message: message.INTERNAL_SERVER_ERROR,
          data: {}
        })
      } 
      else {
        return res.json({
          code: code.BAD_REQUEST,
          message: message.BAD_REQUEST,
          data: {}
        })
      }
    })
  } else {
    return res.json({
      code: code.UNAUTHORIZED,
      message: message.API_KEY_REQUIRED,
      data: {}
    })
  }
}

function checkAccessToken(req, res, next) {
  let token = req.headers['api-key']

  if (token !== undefined) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from token if it exists
      token = token.slice(7, token.length)
    }
    authModel.accessTokenExists(token).then((result) => {
      if (result) {
        next()
      } else {
        return res.json({
          code: code.UNAUTHORIZED,
          message: message.INVALID_AUTH_TOKEN,
          data: {}
        })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR) {
        return res.json({
          code: code.INTERNAL_SERVER_ERROR,
          message: message.INTERNAL_SERVER_ERROR,
          data: {}
        })
      } 
      else {
        return res.json({
          code: code.BAD_REQUEST,
          message: message.BAD_REQUEST,
          data: {}
        })
      }
    })
  } else {
    return res.json({
      code: code.UNAUTHORIZED,
      message: message.API_KEY_REQUIRED,
      data: {}
    })
  }
}

module.exports = {
  checkApiKey: checkApiKey,
  checkAccessToken: checkAccessToken,
}
