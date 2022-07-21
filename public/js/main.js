let input = document.getElementById('msg');
let button = document.getElementById('button');
let room = document.getElementById("roomname");
let msgContainer = document.querySelector('.msg-container');
let userList = document.querySelector('.users');

input.focus();

const {username, roomname} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

room.innerText = roomname;

socket.emit('new-user-join', {username, roomname});


// message getting from server end
socket.on('message', data => {
    // console.log(data);

    addOthersMessage(data);

    msgContainer.scrollTop = msgContainer.scrollHeight;
})

socket.on('roomUpdate', data => {
    updateUsersName(data);
})


button.addEventListener('click', (e) => {
    e.preventDefault();

    let msg = input.value;
    
    if(msg != ''){
        socket.emit('chatMessage', msg);
        input. value = '';
        input.focus();
    }
})

document.addEventListener('keyup', (e) => {

    if(e.key == 'Enter')
    {
        e.preventDefault();

        let msg = input.value;
        
        if(msg != ''){
            socket.emit('chatMessage', msg);
            input. value = '';
            input.focus();
        }
    }
})

function addOthersMessage(data) {
    let child = document.createElement('div');
    // console.log(data);
    child.classList.add('message');

    if(data.id == socket.id){
        child.classList.add('right');
        child.innerHTML = `<h5>You :</h5><span>${data.msg}</span>`;
    }

    else if(data.id == "00"){
        child.classList.add('middle');
        child.innerHTML = `<h5>Chat Bot :</h5><span>${data.msg}</span>`;
    }

    else{
        child.classList.add('left');
        child.innerHTML = `<h5>${data.user} :</h5><span>${data.msg}</span>`;
    }

    console.log(child);
    msgContainer.appendChild(child);
}

function updateUsersName(users){
    // console.log(users);
    // userList.innerHTML = `${users.map(user => `<li>${users.name}</li>`).join('')}`;

    for(var i = 0; i < users.length; i++){
        let curr = users[i];
        let child = document.createElement('li');
        child.innerHTML = `<i class="fas fa-angle-right"></i> ${curr.name}`;
        userList.appendChild(child);
    }
}

/* <div class="message right">
    <h5>Rajdeep :</h5>
    <span>Hello my name is rajdeep</span>
</div> */
