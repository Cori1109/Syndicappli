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
const apiAdminRouter = require('./admin')
const apiManagerRouter = require('./manager')
const apiOwnerRouter = require('./owner')

/**
 * admin API router
 */
router.use('/admin', apiAdminRouter)

/**
 * manager API router
 */
router.use('/manager', apiManagerRouter)

/**
 * owner API router
 */
router.use('/owner', apiOwnerRouter)


module.exports = router
