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
const {sendMail} = require('../../../helper/mailHelper')
var mail = require('../../../constants/mail')
var randtoken = require('rand-token');
var code = require('../../../constants/code')

var productModel = {
    getProductList: getProductList,
    getCountProductList: getCountProductList,
    createProduct: createProduct,
    getProduct: getProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    deleteAllProduct: deleteAllProduct
}

/**
 * get company list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getProductList(uid, data) {
    return new Promise((resolve, reject) => {
        let query = `SELECT
                    *, productID ID
                    FROM products
                    WHERE permission = ? and buyer_type = ? and name like ? `

        sort_column = Number(data.sort_column);
        row_count = Number(data.row_count);
        page_num = Number(data.page_num);
        search_key = '%' + data.search_key + '%'
        let params = [data.status, data.type, search_key];

        if (sort_column === -1)
            query += ' order by productID desc';
        else {
            if (sort_column === 0)
                query += ' order by name ';
            else if (sort_column === 1)
                query += ' order by price ';
            query += data.sort_method;
        }
        if (row_count > 0)
            query += ' limit ' + page_num * row_count + ',' + row_count
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
 * get count for building list for search filter
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getCountProductList(uid, data) {
    return new Promise((resolve, reject) => {
        let query = `SELECT
                    count(*) count
                    FROM products
                    WHERE permission = ? and buyer_type = ? and name like ? `
        search_key = '%' + data.search_key + '%'
        let params = [data.status, data.type, search_key];

        db.query(query, params, (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows[0].count)
            }
        })
    })
}


/**
 * create Product only product table
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createProduct(uid, data) {
    return new Promise((resolve, reject) => {
        let query = `Insert into ` + table.PRODUCTS + ` (buyer_type, billing_cycle, renewal, name, description, price_type, price, vat_option, vat_fee, created_by, created_at) values (?,?,?,?,?,?,?,?,?,?,?)`;
        db.query(query, [data.buyer_type, data.billing_cycle, data.renewal, data.name, data.description, data.price_type, data.price, data.vat_option, data.vat_fee, uid, timeHelper.getCurrentTime()], function (error, result, fields) {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR });
            } else {
                resolve("ok")
            }
        })
    })
}

/**
 * get product
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getProduct(uid, id) {
    return new Promise((resolve, reject) => {
        let query = 'Select * from ' + table.PRODUCTS + ' where productID = ?'

        db.query(query, [ id ],   (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length == 0) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                } else {
                    resolve(rows[0]);
                }
            }
        })
    })
}


/**
 * update Product only product table
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateProduct(id, data) {
    return new Promise(async (resolve, reject) => {
        let query = `Update ` + table.PRODUCTS + ` set buyer_type = ?, billing_cycle = ?, renewal = ?, name = ?, description = ?, price_type = ?, price = ?, vat_option = ?, vat_fee = ?, updated_at = ? where productID = ? `
        db.query(query, [data.buyer_type, data.billing_cycle, data.renewal, data.name, data.description, data.price_type, data.price, data.vat_option, data.vat_fee, timeHelper.getCurrentTime(), id], function (error, result, fields) {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR });
            } else {
                resolve("ok")
            }
        })
    })
}

/**
 * delete product
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteProduct(uid, id, data) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.PRODUCTS + ' SET  permission = ?, deleted_by = ?, deleted_at = ? where productID = ?'
  
        db.query(query, [ data.status, uid, timeHelper.getCurrentTime(), id ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("ok")
            }
        })
    })
  }

/**
 * delete all product
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteAllProduct() {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.PRODUCTS + ' SET  permission = "deleted" where  permission = "trash"'
  
        db.query(query, [], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("ok")
            }
        })
    })
  }
module.exports = productModel
