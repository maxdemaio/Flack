// If the user tries to log-in without a username, default to anonymous
if (!localStorage.getItem('storedUser')) {
    localStorage.setItem('storedUser', 'anonymous')
};

// Save last visited channel for user (default general)
if (!localStorage.getItem('last-channel')) {
    localStorage.setItem('last-channel', "general")
};

// Set quantity of posts to be loaded (Change to 100)
const quantity = 10;

// Load posts
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

// Add post to the DOM with its contents
function add_post(contents) {

    // Create new post.
    const post = document.createElement("div");
    post.className = "post";
    post.innerHTML = contents;

    // Add post to DOM.
    document.querySelector("#posts").append(post);
};


document.addEventListener("DOMContentLoaded", () => {
    
    // Load posts
    load()

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

    // Function for when websockets are connected
    socket.on('connect', () => {

        // User has submitted message, send to server with username
        document.querySelector("#new-message").onsubmit = () => {
            const contents = document.querySelector("#message").value;
            socket.send([contents, localStorage.getItem('storedUser')]);

            // Clear the input field and disable button again
            document.querySelector("#message").value = "";
            document.querySelector(".submit").disabled = true;

            // Stop form from submitting
            return false;
        };
    });

    // Response from server message bucket
    socket.on("message", data => {
        const p = document.createElement('p');
        const br = document.createElement('br');
        p.innerHTML = data;

        // Append to DOM
        document.querySelector("#display-message-section").append(p)
    });

});


