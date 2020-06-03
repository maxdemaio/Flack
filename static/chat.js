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
// Do so with handlebar.js
function add_post(contents) {

    // Create new post.
    const post = document.createElement("div");
    post.className = "post";
    post.innerHTML = contents;

    // Add post to DOM.
    document.querySelector("#posts").append(post);
};


// Submit button enabling (input and submit classes)
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

    // Web Socket version
    // Message sent (Change to AJAX/Web Socket version)
    // Store in local storage

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);


    // When connected, configure submit button
    socket.on('connect', () => {

        document.querySelector("#new-message").onsubmit = () => {
            const contents = document.querySelector("#message").value;
            console.log(contents);
            socket.emit("submit message", {"contents": contents});

            // Clear the input field and disable button again
            document.querySelector("#message").value = "";
            document.querySelector(".submit").disabled = true;

            // Stop form from submitting
            return false;
        };
    });

    // When a new message is broadcasted, add to the unordered list
    socket.on("send message", data => {
        const li = document.createElement("li");
        li.innerHTML = `${data.contents}`;
        document.querySelector("#example").append(li);
    });
});


