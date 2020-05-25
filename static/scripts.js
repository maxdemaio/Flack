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

    // Message sent (Change to AJAX/Web Socket version)
    // Store in local storage
    document.querySelector("#new-message").onsubmit = () => {
        // Create new li for message
        const li = document.createElement('li');
        li.innerHTML = document.querySelector("#message").value;

        // Add new message to list
        document.querySelector("#posts").append(li);

        // Clear the input field and disable button again
        document.querySelector("#message").value = "";
        document.querySelector(".submit").disabled = true;

        // Stop form from submitting
        return false;
    };
});


