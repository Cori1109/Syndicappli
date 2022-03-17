/**
 * Index router file
 *
 * @package   backend/src/routes
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly
 */

const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const formidable = require('formidable');

const router = express.Router()
const authMiddleware = require('../../middleware/auth-middleware')
const adminService = require('../../services/web/admin/admin-service')
const buildingService = require('../../services/web/admin/building-service')
const companyService = require('../../services/web/admin/company-service')
const managerService = require('../../services/web/admin/manager-service')
const ownerService = require('../../services/web/admin/owner-service')
const productService = require('../../services/web/admin/product-service')
const discountCodesService = require('../../services/web/admin/discountcodes-service')
const orderService = require('../../services/web/admin/order-service')

const {validate} = require('express-validation')
var adminValidation = require('../../validator/admin-validation')
var multer  = require('multer')
var upload = multer({ dest: process.env.UPLOAD_ORIGIN || '/tmp/', limits: {fileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE)} })

/**
 * profile api
 */
router.get('/profile', authMiddleware.checkToken, getProfile)
router.post('/profile', authMiddleware.checkToken, upload.single('avatar'), updateProfile)

/**
 * user api
 */
router.post('/userList', authMiddleware.checkToken, getUserList)
router.post('/user', authMiddleware.checkToken, upload.single('logo'), createUser)
router.get('/user/:id', authMiddleware.checkToken, getUser)
router.put('/user/:id', authMiddleware.checkToken, upload.single('logo'), updateUser)
router.post('/user/:id/delete', authMiddleware.checkToken, deleteUser)
router.post('/trash/user/deleteAll', authMiddleware.checkToken, deleteAllUser)

/**
 * company api
 */
router.post('/companyList', authMiddleware.checkToken, getCompanyList)
router.post('/company', authMiddleware.checkToken, upload.single('logo'), createCompany)
router.put('/company/:id', authMiddleware.checkToken, upload.single('logo'), updateCompany)
router.put('/company/:id/bank', authMiddleware.checkToken, updateCompanyBankInformation)
router.get('/company/:id', authMiddleware.checkToken, getCompany)
router.post('/company/:id/delete', authMiddleware.checkToken, deleteCompany)
router.post('/trash/company/deleteAll', authMiddleware.checkToken, deleteAllCompany)

router.post('/cardList', authMiddleware.checkToken, getCardList)
router.post('/card', authMiddleware.checkToken, createCard)
router.get('/card/:id', authMiddleware.checkToken, getCard)
router.put('/card/:id', authMiddleware.checkToken, updateCard)
router.delete('/card/:id', authMiddleware.checkToken, deleteCard)

/**
 * building api
 */
router.post('/buildingList', authMiddleware.checkToken, getBuildingList)
router.post('/buildingListByCompany', authMiddleware.checkToken, getBuildingListByCompany)
router.get('/companyListByUser', authMiddleware.checkToken, getCompanyListByUser)
router.post('/building', authMiddleware.checkToken, createBuilding)
router.get('/building/:id', authMiddleware.checkToken, getBuilding)
router.put('/building/:id', authMiddleware.checkToken, updateBuilding)
router.put('/building/:id/bank', authMiddleware.checkToken, updateBuildingBankInformation)
router.post('/building/:id/delete', authMiddleware.checkToken, deleteBuilding)
router.post('/trash/building/deleteAll', authMiddleware.checkToken, deleteAllBuilding)

router.post('/building/import_csv', authMiddleware.checkToken, upload.single('csv'), importBuildingCSV)
router.post('/building/export_csv', authMiddleware.checkToken, exportBuildingCSV)
/**
 * manager api
 */
router.post('/managerList', authMiddleware.checkToken, getManagerList)
router.post('/manager', authMiddleware.checkToken, upload.single('logo'), createManager)
router.get('/manager/:id', authMiddleware.checkToken, getManager)
router.put('/manager/:id', authMiddleware.checkToken, upload.single('logo'), updateManager)
router.post('/manager/:id/delete', authMiddleware.checkToken, deleteManager)
router.put('/manager/:id/status', authMiddleware.checkToken, updateManagerStatus)
router.post('/trash/manager/deleteAll', authMiddleware.checkToken, deleteAllManager)


/**
 * owner api
 */
router.post('/ownerList', authMiddleware.checkToken, getOwnerList)
router.post('/owner', authMiddleware.checkToken,  upload.fields([{name: 'photo_url', maxCount: 1}, {name: 'id_card_front', maxCount: 1},{name: 'id_card_back', maxCount: 1}]), createOwner)
router.post('/owner/:id', authMiddleware.checkToken, getOwner)
router.put('/owner/:id', authMiddleware.checkToken, upload.fields([{name: 'photo_url', maxCount: 1}, {name: 'id_card_front', maxCount: 1},{name: 'id_card_back', maxCount: 1}]), updateOwner)
router.post('/owner/:id/delete', authMiddleware.checkToken, deleteOwner)
router.put('/owner/:id/status', authMiddleware.checkToken, updateOwnerStatus)
router.post('/trash/owner/deleteAll', authMiddleware.checkToken, deleteAllOwner)

router.post('/owner_import_csv', authMiddleware.checkToken, upload.single('csv'), importOwnerCSV)
router.post('/owner_export_csv', authMiddleware.checkToken, exportOwnerCSV)

/**
 * product api
 */
router.post('/productList', authMiddleware.checkToken, getProductList)
router.post('/product', authMiddleware.checkToken, createProduct)
router.get('/product/:id', authMiddleware.checkToken, getProduct)
router.put('/product/:id', authMiddleware.checkToken, updateProduct)
router.post('/product/:id/delete', authMiddleware.checkToken, deleteProduct)
router.post('/trash/product/deleteAll', authMiddleware.checkToken, deleteAllProduct)

/**
 * discountcode api
 */
router.post('/discountCodeList', authMiddleware.checkToken, getDiscountCodeList)
router.post('/discountCode', authMiddleware.checkToken, createDiscountCode)
router.get('/discountCode/:id', authMiddleware.checkToken, getDiscountCode)
router.put('/discountCode/:id', authMiddleware.checkToken, updateDiscountCode)
router.post('/discountCode/:id/delete', authMiddleware.checkToken, deleteDiscountCode)
router.post('/trash/discountCode/deleteAll', authMiddleware.checkToken, deleteAllDiscountCode)

/**
 * order api
 */
router.post('/orderList', authMiddleware.checkToken, getOrderList)
router.post('/buyerList', authMiddleware.checkToken, getBuyerList)
router.post('/discountCodeListByType', authMiddleware.checkToken, getDiscountCodeListByType)
router.post('/order', authMiddleware.checkToken, createOrder)
router.get('/order/:id', authMiddleware.checkToken, getOrder)
router.put('/order/:id', authMiddleware.checkToken, updateOrder)
router.post('/order/:id/delete', authMiddleware.checkToken, deleteOrder)
router.post('/trash/order/deleteAll', authMiddleware.checkToken, deleteAllOrder)
router.post('/downloadInvoiceCompany', authMiddleware.checkToken, downloadInvoiceOrder)
router.post('/downloadInvoiceOwner', authMiddleware.checkToken, downloadInvoiceOwner)
router.post('/downloadInvoiceBuilding', authMiddleware.checkToken, downloadInvoiceBuilding)
router.post('/downloadZipCompany', authMiddleware.checkToken, downloadZipOrder)
router.post('/downloadZipOwner', authMiddleware.checkToken, downloadZipOwner)
router.post('/downloadZipBuilding', authMiddleware.checkToken, downloadZipBuilding)
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
    let data = req.body
    let file = req.file
    adminService.updateProfile(userId, data, file, userdata).then((result)=>{
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });
}

/**
 * Function that get user list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getUserList(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    adminService.getUserList(userId, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function createUser(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let file = req.file
    adminService.createUser(userId, req.body, file, userdata).then((result)=>{
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });

}

/**
 * Function that get user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getUser(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.params.id
    adminService.getUser(userId, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that update user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateUser(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    let data = req.body
    let file = req.file
    adminService.updateUser(userId, id, data, userdata, file).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteUser(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    let data = req.body
    adminService.deleteUser(userId, id, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete all trashed user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteAllUser(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    adminService.deleteAllUser(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}


////////////////////////////////////Company///////////////////////////////////////

/**
 * Function that get company list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getCompanyList(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    companyService.getCompanyList(userId, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that create company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function createCompany(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let file = req.file
    companyService.createCompany(userId, userdata, req.body, file).then((result)=>{
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });
}

/**
 * Function that updates company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateCompany(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let file = req.file
    let companyID = req.params.id
    companyService.updateCompany(companyID, userId, userdata, req.body, file).then((result)=>{
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });
}

/**
 * Function that updates bank information
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateCompanyBankInformation(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let companyID = req.params.id
    companyService.updateBankInformation(companyID, userId, userdata, req.body).then((result)=>{
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });
}

/**
 * Function that gets company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getCompany(req, res) {
    let uid = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.params.id
    companyService.getCompany(uid, userdata, data).then((result)=>{
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });
}

/**
 * Function that delete company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteCompany(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    let data = req.body
    companyService.deleteCompany(userId, id, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete all trashed company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteAllCompany(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    companyService.deleteAllCompany(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get card list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getCardList(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    companyService.getCardList(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that create card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function createCard(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    companyService.createCard(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getCard(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    companyService.getCard(userId, userdata, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that update card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateCard(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    let data = req.body
    companyService.updateCard(userId, userdata, id, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete card
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteCard(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    companyService.deleteCard(userId, userdata, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}
/////////////////////////////////////////////////Building///////////////////////////////////////
/**
 * Function that get company list by user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getCompanyListByUser(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    buildingService.getCompanyListByUser(userId, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get building list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getBuildingList(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body

    buildingService.getBuildingList(userId, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get building list by Company
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getBuildingListByCompany(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body

    buildingService.getBuildingListByCompany(userId, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}



/**
 * Function that create building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function createBuilding(req, res) {

    let userId = req.decoded.uid
    let data = req.body
    let userdata = req.decoded.userdata
    buildingService.createBuilding(userId, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getBuilding(req, res) {

    let userId = req.decoded.uid
    let data = req.params.id
    let userdata = req.decoded.userdata
    buildingService.getBuilding(userId, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that update building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateBuilding(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id;
    let data = req.body
    buildingService.updateBuilding(userId, id, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete all trashed building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteAllBuilding(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    buildingService.deleteAllBuilding(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that deletes building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteBuilding(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    let data = req.body
    buildingService.deleteBuilding(userId, id, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that import CSV for Building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function importBuildingCSV(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let file = req.file
    let data = req.body
    
    buildingService.importBuildingCSV(userId, userdata, file, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that export CSV for Building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function exportBuildingCSV(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    buildingService.exportBuildingCSV(userId, userdata, data, res).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that updates bank information
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateBuildingBankInformation(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let buildingID = req.params.id
    buildingService.updateBankInformation(buildingID, userId, userdata, req.body).then((result)=>{
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });
}

//////////////////////////////////////////Manager//////////////////////////////////

/**
 * Function that get manager list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getManagerList(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    managerService.getManagerList(userId, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that create user
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function createManager(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let file = req.file
    managerService.createManager(userId, userdata, req.body, file).then((result)=>{
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });
}

/**
 * Function that get manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getManager(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.params.id
    managerService.getManager(userId, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that update manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateManager(req, res) {

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id;
    let data = req.body
    let file = req.file
    managerService.updateManager(userId, id, data, userdata, file).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteManager(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    let data = req.body
    managerService.deleteManager(userId, id, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}


/**
 * Function that update manager status
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateManagerStatus(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id;
    let data = req.body
    managerService.updateManagerStatus(userId, id, data, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete all trashed manager
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteAllManager(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    managerService.deleteAllManager(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/////////////////////////////////Owner/////////////////////////////
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
 * Function that update owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateOwner(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    let id = req.params.id;
    let files = req.files
    ownerService.updateOwner(userId, userdata, data, files, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that update owner status
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateOwnerStatus(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    let id = req.params.id;
    ownerService.updateOwnerStatus(userId, userdata, data, id).then((result) => {
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
    let data = req.body
    ownerService.deleteOwner(userId, id, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete all trashed owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteAllOwner(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    ownerService.deleteAllOwner(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that import CSV for Building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function importOwnerCSV(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let file = req.file
    let data = req.body
    
    ownerService.importOwnerCSV(userId, userdata, file, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that export CSV for Building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function exportOwnerCSV(req, res) {
    console.log('aaa')
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    ownerService.exportOwnerCSV(userId, userdata, data, res).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

//////////////////////////product////////////////////////////
/**
 * Function that get the product list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getProductList(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    productService.getProductList(userId, userdata, data).then((result) => {
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
function createProduct(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    productService.createProduct(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get product
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getProduct(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    productService.getProduct(userId, userdata, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that update product
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateProduct(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    let id = req.params.id;
    productService.updateProduct(userId, userdata, data, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete product
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteProduct(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    let data = req.body
    productService.deleteProduct(userId, id, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete all trashed product
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteAllProduct(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    productService.deleteAllProduct(userId, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

//////////////////////////discount_codes////////////////////////////
/**
 * Function that get the discountcodes list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getDiscountCodeList(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    discountCodesService.getDiscountCodeList(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}


/**
 * Function that create discountcodes
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function createDiscountCode(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    discountCodesService.createDiscountCode(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get discountcode
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getDiscountCode(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    discountCodesService.getDiscountCode(userId, userdata, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that update discountcode
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateDiscountCode(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    let id = req.params.id;
    discountCodesService.updateDiscountCode(userId, userdata, data, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete discountcode
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteDiscountCode(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    let data = req.body
    discountCodesService.deleteDiscountCode(userId, id, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete all discountcode
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteAllDiscountCode(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    discountCodesService.deleteAllDiscountCode(userId, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

//////////////////////////order////////////////////////////
/**
 * Function that get the order list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getOrderList(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    orderService.getOrderList(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get the buyer list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getBuyerList(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    orderService.getBuyerList(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get the buyer list
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getDiscountCodeListByType(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    orderService.getDiscountCodeListByType(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}


/**
 * Function that create order
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function createOrder(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    orderService.createOrder(userId, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get order
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getOrder(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    orderService.getOrder(userId, userdata, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that update order
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateOrder(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    let id = req.params.id;
    orderService.updateOrder(userId, userdata, data, id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete order
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteOrder(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let id = req.params.id
    let data = req.body
    orderService.deleteOrder(userId, id, userdata, data).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that delete all trashed order
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function deleteAllOrder(req, res) {
    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    orderService.deleteAllOrder(userId, userdata).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that download addon Invoice
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function downloadInvoiceOrder(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    orderService.downloadInvoiceOrder(userId, userdata, data, res).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that download addon Invoice
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function downloadInvoiceOwner(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    orderService.downloadInvoiceOwner(userId, userdata, data, res).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that download addon Invoice
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function downloadInvoiceBuilding(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    orderService.downloadInvoiceBuilding(userId, userdata, data, res).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}


/**
 * Function that download addon Invoice
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function downloadZipOrder(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    orderService.downloadZipOrder(userId, userdata, data, res).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that download addon Invoice
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function downloadZipOwner(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    orderService.downloadZipOwner(userId, userdata, data, res).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that download addon Invoice
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function downloadZipBuilding(req, res){

    let userId = req.decoded.uid
    let userdata = req.decoded.userdata
    let data = req.body
    orderService.downloadZipBuilding(userId, userdata, data, res).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}
module.exports = router