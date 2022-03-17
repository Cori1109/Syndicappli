const Promise = require("bluebird");
const appActions = require("../constants/appActions");
const codes = require("../../constants/code");
const problemTypes = require("../constants/problemTypes");
const authMiddleware = require('../../middleware/auth-middleware');
const dbUtil = require('../utilities/dbUtil');

exports.expose = function (router) {
  exposeCommon(router);
}

function exposeCommon(router) {

  router.post('/score/', authMiddleware.checkAdminToken, (req, res) => {
    var action = req.body.action;

    switch (action) {

      case appActions.adminActions.UPDATE_SYSTEM_DESIGN_LIST_SCORE:
        {
          const { systemId, systemScore } = req.body;
          dbUtil.commonQuery('update_system_design_list_score',
            [systemId, systemScore],
            res);
        }

        break;

      case appActions.adminActions.UPDATE_PRODUCT_DESIGN_LIST_SCORE:
        {
          const { productId, productScore } = req.body;
          dbUtil.commonQuery('update_product_design_list_score',
            [productId, productScore],
            res);
        }

        break;

      case appActions.adminActions.GET_SUBMITTED_CHALLENGE_WITH_INFO:
        {
          const {submit_id} = req.body;
          const submissionInfo = dbUtil.commonQueryRows('get_submitted_challenge_with_info', [submit_id]);
          Promise.all([submissionInfo]).then(allValues => {
            let data = allValues[0][0];
            if(!data.length){
              res.json({ success: false });
            }
            let funcs = [];
            data.forEach((obj, ind) => {
              if(obj.type === problemTypes.SINGLE_CHOICE || obj.type === problemTypes.MULTI_CHOICE){
                funcs.push(dbUtil.commonQueryRows('retrieve_problem_choices', [obj.problem_id]));
              } else{
                funcs.push(dbUtil.commonQueryRows('retrieve_problem_cases', [obj.problem_id, null]));
              }
              if(!obj.answer && !obj.content){
                data[ind]['is_submitted'] = false;
              }else{
                data[ind]['is_submitted'] = true;
              }
            });

            Promise.all(funcs).then(allValues1 => {
              let total_cases = 0;
              allValues1.forEach((obj, ind) => {
                if(data[ind]['is_submitted'] && (data[ind].type === problemTypes.SINGLE_CHOICE || data[ind].type === problemTypes.MULTI_CHOICE)){
                  data[ind]['choice_set'] = obj[0];
                }else if(data[ind]['is_submitted']){
                  data[ind]['problem_cases'] = obj[0];
                  total_cases += obj[0].length;
                }
              });
              let result = {
                challenge_name: data[0].challenge_name,
                dev_name: data[0].dev_name,
                submit_time: data[0].submit_time,
                total_score_by_cases: data[0].total_score_by_cases,
                total_score_by_problem: data[0].total_score_by_problem,
                total_time: data[0].total_time,
                total_problems: data.length,
                total_cases: total_cases,
                problem_data: data
              }
              res.json({ success: true, result });
            }).catch(err => {
              console.log('error1: ', err);
              res.json({ success: false, errorMessage: codes.BAD_REQUEST });
            })
          }).catch(err => {
            console.log('error: ', err);
            res.json({ success: false, errorMessage: codes.BAD_REQUEST });
          })

        }

        break;

      case appActions.adminActions.SET_DEVELOPER_CHALLENGE_GRADE:
        {
          const { submitId, developerGrade } = req.body;
          dbUtil.commonQuery('update_challenge_grade', [submitId, developerGrade], res);
        }

        break;
      default:
        res.json({ success: false, errorMessage: codes.BAD_REQUEST });
    }
  });
}