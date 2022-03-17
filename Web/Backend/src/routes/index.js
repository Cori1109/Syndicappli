/**
 * Index router file
 *
 * @package   backend/src/routes
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly
 */

const express = require('express')
const router = express.Router()

const apiAuthRouter = require('./auth')
const mobileRouter = require('./mobile')
const webRouter = require('./web')

/**
 * Authentication page API router
 */
router.use('/auth', apiAuthRouter)

/**
 * Mobile API router
 */
router.use('/mobile', mobileRouter)

/**
 * Web API router
 */
router.use('/web', webRouter)


module.exports = router
