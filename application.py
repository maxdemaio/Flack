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
    # """ AJAX route that obtains posts """
    # message = (request.form.get("start")
    #     return jsonify(message)
