/**
 * Auth router file
 * 
 * @package   backend/src/routes
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth
 */

const dotenv = require('dotenv')
dotenv.config()

var express = require('express')
var router = express.Router()

const authMiddleware = require('../../middleware/auth-middleware')
const ownerService = require('../../services/mobile/owner/owner-service')
const adminService = require('../../services/mobile/owner/account-service')

var multer  = require('multer')
var upload = multer({ dest: process.env.UPLOAD_ORIGIN || '/tmp/', limits: {fileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE)} })

/**
 * profile api
 */
router.get('/profile', authMiddleware.checkToken, getProfile)
router.post('/profile', authMiddleware.checkToken, upload.fields([{name: 'avatar', maxCount: 1}, {name: 'id_card_front', maxCount: 1},{name: 'id_card_back', maxCount: 1}]), updateProfile)

/**
 * owner api
 */
router.post('/subAccountList', authMiddleware.checkToken, getOwnerList)
router.post('/subAccount', authMiddleware.checkToken, createOwner)
router.post('/subAccount/:id', authMiddleware.checkToken, getOwner)
router.delete('/subAccount/:id', authMiddleware.checkToken, deleteOwner)
router.post('/invitation', acceptInvitation)
router.post('/subAccount/:id/reinvite', authMiddleware.checkToken, reinviteOwner)
router.get('/buildingListByOwner', authMiddleware.checkToken, getBuildingListByOwner)

///////////////////////////////////Profile/////////////////////////////

/**
 * Function that get profile data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getProfile(req, res) {
    let userId = req.decoded.uid

    adminService.getProfile(userId).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that update profile data
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */


function updateProfile(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let files = req.files
    let data = req.body
    adminService.updateProfile(userId, data, files, userdata).then((result)=>{
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });
}

///////////////////////////////////Owner/////////////////////////////

/**
 * Function that get the owner list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getOwnerList(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    ownerService.getOwnerList(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get the owner list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getBuildingListByOwner(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    ownerService.getBuildingListByOwner(userId, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that create owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function createOwner(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    let files = req.files
    ownerService.createOwner(userId, userdata, data, files).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getOwner(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    let data = req.body
    ownerService.getOwner(userId, userdata, data, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}


/**
 * Function that delete owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteOwner(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    ownerService.deleteOwner(userId, id, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function acceptInvitation(req, res) {
    let data = req.body
    console.log("data:", data)
    ownerService.acceptInvitation(data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get the owner list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function reinviteOwner(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    ownerService.reinviteOwner(userId, userdata, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

module.exports = router
