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

var discountCodeModel = {
    getDiscountCodeList: getDiscountCodeList,
    getCountDiscountCodeList: getCountDiscountCodeList,
    createDiscountCode: createDiscountCode,
    getDiscountCode: getDiscountCode,
    updateDiscountCode: updateDiscountCode,
    deleteDiscountCode: deleteDiscountCode,
    deleteAllDiscountCode: deleteAllDiscountCode
}

/**
 * get company list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getDiscountCodeList(uid, data) {
    return new Promise((resolve, reject) => {
        let query = `SELECT
                    *, if(DATE(end_date ) > CURRENT_DATE, "active", "expired") status, d.discount_codeID ID, if(end_date = "9999-12-31", "", end_date) end_date
                    FROM discount_codes d left join (select count(discount_codeID) count, discount_codeID from orders where permission = "active" or permission = "trash" group by discount_codeID) s
                    ON d.discount_codeID = s.discount_codeID
                    WHERE permission = ? and name like ? `

        sort_column = Number(data.sort_column);
        row_count = Number(data.row_count);
        page_num = Number(data.page_num);
        search_key = '%' + data.search_key + '%'
        let params = [data.status, search_key];

        if (sort_column === -1)
            query += ' order by d.discount_codeID desc';
        else {
            if (sort_column === 0)
                query += ' order by d.name ';
            else if (sort_column === 1)
                query += ' order by d.user_type ';
            else if (sort_column === 2)
                query += ' order by d.discount_type, d.discount_amount ';
            else if (sort_column === 3)
                query += ' order by d.start_date ';
            else if (sort_column === 4)
                query += ' order by d.end_date ';
            else if (sort_column === 5)
                query += ' order by s.count ';
            else if (sort_column === 6)
                query += ' order by status ';
            query += data.sort_method;
        }
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
function getCountDiscountCodeList(uid, data) {
    return new Promise((resolve, reject) => {
        let query = `SELECT
                    count(*) count
                    FROM discount_codes
                    WHERE permission = ? and name like ? `
        search_key = '%' + data.search_key + '%'
        let params = [data.status, search_key];

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
 * create DiscountCode only discountCode table
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createDiscountCode(uid, data) {
    return new Promise((resolve, reject) => {
        if (data.end_date === undefined || data.end_date === "" || data.end_date === null)
            data.end_date = "9999-12-31"
        let query = `Insert into ` + table.DISCOUNTCODES + ` (user_type, name, start_date, end_date, discount_type, discount_amount, billing_cycle, amount_of_use, amount_of_use_per_user, permission, created_by, created_at) values (?,?,?,?,?,?,?,?,?,?,?,?)`;
        db.query(query, [data.user_type, data.name, data.start_date, data.end_date, data.discount_type, data.discount_amount, data.billing_cycle, data.amount_of_use, data.amount_of_use_per_user, "active", uid,timeHelper.getCurrentTime()], function (error, result, fields) {
            if (error) {
                reject({ message: error });
            } else {
                resolve("ok")
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


/**
 * update DiscountCode only discountCode table
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateDiscountCode(id, data) {
    return new Promise((resolve, reject) => {
        if (data.end_date === undefined || data.end_date === "" || data.end_date === null)
            data.end_date = "9999-12-31"
        let query = `Update ` + table.DISCOUNTCODES + ` set user_type = ?, name = ?, start_date = ?, end_date = ?, discount_type = ?, discount_amount = ?, billing_cycle = ?, amount_of_use = ?, amount_of_use_per_user = ?, updated_at = ? where discount_codeID = ? `
        db.query(query, [data.user_type, data.name, data.start_date, data.end_date, data.discount_type, data.discount_amount, data.billing_cycle, data.amount_of_use, data.amount_of_use_per_user, timeHelper.getCurrentTime(), id], function (error, result, fields) {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR });
            } else {
                resolve("ok")
            }
        })
    })
}

/**
 * delete discountCode
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteDiscountCode(uid, id, data) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.DISCOUNTCODES + ' SET  permission = ?, deleted_by = ?, deleted_at = ? where discount_codeID = ?'
  
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
 * delete all discountCode
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteAllDiscountCode() {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.DISCOUNTCODES + ' SET  permission = "deleted" where  permission = "trash"'
  
        db.query(query, [], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("ok")
            }
        })
    })
  }
module.exports = discountCodeModel
