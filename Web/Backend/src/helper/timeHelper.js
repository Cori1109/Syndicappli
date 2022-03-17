/**
 * Timer Helper file
 *
 * @package   backend/src/helper
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth
 */

var timer_functions = {
    getCurrentTime:getCurrentTime,
    getCurrentDate: getCurrentDate,
    getNextYearDate: getNextYearDate,
}

function getCurrentTime(){
    var current = new Date();
    var currentYear = current.getFullYear();
    var currentMonth = current.getMonth();
    var currentDate = current.getDate();
    var currentHour = current.getHours();
    var currentMinute = current.getMinutes();
    var currentSecond = current.getSeconds();

    if((currentMonth + 1) < 10){
        currentMonth = "0" + (currentMonth + 1)
    }

    if(currentDate < 10){
        currentDate = "0" + currentDate
    }

    if(currentHour < 10){
        currentHour = "0" + currentHour
    }

    if(currentMinute < 10){
        currentMinute = "0" + currentMinute
    }

    if(currentSecond < 10){
        currentSecond = "0" + currentSecond
    }

    return String(currentYear + "-" + currentMonth + "-" + currentDate + " " + currentHour + ":" + currentMinute + ":" + currentSecond)
}

function getCurrentDate(){
    var current = new Date();
    var currentYear = current.getFullYear();
    var currentMonth = current.getMonth();
    var currentDate = current.getDate();

    if((currentMonth + 1) < 10){
        currentMonth = "0" + (currentMonth + 1)
    }

    if(currentDate < 10){
        currentDate = "0" + currentDate
    }

    return String(currentYear + "-" + currentMonth + "-" + currentDate)
}

function getNextYearDate(){
    var current = new Date();
    var currentYear = current.getFullYear() + 1;
    var currentMonth = current.getMonth();
    var currentDate = current.getDate();

    if((currentMonth + 1) < 10){
        currentMonth = "0" + (currentMonth + 1)
    }

    if(currentDate < 10){
        currentDate = "0" + currentDate
    }

    return String(currentYear + "-" + currentMonth + "-" + currentDate)
}

module.exports = timer_functions