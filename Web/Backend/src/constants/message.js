/**
 * Message constant
 *
 * @package   backend/src/constants
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

/**
 * Message constants
 */
const messages = {
    INVALID_INPUT_PARAMS: 'Invalid input parameters.',
    INVALID_AUTH_TOKEN: 'Auth token is invalid.',
    AUTH_ERROR: 'Sorry, your request could not be authenticated',
    INTERNAL_SERVER_ERROR: 'The request was not completed.',
    INVALID_PASSWORD: 'Invalid password.',
    INVALID_NEW_PASSWORD: 'New password is the same with your old one. Please try to change your password again.',
    INVALID_SMS_CODE: 'Invalid SMS Code, Please check your SMS code again.',
    EXPIRED_SMS_CODE: 'Your SMS Code is Expired, Please try again.',
    EXPIRED_TOKEN_CODE: 'Your Token is Expired, Please try again.',
    USER_EMAIL_DUPLICATED: 'Sorry, this user already exists.',
    USER_DELETED: 'Sorry, this user is deleted.',
    EMIL_IS_NOT_EXIST: 'Your email Address is not exist or not authorized recipients.',
    INVALID_TOKEN: 'Invalid TOKEN to reset your password, Please try again.',
    ACCOUNT_NOT_EXIST: 'The account does not exist.',
    COMPANY_NOT_EXIST: 'The company does not exist.',
    INVALID_OLD_PASSWORD: 'Old password does not match!',
    CHANGEPWD_ERROR: 'Sorry, you can not change the password.',
    DATA_NOT_EXIST: 'The data does not exists.',
    UPLOAD_FAILED: 'Sorry, Uploading failed.',
    SEND_CHALLENGE_ERROR: 'Sorry, sending challenge email failed.',
    API_KEY_REQUIRED: 'API key is required for this functionality',
    COMPANY_ALREADY_EXIST: 'Company is already exist.',
    OWNER_ALREADY_EXIST: 'Owner is already exist.',
    MANAGER_ALREADY_EXIST: 'Manager is already exist.',
    HAS_NO_PERMISSION: "You don't have a permission to see or edit this section.",
    BUILDING_NOT_EXSIT: "Building Information does not exist.",

    SMS_CODE_SENT_SUCCESSFULLY: 'Sent the SMS Code to Your Phone.',
    EMAIL_RESET_LINK_SENT_SUCCESSFULLY: 'Sent the new password to your email. Please check your email.',
    VERIFIED_TOKEN_SUCCESSFULLY: 'Verified the token to reset your password. Please type your new and confirm password.',
    RESET_PASSWORD_SUCCESSFULLY: 'Reseted your password successfully.',
    COMPANY_ADD_SUCCESSFULLY: 'Created Company Successfully.',
    COMPANY_UPDATE_SUCCESSFULLY: 'Updated Company Successfully.',
    BUILDING_UPDATE_SUCCESSFULLY: 'Updated Building Successfully.',
    SUBACCOUNT_HAS_BEEN_UPDATED_STATUS: 'Your account status has been updated with "ACTIVE" ',
    NOT_USE_THIS_DISCOUNT_CODE: 'You cant use this discount code because not charge',
    CARD_ADD_SUCCESSFULLY: 'Created Card Successfully.',
    CARD_UPDATE_SUCCESSFULLY: 'Updated Card Successfully.',
    NO_BANK: 'Have No Bank Information.',
    NO_CARD: 'Have No Card Information.',
    NOT_CREATE_ORDER: `Can't create the order due to price is lower than zero.`,
}

module.exports = messages
