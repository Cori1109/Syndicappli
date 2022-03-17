const Promise = require("bluebird");
const appActions = require("../constants/appActions");
const codes = require("../../constants/code");
const dbUtil = require('../utilities/dbUtil');
const dbChallenge = require("../db/dbChallenge");
/* Use their auth because if we don't --> */
const authMiddleware = require('../../middleware/auth-middleware');

exports.expose = function(router) {
  exposeCommon(router);
}

function exposeCommon(router) {

  router.post('/challenge/', authMiddleware.checkToken, (req, res) => {
    var action = req.body.action;

    switch (action) {

      case appActions.challengeActions.RETRIEVE_CHALLENGE_WITH_PROBLEM:
        {
          const { challenge_id } = req.body;
          const user_id = req.decoded.uid;

          const challenge = dbUtil.commonQueryRows('retrieveChallenge',[challenge_id, 1]);
          const challengeProblems = dbUtil.commonQueryRows('retrieveChallengeProblem',[challenge_id]);
          const trackChallenge = dbUtil.commonQueryRows('get_track_challenge',[user_id, challenge_id]);

          Promise.all([challenge, challengeProblems, trackChallenge])
          .then(allValues => {
            if(allValues[0][0].length === 0) {
              /* Challenge not active */
              res.json({ success: false });
            }
            else res.json({ success: true, result: { challenge: allValues[0][0], challenge_problems: allValues[1][0], timePassed: allValues[2][0] } });
          })
          .catch(error => {
            res.json({ success: false, errorMessage: codes.BAD_REQUEST });
          });
        }
        break;

      case appActions.challengeActions.RETRIEVE_PROBLEM_FOR_CHALLENGE:
        {
          const { problem_id } = req.body;
          const problem = dbUtil.commonQueryRows('retrieve_problem',[problem_id]);
          const problemTemplates = dbUtil.commonQueryRows('retrieve_problem_templates',[problem_id]);
          const problemCases = dbUtil.commonQueryRows('retrieve_problem_cases',[problem_id, 1]);
          const problemChoices = dbUtil.commonQueryRows('retrieve_problem_choices',[problem_id]);

          Promise.all([problem, problemTemplates, problemCases, problemChoices])
          .then(allValues => {
            res.json({ success: true, result: { problem: allValues[0][0], problem_templates: allValues[1][0], problem_cases: allValues[2][0], problem_choices: allValues[3][0]  } });
          })
          .catch(error => {
            res.json({ success: false, errorMessage: codes.BAD_REQUEST });
          });
        }
        break;

      case appActions.challengeActions.RETRIEVE_CHALLENGE:
        {
          const { challenge_id, active } = req.body;
          dbUtil.commonQuery('retrieveChallenge',
            [challenge_id, active],
            res);
        }

        break;

      case appActions.challengeActions.ADD_TRACK_CHALLENGE:
        {
          const { challenge_id } = req.body;
          const user_id = req.decoded.uid;
          dbUtil.commonQuery('add_track_challenge',
            [user_id, challenge_id],
            res, false, 'You already participated in this one time challenge.');
        }

        break;

      case appActions.challengeActions.UPDATE_TRACK_CHALLENGE_STEP:
        {
          const { track_challenge_id, step } = req.body;
          dbUtil.commonQuery('update_track_challenge_step',
            [track_challenge_id, step],
            res);
        }

        break;

      case appActions.challengeActions.SUBMIT_PROBLEM_SOLUTION:
        {
          const { challenge_id, problem_id, programming_language_id, content, codeLog } = req.body;
          const user_id = req.decoded.uid;

          dbChallenge.submitSolutionAsync(user_id, challenge_id, problem_id, programming_language_id, content, codeLog)
          .then(function(result) {
            if(result)
            {
              res.json({ success: true, result: result });
            }
            else res.json({ success: false, errorMessage: codes.BAD_REQUEST });
          })
          .catch(function(error) {
            res.json({ success: false, errorMessage: codes.BAD_REQUEST });
          })
        }

        break;

      case appActions.challengeActions.SUBMIT_PROBLEM_CHOICE:
        {
          const { challenge_id, problem_id, answer } = req.body;
          const user_id = req.decoded.uid;

          dbChallenge.submitChoicesAsync(user_id, challenge_id, problem_id, answer)
          .then(function(result) {
            if(result)
            {
              res.json({ success: true, result: result });
            }
            else res.json({ success: false, errorMessage: codes.BAD_REQUEST });
          })
          .catch(function(error) {
            res.json({ success: false, errorMessage: codes.BAD_REQUEST });
          })
        }

        break;

      case appActions.challengeActions.LIST_CHALLENGE_UPLOAD_BY_USER: {
        let { challenge_id } = req.body;
        const user_id = req.decoded.uid;

        /* Because the current challenge type list Id from 2 ... 6 (remove the 1 = Frontend) */
        /* So, our challenge Id must be the same if we want to retrieve the old data */
        dbUtil.commonQuery('list_challenge_upload_by_user', [user_id, challenge_id],
        res);
        break;
      }

      case appActions.challengeActions.LIST_MULTI_CHOICES_CHALLENGE:
        {
          const { startFrom, numberOfRows } = req.body;
          const gotCount = true;
          dbUtil.commonQuery('list_multi_choices_challenge',
            [startFrom, numberOfRows],
            res, gotCount);
        }

        break;

      default:
        res.json({ success: false, errorMessage: codes.BAD_REQUEST });
    }
  });
}