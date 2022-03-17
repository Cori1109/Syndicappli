/**
 * Mail config file
 *
 * @package   backend/src/config
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */
const dotenv = require('dotenv')
dotenv.config()

/**
 * Mailgun configuration constants
 */
const mailgun = {
  privateApiKey: process.env.MAILGUN_PRIVATE_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  domain1: process.env.MAILGUN_DOMAIN_1,
  publicApiKey: process.env.MAILGUN_PRIVATE_KEY,
  developerTag: process.env.MAILGUN_DEVELOPER_TAG
}

/**
 * Mixmax configuration constants
 */
const mixmax = {
  apiToken: process.env.MIXMAX_API_TOKEN,
  domain: process.env.MIXMAX_DOMAIN,
  baseUrl: process.env.MIXMAX_BASE_URL
}
/**
 * SendGrid configuration constants
 */
const sendgrid = {
  apiKey: process.env.SENDGRID_API_KEY,
  domain: process.env.SENDGRID_DOMAIN,
  baseUrl: process.env.SENDGRID_BASE_URL
}

let apiKey = process.env.ENV === 'production'? process.env.EMAIL_SYSTEM_API_KEY : process.env.EMAIL_SYSTEM_DEV_API_KEY
const emailSystem = {
  apiKey: apiKey,
  sendTemplateUrl: process.env.EMAIL_SYSTEM_API_URL
}

module.exports = {
  MAILGUN: mailgun,
  MIXMAX: mixmax,
  SENDGRID: sendgrid,
  EMAIL_SYSTEM: emailSystem
}
