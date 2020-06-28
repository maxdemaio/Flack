// No username / room defaults
if (!localStorage.getItem('storedUser')) {
    localStorage.setItem('storedUser', 'anonymous');
};
if (!localStorage.getItem('room')) {
    localStorage.setItem('room', 'Lounge');
};


// Load posts for room
function load(channel) {

    // Open new request to get posts
    const request = new XMLHttpRequest();
    request.open("POST", "/posts");
    request.onload = () => {
        const data = JSON.parse(request.responseText);
        data.forEach(add_post);
    };

    // Send quantity of posts to back-end
    const data = new FormData();
    data.append("channel", channel);

    // Send request
    request.send(data)
};

// Add room posts to the DOM with their contents
function add_post(contents) {

    // Create new post.
    const post = document.createElement("p");
    post.className = "post";
    post.innerHTML = contents;

    // Add post to DOM.
    document.querySelector("#display-message-section").append(post);
};


document.addEventListener("DOMContentLoaded", () => {

    // Set header to be equal to current room
    document.querySelector("#current-room").innerHTML = localStorage.getItem('room');

    // By default the button is disabled
    document.querySelector(".submit").disabled = true;

    // Enable button only if there is text in the input field
    document.querySelector(".input").onkeyup = () => {
        if (document.querySelector(".input").value.length > 0)
            document.querySelector(".submit").disabled = false;
        else
            document.querySelector(".submit").disabled = true;
    };

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Join last visited room on entering
    joinRoom(localStorage.getItem('room'));

    // Function for when websockets are connected
    socket.on('connect', () => {

        // Send message, username, and room to server
        document.querySelector("#new-message").onsubmit = () => {
            const data = new Object;
            const contents = document.querySelector("#message").value;
            data.message = contents;
            data.username = localStorage.getItem('storedUser');
            data.room = localStorage.getItem('room');
            socket.send(data);

            // Clear the input field and disable button again
            document.querySelector("#message").value = "";
            document.querySelector(".submit").disabled = true;
            document.querySelector("#message").focus();
            // Stop form from submitting
            return false;
        };
    });

    // Display incoming message from server
    socket.on("message", data => {
        const p = document.createElement('p');
        const spanUser = document.createElement('span');
        const spanMessage = document.createElement('span');
        const spanTime = document.createElement('span');
        const br = document.createElement('br');

        if (data.username) {
            spanTime.innerHTML = data.time;
            spanTime.className = "time";
            spanUser.innerHTML = data.username;
            spanUser.className = "user";
            spanMessage.innerHTML = data.message;
            spanMessage.className = "message";
            p.className = "post";
            p.innerHTML = spanUser.outerHTML + br.outerHTML + spanMessage.outerHTML + br.outerHTML + spanTime.outerHTML;

            // Append to DOM
            document.querySelector("#display-message-section").append(p);
        } else {
            printSysMsg(data.message);
        };
        
    });

    // Leave room function
    function leaveRoom(room) {
        socket.emit("leave", { "username": localStorage.getItem('storedUser'), "room": room })
    };

    // Join room function
    function joinRoom(room) {
        socket.emit("join", { "username": localStorage.getItem('storedUser'), "room": room })
        // Clear messages in chat from previous room, load new messages
        document.querySelector("#display-message-section").innerHTML = '';
        load(room);
    };

    // Room selection
    document.querySelectorAll(".select-room").forEach(p => {
        p.onclick = () => {
            let newRoom = p.innerHTML;
            room = localStorage.getItem("room");
            if (newRoom == room) {
                msg = `You are already in the ${room} room.`
                printSysMsg(msg);
            } else {
                leaveRoom(localStorage.getItem('room'));
                joinRoom(newRoom);
                localStorage.setItem('room', `${newRoom}`);
                document.querySelector("#current-room").innerHTML = localStorage.getItem('room');
            }
        };
    });

    // Add new channel to the DOM
    function add_channel(channel) {
        console.log(channel);

        // If channel already exists, alert user
        if (channel.nameExist == true) {
            alert("Channel name already exists")
        } else {
            // Add channel to room list
            const post = document.createElement("p");
            post.className = "select-room";
            post.innerHTML = channel.newChannel;

            post.onclick = () => {
                let newRoom = post.innerHTML;
                room = localStorage.getItem("room");
                if (newRoom == room) {
                    msg = `You are already in the ${room} room.`
                    printSysMsg(msg);
                } else {
                    leaveRoom(localStorage.getItem('room'));
                    joinRoom(newRoom);
                    localStorage.setItem('room', `${newRoom}`);
                    document.querySelector("#current-room").innerHTML = localStorage.getItem('room');
                };
            };

            // Add post to DOM.
            document.querySelector("#new-channels").append(post);
        };
    };

    // New room
    document.querySelector("#new-room").onclick = () => {
        var roomName = prompt("Please enter the new room's name", "Example New Room");
        if (roomName != null) {
            // Post request to our new room route on server side w/ name
            const myRequest = new XMLHttpRequest();
            myRequest.open("POST", "/newChannel");
            myRequest.onload = () => {
                // TODO append new Room to DOM (using add room function)
                const data = JSON.parse(myRequest.responseText);
                add_channel(data);
            };

            // Send new channel name to back-end
            const data = new FormData();
            data.append("new-channel", roomName);

            // Send request
            myRequest.send(data)

        };  
    };

    // Print system message
    function printSysMsg(msg) {
        const p = document.createElement("p");
        p.innerHTML = msg;
        document.querySelector("#display-message-section").append(p);
    };
});
