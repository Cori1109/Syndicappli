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
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const stripeHelper = require('../../../helper/stripeHelper')
var ownerModel = {
    getOwnerList: getOwnerList,
    getCountOwnerList: getCountOwnerList,
    createOwner_info: createOwner_info,
    createBuildingRelationShip: createBuildingRelationShip,
    createOwner: createOwner,
    getOwner: getOwner,
    updateOwner_info: updateOwner_info,
    updateOwner: updateOwner,
    delete_apartments: delete_apartments,
    deleteOwner: deleteOwner,
    updateOwnerStatus: updateOwnerStatus,
    deleteAllOwner: deleteAllOwner,
    exportOwnerCSV: exportOwnerCSV,
    importOwnerCSV: importOwnerCSV
}

/**
 * get company list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getOwnerList(uid, data) {
    return new Promise((resolve, reject) => {
        let query = `SELECT
                    *, users.userID ID, users.phone phone, users.email email, user_relationship.relationID buildingID, ifnull(s.count, 0) count
                    FROM users
                    LEFT JOIN user_relationship USING ( userID ) 
                    LEFT JOIN buildings ON user_relationship.relationID = buildings.buildingID 
                    Left join companies using (companyID)
                    LEFT JOIN ( SELECT count( buildingID ) count, buildingID, userID FROM apartments LEFT JOIN buildings USING ( buildingID ) GROUP BY apartments.buildingID, apartments.userID ) s ON buildings.buildingID = s.buildingID and users.userID = s.userID
                    WHERE users.usertype = "owner" and users.firstname like ? and users.permission = ? `

        sort_column = Number(data.sort_column);
        row_count = Number(data.row_count);
        page_num = Number(data.page_num);
        search_key = '%' + data.search_key + '%'
        let params = [search_key, data.status];
        if (data.role !== "all") {
            if (data.role === "owner") {
                query += 'and (users.owner_role = ? or users.owner_role = ?) '
                params.push('owner', 'member')
            } else {
                query += 'and users.owner_role = ? ';
                params.push(data.role)                
            }
        }
        if (data.buildingID != -1) {
            query += ` and buildings.buildingID = ?`
            params.push(data.buildingID)
        }
        else if (data.companyID != -1) {
            query += ` and companies.companyID = ?`
            params.push(data.companyID)
        }

        if (sort_column === -1)
            query += ' order by users.userID desc';
        else {
            if (sort_column === 0)
                query += ' order by users.lastname ';
            else if (sort_column === 1)
                query += ' order by users.firstname ';
            else if (sort_column === 2) {
                query += ' order by users.email ';
            }
            else if (sort_column === 3) {
                query += ' order by users.phone ';
            }
            else if (sort_column === 4) {
                query += ' order by users.owner_role ';
            } else if (sort_column === 5) {
                query += ' order by s.count ';
            }
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
function getCountOwnerList(uid, data) {
    return new Promise((resolve, reject) => {
        let query = `SELECT
                    count(*) count
                    FROM users
                    LEFT JOIN user_relationship USING ( userID )
                    LEFT JOIN buildings ON user_relationship.relationID = buildings.buildingID 
                    Left join companies using (companyID)
                    LEFT JOIN ( SELECT count( buildingID ) count, buildingID, userID FROM apartments LEFT JOIN buildings USING ( buildingID ) GROUP BY apartments.buildingID, apartments.userID ) s ON buildings.buildingID = s.buildingID and users.userID = s.userID
                    WHERE users.usertype = "owner" and users.firstname like ? and users.permission = ? `
        
        search_key = '%' + data.search_key + '%'
        let params = [search_key, data.status];
        if (data.role !== "all") {
            if (data.role === "owner") {
                query += 'and (users.owner_role = ? or users.owner_role = ?) '
                params.push('owner', 'member')
            } else {
                query += 'and users.owner_role = ? ';
                params.push(data.role)                
            }
        }

        if (data.buildingID != -1) {
            query += ` and buildings.buildingID = ?`
            params.push(data.buildingID)
        }
        else if (data.companyID != -1) {
            query += ` and companies.companyID = ?`
            params.push(data.companyID)
        }
        

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
 * create Owner only owner table
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createOwner_info(uid, data, files) {
    return new Promise(async (resolve, reject) => {
        var response = await stripeHelper.createCustomer({email: data.email, name: data.firstname + ' ' + data.lastname, description: 'owner'})
        data.customer_id = response.id
        let query = `Select * from ` + table.USERS + ` where email = ?`;
        db.query(query, [data.email], async function (error, result, fields) {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR });
            } else {
                if (result.length == 0) {
                    let photo_url = ""
                    let id_front = ""
                    let id_back = ""
                    if (files.photo_url) {
                        uploadS3 = await s3Helper.uploadLogoS3(files.photo_url[0], s3buckets.AVATAR)
                        photo_url = uploadS3.Location
                    } 
                    if (files.id_card_front) {
                        uploadS3 = await s3Helper.uploadLogoS3(files.id_card_front[0], s3buckets.IDENTITY_IMAGE)
                        id_front = uploadS3.Location
                    }
                    if (files.id_card_back) {
                        uploadS3 = await s3Helper.uploadLogoS3(files.id_card_back[0], s3buckets.IDENTITY_IMAGE)
                        id_back = uploadS3.Location    
                    }
                  

                    let randomPassword = randtoken.generate(15);
                    let randomToken = randtoken.generate(50);
                    let password = bcrypt.hashSync(randomPassword)
                    let query = `Insert into ` + table.USERS + ` (usertype, type, owner_role, firstname, lastname, firstname_1, lastname_1, owner_company_name, password, email, address, phone, photo_url, identity_card_front, identity_card_back, status, permission, created_by, created_at, updated_at, stripe_customerID, code_postal, city) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
                    db.query(query, ["owner", data.type, data.owner_role, data.firstname, data.lastname, data.firstname_1, data.lastname_1, data.owner_company_name, password, data.email, data.address, data.phone, photo_url, id_front, id_back, "active", "active", uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime(), data.customer_id, data.code_postal, data.city], function (error, rows, fields)  {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            sendMail(mail.TITLE_OWNER_CREATE, data.email, mail.TYPE_OWNER_CREATE, randomPassword, randomToken)
                            .then((response) => {
                                resolve("OK")
                            })
                            .catch((err) => {
                                if(err.message.statusCode == code.BAD_REQUEST){
                                    resolve("OK")
                                } else {
                                    resolve("OK")
                                }
                            })
                        }
                    })
                } else {
                    resolve("ok")
                }
            }
        })
    })
}

/**
 * create Owner Relation Ship
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createBuildingRelationShip(data) {
    return new Promise((resolve, reject) => {
        let query = `Select * from ` + table.USERS + ` where email = ?`;
        db.query(query, [data.email], function (error, result, fields) {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR });
            } else {
                if (result.length == 0) {
                    reject({ message: message.INTERNAL_SERVER_ERROR });
                } else {
                    let query = `Insert into ` + table.USER_RELATIONSHIP + ` (userID, type, relationID) VALUES (?,?,?)`
                    db.query(query, [result[0].userID, "building", data.buildingID], function (error, rows, fields)  {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            resolve(result[0].userID)
                        }
                    })
                }
            }
        })
    })
}
/**
 * create owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createOwner(uid, data, ownerID) {
    return new Promise((resolve, reject) => {
        let id = ownerID;
        let vote_value_list = JSON.parse(data.vote_value_list);
        for (let i in vote_value_list) {
            let vote_value = vote_value_list[i];
            let query = `Select * from ` + table.APARTMENTS + ` where userID = ?  and apartment_number = ? and buildingID = ?`
            db.query(query, [id, vote_value.apartment_number, data.buildingID], (error, rows, fields) => {
                if (error) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                } else {
                    if (rows.length == 0) {
                        let query = `Insert into ` + table.APARTMENTS + ` (userID, apartment_number, buildingID, created_by, created_at, updated_at) values (?, ?, ?, ?, ?, ?)`
                        db.query(query, [id, vote_value.apartment_number, data.buildingID, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()], (error, rows, fields) => {
                            if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR })
                            } else {
                                let query = `Select * from ` + table.APARTMENTS + ` where userID = ? and apartment_number = ? and buildingID = ?`
                                db.query(query, [id, vote_value.apartment_number, data.buildingID], (error, rows, fields) => {
                                    if (error) {
                                        reject({ message: message.INTERNAL_SERVER_ERROR })
                                    } else {
                                        let apartment_id = rows[0].apartmentID;
                                        for (let i in vote_value.vote) {
                                            let vote = vote_value.vote[i];
                                            let query = `Select * from ` + table.VOTE_AMOUNT_OF_PARTS + ` where apartmentID = ? and voteID = ?`
                                            db.query(query, [apartment_id, vote.voteID], (error, rows, fields) => {
                                                if (error) {
                                                    reject({ message: message.INTERNAL_SERVER_ERROR })
                                                } else {
                                                    if (rows.length == 0) {
                                                        let query = `Insert into ` + table.VOTE_AMOUNT_OF_PARTS + ` (apartmentID, voteID, amount, created_by, created_at, updated_at) values (?, ?, ?, ?, ?, ?)`
                                                        db.query(query, [apartment_id, vote.voteID, vote.vote_amount, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()], (error, rows, fields) => {
                                                            if (error) {
                                                                reject({ message: message.INTERNAL_SERVER_ERROR })
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
                resolve("ok");
            }) 
        }
    })
}

/**
 * get owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getOwner(uid, data, id) {
    return new Promise((resolve, reject) => {
        let query = 'Select *, users.type usertype, users.email email, users.phone phone, users.address address, users.status status, users.stripe_customerID customerID from ' + table.USERS + ' left join ' + table.USER_RELATIONSHIP + ' using (userID) left join '+  table.BUILDINGS + ' on buildings.buildingID = user_relationship.relationID left join ' + table.COMPANIES + ' using (companyID) where users.userID = ? and buildings.buildingID = ?'
        let ownerInfo;
        let vote_amount_info;
        let apartment_info;
        db.query(query, [ id, data.buildingID],   (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length == 0) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                } else {
                    ownerInfo = rows[0];
                    let query = 'Select * from ' + table.BUILDINGS + ' b left join ' + table.APARTMENTS + ' a using (buildingID) where b.buildingID = ? and a.userID = ?'
                    db.query(query, [data.buildingID, id], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            apartment_info = rows;
                            let query = 'Select * from ' + table.BUILDINGS + ' b left join ' + table.APARTMENTS + ' a using (buildingID) left join ' + table.VOTE_AMOUNT_OF_PARTS + ' va using (apartmentID) left join ' + table.VOTE_BUILDING_BRANCH + ' vb using(voteID) where b.buildingID = ? and a.userID = ? and vb.buildingID = ?'
                            db.query(query, [data.buildingID, id, data.buildingID],  (error, rows, fields) => {
                                if (error) {
                                    reject({ message: message.INTERNAL_SERVER_ERROR })
                                } else {
                                    vote_amount_info = rows;
                                    resolve({ownerInfo: ownerInfo, amount_info: vote_amount_info, apartment_info: apartment_info});
                                }
                            })
                        }
                    })
                }
            }
        })
    })
}


/**
 * update Owner only owner table
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateOwner_info(id, data, files) {
    return new Promise(async (resolve, reject) => {
        await stripeHelper.updateCustomer(data.stripe_customerID, {email: data.email, name: data.firstname + ' ' + data.lastname, description: 'owner'})
        let photo_url = ""
        let id_front = ""
        let id_back = ""

        if (files.photo_url) {
            uploadS3 = await s3Helper.uploadLogoS3(files.photo_url[0], s3buckets.AVATAR)
            photo_url = uploadS3.Location
        } 
        if (files.id_card_front) {
            uploadS3 = await s3Helper.uploadLogoS3(files.id_card_front[0], s3buckets.IDENTITY_IMAGE)
            id_front = uploadS3.Location
        }
        if (files.id_card_back) {
            uploadS3 = await s3Helper.uploadLogoS3(files.id_card_back[0], s3buckets.IDENTITY_IMAGE)
            id_back = uploadS3.Location    
        }
        
        let query = `Select * from ` + table.USERS + ` where userID = ?`
        db.query(query, [id], (error, result, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR });
            } else {
                if (result.length == 0) {
                    reject({ message: message.INTERNAL_SERVER_ERROR });
                } else {
                    if (photo_url == "")
                        photo_url = result[0].photo_url
                    if (id_front == "")
                        id_front = result[0].identity_card_front
                    if (id_back == "")
                        id_back = result[0].identity_card_back
                    let query = `Update ` + table.USERS + ` set type = ?, owner_role = ?, firstname = ?, lastname = ?, firstname_1 = ?, lastname_1 = ?, owner_company_name = ?, email = ?, address = ?, phone = ?, photo_url = ?, identity_card_front = ?, identity_card_back = ?, updated_at = ?, code_postal = ?, city = ?  where userID = ? `
                    db.query(query, [data.type, data.owner_role, data.firstname, data.lastname, data.firstname_1, data.lastname_1, data.owner_company_name, data.email, data.address, data.phone, photo_url, id_front, id_back, timeHelper.getCurrentTime(), data.code_postal, data.city, id], async function (error, result, fields) {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR });
                        } else {
                            resolve("ok")
                        }
                    })
                }
            }
        })        
    })
}


/**
 * delete apartments related to the owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function delete_apartments(data, id) {
    return new Promise(async (resolve, reject) => {
        let query = `Select * from ` + table.APARTMENTS + ` where userID = ? and buildingID = ?`
        let apartments = [];
        db.query(query, [id, data.buildingID], function (error, result, fields) {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR });
            } else {
                apartments = result;
                let query = `Delete from ` + table.APARTMENTS + ` where userID = ? and buildingID = ?`
                db.query(query, [id, data.buildingID], function (error, result, fields) {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR });
                    } else {
                        for (let i in apartments) {
                            let query = `Delete from ` + table.VOTE_AMOUNT_OF_PARTS + ` where apartmentID = ?`
                            db.query(query, [apartments[i].apartmentID], function (error, results, fields) {
                                if (error ){ 
                                    reject({ message: message.INTERNAL_SERVER_ERROR });
                                }
                            })
                        }
                        resolve("ok")
                    }
                })
            }
        })
        
    })
}



/**
 * update owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateOwner(uid, data) {
    return new Promise(async (resolve, reject) => {
        
        let query = 'Insert into ' + table.USERS + ' (companyID, name, address, account_holdername, account_address, account_IBAN) values (?, ?, ?, ?, ?, ?)'
        let select_building_query = 'Select * from ' + table.BUILDINGS + ' order by created_at desc limit 1'
        db.query(query, [ data.companyID, data.name, data.address, data.account_holdername, data.account_address, data.account_IBAN ],  async (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                await db.query(select_building_query, [],  async (error, rows, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR });
                    } else {
                        let buildingID = rows[0].buildingID;
                        for (let i in data.vote) {
                            let query = 'Insert into ' + table.VOTEBRANCH + ' (name) values (?)'
                            let select_query = 'Select * from ' + table.VOTEBRANCH + ' where name = ?'
                            let insert_query = 'Insert into ' + table.BUILDING_VOTE_BRANCH + ' (buildingID, voteID) values (?, ?)'
                            await db.query(query, [ data.vote[i].name ], async (error, rows, fields) => {
                                if (error) {
                                    reject({ message: message.INTERNAL_SERVER_ERROR })
                                } else {
                                    await db.query(select_query, [ data.vote[i].name ], (error, rows, fields) => {
                                        if (error) {
                                            reject({ message: message.INTERNAL_SERVER_ERROR})
                                        } else {
                                            db.query(insert_query, [ buildingID, rows[rows.length - 1].voteID ], (error, rows, fields) => {
                                                if (error) {
                                                    reject({ message: message.INTERNAL_SERVER_ERROR })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
                resolve("ok");
            }
        })
    })
}

/**
 * update owner status
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateOwnerStatus(id, data) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.USERS + ' SET  status = ? where userID = ?'
  
        db.query(query, [ data.status, id ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("ok")
            }
        })
    })
  }

/**
 * delete owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteOwner(uid, id, data) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.USERS + ' SET  permission = ?, deleted_by = ?, deleted_at = ? where userID = ?'
  
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
 * delete trased all owner
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteAllOwner(data) {
    return new Promise((resolve, reject) => {
        let users = data.list

        for (let i in users) {
            let query = 'Delete from ' + table.USERS + ' where userID = ?'
            db.query(query, [users[i]], (error, rows, fields) => {
                if (error) {
                    reject({ message: message.INTERNAL_SERVER_ERROR})
                } else {
                    let query = 'Delete from ' + table.USER_RELATIONSHIP + ' where userID = ?'
                    db.query(query, [users[i]], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR})
                        } else {
                            let query = 'Delete from ' + table.ROLE + ' where userID = ?'
                            db.query(query, [users[i]], (error, rows, fields) => {
                                if (error) {
                                    reject({ message: message.INTERNAL_SERVER_ERROR })
                                } else {
                                    let query = 'Select * from ' + table.APARTMENTS + ' where userID = ?'
                                    db.query(query, [users[i]], (error, rows, fields) => {
                                        if (error) {
                                            reject({ message: message.INTERNAL_SERVER_ERROR})
                                        } else {
                                            let apartments = rows
                                            let query = 'Delete from ' + table.APARTMENTS + ' where userID = ?'
                                            db.query(query, [users[i]], (error, rows, fields) => {
                                                if (error) {
                                                    reject({ message: message.INTERNAL_SERVER_ERROR})
                                                } else {
                                                    let query = 'Delete from ' + table.VOTE_AMOUNT_OF_PARTS + ' where apartmentID = ?'
                                                    for (let j in apartments) {
                                                        db.query(query, [apartments[j].apartmentID], (error, rows, fields) => {
                                                            if (error) {
                                                                reject({ message: message.INTERNAL_SERVER_ERROR})
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        resolve("OK")
    })
}

function getbranch(buildingID) {
    return new Promise(async (resolve, reject) => {
        query = 'Select v.vote_branch_name, v.voteID from buildings b left join vote_building_branches v on b.buildingID = v.buildingID where b.buildingID = ?'
        db.query(query, [ buildingID ],  (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows)
            }
        })
    })
}

/**
 * import building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function importOwnerCSV(uid, file, data) {
    return new Promise(async (resolve, reject) => {
        let owners = []
        let owner = {
            'type': '',
            'owner_role': '',
            'firstname': '',
            'lastname': '',
            'firstname_1': '',
            'lastname_1': '',
            'owner_company_name': '',
            'address': '',
            'code_postal': '',
            'city': '',
            'email': '',
            'phone': '',
            'vote_value_list': []
        }
        let votes = await getbranch(data.buildingID)
        
        fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', async (row) => {
            owner_role = row['subaccount'] == 'yes' ? 'subaccount' : row['member of union council'] == 'yes' ? 'member' : 'owner'
            
            if (row['type'] !== '' && row['type'] !== null && row['type'] !== undefined) {
                if (owner.vote_value_list.length != 0) {
                    item = JSON.parse(JSON.stringify(owner));
                    owners.push(item)
                    owner.type = ''
                    owner.owner_role = ''
                    owner.firstname = ''
                    owner.lastname = ''
                    owner.firstname_1 = ''
                    owner.lastname_1 = ''
                    owner.owner_company_name = ''
                    owner.address = ''
                    owner.ville = ''
                    owner.code_postal = ''
                    owner.email = ''
                    owner.phone = ''
                    owner.vote_value_list = []
                }
                owner.type = row.type
                owner.email = row.email
                owner.owner_role = owner_role
                owner.buildingID = data.buildingID
                owner.firstname = row['1st name 1']
                owner.lastname = row['last name 1']
                owner.firstname_1 = row['1st name 2']
                owner.lastname_1 = row['last name 2']
                owner.owner_company_name = row['company name']
                owner.address = row['address']
                owner.code_postal = row['code_postal']
                owner.city = row['ville']
                owner.phone = row['phone number']
                var temp = []
                if (owner_role != "subaccount")
                    for (var i in votes) {
                        temp.push({"voteID" :votes[i].voteID, "vote_amount": row[votes[i].vote_branch_name]})
                    }

                owner.vote_value_list.push({"apartment_number": row['lots'], "vote": temp})
            } else {
                if (owner_role != "subaccount") {
                    var temp = []
                
                    for (var i in votes)
                        temp.push({"voteID" :votes[i].voteID, "vote_amount": row[votes[i].vote_branch_name]})
                    owner.vote_value_list.push({"apartment_number": row['lots'], "vote": temp})
                }
            }
        })
        .on('end', async () => {
            item = JSON.parse(JSON.stringify(owner));
            owners.push(item)
            for (var i in owners) {
                var item = JSON.parse(JSON.stringify(owners[i]));
                item.vote_value_list = JSON.stringify(item.vote_value_list)
                await createOwner_info(uid, item, {})
                var response = await createBuildingRelationShip(item)
                if (item.owner_role !== "subaccount") {                     
                    await createOwner(uid, item, response)
                }
            }
            resolve("OK")
        });
    })
}

function getOwnerForCSV(data, ownerID) {
    return new Promise(async (resolve, reject) => {
        let apartments = []
        let owner_result = {}
        owner = await getOwner(1, data, ownerID)
        type_owner = owner.ownerInfo.usertype
        firstname = owner.ownerInfo.firstname
        lastname = owner.ownerInfo.lastname
        firstname_1 = owner.ownerInfo.firstname_1
        lastname_1 = owner.ownerInfo.lastname_1
        company_name = owner.ownerInfo.owner_company_name
        address = owner.ownerInfo.address
        code_postal = owner.ownerInfo.code_postal
        city = owner.ownerInfo.city
        email = owner.ownerInfo.email
        phone_number = owner.ownerInfo.phone
        subaccount = owner.ownerInfo.owner_role == "subaccount" ? "yes" : "no"
        member = owner.ownerInfo.owner_role == "member" ? "yes" : "no"
        if (subaccount == "yes") {
            owner_result['type'] = type_owner
            owner_result['firstname'] = firstname
            owner_result['lastname'] = lastname
            owner_result['firstname_1'] = firstname_1
            owner_result['lastname_1'] = lastname_1
            owner_result['company_name'] = company_name
            owner_result['address'] = address
            owner_result['city'] = city
            owner_result['code_postal'] = code_postal
            owner_result['email'] = email
            owner_result['phone_number'] = phone_number
            owner_result['subaccount'] = subaccount
            owner_result['member'] = member
            apartments.push(owner_result)
            resolve(apartments)
        } else {
            for (var i in owner.apartment_info) {
                owner_result['lots'] = owner.apartment_info[i].apartment_number
                for (var j in owner.amount_info) {
                    if (i == 0) {
                        owner_result['type'] = type_owner
                        owner_result['firstname'] = firstname
                        owner_result['lastname'] = lastname
                        owner_result['firstname_1'] = firstname_1
                        owner_result['lastname_1'] = lastname_1
                        owner_result['company_name'] = company_name
                        owner_result['address'] = address
                        owner_result['city'] = city
                        owner_result['code_postal'] = code_postal
                        owner_result['email'] = email
                        owner_result['phone_number'] = phone_number
                        owner_result['subaccount'] = subaccount
                        owner_result['member'] = member
                    }
                    if (owner.amount_info[j].apartment_number === owner.apartment_info[i].apartment_number)
                        owner_result[owner.amount_info[j].voteID] = owner.amount_info[j].amount
                }
                apartments.push(owner_result)
                owner_result = {}
            }
            resolve(apartments)
        }   
    })
}

/**
 * delete building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function exportOwnerCSV(data, res) {
    return new Promise(async (resolve, reject) => {
        time = timeHelper.getCurrentTime()
        
        var header =  [
            {id: 'type', title: 'type'},
            {id: 'firstname', title: '1st name 1'},
            {id: 'lastname', title: 'last name 1'},
            {id: 'firstname_1', title: '1st name 2'},
            {id: 'lastname_1', title: 'last name 2'},
            {id: 'company_name', title: 'company name'},
            {id: 'address', title: 'address'},
            {id: 'code_postal', title: 'code_postal'},
            {id: 'city', title: 'ville'},
            {id: 'email', title: 'email'},
            {id: 'phone_number', title: 'phone number'},
            {id: 'subaccount', title: 'subaccount'},
            {id: 'member', title: 'member of union council'},
            {id: 'lots', title: 'lots'}
          ]
        votes = await getbranch(data.buildingID)
        for (var k in votes) {
            header.push({id: votes[k].voteID, title: votes[k].vote_branch_name})
        }
        const csvWriter = createCsvWriter({
            path: 'public/upload/' + time,
            header: header
        });
        let owners = []
        let ownerIDs = JSON.parse(data.ownerID)
        for (var i in ownerIDs) {
            result = await getOwnerForCSV(data,ownerIDs[i])
            for (var j in result) {
                owners.push(result[j])
            }
        }
        csvWriter
            .writeRecords(owners)
            .then(()=> {
                var file = fs.readFileSync("public/upload/" + time);
                res.setHeader('Content-Length', file.length);
                res.write(file, 'binary');
                res.end();
            });
        
    })
}

module.exports = ownerModel
