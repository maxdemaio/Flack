import os, settings

from time import localtime, strftime
from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit, send, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


# Chat posts (Limit to 100)
myRooms = []
for file in os.listdir("./channels"):
    myRooms.append(file[:-4])

@app.route("/")
def index():
    """ Homepage """
    return render_template("index.html")

@app.route("/chat")
def chat():
    """ Chat """
    return render_template("chat.html", rooms=myRooms)

@app.route("/posts", methods=["POST"])
def posts():
    pass
    """ AJAX route that obtains posts for chat room """
    
    # Each room will have a list of posts which we will read in
    # We will populate the empty list and fetch them for the client here
    # Read from the text file associated with room  
    # NOTE each line has to be ended with a new line, or else the list will be empty
    
    # Get channel from client
    channel = request.form.get("channel")
    print(f"{channel}.txt")

    # Populate list of posts
    with open(f"./channels/{channel}.txt", "r") as channel:
        data = channel.read().splitlines()
        print(data)

    # Return list of posts
    return jsonify(data)

@app.route("/newChannel", methods=["POST"])
def newChannel():
    """ Create a new room """

    newChannel = request.form.get("new-channel")
    data = {}
    nameExist = False

    # Check if name doesn't already exist
    for file in os.listdir("./channels"):
        fileName = file[:-4].lower()
        print(fileName)
        if newChannel.lower() == fileName:
            # If channel already exists, change boolean variable for JSON
            nameExist = True

    if nameExist == False:
        f = open(f"./channels/{newChannel}.txt", "w+")
        f.close()
        data["newChannel"] = newChannel
        data["nameExist"] = nameExist
    else:
        data["nameExist"] = nameExist
    
    print(data)
    return jsonify(data)

## Socket IO event bucket handlers
@socketio.on("message")
def message(data):
    """ Broadcast message, username, and time """
    """ Store message related to room in a text file with the name of that room """
    
    #TODO
    # escape user messages so things like \n \t are ommitted
    # add user info to message 
    channel = data["room"]
    currentTime = strftime('%b-%d %I:%M%p', localtime())

    # Maximum amount of messages stored per channel
    quantity = 100

    # TODO store each as a JSON object rather and delimit by newlines
    # Add new message to channel delimited by newlines
    """
    <span class="username">xyz</span> <span class="message">xyz</span> <span class="time">xyz</span>
    """
    with open(f"./channels/{channel}.txt", "r+") as channel:
        channelData = channel.read().splitlines()
        currentLength = len(channelData)

        # Check if maxiumum amount messages reached
        if currentLength > quantity:
            # Recreate file and pop first element
            channel.seek(0)
            newChannel = channel.readlines()[1:]
            print(newChannel)

            channel.seek(0)
            for line in newChannel:
                channel.write(line)
            channel.truncate()
            channel.write("<span class='user'>" + data["username"] + "</span>" + "<br>" +
                          "<span class='message'>" + data["message"] + "</span>" + "<br>" +
                          "<span class='time'>" + currentTime + "</span>" + "\n")

        else:
            channel.write("<span class='user'>" + data["username"] + "</span>" + "<br>" +
                          "<span class='message'>" + data["message"] + "</span>" + "<br>" +
                          "<span class='time'>" + currentTime + "</span>" + "\n")
            
    print(data)
    send({"message": data["message"], "username": data["username"], 
    "time": currentTime, "room": data["room"]}, room=data["room"])

@socketio.on('join')
def on_join(data):
    """ Upon join (Info received from client), update active users """
    username = data['username']
    room = data['room']
    join_room(room)
    send({"message": username + ' has entered the ' + room + ' room.', "room": room}, room=room)

@socketio.on('leave')
def on_leave(data):
    """ Upon leave (Info received from client), update active users """
    username = data['username']
    room = data['room']
    leave_room(room)
    send({"message": username + ' has left the ' + room + ' room.', "room": room}, room=room)


if __name__ == "__main__":
    socketio.run(app, debug=True)
