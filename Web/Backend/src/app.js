/**
 * Init file
 *
 * @package    src
 * @author     Taras Hryts <streaming9663@gmail.com>
 * @copyright  2020 Say Digital Company
 * @license    Turing License
 * @version    2.0
 * @link       https://turing.ly
 */

var express = require('express')
var path = require('path')
var cors = require('cors')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var bodyParser = require('body-parser')
const dotenv = require('dotenv')
var apiRouter = require('./routes/index')
const cron = require("node-cron");
var authMiddleware = require('./middleware/auth-middleware')
const { ValidationError } = require('express-validation')
const orderModel = require('./models/web/admin/order-model')
dotenv.config()
const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, '../public/upload')))
app.use(express.static(path.join(__dirname, 'assets')))
app.set('views', path.join(__dirname, 'views'))
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));

app.use('/api', apiRouter)

app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(200).json({
            'status': 200,
            'message': 'Please be sure to fill all fields'
        })
    }

    return res.status(500).json(err)
})

cron.schedule("0 9 * * *", function() {
    console.log("running a task every minute");
    orderModel.getPendingOrderList().then((data) =>{
        orderModel.createChargeList(data)
    }).catch((err) =>{

    })
});


module.exports = app
