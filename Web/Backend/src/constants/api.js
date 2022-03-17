/**
 * API constant file
 *
 * @package   backend/src/constants
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly
 */
const dotenv = require('dotenv')
dotenv.config()
/**
 * API constants
 */
const api = {
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET
}

module.exports = api
