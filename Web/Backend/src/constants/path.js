/**
 * Path constant
 *
 * @package   backend/src/constants
 * @author    YingTuring <ying@turing.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */
const dotenv = require('dotenv')
dotenv.config()

/**
 * Path constants
 */
const UploadPath = {
  UPLOADORIGIN: process.env.UPLOAD_ORIGIN,
  RESUME: process.env.UPLOAD_RESUME,
  SOURCECODE: process.env.UPLOAD_SOURCE_CODE,
  MAILLIST: process.env.UPLOAD_MAIL_LIST
}

const ENV = process.env.ENV
const DEV_BASE_URL = process.env.DEV_BASE_URL
const LIVE_BASE_URL = process.env.LIVE_BASE_URL
const BASE_URL = ENV === 'development' ? DEV_BASE_URL : LIVE_BASE_URL

module.exports = {
  UploadPath: UploadPath,
  BASE_URL: BASE_URL
}
