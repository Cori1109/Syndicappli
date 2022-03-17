/**
 * Database control file
 *
 * @package   backend/src/database
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

/**
 * Function that check the connection is exist or not from pool
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @return  string success if connection existed returns success else returns err
 */
function connectionCheck(pool) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        if (connection) connection.release()
        reject(err)
      } else {
        resolve(connection)
      }
    })
  })
}

module.exports = {
  connectionCheck: connectionCheck
}
