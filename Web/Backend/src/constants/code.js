/**
 * Code constant file
 *
 * @package   backend/src/constants
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

/**
 * Code constants
 */
const codes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    INVALID_INPUT_PARAMS: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    ALREADY_EXIST: 600,

    SEE_PERMISSION: "see",
    EDIT_PERMISSION: "edit",
    DENIED_PERMISSION: "denied",
}

module.exports = codes
