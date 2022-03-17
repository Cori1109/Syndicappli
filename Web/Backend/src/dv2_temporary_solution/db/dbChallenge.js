const FormData = require('form-data');
const axios = require('axios');
const dbUtil = require('../utilities/dbUtil');

const DEFAULT_COMPILER_URL = 'https://rextester.com/rundotnet/api';

function getSubmitedChallengeList({ page, limit, challenge_id, orderby, userId }, callback) {
  page = Math.max(page || 1, 1);
  limit = Math.min(limit || 10, 50);
  let start = (page - 1) * limit;
  let params = [];
  let sqlstr = `
            SELECT ch.*, CASE WHEN user.full_name IS NOT NULL THEN user.full_name ELSE user.email END as name, user.id AS id
            FROM dv2_challenge_submit ch LEFT JOIN user_list_v4 user ON user.id = ch.user_id
            WHERE 1`;

  if (challenge_id) {
    sqlstr += ` and challenge_id = ?`;
    params.push(challenge_id);
  }
  if (userId) {
    sqlstr += ` and user.id = ?`;
    params.push(userId);
  }

  switch (orderby) {
    case "top-challenge-score":
      sqlstr += ` ORDER BY total_score_by_problem DESC`;
      break;
    case "top-test-cases-score":
      sqlstr += ` ORDER BY total_score_by_cases DESC`;
      break;
    default:
      sqlstr += ` ORDER BY submit_time DESC`;
      break;
  }


  let sqlCount = `SELECT count(*) as total FROM (${sqlstr}) tbl`;
  let sqlRows = ''
  if (start && limit) {
    sqlRows = `SELECT * FROM (${sqlstr}) tbl limit ${start},${limit}`;
  } else {
    sqlRows = `SELECT * FROM (${sqlstr}) tbl`;
  }
  dbUtil.executeSQL(sqlCount, params)
    .then(function (row) {
      dbUtil.executeSQL(sqlRows, params)
        .then(function (rows) {
          callback(null, {
            count: row[0].total,
            rows: rows || []
          });
        })
        .catch(function (error) {
          callback(error, {});
        });

    })
    .catch(function (error) {
      callback(error, {});
    });
}

function submitSolution(user_id, challenge_id, problem_id, programming_language_id, content, codeLog, callback) {
  /* This is for submitting solution for code problem */
  const sleep = (ms) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  const runSubmit = async(callback) => {
    /* 1. Add submit problem content to DB */
    var sqlstr = `CALL add_submit_problem(?,?,?,?,?,?);`;
    let submitResult = await dbUtil.executeSQL(sqlstr, [user_id, challenge_id, problem_id, programming_language_id, content, codeLog]).catch(error => {});
    if(!submitResult || submitResult.length === 0 || submitResult[0].length === 0) {
      callback('Error submiting solution', null);
      return;
    }

    let problem_submit_id = submitResult[0][0].problem_submit_id;
    /* 2. Run through our test cases */
    /* 2.1 Get all cases */
    sqlstr = `CALL retrieve_problem_cases(?,?);`;
    let allCases = await dbUtil.executeSQL(sqlstr, [problem_id, null]).catch(error => {});
    if(!allCases || allCases.length === 0 || allCases[0].length === 0) {
      callback(null, problem_submit_id); /* If there is no test cases, its our fault. */
      return;
    }
    /* 2.2 Get compiler Options */
    sqlstr = `CALL retrieve_compiler_option(?);`;
    let compilerOptions = await dbUtil.executeSQL(sqlstr, [programming_language_id]).catch(error => {});
    let data = new FormData();

    let compilerURL = DEFAULT_COMPILER_URL;
    if(compilerOptions && compilerOptions[0].length > 0) {
      compilerURL = compilerOptions[0][0].compile_url;
      compilerOptions[0].forEach(c => {
        if(c.compile_key && c.compile_value) data.append(c.compile_key, c.compile_value);
      });
    }

    let testCasesResult = {};
    let successCases = 0;
    /* 2.2 Now run first case test to check if compile error */
    let firstCase = allCases[0][0];
    data.append('Program', content);
    if(firstCase.input) data.append('Input', firstCase.input);

    let firstTest = await axios.post(compilerURL, data, { headers: data.getHeaders() });
    if(!firstTest || !firstTest.data) {
      callback(null, 'Our system will collect testing result later on.'); /* If cannot connect to compiler, its our fault. */
      return;
    }

    /* Compiler Error */
    firstTest = firstTest.data;
    if(firstTest.Errors) {
      /* Make up the result */
      let result = {
        'Compiler Error': firstTest.Errors,
        'Stats': firstTest.Stats,
        'Final Result': `0/${allCases[0].length} (0%)`
      }

      /* 2.3 Update score */
      sqlstr = `CALL update_problem_submit_code_score(?,?,?);`;
      await dbUtil.executeSQL(sqlstr, [problem_submit_id, successCases, allCases[0].length]).catch(error => {});
      /* 2.4 Update challenge score */
      sqlstr = `CALL calculate_challenge_case_score(?,?);`;
      await dbUtil.executeSQL(sqlstr,[user_id, challenge_id]).catch(error => {});
      /* No test cases needed */
      callback(null, result);
      return;
    }
    else {
      /* No Error */
      if(firstTest.Result && firstCase.output === firstTest.Result.replace(/\r/g,'').replace(/\n/g,'')) {
        successCases++;
        testCasesResult['Test 1'] = 'Success';
      }
      else testCasesResult['Test 1'] = 'Fail';

      testCasesResult['Test 1 Stats'] = firstTest.Stats;
      /* Extract absolute running time */
      let absoluteString = 'absolute running time: ';
      let index = firstTest.Stats.indexOf(absoluteString);
      if(index != -1) {
        index += absoluteString.length;
        let indexNextSec = firstTest.Stats.indexOf(' sec', index);
        if(indexNextSec != -1) {
          let value = firstTest.Stats.substring(index, indexNextSec);
          if(value && value.length > 0) {
            value = value.replace(',','.');
            /* Update the execution time */
            sqlstr = `CALL add_execution_time(?,?,?);`;
            await dbUtil.executeSQL(sqlstr, [problem_submit_id, 0, value]);
          }
        }
      }
    }

    /* No compile error, continue for the rest of cases */
    /* Do not request too fast on rextester it will block */
    /* Quick implementation - We will use our own server. This rex doesn't allow multiple inputs at one run also */

    for(let i = 1; i < allCases[0].length; i++) {
      let aCase = allCases[0][i];
      /* It seem the FormData must be re-build the whole */
      let data = new FormData();

      let compilerURL = DEFAULT_COMPILER_URL;
      if(compilerOptions && compilerOptions[0].length > 0) {
        compilerURL = compilerOptions[0][0].compile_url;
        compilerOptions[0].forEach(c => {
          if(c.compile_key && c.compile_value) data.append(c.compile_key, c.compile_value);
        });
      }

      data.append('Program', content);
      data.append('Input', aCase.input);
      await sleep(2000); /* not too fast */
      let test = await axios.post(compilerURL, data, { headers: data.getHeaders() });
      if(!test || !test.data) {
        testCasesResult[`Test ${i+1}`] = 'Pending...';
      }
      else {
        test = test.data;
        if(test.Result && aCase.output === test.Result.replace(/\r/g,'').replace(/\n/g,'')) {
          successCases++;
          testCasesResult[`Test ${i+1}`] = 'Success';
        }
        else testCasesResult[`Test ${i+1}`] = 'Fail';

        testCasesResult[`Test ${i+1} Stats`] = test.Stats;
        /* Extract absolute running time */
        let absoluteString = 'absolute running time: ';
        let index = firstTest.Stats.indexOf(absoluteString);
        if(index != -1) {
          index += absoluteString.length;
          let indexNextSec = firstTest.Stats.indexOf(' sec', index);
          if(indexNextSec != -1) {
            let value = firstTest.Stats.substring(index, indexNextSec);
            if(value && value.length > 0) {
              value = value.replace(',','.');
              /* Update the execution time */
              sqlstr = `CALL add_execution_time(?,?,?);`;
              await dbUtil.executeSQL(sqlstr, [problem_submit_id, i, value]);
            }
          }
        }
      }
    }

    /* Final */
    testCasesResult['Final Result'] = `${successCases}/${allCases[0].length} (${successCases/allCases[0].length*100}%)`;
    /* For this version, we didn't store the execution time of each test yet */
    /* 2.3 Update score */
    sqlstr = `CALL update_problem_submit_code_score(?,?,?);`;
    await dbUtil.executeSQL(sqlstr, [problem_submit_id, successCases, allCases[0].length]).catch(error => {});
    /* 2.4 Update challenge score */
    sqlstr = `CALL calculate_challenge_case_score(?,?);`;
    await dbUtil.executeSQL(sqlstr,[user_id, challenge_id]).catch(error => {});

    /* Return */
    callback(null, testCasesResult);
  }

  runSubmit(callback);
}

function submitChoices(user_id, challenge_id, problem_id, answer, callback) {

  const runSubmit = async(callback) => {

    /* 1. Check score */
    const problemChoices = await dbUtil.commonQueryRows('retrieve_problem_choices',[problem_id]);
      /* Answer must be sort by problem_choice_id for easy to check */
    const validAnswer = problemChoices[0].filter(c => c.valid === 1).map(c => c.problem_choice_id).join(',');
    const score = validAnswer === answer ? 1 : 0;

    /* 2. Add submit problem content to DB */
    var sqlstr = `CALL add_submit_problem_type_choice(?,?,?,?,?);`;
    let submitResult = await dbUtil.executeSQL(sqlstr, [user_id, challenge_id, problem_id, answer, score]).catch(error => {});
    if(!submitResult || submitResult.length === 0 || submitResult[0].length === 0) {
      callback('Error submiting answer', null);
      return;
    }

    /* 2.4 Update challenge score */
    sqlstr = `CALL calculate_challenge_case_score(?,?);`;
    await dbUtil.executeSQL(sqlstr,[user_id, challenge_id]).catch(error => {});

    /* Return */
    callback(null, submitResult);
  }

  runSubmit(callback);
}

const dbChallenge = {
  getSubmitedChallengeList,
  submitSolution,
  submitChoices
}

module.exports = dbChallenge;