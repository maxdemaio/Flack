// No username / room defaults
if (!localStorage.getItem('storedUser')) {
    localStorage.setItem('storedUser', 'anonymous');
};
if (!localStorage.getItem('room')) {
    localStorage.setItem('room', 'Lounge');
};

// Set quantity of posts to be loaded from room CSV (Change to 100)
const quantity = 10;

// Load posts for room
function load() {

    // Open new request to get posts
    const request = new XMLHttpRequest();
    request.open("POST", "/posts");
    request.onload = () => {
        const data = JSON.parse(request.responseText);
        data.forEach(add_post);
    };

    // Send quantity of posts to back-end
    const data = new FormData();
    data.append('quantity', quantity);

    // Send request
    request.send()
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

            // Stop form from submitting
            return false;
        };
    });

    // Display incoming message from server
    socket.on("message", data => {
        const p = document.createElement('p');
        const spanUser = document.createElement('span');
        const br = document.createElement('br');
        const spanTime = document.createElement('span');

        if (data.username) {
            spanTime.innerHTML = data.time;
            spanUser.innerHTML = data.username;
            p.className = "post";
            p.innerHTML = spanUser.outerHTML + br.outerHTML + data.message
                + br.outerHTML + spanTime.outerHTML;

            // Append to DOM
            document.querySelector("#display-message-section").append(p);
        } else {
            printSysMsg(data.message);
        };
        
    });

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
            }
        };
    });

    // Leave room function
    function leaveRoom(room) {
        socket.emit("leave", { "username": localStorage.getItem('storedUser'), "room": room})
    };

    // Join room function
    function joinRoom(room) {
        socket.emit("join", { "username": localStorage.getItem('storedUser'), "room": room})
        // Clear messages in chat from previous room
        document.querySelector("#display-message-section").innerHTML = '';
        load()
        // TODO 
        // Display messages for current room
        // Append messages to display section ID
        // document.querySelector("#display-message-section")
    };

    // Print system message
    function printSysMsg(msg) {
        const p = document.createElement("p");
        p.innerHTML = msg;
        document.querySelector("#display-message-section").append(p);
    };
});
