/**
 * Auth middleware file
 *
 * @package   backend/src/middleware
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var jwt = require('jsonwebtoken')
var message = require('../constants/message')
var code = require('../constants/code')
var key = require('../config/key-config')
var db = require('../database/database')
var timeHelper = require('../helper/timeHelper')
/**
 * Function that check auth token
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @param   object next
 * @return  json if auth token is invalid returns json else go to next()
 */
function checkToken(req, res, next) {
  let token = req.headers['authorization']

  if (token !== undefined) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length)
    }

    jwt.verify(token, key.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.json({
          code: code.UNAUTHORIZED,
          message: message.INVALID_AUTH_TOKEN,
          data: {}
        })
      } else {
        req.decoded = decoded
        let query = 'select * from logs where userID = ? order by logID desc'
        db.query(query, [req.decoded.uid], (error, rows, fields) => {
          if (error) {
            return res.json({
              code: code.UNAUTHORIZED,
              message: message.INVALID_AUTH_TOKEN,
              data: {}
            })
          } else {
            if (rows.length == 0) {
              return res.json({
                code: code.UNAUTHORIZED,
                message: message.INVALID_AUTH_TOKEN,
                data: {}
              })
            } else {
              let query = 'update logs set logout_time = ? where logID = ?'
              db.query(query, [timeHelper.getCurrentTime(), rows[0].logID], (error, rows, fields) => {
                if (error) {
                  return res.json({
                    code: code.UNAUTHORIZED,
                    message: message.INVALID_AUTH_TOKEN,
                    data: {}
                  })
                } else {
                  next()
                }
              })
            }

          }
        })

      }
    })
  } else {
    return res.json({
      code: code.UNAUTHORIZED,
      message: message.INVALID_AUTH_TOKEN,
      data: {}
    })
  }
}


module.exports = {
  checkToken: checkToken
}
