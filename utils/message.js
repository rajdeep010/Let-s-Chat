const moment = require('moment');

function formatMessage(user, id, msg){
    let obj = {
        user, 
        msg, 
        id,
        time: moment().format('hh:mm A')
    }

    return obj;
}

module.exports = formatMessage;