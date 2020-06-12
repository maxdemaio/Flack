import os

with open("./channels/exampleChannel.txt", "r") as channel:
    data = channel.read().splitlines()
    print(data)

  
