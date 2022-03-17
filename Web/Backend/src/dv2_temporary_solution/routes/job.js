const Promise = require("bluebird");
const appActions = require("../constants/appActions");
const codes = require("../../constants/code");
const dbUtil = require('../utilities/dbUtil');
const authMiddleware = require('../../middleware/auth-middleware');

exports.expose = function(router) {
  exposeCommon(router);
}

function exposeCommon(router) {

  router.post('/job/', authMiddleware.checkAdminToken, (req, res) => {
    var action = req.body.action;

    switch (action) {

      case appActions.adminActions.CREATE_JOB:
        {
          const { title, job_description, job_type_id, job_length_id, job_level_id, job_deadline, client_id, category_use, skill_use, special_condition } = req.body;
          const job_posted_by = req.decoded.uid;
          dbUtil.commonQuery('create_job',
            [title, job_description, job_type_id, job_length_id, job_level_id, job_deadline, job_posted_by, client_id, category_use, skill_use, special_condition],
            res);
        }

        break;

      case appActions.adminActions.UPDATE_JOB:
        {
          const { job_id, title, job_description, job_type_id, job_length_id, job_level_id, job_deadline, client_id, category_use, skill_use, active, special_condition } = req.body;
          const job_posted_by = req.decoded.uid;
          dbUtil.commonQuery('update_job',
            [job_id, title, job_description, job_type_id, job_length_id, job_level_id, job_deadline, job_posted_by, client_id, category_use, skill_use, active, special_condition],
            res);
        }

        break;

        case appActions.adminActions.LIST_JOB_APPLY:
        {
          const { keyword, skillId, startFrom, numberOfRows } = req.body;
          const gotCount = true;
          dbUtil.commonQuery('list_job_apply',
            [keyword, skillId, startFrom, numberOfRows],
            res, gotCount);
        }

        break;

      default:
        res.json({ success: false, errorMessage: codes.BAD_REQUEST });
    }
  });

  router.post('/job-apply/', authMiddleware.checkToken, (req, res) => {
    var action = req.body.action;

    switch (action) {

      case appActions.commonActions.JOB_APPLY:
        {
          const { job_id } = req.body;
          const user_id = req.decoded.uid;

          dbUtil.commonQueryRows('job_apply', [user_id, job_id])
          .then(result => {
            if(result && result.length > 0) {
              res.json({ success: true, result: result[0] });
            }
            else res.json({ success: false, errorMessage: codes.BAD_REQUEST });
          })
          .catch(error => {
            res.json({ success: false, errorMessage: codes.BAD_REQUEST });
          });
        }

        break;

      default:
        res.json({ success: false, errorMessage: codes.BAD_REQUEST });
    }
  });
}