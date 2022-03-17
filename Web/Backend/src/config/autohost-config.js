/**
 * Jenkins config file
 *
 * @package   backend/src/config
 * @author    FrederickTuring <frederick@turing.com>
 * @copyright 2019 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */
const dotenv = require('dotenv')
dotenv.config()

/**
 * Key configuration constants
 */

module.exports = {
  JENKINS_USER: process.env.JENKINS_USER,
  JENKINS_PASSWORD: process.env.JENKINS_PASSWORD,
  JENKINS_AUTO_HOST_PATH: process.env.JENKINS_AUTO_HOST_PATH,
  DOMAIN_ADMINSTRATOR_EMAIL: process.env.DOMAIN_ADMINSTRATOR_EMAIL,
  DOMAIN_POOL: process.env.DOMAIN_POOL,
  DOMAIN_EXHAUSTION_WARNING_THRESHOLD: process.env.DOMAIN_EXHAUSTION_WARNING_THRESHOLD || 200,
  ENTRIES_PER_DOMAIN: process.env.ENTRIES_PER_DOMAIN || 3400,
}
