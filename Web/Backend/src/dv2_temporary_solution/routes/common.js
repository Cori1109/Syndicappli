const Promise = require("bluebird");
const appActions = require("../constants/appActions");
const codes = require("../../constants/code");
const dbUtil = require('../utilities/dbUtil');
const handleGetFileDownloadUrl = require('../../services/gcs-service').handleGetFileDownloadUrl;
const tables = require('../../constants/table');

exports.expose = function (router) {
  exposeCommon(router);
}

function exposeCommon(router) {

  router.post('/common/', (req, res) => {
    var action = req.body.action;

    switch (action) {

      case appActions.commonActions.LIST_PROGRAMMING_LANGUAGE:

        dbUtil.commonQuery('listProgrammingLanguage', [], res);
        break;

      case appActions.commonActions.LIST_AREA:

        dbUtil.commonQuery('listArea', [], res);
        break;

      case appActions.commonActions.LIST_COMPANY_USE:

        dbUtil.commonQuery('listCompanyUse', [], res);
        break;

      case appActions.commonActions.LIST_COMPILER:

        dbUtil.commonQuery('listCompiler', [], res);
        break;

      case appActions.commonActions.LIST_SKILLS:

        dbUtil.commonQuery('list_skills', [], res);
        break;

      case appActions.commonActions.LIST_CATEGORIES:

        dbUtil.commonQuery('list_categories', [], res);
        break;

      case appActions.commonActions.LIST_JOB_TYPE:

        dbUtil.commonQuery('list_job_types', [], res);
        break;

      case appActions.commonActions.LIST_JOB_LENGTH:

        dbUtil.commonQuery('list_job_length', [], res);
        break;

      case appActions.commonActions.LIST_JOB_LEVEL:

        dbUtil.commonQuery('list_job_levels', [], res);
        break;

      case appActions.commonActions.LIST_CLIENTS:

        dbUtil.commonQuery('list_clients', [], res);
        break;

      case appActions.commonActions.LIST_JOB:
        {
          const { keyword, skillId, startFrom, numberOfRows } = req.body;
          const gotCount = true;
          dbUtil.commonQuery('list_job_with_count',
            [keyword, skillId, startFrom, numberOfRows],
            res, gotCount);
        }

        break;

      case appActions.commonActions.LIST_SYSTEM_DESIGN:
        {
          const { startFrom, numberOfRows } = req.body;
          const gotCount = true;
          dbUtil.commonQuery('list_system_design_with_user',
            [startFrom, numberOfRows],
            res, gotCount);
        }

        break;

      case appActions.commonActions.LIST_PRODUCT_DESIGN:
        {
          const { startFrom, numberOfRows } = req.body;
          const gotCount = true;
          dbUtil.commonQuery('list_product_design_with_user',
            [startFrom, numberOfRows],
            res, gotCount);
        }

        break;

      case appActions.commonActions.GET_FILE_DOWNLOAD_URL: {
        let { fileName } = req.body;
        handleGetFileDownloadUrl(fileName, res)

        break;
      }

      case appActions.commonActions.RETRIEVE_JOB:
        const { job_id } = req.body;
        dbUtil.commonQuery('retrieve_job', [job_id], res);
        break;

      case appActions.commonActions.LIST_CHALLENGES_WITH_TYPES: {
        let { filterType, filterInOrder, filterActive, filterOneShot } = req.body;

        dbUtil.commonQuery('list_challenges_with_types', [filterType, filterInOrder, filterActive, filterOneShot],
        res);
        break;
      }

      case appActions.commonActions.LIST_CHALLENGE_UPLOAD_OPTIONS: {
        let { challenge_id } = req.body;

        dbUtil.commonQuery('list_challenge_upload_options', [challenge_id],
        res);
        break;
      }

      default:
        res.json({ success: false, errorMessage: codes.BAD_REQUEST });
    }
  });

  router.post('/common-admin/', (req, res) => {
    var action = req.body.action;

    switch (action) {

      case appActions.adminActions.RETRIEVE_CONDITIONS: {
        let {job_id, challenge_id, special_job_id} = req.body;
        let func_arr = [];
        func_arr.push(dbUtil.commonQueryRows('retrieve_conditions',[]));
        func_arr.push(dbUtil.commonQueryRows('list_challenges',[null, null, null, null, null, null]));
        func_arr.push(dbUtil.commonQueryRows('retrieve_challenge_job_conditions',[challenge_id, job_id]));
        func_arr.push(dbUtil.commonQueryRows('retrieve_challenge_job_conditions',[special_job_id, null]));

        const additional_param_arr = (chlng_lst, cnd_lst) => {
          let conditions = cnd_lst.map(cnd => {
            let params = cnd.additional_parameters ? cnd.additional_parameters.split(',') : [];                        
            let detailed_params = params.map(par => {
              let parId = parseInt(par);
              let par_obj = chlng_lst.filter(ch => ch.challenge_id === parId)[0];
              return {
                id: parId,
                name: par_obj.challenge_name
              }
            })            
            return {
              ...cnd,
              additional_parameters: detailed_params
            }
          })
          return conditions;
        }

        Promise.all(func_arr)
          .then(allValues => {
            res.json({
              success: true,
              result: {
                allConditions: allValues[0][0],
                prevConditions: allValues[2] ? additional_param_arr(allValues[1][0], allValues[2][0]) : undefined,
                specialJobConditions: allValues[3] ? additional_param_arr(allValues[1][0], allValues[3][0]) : undefined
              }
            })
          })
          .catch(error => {
            console.log(error);
            res.json({ success: false, errorMessage: codes.BAD_REQUEST });
          });

        break;
      }

      case appActions.adminActions.SET_CONDITIONS: {
        let {conditions, type, id} = req.body;
        let str_conditions = conditions.map(cdn => cdn.condition_id).join(',');
        const set_conds = dbUtil.commonQueryRows('set_conditions', [type, id, str_conditions]);
        Promise.all([set_conds]).then(result1 => {
          let funcs = [];
          conditions.forEach(cnd => {
            if(cnd.additional_parameters){
              let params = cnd.additional_parameters;
              if(params.length){
                params = params.map(p => p.id).join(',');
              }else{
                params = null;
              }
              funcs.push(dbUtil.commonQueryRows('set_additional_parameters_for_condition', [type, id, cnd.condition_id, params]));
            }
          })
          Promise.all(funcs).then(result2 => {
            res.json({success: true});
          }).catch(error => {
            console.log(error);
            res.json({ success: false, errorMessage: codes.BAD_REQUEST });  
          })
        }).catch(error => {
          console.log(error);
          res.json({ success: false, errorMessage: codes.BAD_REQUEST });
        });

        break;
      }

      default:
        res.json({ success: false, errorMessage: codes.BAD_REQUEST });
    }
  });
}