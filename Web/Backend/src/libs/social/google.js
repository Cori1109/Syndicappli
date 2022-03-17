/**
 * Google Api lib file
 * 
 * @package   backend/src/services
 * @author    Taras Hryts <dong@turingai.net>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth/
 */

const { google } = require('googleapis')

var googleApi = {
  urlGoogle: urlGoogle,
  getGoogleAccount: getGoogleAccount
}
const googleConfig = {
  clientId: '934714364520-8crnele5d5rt41j2vua6sfh4s5d64bon.apps.googleusercontent.com', 
  clientSecret: '6T9aolPVC0nNlZASM6RCrIPA', 
  redirect: 'http://localhost:3001/api/social-auth/google/callback'
};

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email'
];

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
}

function urlGoogle() {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
}

function getGoogleAccount(code) {
  const auth = createConnection();
  const data = auth.getToken(code);
  const tokens = data.tokens;
  auth.setCredentials(tokens);
  const plus = getGooglePlusApi(auth);
  const me = plus.people.get({ userId: 'me' });
  const userGoogleId = me.data.id;
  const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
  return {
    id: userGoogleId,
    email: userGoogleEmail,
    tokens: tokens,
  };
}

module.exports = googleApi
