import os

# Maximum amount of messages stored per channel
quantity = 3

# Add new message to channel delimited by newlines
with open("./channels/exampleChannel.txt", "r+") as channel:
    data = channel.read().splitlines()
    currentLength = len(data)
    
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
        channel.write("New incoming message")
        
    else:
        channel.write("This is a new line\n")
