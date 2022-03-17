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
const { sendMail } = require('../../../helper/mailHelper')
var mail = require('../../../constants/mail')
var randtoken = require('rand-token');
var code = require('../../../constants/code')
const orderTemplate = require('../../../invoiceTemplate/order')
const addonTemplate = require('../../../invoiceTemplate/addon')
const pdf = require('html-pdf');
var invoiceModel = {
    getInvoiceAddon: getInvoiceAddon,
    getInvoiceOrder: getInvoiceOrder,
    downloadInvoiceAddon: downloadInvoiceAddon,
    downloadInvoiceOrder: downloadInvoiceOrder
}

/**
 * get order invoice
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getInvoiceOrder(data) {
    return new Promise((resolve, reject) => {
        let query = `SELECT
                        o.orderID as ID,
                        b.name building_name,
                        o.start_date,
                        p.name product_name,
                        o.apartment_amount,
                        ROUND(
                            if (o.discount_type = "fixed", 
                            (o.apartment_amount * o.price * (100 + o.vat_fee) / 100 - o.discount_amount) * 100 / (100 + o.vat_fee), 
                            (o.apartment_amount * o.price * (100 + o.vat_fee) / 100 * (100 - o.discount_amount) / 100) * 100 / (100 + o.vat_fee)), 2) total_amount, 
                        ROUND(
                            if (o.discount_type = "fixed", 
                            (o.apartment_amount * o.price * (100 + o.vat_fee) / 100 - o.discount_amount) * 100 / (100 + o.vat_fee), 
                            (o.apartment_amount * o.price *(100 + o.vat_fee) / 100 * (100 - o.discount_amount) / 100) * 100 / (100 + o.vat_fee)) / o.apartment_amount, 2) price
                    FROM
                        orders o
                        LEFT JOIN products p ON o.productID = p.productID
                        LEFT JOIN buildings b ON o.buildingID = b.buildingID 
                    WHERE
                        o.buyerID = ?
                        AND o.buyer_type = "managers" 
                        AND o.permission = "active" 
                        AND p.name not like "Pack de Modules"`

        db.query(query, [data.companyID], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows);
            }
        })
    })
}

/**
 * get invoice addonlist by buildingID
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getInvoiceAddon(data) {
    return new Promise((resolve, reject) => {
        let query
        let params = []
        if (data.buildingID == -1) {
            query = `SELECT
                        o.orderID as ID,
                        b.name building_name,
                        o.start_date,
                        ROUND(
                            if (o.discount_type = "fixed", 
                            (o.apartment_amount * o.price *(100 + o.vat_fee) / 100  - o.discount_amount) * 100 / (100 + o.vat_fee), 
                            (o.apartment_amount * o.price *(100 + o.vat_fee) / 100  * (100 - o.discount_amount) / 100) * 100 / (100 + o.vat_fee)), 2) total_amount,
                        p.name product_name
                    FROM
                        orders o
                        LEFT JOIN products p ON o.productID = p.productID
                        LEFT JOIN buildings b ON o.buildingID = b.buildingID 
                    WHERE
                        o.companyID = ?
                        AND o.buyer_type = "buildings" 
                        AND o.permission = "active" 
                        AND p.name = "Pack de Modules"`
            params = [data.companyID]
        } else {
            query = `SELECT
                        o.orderID as ID,
                        b.name building_name,
                        o.start_date,
                        ROUND(
                            if (o.discount_type = "fixed", 
                            (o.apartment_amount * o.price*(100 + o.vat_fee) / 100  - o.discount_amount) * 100 / (100 + o.vat_fee), 
                            (o.apartment_amount * o.price *(100 + o.vat_fee) / 100 * (100 - o.discount_amount) / 100) * 100 / (100 + o.vat_fee)), 2) total_amount,
                        p.name product_name
                    FROM
                        orders o
                        LEFT JOIN products p ON o.productID = p.productID
                        LEFT JOIN buildings b ON o.buildingID = b.buildingID 
                    WHERE
                        o.companyID = ?
                        AND o.buildingID = ?
                        AND o.buyer_type = "buildings" 
                        AND o.permission = "active" 
                        AND p.name = "Pack de Modules"`
            params = [data.companyID, data.buildingID]
        }

        db.query(query, params, (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows);
            }
        })
    })
}

/**
 * download invoice
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function downloadInvoiceAddon(data, res) {
    return new Promise((resolve, reject) => {
        let query = `Select b.name name, b.address address, c.email email, o.orderID invoice_number, o.start_date invoice_date, o.orderID order_id, o.start_date order_date, p.name product_name, b.name building_name, 
                        ROUND(if (o.discount_type = "fixed", 
                            if (o.vat_option = "true", o.price * o.apartment_amount * (100 + o.vat_fee) / 100, o.price * o.apartment_amount) - o.discount_amount,
                            if (o.vat_option = "true", o.price * o.apartment_amount * (100 + o.vat_fee) / 100, o.price * o.apartment_amount) * (100 - o.discount_amount) / 100
                        ), 2) price, o.vat_option, o.vat_fee, 
                        ROUND(if (o.discount_type = "fixed", 
                            (o.price * o.apartment_amount * (100 + o.vat_fee) / 100 - o.discount_amount) / ((100 + o.vat_fee)) * o.vat_fee,
                            (o.price * o.apartment_amount * (100 + o.vat_fee) / 100 / 100 * (100 - o.discount_amount)) / ((100 + o.vat_fee)) * o.vat_fee
                        ), 2) vat_amount,
                        ROUND(
                            if (o.discount_type = "fixed", 
                            (o.apartment_amount * o.price * (100 + o.vat_fee) / 100 - o.discount_amount) * 100 / (100 + o.vat_fee), 
                            (o.apartment_amount * o.price *(100 + o.vat_fee) / 100 * (100 - o.discount_amount) / 100) * 100 / (100 + o.vat_fee)), 2) price_without_vat,
                        o.start_date date, if (o.payment_method = "credit_card", "carte_bancaire", "SEPA") payment_method
                        from orders o
                        LEFT JOIN products p ON o.productID = p.productID
                        LEFT JOIN buildings b ON o.buildingID = b.buildingID
                        LEFT JOIN companies c ON o.companyID = c.companyID 
                    WHERE
                        o.orderID = ?`
        db.query(query, [data.orderID], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                data = rows[0]
                if (data.vat_option === "false")
                    data.vat_result = "Montant de la TVA : 0"
                else
                    data.vat_result = "Montant de la TVA à "+ data.vat_fee + "% : " + data.vat_amount
                options = {format: "A3"}
                pdf.create(addonTemplate(data), options).toBuffer(function (err, buffer) {
                    if (err) return res.send(err);
                    res.type('pdf');
                    res.end(buffer, 'binary');
                });
            }
        })
        

    })
}

/**
 * download invoice
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function downloadInvoiceOrder(data, res) {
    return new Promise((resolve, reject) => {
        let query = `Select c.name name, c.address address, c.email email, o.orderID invoice_number, o.start_date invoice_date, o.orderID order_id, o.start_date order_date, p.name product_name, o.apartment_amount amount_lot, o.start_date date, 
                     ROUND(if (o.discount_type = "fixed", 
                        if (o.vat_option = "true", o.price * o.apartment_amount * (100 + o.vat_fee) / 100, o.price * o.apartment_amount) - o.discount_amount,
                        if (o.vat_option = "true", o.price * o.apartment_amount * (100 + o.vat_fee) / 100, o.price * o.apartment_amount) * (100 - o.discount_amount) / 100
                     ), 2) total, o.vat_option, o.vat_fee, 
                     ROUND(if (o.discount_type = "fixed", 
                            (o.price * o.apartment_amount * (100 + o.vat_fee) / 100 - o.discount_amount) / ((100 + o.vat_fee)) * o.vat_fee,
                            (o.price * o.apartment_amount * (100 + o.vat_fee) / 100 / 100 * (100 - o.discount_amount)) / ((100 + o.vat_fee)) * o.vat_fee
                        ), 2) vat_amount,
                    ROUND(
                        if (o.discount_type = "fixed", 
                        (o.apartment_amount * o.price * (100 + o.vat_fee) / 100 - o.discount_amount) * 100 / (100 + o.vat_fee), 
                        (o.apartment_amount * o.price *(100 + o.vat_fee) / 100 * (100 - o.discount_amount) / 100) * 100 / (100 + o.vat_fee)), 2) price_without_vat,
                    ROUND(
                        if (o.discount_type = "fixed", 
                        (o.apartment_amount * o.price * (100 + o.vat_fee) / 100 - o.discount_amount) * 100 / (100 + o.vat_fee), 
                        (o.apartment_amount * o.price *(100 + o.vat_fee) / 100 * (100 - o.discount_amount) / 100) * 100 / (100 + o.vat_fee)) / o.apartment_amount, 10) price,
                    if (o.payment_method = "credit_card", "carte_bancaire", "SEPA") payment_method
                     from orders o left join companies c on o.companyID = c.companyID left join products p on o.productID = p.productID where o.orderID = ?`
        db.query(query, [data.orderID], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                data = rows[0]
                if (data.vat_option === "false")
                    data.vat_result = "Montant de la TVA : 0"
                else
                    data.vat_result = "Montant de la TVA à "+ data.vat_fee + "% : " + data.vat_amount
                options = {format: "A3"}
                pdf.create(orderTemplate(data), options).toBuffer(function (err, buffer) {
                    if (err) return res.send(err);
                    res.type('pdf');
                    res.end(buffer, 'binary');
                });
            }
        })
        

    })
}


module.exports = invoiceModel
