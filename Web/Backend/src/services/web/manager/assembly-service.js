/**
 * Auth service file
 *
 * @package   backend/src/services
 * @author    Talent Developer <talentdeveloper59@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth/
 */

var assemblyModel = require('../../../models/web/manager/assembly-model')
var jwt = require('jsonwebtoken')
var message = require('../../../constants/message')
var code = require('../../../constants/code')
var key = require('../../../config/key-config')
var timer  = require('../../../constants/timer')
var authHelper = require('../../../helper/authHelper')

var assemblyService = {
    createAssembly: createAssembly,
    updateAssembly: updateAssembly,
    getAssembly: getAssembly,
    getAssemblyList: getAssemblyList,
    deleteAssembly: deleteAssembly,
    getBuildingList: getBuildingList,
    importAssemblyCSV: importAssemblyCSV,
    exportAssemblyCSV: exportAssemblyCSV,
    createAssemblyFile: createAssemblyFile,
    deleteAssemblyFile: deleteAssemblyFile,
    getAssemblyFileList: getAssemblyFileList,
    createAssemblyDecision: createAssemblyDecision,
    updateAssemblyDecision: updateAssemblyDecision,
    deleteAssemblyDecision: deleteAssemblyDecision,
    getAssemblyDecision: getAssemblyDecision,
    getAssemblyDecisionList: getAssemblyDecisionList,
    importAssemblyDecisionCSV: importAssemblyDecisionCSV,
    exportAssemblyDecisionCSV: exportAssemblyDecisionCSV,
    createAssemblyVote: createAssemblyVote,
    getPostalVoteOwnerList: getPostalVoteOwnerList,
    getAssemblyVoteList: getAssemblyVoteList,
    deleteAssemblyVote: deleteAssemblyVote,
    getAssemblyVoteDetail: getAssemblyVoteDetail,
}

/**
 * Function that add assembly
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object data
 * @return  json
 */
function createAssembly(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.createAssembly(uid, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that update assembly
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object id
 * @param   object userdata
 * @param   object data
 * @return  json
 */
function updateAssembly(uid, id, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.updateAssembly(uid, id, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that get assembly
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object id
 * @param   object userdata
 * @return  json
 */
function getAssembly(uid, id, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.getAssembly(id).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token, 'assembly': result.assembly, 'votelist': result.votelist } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that get assembly list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object id
 * @param   object userdata
 * @return  json
 */
function getAssemblyList(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.getAssemblyList(uid, data).then((assemblyList) => {
                if (assemblyList) {
                    assemblyModel.getCountAssemblyList(uid, data).then((assemblyCount) => {
                        let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                            expiresIn: timer.TOKEN_EXPIRATION
                        })
                        resolve({ code: code.OK, message: '', data: { 'token': token, 'totalpage': Math.ceil(assemblyCount / Number(data.row_count)), 'assemblyList': assemblyList, 'totalcount': assemblyCount} })
                    })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that delete assembly
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object id
 * @param   object userdata
 * @return  json
 */
function deleteAssembly(uid, id, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.deleteAssembly(id).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that get building list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object data
 * @return  json
 */
function getBuildingList(uid, userdata ,data) {
    return new Promise((resolve, reject) => {
        authHelper.hasOwnerPermission(userdata, [code.EDIT_PERMISSION, code.SEE_PERMISSION]).then((response) => {
            assemblyModel.getBuildingList(uid, data).then((buildinglist) => {
                if (buildinglist) {
                        let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                            expiresIn: timer.TOKEN_EXPIRATION
                        })
                        resolve({ code: code.OK, message: '', data: { 'token': token, 'buildinglist': buildinglist} })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that import assembly list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object file
 * @param   object data
 * @return  json
 */
function importAssemblyCSV(uid, userdata, file, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasBuildingPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.importAssemblyCSV(uid, file, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that export assembly list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object data
 * @param   object res
 * @return  json
 */
function exportAssemblyCSV(uid, userdata, data, res) {
    return new Promise((resolve, reject) => {
        authHelper.hasBuildingPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.exportAssemblyCSV(data, res).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that create assembly file
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object file
 * @param   object userdata
 * @return  json
 */
function createAssemblyFile(uid, data, file, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.createAssemblyFile(uid, data, file).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that delete assembly file
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object id
 * @param   object userdata
 * @return  json
 */
function deleteAssemblyFile(uid, id, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.deleteAssemblyFile(id).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that get assembly file list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object id
 * @param   object userdata
 * @return  json
 */
function getAssemblyFileList(uid, id, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.getAssemblyFileList(id, uid).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token, 'files': result.files } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that add assembly decision
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object data
 * @return  json
 */
function createAssemblyDecision(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.createAssemblyDecision(uid, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that update assembly decision
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object id
 * @param   object userdata
 * @param   object data
 * @return  json
 */
function updateAssemblyDecision(uid, id, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.updateAssemblyDecision(uid, id, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that get assembly decision
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object id
 * @param   object userdata
 * @return  json
 */
function getAssemblyDecision(uid, id, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.getAssemblyDecision(id).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token, 'decision': result.decision, 'assembly': result.assembly, 'votelist': result.votelist } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that delete assembly decision
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object id
 * @param   object userdata
 * @return  json
 */
function deleteAssemblyDecision(uid, id, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.deleteAssemblyDecision(id).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that get assembly decision list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object id
 * @param   object userdata
 * @return  json
 */
function getAssemblyDecisionList(uid, data, id, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.getAssemblyDecisionList(id, data).then((assemblyDecisionList) => {
                if (assemblyDecisionList) {
                    assemblyModel.getCountAssemblyDecisionList(id, data).then((assemblyDicisionCount) => {
                        if (assemblyDicisionCount) {
                            assemblyModel.getAssembly(id).then((result) => {
                                if (result) {
                                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                                        expiresIn: timer.TOKEN_EXPIRATION
                                    })
                                    resolve({ code: code.OK, message: '', data: { 'token': token, 'totalpage': Math.ceil(assemblyDicisionCount / Number(data.row_count)), 'assemblyDecisionList': assemblyDecisionList, 'totalcount': assemblyDicisionCount, 'assembly': result.assembly, 'votelist': result.votelist} })
                                }
                            })
                        }
                    })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that import assembly decision list from CSV
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object id
 * @param   object userdata
 * @return  json
 */
function importAssemblyDecisionCSV(uid, userdata, file, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.importAssemblyDecisionCSV(uid, file, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that delete All trashed company data
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object data
 * @param   object res
 * @return  json
 */
function exportAssemblyDecisionCSV(uid, userdata, data, res) {
    return new Promise((resolve, reject) => {
        authHelper.hasBuildingPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.exportAssemblyDecisionCSV(data, res).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })

                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that add assembly decision
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object data
 * @return  json
 */
function createAssemblyVote(uid, userdata, data) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.createAssemblyVote(uid, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that get owner list for vote
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object data
 * @return  json
 */
function getPostalVoteOwnerList(uid, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.getPostalVoteOwnerList(uid).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token, 'owners': result.owners, } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that get vote list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object data
 * @return  json
 */
function getAssemblyVoteList(uid, data, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.getAssemblyVoteList(uid, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token, 'votes': result.votes, } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that delete vote
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object data
 * @return  json
 */
function deleteAssemblyVote(uid, data, id, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.deleteAssemblyVote(id, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token } })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

/**
 * Function that get vote detail
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object userdata
 * @param   object data
 * @return  json
 */
function getAssemblyVoteDetail(uid, data, id, userdata) {
    return new Promise((resolve, reject) => {
        authHelper.hasAssemblyPermission(userdata, [code.EDIT_PERMISSION]).then((response) => {
            assemblyModel.getAssemblyVoteDetail(uid, id, data).then((result) => {
                if (result) {
                    let token = jwt.sign({ uid: uid, userdata: userdata }, key.JWT_SECRET_KEY, {
                        expiresIn: timer.TOKEN_EXPIRATION
                    })
                    resolve({ code: code.OK, message: '', data: { 'token': token, 'votes': result.votes, 'decisions': result.decisions, 'users': result.users} })
                }
            }).catch((err) => {
                if (err.message === message.INTERNAL_SERVER_ERROR)
                    reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
                else
                    reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
            })
        }).catch((error) => {
            reject({ code: code.BAD_REQUEST, message: error.message, data: {} })
        })
    })
}

module.exports = assemblyService