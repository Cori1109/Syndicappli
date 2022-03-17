const Promise = require("bluebird");
const appActions = require("../constants/appActions");
const codes = require("../../constants/code");
const authMiddleware = require('../../middleware/auth-middleware');
const dbChallenge = require("../db/dbChallenge");
const dbUtil = require('../utilities/dbUtil');

exports.expose = function (router) {
  exposeCommon(router);
}

function exposeCommon(router) {

  Promise.promisifyAll(dbChallenge);

  router.post('/problem/', authMiddleware.checkAdminToken, (req, res) => {
    var action = req.body.action;

    switch (action) {

      case appActions.adminActions.CREATE_PROBLEM:
        {
          const { type_id, difficulty_id, areas, company_use, content, duration } = req.body;
          dbUtil.commonQuery('create_problem',
            [type_id, difficulty_id, areas, company_use, content, duration],
            res);
        }

        break;

      case appActions.adminActions.CREATE_CHALLENGE:
        {
          const { type_id, challenge_name, challenge_description, duration, inOrder, one_shot, active } = req.body;
          dbUtil.commonQuery('create_challenge',
            [type_id, challenge_name, challenge_description, duration, inOrder, one_shot, active],
            res);
        }

        break;

      case appActions.adminActions.CREATE_PROBLEM_CHOICE:
        {
          const { problem_id, content, valid, language_id } = req.body;
          dbUtil.commonQuery('create_problem_choice',
            [problem_id, content, valid, language_id],
            res);
        }

        break;

      case appActions.adminActions.CREATE_PROBLEM_TEMPLATE:
        {
          const { problem_id, language_id, content } = req.body;
          dbUtil.commonQuery('create_problem_template',
            [problem_id, language_id, content],
            res);
        }

        break;

      case appActions.adminActions.CREATE_PROBLEM_SOLUTION:
        {
          const { problem_id, language_id, content } = req.body;
          dbUtil.commonQuery('create_problem_solution',
            [problem_id, language_id, content],
            res);
        }

        break;

      case appActions.adminActions.CREATE_PROBLEM_CASE:
        {
          const { problem_id, input, output, inputVisible } = req.body;
          dbUtil.commonQuery('create_problem_case',
            [problem_id, input, output, inputVisible],
            res);
        }

        break;

      case appActions.adminActions.LIST_PROBLEMS: {
        let { filterType, filterArea, filterCompanyUse, filterDifficulty, startFrom, numberOfRows } = req.body;
        if (filterType === 'all') filterType = null;
        if (filterArea === 'all') filterArea = null;
        if (filterCompanyUse === 'all') filterCompanyUse = null;
        if (filterDifficulty === 'all') filterDifficulty = null;

        const gotCount = true;

        dbUtil.commonQuery('list_problems',
          [filterType, filterArea, filterCompanyUse, filterDifficulty, startFrom, numberOfRows],
          res, gotCount);

        break;
      }

      case appActions.adminActions.GET_PROBLEMS_LIST:
        {
          dbUtil.commonQuery('list_problems',
            [null, null, null, null],
            res);
        }

        break;

      case appActions.adminActions.GET_SUBMITED_CHALLENGE_LIST:
        {
          dbChallenge.getSubmitedChallengeListAsync(req.body)
            .then(function (result) {
              if (result) {
                res.json({ success: true, ...result });
              }
              else res.json({ success: false, errorMessage: codes.BAD_REQUEST });
            })
            .catch(function (error) {
              res.json({ success: false, error, errorMessage: codes.BAD_REQUEST });
            })
        }

        break;

      case appActions.adminActions.GET_SUBMITED_CHALLENGE_LIST_USERS:
        {
          const gotCount = true;
          const { current, numberOfRows, challenge_id, orderby } = req.body
          let challengeId = challenge_id
          if (challengeId === '') challengeId = null
          const startFrom = (current - 1) * numberOfRows

          dbUtil.commonQuery('list_submitted_challenge_list_users', [startFrom, numberOfRows, challengeId, orderby],
            res, gotCount);
        }

        break;

      case appActions.adminActions.GET_CHALLENGE_LIST:
        {
          dbUtil.commonQuery('getChallengeNames', [], res);
        }

        break;

      case appActions.adminActions.RETRIEVE_PROBLEM_FOR_EDIT:
        {
          const { problem_id } = req.body;
          const problem = dbUtil.commonQueryRows('retrieve_problem', [problem_id]);
          const problemTemplates = dbUtil.commonQueryRows('retrieve_problem_templates', [problem_id]);
          const problemCases = dbUtil.commonQueryRows('retrieve_problem_cases', [problem_id, null]);
          const problemChoices = dbUtil.commonQueryRows('retrieve_problem_choices', [problem_id]);
          const problemSolutions = dbUtil.commonQueryRows('retrieve_problem_solutions', [problem_id]);

          Promise.all([problem, problemTemplates, problemCases, problemChoices, problemSolutions])
            .then(allValues => {
              res.json({
                success: true,
                result: {
                  problem: allValues[0][0], problem_templates: allValues[1][0],
                  problem_cases: allValues[2][0], problem_choices: allValues[3][0], problem_solutions: allValues[4][0]
                }
              });
            })
            .catch(error => {
              res.json({ success: false, errorMessage: codes.BAD_REQUEST });
            });
        }

        break;

      case appActions.adminActions.RETRIEVE_CHALLENGE_FOR_EDIT:
        {
          const { challenge_id } = req.body;
          const challenge = dbUtil.commonQueryRows('retrieveChallenge', [challenge_id, null]);
          const challengeProblem = dbUtil.commonQueryRows('retrieveChallengeProblem', [challenge_id]);

          Promise.all([challenge, challengeProblem])
            .then(allValues => {
              res.json({
                success: true,
                result: {
                  challenge: allValues[0][0], challengeProblem: allValues[1][0]
                }
              });
            })
            .catch(error => {
              res.json({ success: false, errorMessage: codes.BAD_REQUEST });
            });
        }

        break;

      case appActions.adminActions.UPDATE_PROBLEM:
        {
          const { problem_id, type_id, difficulty_id, areas, company_use, content, duration } = req.body;
          dbUtil.commonQuery('update_problem',
            [problem_id, type_id, difficulty_id, areas, company_use, content, duration],
            res);
        }

        break;

      case appActions.adminActions.UPDATE_CHALLENGE:
        {
          const { challenge_id, type_id, challenge_name, challenge_description, duration, inOrder, one_shot, active } = req.body;
          dbUtil.commonQuery('update_challenge',
            [challenge_id, type_id, challenge_name, challenge_description, duration, inOrder, one_shot, active],
            res);
        }

        break;

      case appActions.adminActions.UPDATE_PROBLEM_CHOICE:
        {
          const { problem_choice_id, problem_id, content, valid, language_id } = req.body;
          dbUtil.commonQuery('update_problem_choice',
            [problem_choice_id, problem_id, content, valid, language_id],
            res);
        }

        break;

      case appActions.adminActions.UPDATE_PROBLEM_TEMPLATE:
        {
          const { problem_template_id, problem_id, language_id, content } = req.body;
          dbUtil.commonQuery('update_problem_template',
            [problem_template_id, problem_id, language_id, content],
            res);
        }

        break;

      case appActions.adminActions.UPDATE_PROBLEM_SOLUTION:
        {
          const { problem_solution_id, problem_id, language_id, content } = req.body;
          dbUtil.commonQuery('update_problem_solution',
            [problem_solution_id, problem_id, language_id, content],
            res);
        }

        break;

      case appActions.adminActions.UPDATE_PROBLEM_CASE:
        {
          const { problem_cases_id, problem_id, input, output, inputVisible } = req.body;
          dbUtil.commonQuery('update_problem_case',
            [problem_cases_id, problem_id, input, output, inputVisible],
            res);
        }

        break;

      case appActions.adminActions.CREATE_CHALLENGE:
        {
          const { type_id, challenge_name, descr, duration, inOrder, one_shot, active } = req.body;
          dbUtil.commonQuery('create_challenge',
            [type_id, challenge_name, descr, duration, inOrder, one_shot, active],
            res);
        }

        break;

      case appActions.adminActions.UPDATE_CHALLENGE_PROBLEMS:
        {
          const { challenge_id, problemIds } = req.body;
          dbUtil.commonQuery('update_challenge_problems',
            [challenge_id, problemIds],
            res);
        }

        break;

      case appActions.adminActions.ADD_AREA:
        {
          const { areaName } = req.body;
          dbUtil.commonQuery('add_area',
            [areaName],
            res);
        }

        break;

      case appActions.adminActions.ADD_COMPANY:
        {
          const { companyName } = req.body;
          dbUtil.commonQuery('add_company_use',
            [companyName],
            res);
        }

        break;

      case appActions.adminActions.LIST_CHALLENGES: {
        let { filterType, filterInOrder, filterActive, filterOneShot, startFrom, numberOfRows } = req.body;
        if (filterType === 'all') filterType = null;
        startFrom = startFrom ? (startFrom - 1) * numberOfRows : null;
        const gotCount = true;
        dbUtil.commonQuery('list_challenges',
          [filterType, filterInOrder, filterActive, filterOneShot, startFrom, numberOfRows ],
          res, gotCount);
      }

        break;


      default:
        res.json({ success: false, errorMessage: codes.BAD_REQUEST });
    }
  });
}