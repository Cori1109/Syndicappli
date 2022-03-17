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
var message  = require('../../../constants/message')
var bcrypt = require('bcrypt-nodejs')
var table  = require('../../../constants/table')
const s3Helper = require('../../../helper/s3helper')
const s3buckets = require('../../../constants/s3buckets')
const timeHelper = require('../../../helper/timeHelper')
const stripeHelper = require('../../../helper/stripeHelper')
const adminBuildingModel = require('../admin/building-model')
const {sendMail} = require('../../../helper/mailHelper')
var mail = require('../../../constants/mail')
var randtoken = require('rand-token');
var code = require('../../../constants/code')

var addonModel = {
    getAddonsByBuildingID: getAddonsByBuildingID,
    getAddon: getAddon,
    buyAddon: buyAddon,
    getDiscountCodeListByType:getDiscountCodeListByType,
    getDiscountCode: getDiscountCode,
}

/**
 * get addon list by building ID
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getAddonsByBuildingID(data) {
    return new Promise((resolve, reject) => {
        let query = 'Select *, if (end_date ="9999-12-31", "", end_date) end_date from orders where companyID = ? and buildingID = ? and buyer_type = "buildings" and permission = "active"'
        
        db.query(query, [data.companyID, data.buildingID], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows);
            }
        })
    })
}

/**
 * get addon
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getAddon() {
    return new Promise((resolve, reject) => {
        let query = 'Select * from products where name = "Pack de Modules" and permission = "active"'
        
        db.query(query, [], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows)
            }
        })
    })
}

function createCharge(data) {
    return new Promise(async (resolve, reject) => {
        var price;
        if (data.discount_type == "fixed") {
            if (data.vat_option === "true") {
                price = data.price * data.apartment_amount * (100 + data.vat_fee) / 100 - data.discount_amount
            } else {
                price = data.price * data.apartment_amount - data.discount_amount
            }
        } else {
            if (data.vat_option === "true") {
                price = data.price * data.apartment_amount * (100 + data.vat_fee) / 100 * (100 - data.discount_amount) / 100
            } else {
                price = data.price * data.apartment_amount * (100 - data.discount_amount) / 100 
            }
        }
        if (price <= 0) {
            reject({message: message.NOT_CREATE_ORDER})
        } else {
            price *= 100
            price = Math.round(price)
            var response = await adminBuildingModel.getBuilding(data.buildingID)
            stripeHelper.createCharge(price,response.building[0].stripe_customerID, data.id, "").then((response) => {
                resolve("OK")
            }).catch((err) => {
                reject({message: err.message})
            })
        }
        
    })
}

/**
 * buy addon
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function buyAddon(uid, data) {
    return new Promise(async (resolve, reject) => {
        let query = 'select * from discount_codes where permission = "active" and discount_codeID = ? and user_type="buildings"'
        if (data.discount_codeID > 0) {
            db.query(query, [data.discount_codeID], (error, rows, fields) => {
                if (error) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                } else {
                    if (rows.length == 0) 
                        reject({ message: message.INTERNAL_SERVER_ERROR})
                    else {
                        let amount_of_use = rows[0].amount_of_use
                        let amount_of_use_per_user = rows[0].amount_of_use_per_user
                        let query = `Select count(*) count from ` + table.ORDERS + ` where discount_codeID = ? and (permission = "active" or permission = "trash")`
                        db.query(query, [data.discount_codeID], (error, rows, fields) => {
                            if (error)
                                reject({ message: message.INTERNAL_SERVER_ERROR})
                            else {
                                if (data.discount_codeID > 0 && amount_of_use != -1 && rows[0].count + 1 > amount_of_use)
                                    reject({ message: message.NOT_USE_THIS_DISCOUNT_CODE})
                                else {
                                    let query = `Select count(*) count from ` + table.ORDERS + ` where discount_codeID = ? and (permission = "active" or permission = "trash") and buyerID = ? and buyer_type = ?`
                                    db.query(query, [data.discount_codeID, data.companyID, "buildings"], async (error, rows, fields) => {
                                        if (error)
                                            reject({ message: message.INTERNAL_SERVER_ERROR })
                                        else {
                                            if (data.discount_codeID > 0 && amount_of_use_per_user != -1 && rows[0].count + 1 > amount_of_use_per_user)
                                                reject({ message: message.NOT_USE_THIS_DISCOUNT_CODE })
                                            else {
                                                building_response = await adminBuildingModel.getBuilding(data.buildingID)
                                                await stripeHelper.createCardSource(building_response.building[0].stripe_customerID, data.id)
                                                createCharge(data).then((response) => {
                                                    let query = `Insert into ` + table.ORDERS + ` (buyer_type, productID, companyID, buildingID, buyerID, buyer_name, billing_cycle, renewal, price_type, price, vat_option, vat_fee, apartment_amount, start_date, end_date, payment_method, discount_codeID, discount_type, discount_amount, status, permission, created_by, created_at, payment_status) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                                                    db.query(query, ["buildings", data.productID, data.companyID, data.buildingID, data.buyerID, data.buyer_name, data.billing_cycle, data.renewal, data.price_type, data.price, data.vat_option, data.vat_fee, data.apartment_amount, timeHelper.getCurrentDate(), timeHelper.getNextYearDate(), data.payment_method, data.discount_codeID, data.discount_type, data.discount_amount, "active", "active", uid, timeHelper.getCurrentTime(),"success"], function (error, result, fields) {
                                                        if (error) {
                                                            reject({ message: message.INTERNAL_SERVER_ERROR });
                                                        } else {
                                                            resolve("ok")
                                                        }
                                                    })
                                                }).catch((err)=>{
                                                    reject({ message: err.message})
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        } else {
            building_response = await adminBuildingModel.getBuilding(data.buildingID)
            await stripeHelper.createCardSource(building_response.building[0].stripe_customerID, data.id)
            createCharge(data).then((response) => {
                let query = `Insert into ` + table.ORDERS + ` (buyer_type, productID, companyID, buildingID, buyerID, buyer_name, billing_cycle, renewal, price_type, price, vat_option, vat_fee, apartment_amount, start_date, end_date, payment_method, discount_codeID, discount_type, discount_amount, status, permission, created_by, created_at) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                db.query(query, ["buildings", data.productID, data.companyID, data.buildingID, data.buyerID, data.buyer_name, data.billing_cycle, data.renewal, data.price_type, data.price, data.vat_option, data.vat_fee, data.apartment_amount, timeHelper.getCurrentDate(), timeHelper.getNextYearDate(), data.payment_method, data.discount_codeID, data.discount_type, data.discount_amount, "active", "active", uid, timeHelper.getCurrentTime()], function (error, result, fields) {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR });
                    } else {
                        resolve("ok")
                    }
                }).catch((err)=>{
                    reject({ message: err.message})
                })
            })
        }
    })
}

/**
 * get discount code list by type
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getDiscountCodeListByType(data) {
    return new Promise((resolve, reject) => {
        if (data.user_type === "managers")
            data.user_type = "companies"
        let query = `SELECT
                    discount_codeID, name
                    FROM discount_codes
                    WHERE permission = "active" and user_type = ?`

        db.query(query, [data.user_type], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows)
            }
        })
    })
}

/**
 * get discountCode
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getDiscountCode(uid, id) {
    return new Promise((resolve, reject) => {
        let query = 'Select * from ' + table.DISCOUNTCODES + ' where discount_codeID = ?'

        db.query(query, [ id ],   (error, rows, fields) => {
            if (error) {
                 reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length == 0) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                } else {
                    if (rows[0].end_date === "9999-12-31")
                        rows[0].end_date = ""
                    resolve(rows[0]);
                }
            }
        })
    })
}

module.exports = addonModel
