/**
 * TWILIO helper file
 *
 * @package   backend/src/helper
 * @author    Taras <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

const dotenv = require('dotenv')
dotenv.config()
const twilio = require('twilio')

// Send SMS Messages directly using a Twilio Number
function sendSMS(to, body){
    // Initialise account credentials
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACOUNT_SID
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
    const TWILIO_NUMBER = '+19285827715'

    // Create new twilio client
    const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    return new Promise((success, fail) => {
        // Send the text message.
        client.messages.create(
            {
                to, // Recipient's number
                from: TWILIO_NUMBER, // Twilio Number
                body // Message to Recipient
            },
            (error, message) => {
                if (error) {
                    fail(error)
                } else {
                    success({ to, body, message: "success!" })
                }
            }
        )
    })
}

module.exports = {
    sendSMS:sendSMS
}
