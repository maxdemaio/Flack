// Check if user is already signed in
// If so, redirect them to their most recently visited chat
if (localStorage.getItem('storedUser')) {
    // TODO
};

// Submit button enabling (input and submit classes)
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

    // Upon username submission, update the username for that user
    document.querySelector("#new-user").onsubmit = () => {
        const contents = document.querySelector("#username").value;
        console.log(contents);
        localStorage.setItem('storedUser', contents)

        // Clear the input field and disable button again
        document.querySelector("#message").value = "";
        document.querySelector(".submit").disabled = true;

        // Stop form from submitting
        return false;
    };
});