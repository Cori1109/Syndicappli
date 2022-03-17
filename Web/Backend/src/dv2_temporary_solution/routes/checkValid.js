const Promise = require("bluebird");
const codes = require("../../constants/code");
const dbUtil = require('../utilities/dbUtil');
const authMiddleware = require('../../middleware/auth-middleware');
const validChallenge = require('../utilities/validChallenge');

exports.expose = function(router) {
  exposeCommon(router);
}

function exposeCommon(router) {

    router.post('/check-valid/', authMiddleware.checkToken, (req, res) => {
        const { challenge_id, job_id } = req.body;
        const user_id = req.decoded.uid;
        let params = [];
        let sqlStr = `
            SELECT cnd.*, chlng_cnd.*
            FROM dv2_challenge_condition chlng_cnd JOIN dv2_condition cnd ON chlng_cnd.condition_id = cnd.condition_id
            where chlng_cnd.challenge_id = ?`;
        if(job_id) {
          sqlStr = `
              SELECT cnd.*, job_cnd.*
              FROM dv2_job_condition job_cnd JOIN dv2_condition cnd ON job_cnd.condition_id = cnd.condition_id
              where job_cnd.job_id = ?`;
          params.push(job_id);
        }
        else params.push(challenge_id);

        dbUtil.executeSQL(sqlStr, params)
            .then(function (rows) {
                if(!rows.length){
                    return res.json({success: true});
                }
                let funcs = [];
                let js_cls_ins = null;
                for(let i = 0; i < rows.length; i++){
                    let row = rows[i];
                    if (row.sp_or_js === 0){
                        let params = [user_id, challenge_id, job_id];
                        if(row.condition_name === 'ALGORITHM_CHALLENGE'){
                            params.push(row.pass_score);
                        } else if(row.condition_name === 'NEED_COMPLETED_CHALLENGE'){
                            if(!row.additional_parameters || !row.additional_parameters.length){
                                continue;
                            } 
                            const total_chlng_ids = row.additional_parameters.split(',').length;
                            params = [user_id, row.additional_parameters, row.pass_score, total_chlng_ids];
                        }
                        funcs.push(dbUtil.commonQueryRows(row.check_function, params));
                    } else{
                        if(!js_cls_ins){
                            js_cls_ins = new validChallenge.ValidChallenge(user_id, challenge_id, job_id);
                        }
                        funcs.push(js_cls_ins[row.check_function]());
                    }
                };
                Promise.all(funcs)
                    .then(allResults => {
                        let failingConds = [];
                        allResults.forEach((res, ind) => {                            
                            if(rows[ind].condition_name === 'NEED_COMPLETED_CHALLENGE' && res[0][0].result && res[0][0].result.length){                                
                                let display_name = rows[ind].display_name;                                
                                display_name = display_name.replace('?', res[0][0].result);
                                failingConds.push({
                                    ...rows[ind],
                                    display_name
                                })
                            }else if(rows[ind].condition_name !== 'NEED_COMPLETED_CHALLENGE' &&
                                ((rows[ind].sp_or_js === 0 && !res[0][0].result) || (rows[ind].sp_or_js === 1 && !res.result))
                            ){
                                failingConds.push(rows[ind]);
                            }
                        })
                        if(failingConds.length){
                            res.json({ success: false, failingConds });
                        }
                        return res.json({success: true});
                    })
                    .catch(error => {
                        console.log('err: ', error);
                        res.json({ success: false, errorMessage: codes.BAD_REQUEST });
                    })
            })
            .catch(error => {
                console.log('err: ', error);
                res.json({ success: false, errorMessage: codes.BAD_REQUEST });
            })
    });
}