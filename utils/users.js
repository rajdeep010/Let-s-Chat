let users = [];

function userJoin(id, name, room){
    const user = {id, name, room};
    users.push(user);
    return user;
}

function getUser(id){
    let obj = users.find(user => user.id === id);
    return obj;
}

function roomInfo(room){
    let chatRoom = users.filter(user => user.room === room);
    return chatRoom;
}

function userLeft(id){
    const index = users.findIndex(user => user.id === id);

    if(index != -1){
        return users.splice(index,1)[0];
    }
}

module.exports = {userJoin, getUser, roomInfo, userLeft};