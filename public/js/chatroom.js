(function connect() {
    let socket = io.connect("https://realtime-chat-x7ff.onrender.com/")
    

    let username = document.querySelector('#username');
    let usernameBtn = document.querySelector('#usernameBtn');
    let curUsername = document.querySelector('.card-header');

    usernameBtn.addEventListener('click', e => {
        console.log(username.value);
        socket.emit('change_username', { username: username.value })
        curUsername.textContent = username.value
        username.value = ''
    })

    let message = document.querySelector('#message');
    let messageBtn = document.querySelector('#messageBtn')
    let messageList = document.querySelector('#message-list')

    messageBtn.addEventListener('click', e => {
        console.log(message.value)
        socket.emit('new_message', { message: message.value })
        message.value = ''
    })
    //
    socket.on('receive_message', data => {
        console.log(data)
        let listItem = document.createElement('li')
        listItem.textContent = data.username + " : " + data.message;
        listItem.classList.add('list-group-item');
        messageList.appendChild(listItem)
    })
    let info = document.querySelector('.info');
    message.addEventListener('keypress',e =>{
        socket.emit('typing')
    })
    socket.on('typing',data=>{
        info.textContent = data.username + "is typing ..."
        setTimeout(()=>{info.textContent=''},5000)
    })

    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(messageData => {
        let listItem = document.createElement('li');
        listItem.textContent = messageData.username + " : " + messageData.message;
        listItem.classList.add('list-group-item');
        messageList.appendChild(listItem);
    });
    socket.on('receive_message', data => {
        let messageData = {
            username: data.username,
            message: data.message
        };
    
        chatHistory.push(messageData);
    
        // บันทึกประวัติแชทใน localStorage
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    });
})();