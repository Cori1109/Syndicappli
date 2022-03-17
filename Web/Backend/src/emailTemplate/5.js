const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    url: process.env.DEVELOPMENT_ENDPOINT + '/login',
    body: `
        <html>
            <body>
                <div style="display: block;padding-top: 50px;padding-left: 100px;padding-right: 100px;padding-bottom: 100px;">
                    <div style="width: 100%;text-align: center;margin-top: 20px;">
                        <span style="font-size: 12px;font-weight: 500;">Please click the bellow button to login. </span>
                    </div>
                    <div style="width: 100%;text-align: center;margin-top: 20px;">
                    <span style="font-size: 12px;font-weight: 500;"><a href="`,
body1:`">Click here to Login</a> </span>
                    </div>
                    <div style="width: 100%;text-align: center;margin-top: 20px;">
                        <span style="font-size: 12px;font-weight: 500;">Your Password is: <b>`,

    body2:`</b> </span>
                    </div>
                </div>
            </body>
        </html>`
}