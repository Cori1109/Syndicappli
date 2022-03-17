/**
 * Authenticate helper file
 *
 * @package   backend/src/helper
 * @author    Taras <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var message = require('../constants/message')

const authHelper = {
    hasCompanyPermission: hasCompanyPermission,
    hasManagerPermission: hasManagerPermission,
    hasProductPermission: hasProductPermission,
    hasBuildingPermission: hasBuildingPermission,
    hasOwnerPermission: hasOwnerPermission,
    hasOrderPermission: hasOrderPermission,
    hasDiscountCodePermission: hasDiscountCodePermission,
    hasUserPermission: hasUserPermission,
    hasTeamPermission: hasTeamPermission,
    hasAddonPermission: hasAddonPermission,
    hasInvoicePermission: hasInvoicePermission,
    hasPaymentPermission: hasPaymentPermission,
    hasAssemblyPermission: hasAssemblyPermission,
}

function hasCompanyPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_companies == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasManagerPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_managers == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasTeamPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_team == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasBuildingPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_buildings == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasOwnerPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_owners == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasOrderPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_orders == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasProductPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_products == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasDiscountCodePermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_discountcodes == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasUserPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_users == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasAddonPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_addons == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasInvoicePermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_invoices == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasPaymentPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_payments == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

function hasAssemblyPermission(userdata, permission){
    return new Promise((resolve, reject) => {
        let status = false
        for (i in permission) {
            if (userdata.role_assemblies == permission[i]){
                status = true
                break
            } else {
                continue
            }
        }
        if(status == true){
            resolve("true")
        }else{
            reject({ message: message.HAS_NO_PERMISSION })
        }
    })
}

module.exports = authHelper