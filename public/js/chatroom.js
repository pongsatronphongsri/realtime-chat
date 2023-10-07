(function connect() {
    let socket = io.connect("https://realtime-chat-x7ff.onrender.com/");
    //let socket = io.connect("http://localhost:3000");
    let username = document.querySelector('#username');
    let usernameBtn = document.querySelector('#usernameBtn');
    let curUsername = document.querySelector('.card-header');
    socket.desKey = "12345678";

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
        /*try {
            // Decrypt the received message using DES
            const bytes = CryptoJS.DES.decrypt(data.message, socket.desKey);
            const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
    
            if (decryptedMessage !== null && decryptedMessage !== undefined) {
                let listItem = document.createElement('li');
                listItem.textContent = data.username + " : " + decryptedMessage;
                listItem.classList.add('list-group-item');
                messageList.appendChild(listItem);
              
                
            } else {
                console.error("Decryption resulted in null or undefined message.");
            }
        } catch (error) {
            console.error("Error decrypting message:", error);
        }*/
        try {
            // Display the encrypted message
            let encryptedListItem = document.createElement('li');
            encryptedListItem.textContent = data.username + " (Encrypted): " + data.message;
            encryptedListItem.classList.add('list-group-item');
            document.getElementById('encrypted-message-list').appendChild(encryptedListItem);
    
            // Decrypt the received message using DES
            const bytes = CryptoJS.DES.decrypt(data.message, socket.desKey);
            const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
    
            if (decryptedMessage !== null && decryptedMessage !== undefined) {
                // Display the decrypted message
                let decryptedListItem = document.createElement('li');
                decryptedListItem.textContent = data.username + " (Decrypted): " + decryptedMessage;
                decryptedListItem.classList.add('list-group-item');
                messageList.appendChild(decryptedListItem);
            } else {
                console.error("Decryption resulted in null or undefined message.");
            }
        } catch (error) {
            console.error("Error decrypting message:", error);
        }
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