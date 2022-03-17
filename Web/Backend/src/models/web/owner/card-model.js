/**
 * Auth model file
 *
 * @package   backend/src/models
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var db = require('../../../database/database')
var message = require('../../../constants/message')
var bcrypt = require('bcrypt-nodejs')
var table = require('../../../constants/table')
const s3Helper = require('../../../helper/s3helper')
const s3buckets = require('../../../constants/s3buckets')
const timeHelper = require('../../../helper/timeHelper')
const stripeHelper = require('../../../helper/stripeHelper')
const { sendMail } = require('../../../helper/mailHelper')
var mail = require('../../../constants/mail')
var randtoken = require('rand-token');
var code = require('../../../constants/code')
var ownerModel = require('../../../models/web/owner/owner-model')
var cardModel = {
    getCardList: getCardList,
    createCard: createCard,
    getCard: getCard,
    updateCard: updateCard,
    deleteCard: deleteCard,
}

/**
 * get card list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getCardList(data) {
    return new Promise((resolve, reject) => {
        let query = `select ca.*, ca.cardID ID from cards ca left join users o on ca.ownerID = o.userID where o.userID = ?`
        db.query(query, [data.ownerID], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows)
            }
        })
    })
}

/**
 * create card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createCard(data, uid) {
    return new Promise(async (resolve, reject) => {
        response = await ownerModel.getOwner(uid, data, data.ownerID)
        stripe_source = await stripeHelper.createCardSource(response.stripe_customerID, data.id)
        let query = `Insert into cards (ownerID, card_number, expiry_date, name, secure_code, created_by, created_at, stripe_sourceID) values (?, ?, ?, ?, ?, ?, ?, ?)`
        db.query(query, [data.ownerID, data.card_number, data.expiry_date, data.name, data.secure_code, uid, timeHelper.getCurrentTime(), stripe_source.id], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("OK")
            }
        })
    })
}

/**
 *  get card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getCard(id) {
    return new Promise((resolve, reject) => {
        let query = `Select * from cards where cardID = ?`
        db.query(query, [id], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows[0])
            }
        })
    })
}

/**
 *  update card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateCard(id, data, uid) {
    return new Promise(async (resolve, reject) => {
        var card = await getCard(id)
        var response = await ownerModel.getOwner(uid, data, card.ownerID)
        await stripeHelper.deleteCardSource(response.stripe_customerID, card.stripe_sourceID)
        var card_response = await stripeHelper.createCardSource(response.stripe_customerID, data.id)
        let query = `update cards set card_number = ?, expiry_date = ?, name = ?, secure_code = ?, updated_by = ?, updated_at = ?, stripe_sourceID = ? where cardID = ?`
        db.query(query, [data.card_number, data.expiry_date, data.name, data.secure_code, uid, timeHelper.getCurrentTime(), card_response.id, id], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("OK")
            }
        })
    })
}

/**
 *  update card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteCard(id) {
    return new Promise(async (resolve, reject) => {
        var card = await getCard(id)
        var response = await ownerModel.getOwner(null, null, card.ownerID)
        await stripeHelper.deleteCardSource(response.stripe_customerID, card.stripe_sourceID)
        let query = `delete from cards where cardID = ?`
        db.query(query, [id], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("OK")
            }
        })
    })
}

module.exports = cardModel
