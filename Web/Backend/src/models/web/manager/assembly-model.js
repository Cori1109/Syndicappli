/**
 * Auth model file
 *
 * @package   backend/src/models
 * @author    Talent Developer <talentdeveloper59@gmail.com>
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
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const csv = require('csv-parser');

var assemblyModel = {
  createAssembly: createAssembly,
  updateAssembly: updateAssembly,
  getAssembly: getAssembly,
  getAssemblyList: getAssemblyList,
  getCountAssemblyList: getCountAssemblyList,
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
  getCountAssemblyDecisionList: getCountAssemblyDecisionList,
  importAssemblyDecisionCSV: importAssemblyDecisionCSV,
  exportAssemblyDecisionCSV: exportAssemblyDecisionCSV,
  createAssemblyVote: createAssemblyVote,
  getPostalVoteOwnerList: getPostalVoteOwnerList,
  getAssemblyVoteList: getAssemblyVoteList,
  deleteAssemblyVote: deleteAssemblyVote,
  getAssemblyVoteDetail: getAssemblyVoteDetail,
}

/**
 * function that add assembly
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function createAssembly(uid, data) {
    return new Promise( async (resolve, reject) => {
        let query
        let params = []
        query = 'Insert into ' + table.ASSEMBLIES + ' (buildingID, title, description, date, time, address, additional_address, is_published, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        params = [data.buildingID, data.title, data.description, data.date, data.time, data.address, data.additional_address, data.is_published, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()]

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
 * function that add assembly
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object id
 * @param   object data
 * @return  object If success returns object else returns message
 */
function updateAssembly(uid, id, data) {
    return new Promise( async (resolve, reject) => {
        let query
        let params = []
        query = 'UPDATE ' + table.ASSEMBLIES + ' SET buildingID = ?, title = ?, description = ?, date = ?, time = ?, address = ?, additional_address = ?, is_published = ?, updated_at = ? WHERE assemblyID = ?'
        params = [data.buildingID, data.title, data.description, data.date, data.time, data.address, data.additional_address, data.is_published, timeHelper.getCurrentTime(), id ]
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
 * function that get assembly
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function getAssembly(id){
    return new Promise( async (resolve, reject) => {
        let query = `select assemblyID, buildingID, title, description, date, time, address, additional_address 
            from ` + table.ASSEMBLIES + ` 
            where assemblies.assemblyID = ?`
        let branch_info_query = 'Select * from ' + table.VOTE_BUILDING_BRANCH + ' where buildingID = ?'

        db.query(query, [id], async (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                db.query(branch_info_query, [rows[0].buildingID], (error, rows1, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR});
                    } else {
                        resolve({assembly: rows, votelist: rows1})
                    }
                });
            }
        })
    })
}

/**
 * function that get assembly list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function getAssemblyList(uid, data){
    return new Promise( async (resolve, reject) => {
        let query = `select assemblies.assemblyID, assemblies.title, assemblies.date, assemblies.address 
            from assemblies 
            LEFT JOIN buildings using (buildingID)
            where buildings.companyID = ? and assemblies.created_by = ? and assemblies.title like ?`

        sort_column = Number(data.sort_column);
        row_count = Number(data.row_count);
        page_num = Number(data.page_num);
        search_key = '%' + data.search_key + '%'

        let params = [data.companyID, uid, search_key];

        if (data.buildingID != -1) {
            query += ` and assemblies.buildingID = ?`
            params.push(data.buildingID)
        }

        if (sort_column === -1)
            query += ' order by assemblies.assemblyID desc';
        else {
            if (sort_column === 0)
                query += ' order by assemblies.title ';
            else if (sort_column === 1)
                query += ' order by assemblies.date ';
            else if (sort_column === 2) {
                query += ' order by assemblies.address ';
            }
            query += data.sort_method;
        }

        query += ' limit ' + page_num * row_count + ',' + row_count

        db.query(query, params, async (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows)
            }
        })
    })
}

/**
 * get count for assembly list for search filter
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function getCountAssemblyList(uid, data) {
    return new Promise((resolve, reject) => {
        let query = `select count(*) count from assemblies where assemblies.created_by = ? and assemblies.title like ?`

        search_key = '%' + data.search_key + '%'
        let params = [uid, search_key];

        if (data.buildingID != -1) {
            query += ` and assemblies.buildingID = ?`
            params.push(data.buildingID)
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
 * function that delete assembly
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object id
 * @return  object If success returns object else returns message
 */
function deleteAssembly(id){
    return new Promise( async (resolve, reject) => {
        // var card = await getCard(id)
        // var response = await companyModel.getCompany(null, card.companyID)
        // await stripeHelper.deleteCardSource(response.stripe_customerID, card.stripe_sourceID)
        
        let query = `delete from assemblies where assemblyID = ?`
        db.query(query, [id], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("OK")
            }
        })
    })
}

/**
 * import assembly
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function getBuildingList(uid, data) {
    return new Promise((resolve, reject) => {
        let query = `select * from ` + table.BUILDINGS + ` where buildingID in (select relationID from ` + table.USER_RELATIONSHIP + ` where userID = ? and type = 'building') 
                and permission = "active"`
    
        db.query(query, [ uid], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows);
            }
        })
    })
}

/**
 * import assembly
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object file
 * @param   object data
 * @return  object If success returns object else returns message
 */
function importAssemblyCSV(uid, file, data) {
    return new Promise((resolve, reject) => {
        let assemblies = []
        fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', async (row) => {
            let assembly = {
                buildingID: '',
                title: '',
                description: '',
                date: '',
                time: '',
                address: '',
                additional_address: '',
                is_published: '',
                created_by: '',
                created_at: '',
                updated_at: '',
            }
            let date = row['date'].split("/")
            if (row['created_by'] !== '' && row['created_by'] !== null && row['created_by'] !== undefined && row['created_by'] !== uid) {
                assembly.buildingID = row['buildingID']
                assembly.title = row['title']
                assembly.description = row['description']
                assembly.date = date[2] + '-' + date[0] + '-' + date[1]
                assembly.time = row['time']
                assembly.address = row['address']
                assembly.additional_address = row['additional_address']
                assembly.is_published = row['is_published']
                assembly.created_by = row['created_by']
                assembly.created_at = row['created_at']
                assembly.updated_at = row['updated_at']
                assemblies.push(assembly)            
            }
        })
        .on('end', async () => {
            for (var i in assemblies) {
                var item = JSON.parse(JSON.stringify(assemblies[i]));
                await createAssembly(uid, item)                
            }
            resolve("OK")
        });
    })
}

function getAssemblyForCSV(assemblyID) {
    return new Promise((resolve, reject) => {
        let assemblies = []
        let query = 'Select * from assemblies where assemblyID = ?'
        db.query(query, [assemblyID], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                var vote_branch_name = []
                for (var j in rows) {
                    if (j == 0)
                        assemblies.push({assemblyID: rows[0].assemblyID, buildingID: rows[0].buildingID, title: rows[0].title, description: rows[0].description, date: rows[0].date, time: rows[0].time, address: rows[0].address, additional_address: rows[0].additional_address, is_published: rows[0].is_published, created_by: rows[0].created_by, created_at: rows[0].created_at, updated_at: rows[0].updated_at})
                    else
                        assemblies.push({assemblyID: '', buildingID: '', title: '', description: '', date: '', time: '', address: '', additional_address: '', is_published: '', created_by: '', created_at: '', updated_at: ''})
                }
                resolve(assemblies)
            }
        })  
    })
}

/**
 * export assembly list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object file
 * @param   object res
 * @return  object If success returns object else returns message
 */
function exportAssemblyCSV(data, res) {
    return new Promise(async (resolve, reject) => {
        // time = timeHelper.getCurrentTime()
        time = "Assemblies.csv"
        const csvWriter = createCsvWriter({
            path: 'public/upload/' + time,
            header: [
                {id: 'assemblyID', title: 'assemblyID'},
                {id: 'buildingID', title: 'buildingID'},
                {id: 'title', title: 'title'},
                {id: 'description', title: 'description'},
                {id: 'date', title: 'date'},
                {id: 'time', title: 'time'},
                {id: 'address', title: 'address'},
                {id: 'additional_address', title: 'additional_address'},
                {id: 'is_published', title: 'is_published'},
                {id: 'created_by', title: 'created_by'},
                {id: 'created_at', title: 'created_at'},
                {id: 'updated_at', title: 'updated_at'},
            ]
        });
        let assemblys = []
        let assemblyIDs = JSON.parse(data.assemblyIDs)
        for (var i in assemblyIDs) {
            result = await getAssemblyForCSV(assemblyIDs[i])
            for (var j in result) {
                assemblys.push(result[j])
            }
        }
        csvWriter
            .writeRecords(assemblys)
            .then(()=> {
                var file = fs.readFileSync("public/upload/" + time);
                res.setHeader('Content-Length', file.length);
                res.write(file, 'binary');
                res.end();
            });
        
    })
}

/**
 * function that create assembly file
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @param   object file
 * @return  object If success returns object else returns message
 */
function createAssemblyFile(uid, data, file){
    return new Promise( async (resolve, reject) => {
        let file_name = ""
        let query
        let params = []
        if (file)  {
            uploadS3 = await s3Helper.uploadLogoS3(file.file[0], s3buckets.FILE)
            file_name = uploadS3.Location
        }

        query = 'Insert into ' + table.ASSEMBLY_FILE + ' (assemblyID, name, url, created_by, created_at) VALUES (?, ?, ?, ?, ?)'
        params = [data.assemblyID, file.file[0].originalname, file_name, uid, timeHelper.getCurrentTime()]

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
 * function that delete assembly file
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object id
 * @return  object If success returns object else returns message
 */
function deleteAssemblyFile(id){
    return new Promise( async (resolve, reject) => {
        // var card = await getCard(id)
        // var response = await companyModel.getCompany(null, card.companyID)
        // await stripeHelper.deleteCardSource(response.stripe_customerID, card.stripe_sourceID)
        
        let query = `delete from assembly_file where fileID = ?`
        db.query(query, [id], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("OK")
            }
        })
    })
}

/**
 * function that get assembly file list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object id
 * @return  object If success returns object else returns message
 */
function getAssemblyFileList(id, uid){
    return new Promise( async (resolve, reject) => {
        let query = `select * from assembly_file where assemblyID = ?`

        db.query(query, [id], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve({files: rows})
            }
        })
    })
}

/**
 * function that add assembly decision
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function createAssemblyDecision(uid, data) {
    return new Promise( async (resolve, reject) => {
        let query
        let params = []
        query = 'Insert into ' + table.ASSEMBLY_DECISION + ' (assemblyID, name, description, vote_branch, vote_result, calc_mode, intervention, enable_external_speaker, enable_company_transfer, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        params = [data.assemblyID, data.name, data.description, data.vote_branch, data.vote_result, data.calc_mode, data.intervention, data.enable_external_speaker, data.enable_company_transfer, uid, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()]

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
 * function that add assembly decision
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object id
 * @param   object data
 * @return  object If success returns object else returns message
 */
function updateAssemblyDecision(uid, id, data) {
    return new Promise( async (resolve, reject) => {
        let query
        let params = []
        query = 'UPDATE ' + table.ASSEMBLY_DECISION + ' SET name = ?, description = ?, vote_branch = ?, vote_result = ?, calc_mode = ?, intervention = ?, enable_external_speaker = ?, enable_company_transfer = ?, updated_at = ? WHERE decisionID = ? and created_by = ?'
        params = [data.name, data.description, data.vote_branch, data.vote_result, data.calc_mode, data.intervention, data.enable_external_speaker, data.enable_company_transfer, timeHelper.getCurrentTime(), id, uid ]

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
 * function that get assembly decision
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function getAssemblyDecision(id){
    return new Promise( async (resolve, reject) => {
        let query = `select * from ` + table.ASSEMBLY_DECISION + ` where decisionID = ?`
        let assembly_info_query = `select * from ` + table.ASSEMBLIES + ` where assemblyID = ?`
        let branch_info_query = 'Select * from ' + table.VOTE_BUILDING_BRANCH + ' where buildingID = ?'

        db.query(query, [id], async (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                db.query(assembly_info_query, [rows[0].assemblyID], (error, rows1, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR});
                    } else {
                        db.query(branch_info_query, [rows1[0].buildingID], (error, rows2, fields) => {
                            if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR});
                            } else {
                                resolve({decision: rows, assembly: rows1, votelist: rows2})
                            }
                        });
                    }
                });
            }
        })
    })
}

/**
 * function that delete assembly decision
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object id
 * @return  object If success returns object else returns message
 */
function deleteAssemblyDecision(id){
    return new Promise( async (resolve, reject) => {
        // var card = await getCard(id)
        // var response = await companyModel.getCompany(null, card.companyID)
        // await stripeHelper.deleteCardSource(response.stripe_customerID, card.stripe_sourceID)
        
        let query = `delete from assembly_decision where decisionID = ?`
        db.query(query, [id], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("OK")
            }
        })
    })
}

/**
 * function that get assembly decision list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object id
 * @return  object If success returns object else returns message
 */
function getAssemblyDecisionList(id, data){
    return new Promise( async (resolve, reject) => {
        let query = `select * 
                    from assembly_decision 
                    where assembly_decision.assemblyID = ? and assembly_decision.name like ?`

        sort_column = Number(data.sort_column);
        row_count = Number(data.row_count);
        page_num = Number(data.page_num);
        search_key = '%' + data.search_key + '%'

        let params = [id, search_key];

        if (sort_column === -1)
            query += ' order by assembly_decision.decisionID desc';
        else {
            if (sort_column === 0)
                query += ' order by assembly_decision.decisionID ';
            else if (sort_column === 1)
                query += ' order by assembly_decision.name ';
            else if (sort_column === 2)
                query += ' order by assembly_decision.vote_branch ';
            else if (sort_column === 3)
                query += ' order by assembly_decision.calc_mode ';
            else if (sort_column === 4)
                query += ' order by assembly_decision.vote_result ';
            query += data.sort_method;
        }

        query += ' limit ' + page_num * row_count + ',' + row_count

        db.query(query, params, (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows)
            }
        })
    })
}

/**
 * get count for assembly decision list for search filter
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object id
 * @return  object If success returns object else returns message
 */
function getCountAssemblyDecisionList(id, data){
    return new Promise( async (resolve, reject) => {
        let query = `select count(*) count
                    from assembly_decision 
                    where assembly_decision.assemblyID = ? and assembly_decision.name like ?`

        search_key = '%' + data.search_key + '%'
        let params = [id, search_key];

        db.query(query, params, (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(rows)
            }
        })
    })
}

/**
 * import assembly decision CSV
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object CSV file
 * @param   object data
 * @return  object If success returns object else returns message
 */
function importAssemblyDecisionCSV(uid, file, data) {
    return new Promise((resolve, reject) => {
        let decisions = []        
        fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', async (row) => {
            console.log(row);
            let decision = {
                assemblyID: '',
                name: '',
                description: '',
                vote_branch: '',
                vote_result: '',
                calc_mode: '',
                intervention: '',
                enable_external_speaker: '',
                enable_company_transfer: '',
            }

            if (row['name'] !== '' && row['name'] !== null && row['name'] !== undefined) { 
                decision.assemblyID = data.assemblyID
                decision.name = row['name']
                decision.description = row['description']
                decision.vote_branch = row['vote_branch']
                decision.vote_result = 'onhold'
                decision.calc_mode = row['calc_mode']
                decision.intervention = ''
                decision.enable_external_speaker = ''
                decision.enable_company_transfer = ''
                decisions.push(decision)
            }
        })
        .on('end', async () => {
            decisions.push(decision)
            for (var i in decisions) {
                var item = JSON.parse(JSON.stringify(decisions[i]));
                await createAssemblyDecision(uid, item, data)                
            }
            resolve("OK")
        });
    })
}

function getDecisionForCSV(decisionID) {
    return new Promise((resolve, reject) => {
        let decisions = []
        let query = 'Select * from assembly_decision where decisionID = ?'
        db.query(query, [decisionID], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                var vote_branch_name = []
                for (var j in rows) {
                    if (j == 0)
                        decisions.push({decisionID: rows[0].decisionID, assemblyID: rows[0].assemblyID, name: rows[0].name, description: rows[0].description, vote_branch: rows[0].vote_branch, vote_result: rows[0].vote_result, calc_mode: rows[0].calc_mode, intervention: rows[0].intervention, company_transfer: rows[0].company_transfer, enable_external_speaker: rows[0].enable_external_speaker, enable_company_transfer: rows[0].enable_company_transfer, created_at: rows[0].created_at, updated_at: rows[0].updated_at})
                    else
                        decisions.push({decisionID: '', assemblyID: '', name: '', description: '', vote_branch: '', vote_result: '', calc_mode: '', intervention: '', company_transfer: '', enable_external_speaker: '', enable_company_transfer: '', created_at: '', updated_at: ''})
                }
                resolve(decisions)
            }
        })
    })
}

/**
 * export assembly decision list to CSV
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object data
 * @param   object res
 * @return  object If success returns object else returns message
 */
function exportAssemblyDecisionCSV(data, res) {
    return new Promise(async (resolve, reject) => {
        time = timeHelper.getCurrentTime()
        const csvWriter = createCsvWriter({
            path: 'public/upload/' + time,
            header: [
                {id: 'decisionID', title: 'decisionID'},
                {id: 'assemblyID', title: 'assemblyID'},
                {id: 'name', title: 'name'},
                {id: 'description', title: 'description'},
                {id: 'vote_branch', title: 'vote_branch'},
                {id: 'vote_result', title: 'vote_result'},
                {id: 'calc_mode', title: 'calc_mode'},
                {id: 'intervention', title: 'intervention'},
                {id: 'company_transfer', title: 'company_transfer'},
                {id: 'enable_external_speaker', title: 'enable_external_speaker'},
                {id: 'enable_company_transfer', title: 'enable_company_transfer'},
                {id: 'created_at', title: 'created_at'},
                {id: 'updated_at', title: 'updated_at'},
            ]
        });
        let decisions = []
        let decisionIDs = JSON.parse(data.decisionID)
        for (var i in decisionIDs) {
            result = await getDecisionForCSV(decisionIDs[i])
            for (var j in result) {
                decisions.push(result[j])
            }
        }
        csvWriter
            .writeRecords(decisions)
            .then(()=> {
                var file = fs.readFileSync("public/upload/" + time);
                res.setHeader('Content-Length', file.length);
                res.write(file, 'binary');
                res.end();
            });        
    })
}

/**
 * function that add assembly vote
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function createAssemblyVote(uid, data) {
    return new Promise( async (resolve, reject) => {
        let query = 'select * from ' + table.USERS + ' where userID = ?'
        db.query(query, [data.ownerID], async (error, users, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (error) {
                    reject({ message: message.INTERNAL_SERVER_ERROR});
                } else {
                    let query = 'select * from ' + table.ASSEMBLIES + ' where assemblyID = ?'
                    db.query(query, [data.assemblyID], async (error, assemblies, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR});
                            } else {
                                let query = 'select apartment_number from ' + table.APARTMENTS + ' where created_by = ? and buildingID = ?'
                                db.query(query, [data.ownerID, assemblies[0].buildingID], async (error, apartment_numbers, fields) => {
                                    if (error) {
                                        reject({ message: message.INTERNAL_SERVER_ERROR })
                                    } else {
                                        if (error) {
                                            reject({ message: message.INTERNAL_SERVER_ERROR});
                                        } else {
                                            let numbers;
                                            if (apartment_numbers.length > 0) {
                                                numbers = '' + apartment_numbers[0].apartment_number;
                                                if (apartment_numbers.length > 1) {
                                                    for (var i = 1; i < apartment_numbers.length; i ++) {
                                                        numbers = numbers + ', ';
                                                        numbers = numbers + apartment_numbers[i].apartment_number;
                                                    }
                                                }
                                            }
                                            let fullname = users[0].firstname + ' ' + users[0].lastname;
                                            console.log(fullname);
                                            let query = 'Insert into ' + table.ASSEMBLY_VOTE + ' (assemblyID, userID, fullname, apartments, type, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                                            let params = [data.assemblyID, data.ownerID, fullname, numbers, "postal", data.status, timeHelper.getCurrentTime(), timeHelper.getCurrentTime()]
                                            db.query(query, params, async (error, votes, fields) => {
                                                if (error) {
                                                    reject({ message: message.INTERNAL_SERVER_ERROR })
                                                } else {
                                                    resolve(votes)
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    })
}

/**
 * function that get owner list for vote
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function getPostalVoteOwnerList(uid) {
    return new Promise( async (resolve, reject) => {
        let query = `select *
            from ` + table.USERS + ` 
            where created_by = ? and usertype = ?`

        db.query(query, [uid, "owner"], async (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve({owners: rows})
            }
        })
    })
}

/**
 * function that get vote list
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function getAssemblyVoteList(uid, data) {
    console.log(data)
    return new Promise( async (resolve, reject) => {
        let query = `select * 
                    from ` + table.ASSEMBLY_VOTE + ` 
                    where assemblyID = ? and status = 'active'`

        sort_column = Number(data.sort_column);
        row_count = Number(data.row_count);
        page_num = Number(data.page_num);
        search_key = '%' + data.search_key + '%'

        let params = [data.assemblyID];

        if (sort_column === -1)
            query += ' order by correspondenceID desc';
        else {
            if (sort_column === 0)
                query += ' order by fullname ';
            else if (sort_column === 1)
                query += ' order by apartments ';
            else if (sort_column === 2)
                query += ' order by type ';
            query += data.sort_method;
        }
        query += ' limit ' + page_num * row_count + ',' + row_count

        db.query(query, params, async (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve({votes: rows})
            }
        })
    })
}

/**
 * function that delete vote
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function deleteAssemblyVote(id, data){
    return new Promise( async (resolve, reject) => {
        let query
        let params = []
        query = 'UPDATE ' + table.ASSEMBLY_VOTE + ' SET status = ? WHERE correspondenceID = ?'
        params = [data.status, id ]
        console.log(query)
        console.log(params)
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
 * function that get vote detail
 *
 * @author  Talent Developer <talentdeveloper59@gmail.com>
 * @param   object uid
 * @param   object data
 * @return  object If success returns object else returns message
 */
function getAssemblyVoteDetail(uid, id, data) {
    return new Promise( async (resolve, reject) => {
        let query = `select * from ` + table.ASSEMBLY_VOTE + ` where correspondenceID = ? and status = 'active'`
        let params = [id];

        db.query(query, params, async (error, votes, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                let query = `select * from ` + table.ASSEMBLY_DECISION + ` where assemblyID = ?`
                let params = [data.assemblyID];

                db.query(query, params, async (error, decisions, fields) => {
                    if (error) {
                        reject({ message: message.INTERNAL_SERVER_ERROR })
                    } else {
                        let query = `select * from ` + table.USERS + ` where userID = ?`
                        let params = [votes[0].userID];

                        db.query(query, params, async (error, users, fields) => {
                            if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR })
                            } else {
                                resolve({votes: votes, decisions: decisions, users: users,})
                            }
                        })
                    }
                })
            }
        })
    })
}

module.exports = assemblyModel
