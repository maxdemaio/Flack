import os, settings

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Chat posts (Limit to 100)
posts = []

@app.route("/")
def index():
    """ Homepage """
    return render_template("index.html")

@app.route("/chat")
def chat():
    """ Chat """
    return render_template("chat.html")

@app.route("/posts", methods=["POST"])
def posts():
    pass
    """ AJAX route that obtains posts for chat room """
    
    # Each room will have a list of posts which we will read in
    # We will populate the empty list and fetch them for the client here
    # Read from the text file associated with room
    
    # Get amount of posts to be loaded
    quantity = int(request.form.get("quantity") or 10)

    # Populate list of posts
    data = [] 

    # Display 100 posts
    for i in range(0, quantity):
        data.append(f"Post #{i + 1}")

    # Return list of posts
    return jsonify(data)
