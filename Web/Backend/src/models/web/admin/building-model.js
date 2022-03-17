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
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
var table  = require('../../../constants/table')
var timeHelper = require('../../../helper/timeHelper')
var stripeHelper = require('../../../helper/stripeHelper')
var buildingModel = {
    getCompanyListByUser: getCompanyListByUser,
    getBuildingListByCompany: getBuildingListByCompany,
    getBuildingList: getBuildingList,
    getCountBuildingList: getCountBuildingList,
    createBuilding: createBuilding,
    getBuilding: getBuilding,
    updateBuilding: updateBuilding,
    deleteBuilding: deleteBuilding,
    deleteAllBuilding: deleteAllBuilding,
    importBuildingCSV: importBuildingCSV,
    exportBuildingCSV: exportBuildingCSV,
    updateBankInformation: updateBankInformation,
}

/**
 * get company list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getCompanyListByUser(uid) {
    return new Promise((resolve, reject) => {
        let query = `select c.*
                    from ` + table.COMPANIES + ` c
                    where c.permission = 'active' and c.companyID in (select relationID from ` + table.USER_RELATIONSHIP + ` where type = 'company' and userID = ?)`

        db.query(query, [ uid ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows);
            }
        })
    })
}

/**
 * get company list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getBuildingListByCompany(uid, data) {
    return new Promise((resolve, reject) => {
        let query = ``
        if(data.companyID == -1){
            query = `select b.* from ` + table.BUILDINGS + ` b left join ` + table.COMPANIES + ` c on c.companyID = b.companyID where c.permission = 'active' and b.permission = 'active' and b.companyID in (select relationID from ` + table.USER_RELATIONSHIP + ` where userID = ? and type = 'company')`
        } else {
            query = `select b.* from ` + table.BUILDINGS + ` b left join ` + table.COMPANIES + ` c on c.companyID = b.companyID where c.permission = 'active' and b.permission = 'active' and b.companyID = ?`
        }

        db.query(query, [ data.companyID == -1 ? uid : data.companyID ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows);
            }
        })
    })
}

/**
 * get building list with filter key
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getBuildingList(uid, data) {
    return new Promise((resolve, reject) => {
        let query;

        if (data.companyID == -1) {
            query = `select b.*, 0 as total, b.buildingID as ID
                    from ` + table.BUILDINGS + ` b
                    left join ` + table.COMPANIES + ` c on c.companyID = b.companyID
                    where c.permission = 'active' 
                    and b.companyID in (select relationID from ` + table.USER_RELATIONSHIP + ` where userID = ? and type = 'company') 
                    and b.permission = ? and (b.name like ?)`
        } else {
            query = `select b.*, 0 as total, b.buildingID as ID
                    from ` + table.BUILDINGS + ` b
                    left join ` + table.COMPANIES + ` c on c.companyID = b.companyID
                    where c.permission = 'active'
                    and b.permission = ? and (b.name like ?)
                    and b.companyID = ?`
        }

        sort_column = Number(data.sort_column);
        row_count = Number(data.row_count);
        page_num = Number(data.page_num);
        search_key = '%' + data.search_key + '%'
        if (sort_column === -1)
            query += ' order by b.buildingID desc';
        else {
            if (sort_column === 0)
                query += ' order by b.name ';
            else if (sort_column === 1)
                query += ' order by b.address ';

            else if (sort_column === 2)
                query += ' ';
            query += data.sort_method;
        }
        query += ' limit ' + page_num * row_count + ',' + row_count
        db.query(query, data.companyID == -1 ? [uid, data.status, search_key]: [ data.status, search_key, data.companyID], (error, rows, fields) => {
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
function getCountBuildingList(uid, data) {
    return new Promise((resolve, reject) => {
        let query;
        if (data.companyID == -1) {
            query = `select count(*) count
                    from ` + table.BUILDINGS + ` b
                    left join ` + table.COMPANIES + ` c on c.companyID = b.companyID
                    where c.permission = 'active' 
                    and b.companyID in (select relationID from ` + table.USER_RELATIONSHIP + ` where userID = ? and type = 'company') 
                    and b.permission = ? and (b.name like ?)`
        } else {
            query = `select count(*) count
                    from ` + table.BUILDINGS + ` b
                    left join ` + table.COMPANIES + ` c on c.companyID = b.companyID
                    where c.permission = 'active'
                    and b.permission = ? and (b.name like ?)
                    and b.companyID = ?`
        }
        search_key = '%' + data.search_key + '%'

        db.query(query, data.companyID == -1 ? [ uid, data.status, search_key ]: [ uid, data.status, search_key, data.companyID ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length == 0)
                    resolve(0);
                else
                    resolve(rows[0].count)
            }
        })
    })
}


/**
 * create building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function createBuilding(uid, data) {
    return new Promise(async (resolve, reject) => {
        if (data.account_IBAN != "" && data.account_IBAN != null && data.account_IBAN != undefined) {
            await stripeHelper.createCardSource(data.customer_id, data.id)
            data.stripe_sourceID = data.id
        }
        let query = 'Insert into ' + table.BUILDINGS + ' (companyID, name, address, created_by, account_holdername, account_address, account_IBAN, created_at, updated_at, stripe_customerID, stripe_sourceID) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        let select_building_query = 'Select * from ' + table.BUILDINGS + ' order by created_at desc limit 1'
        db.query(query, [data.companyID, data.name, data.address, uid, data.account_holdername, data.account_address, data.account_IBAN, timeHelper.getCurrentTime(), timeHelper.getCurrentTime(), data.customer_id, data.stripe_sourceID], (error, rows, fields) => {
            if (error) {
                reject({message: message.INTERNAL_SERVER_ERROR})
            } else {
                db.query(select_building_query, [], (error, rows, fields) => {
                    if (error) {
                        reject({message: message.INTERNAL_SERVER_ERROR});
                    } else {
                        if (rows.length > 0) {
                            let buildingID = rows[0].buildingID
                            query = 'Insert into ' + table.VOTE_BUILDING_BRANCH + ' (buildingID, vote_branch_name, description, created_by, created_at, updated_at) values ?'
                            let user_relation_query = 'Insert into ' + table.USER_RELATIONSHIP + ' (userID, type, relationID) values (?, ?, ?)'
                            let vote_branches = []
                            let item
                            for (var i = 0; i < data.vote_branches.length; i++) {
                                item = data.vote_branches[i]
                                vote_branches.push([buildingID, item.name, item.description, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()])
                            }
                            db.query(query, [vote_branches], (error, rows, fields) => {
                                if (error) {
                                    reject({message: message.INTERNAL_SERVER_ERROR});
                                } else {
                                    db.query(user_relation_query, [uid, "building", buildingID], (error, rows, fields) => {
                                        if (error) {
                                            reject({message: message.INTERNAL_SERVER_ERROR});
                                        } else {
                                            resolve("OK")
                                        }
                                    })
                                }
                            })
                        } else {
                            reject({message: message.BUILDING_NOT_EXSIT});
                        }
                    }
                })
            }
        })
    })
}

/**
 * get building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getBuilding(uid) {
    return new Promise((resolve, reject) => {
        let get_building_query = 'Select * from ' + table.BUILDINGS + ' where buildingID = ?'
        let branch_info_query = 'Select * from ' + table.VOTE_BUILDING_BRANCH + ' left join ' + table.BUILDINGS + ' Using (buildingID) where buildingID = ?'
        db.query(get_building_query, [ uid ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                db.query(branch_info_query, [uid], (error, rows1, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR});
                    } else {
                        let query = 'select sum(v.amount) as total, v.voteID from vote_amount_of_parts v group by v.voteID'
                        db.query(query, [], (error, result, fields) => {
                            if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR })
                            } else {
                                for (var j in rows1) {
                                    rows1[j].total = 0
                                    for (var i in result) {
                                        if (result[i].voteID === rows1[j].voteID)
                                            rows1[j].total = result[i].total
                                    }
                                }
                                resolve({building: rows, votelist: rows1})
                            }
                        })
                        
                    }
                })
            }
        })
    })
}

/**
 * update building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateBuilding(uid, id, data) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.BUILDINGS + ' SET companyID = ?, name = ?, address = ?, updated_by = ?, updated_at = ? WHERE buildingID = ?'
        db.query(query, [ data.companyID, data.name, data.address, uid, timeHelper.getCurrentTime(), id ],   (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                let delete_vote_query = 'Delete from ' + table.VOTE_BUILDING_BRANCH + ' where buildingID = ?'
                query = 'Insert into ' + table.VOTE_BUILDING_BRANCH + ' (buildingID, vote_branch_name, description, created_by, created_at, updated_at) values ?'
                db.query(delete_vote_query, [id],  (error, rows, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                    } else {
                        let vote_branches = []
                        let item
                        for ( var i = 0 ; i < data.vote_branches.length ; i++){
                            item = data.vote_branches[i]
                            vote_branches.push([id, item.vote_branch_name, item.description, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()])
                        }
                        db.query(query, [vote_branches],  (error, rows, fields) => {
                            if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR });
                            } else {
                                resolve("OK")
                            }
                        })
                    }
                })
            }
        })
    })
}

/**
 * delete building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteBuilding(uid, id, data) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE ' + table.BUILDINGS + ' SET permission = ?, deleted_at = ? WHERE buildingID = ?'
        db.query(query, [ data.status, timeHelper.getCurrentTime(), id ], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                let delete_apartment_query = 'UPDATE ' + table.APARTMENTS + ' SET permission = ? WHERE buildingID = ?'
                db.query(delete_apartment_query, [ data.status, id ], (error, rows, fields) => {
                  if(error){
                      reject({ message: message.INTERNAL_SERVER_ERROR })
                  } else {
                      resolve("OK")
                  }
                })
            }
        })
    })
}

/**
 * delete trased all building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function deleteAllBuilding(data) {
    return new Promise((resolve, reject) => {
        let buildings = data.list
        for (let i in buildings) {
            let query = 'Delete from ' + table.BUILDINGS + ' where buildingID = ?'
            db.query(query, [buildings[i]], async (error, rows, fields) => {
                if (error) {
                    reject({ message: message.INTERNAL_SERVER_ERROR})
                } else {
                    let query = 'Select * from ' + table.APARTMENTS + ' where buildingID = ?'
                    await db.query(query, [buildings[i]], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR})
                        } else {
                            let apartments = rows
                            let query = 'Delete from ' + table.APARTMENTS + ' where buildingID = ?'
                            db.query(query, [buildings[i]], (error, rows, fields) => {
                                if (error) {
                                    reject({ message: message.INTERNAL_SERVER_ERROR})
                                } else {
                                    for (let k in apartments) {
                                        let query = 'Select * from ' + table.VOTE_AMOUNT_OF_PARTS + ' where apartmentID = ?'
                                        db.query(query, [apartments[k].apartmentID], (error, rows, fields) => {
                                            if (error) {
                                                reject({ message: message.INTERNAL_SERVER_ERROR})
                                            } else {
                                                let votes = rows
                                                let query = 'Delete from ' + table.VOTE_AMOUNT_OF_PARTS + ' where apartmentID = ?'
                                                db.query(query, [apartments[k].apartmentID], (error, rows, fields) => {
                                                    if (error) {
                                                        reject({ message: message.INTERNAL_SERVER_ERROR })
                                                    } else {
                                                        let query = 'Delete from ' + table.VOTE_BUILDING_BRANCH + ' where voteID = ?'
                                                        for (let l in votes) {
                                                            db.query(query, [votes[l].voteID], (error, rows, fields) => {
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
                                }
                            })
                        }
                    })
                    let relation_query = 'Delete from ' + table.USER_RELATIONSHIP + ' where relationID = ?'
                    await db.query(relation_query, [buildings[i]], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR})
                        }
                    })
                }
            })
        }
        resolve("OK")
    })
}

function addBuilding(uid, item, data) {
    return new Promise(async (resolve, reject) => {
        query = 'Insert into ' + table.BUILDINGS + ' (companyID, name, address, created_by, created_at, updated_at) values (?, ?, ?, ?, ?, ?)'
        let select_building_query = 'Select * from ' + table.BUILDINGS + ' where name = ? and address = ?'
        await db.query(query, [ data.companyID, item.name, item.address, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime() ],  (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                db.query(select_building_query, [item.name, item.address],  (error, rows, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR });
                    } else {
                        if(rows.length > 0){
                            let buildingID = rows[0].buildingID
                            let query = `Insert into ` + table.USER_RELATIONSHIP + ` (userID, type, relationID) values (?, ?, ?)`
                            db.query(query, [uid, "building", buildingID], (error, rows, fields) => {
                                if (error) {
                                    console.log(error)
                                    reject({ message: message.INTERNAL_SERVER_ERROR });
                                } else {
                                    query = 'Insert into ' + table.VOTE_BUILDING_BRANCH + ' (buildingID, vote_branch_name, created_by, created_at, updated_at) values ?'
                                    let branches = []
                                    let vote_branch = item.vote_branch
                                    for ( var j = 0 ; j < vote_branch.length ; j++){
                                        var value = vote_branch[j]
                                        branches.push([buildingID, value, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()])
                                    }
                                    db.query(query, [branches],  (error, rows, fields) => {
                                        if (error) {
                                            reject({ message: message.INTERNAL_SERVER_ERROR });
                                        }
                                    })
                                }
                            })
                            
                        } else {
                            reject({ message: message.BUILDING_NOT_EXSIT });
                        }
                    }
                })
                resolve("OK")
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
function importBuildingCSV(uid, file, data) {
    return new Promise((resolve, reject) => {
        let buildings = []

        let building = {
            name: '',
            address: '',
            vote_branch: []
        }
        fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', async (row) => {
            console.log(row);

            if (row['name'] !== '' && row['name'] !== null && row['name'] !== undefined) { 
                if (building.vote_branch.length != 0) {
                    item = JSON.parse(JSON.stringify(building));
                    buildings.push(item)
                    building.vote_branch = []
                }
                building.name = row['name']
                building.address = row['address']
                building.vote_branch.push(row['Key'])                
            } else {
                building.vote_branch.push(row['Key'])
            }
        })
        .on('end', async () => {
            buildings.push(building)
            for (var i in buildings) {
                var item = JSON.parse(JSON.stringify(buildings[i]));
                await addBuilding(uid, item, data)
                
            }
            resolve("OK")
        });
    })
}

function getBuildingForCSV(buildingID) {
    return new Promise((resolve, reject) => {
            let buildings = []
            let query = 'Select b.name name, b.address address, v.vote_branch_name vote_branch_name from buildings b left join vote_building_branches v on b.buildingID = v.buildingID where b.buildingID = ?'
            db.query(query, [buildingID], (error, rows, fields) => {
                if (error) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                } else {
                    var vote_branch_name = []
                    for (var j in rows) {
                        if (j == 0)
                            buildings.push({name: rows[0].name, address: rows[0].address, vote_branch_name: rows[0].vote_branch_name})
                        else
                            buildings.push({name: '', address: '', vote_branch_name: rows[j].vote_branch_name})
                    }
                    resolve(buildings)
                }
            })
        
            
    })
}

/**
 * delete building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function exportBuildingCSV(data, res) {
    return new Promise(async (resolve, reject) => {
        time = timeHelper.getCurrentTime()
        const csvWriter = createCsvWriter({
            path: 'public/upload/' + time,
            header: [
              {id: 'name', title: 'name'},
              {id: 'address', title: 'address'},
              {id: 'vote_branch_name', title: 'Key'},
            ]
        });
        let buildings = []
        let buildingIDs = JSON.parse(data.buildingID)
        for (var i in buildingIDs) {
            result = await getBuildingForCSV(buildingIDs[i])
            for (var j in result) {
                buildings.push(result[j])
            }
        }
        csvWriter
            .writeRecords(buildings)
            .then(()=> {
                var file = fs.readFileSync("public/upload/" + time);
                res.setHeader('Content-Length', file.length);
                res.write(file, 'binary');
                res.end();
            });
        
    })
}

/**
 * update Bank Information of building
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateBankInformation(buildingID, data) {
    return new Promise(async (resolve, reject) => {
        building_response = await getBuilding(buildingID)
        if (building_response.building[0].stripe_sourceID !== null && building_response.building[0].stripe_sourceID !== undefined && building_response.building[0].stripe_sourceID !== "")
            await stripeHelper.deleteCardSource(building_response.building[0].stripe_customerID, building_response.building[0].stripe_sourceID)
        var response = await stripeHelper.createCardSource(building_response.building[0].stripe_customerID, data.id)
        let query = 'Update ' + table.BUILDINGS + ' SET account_holdername = ?, account_address = ?, account_IBAN = ?, stripe_sourceID = ? where buildingID = ?';
        params = [data.account_holdername, data.account_address, data.account_IBAN, response.id, buildingID]
        db.query(query, params, (error, rows, fields) => {
            if (error) {
                reject({message: message.INTERNAL_SERVER_ERROR})
            } else {
                resolve("OK")
            }
        })
    })
}

module.exports = buildingModel
