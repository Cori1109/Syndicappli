const mysql = require('mysql');
const dbConfig = require('../../config/database-config');
const codes = require("../../constants/code");
const pool = mysql.createPool(dbConfig);

/* THE BEST WAY FOR A CLEAN CODE */
const executeSQL = async function (sqlstr, params) {

  var promise = new Promise(function(resolve, reject) {

    var allRows = [];

    pool.getConnection(function(error, mysqlConnection) {
      if(error) {
        reject(error);
        return;
      }

      mysqlConnection.query(sqlstr, params, function(error, allRows) {
        mysqlConnection.release();
        if(error) {
          reject(error);
        }
        else resolve(allRows);
      });

    });
  });

  return await promise;
}

exports.executeSQL = executeSQL;

exports.commonQuery = async function (spName, params, res, gotCount, errorMessage) {
  var sqlstr = `CALL ${spName}(`;
  for(let i = 0; i < params.length; i++) {
    sqlstr += (i === 0 ? '?' : ',?');
  }
  sqlstr += ');';
  /* Beware: If there is count value in the SP, it must be the second result set and name as total */
  await executeSQL(sqlstr, params)
  .then(function(result) {
    if(result && result.length > 0)
    {
      res.json({
        success: true, result: result[0],
        count: ((gotCount && result.length > 1) ? result[1][0].total : 0)
      });
    }
    else res.json({ success: false, errorMessage: errorMessage ? errorMessage : codes.BAD_REQUEST });
  })
  .catch(function(error) {
    res.json({ success: false, errorMessage: codes.BAD_REQUEST });
  });
}

exports.commonQueryRows = async function (spName, params) {
  var sqlstr = `CALL ${spName}(`;
  for(let i = 0; i < params.length; i++) {
    sqlstr += (i === 0 ? '?' : ',?');
  }
  sqlstr += ');';

  let finalResult;

  await executeSQL(sqlstr, params)
  .then(function(result) {
    if(result && result.length > 0)
    {
      finalResult = result;
    }
  })
  .catch(function(error) { });

  return finalResult;
}