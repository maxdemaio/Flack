import os

channel = open("./channels/exampleChannel.txt", "w")

for i in range(10):
    channel.write("This is line %d\r\n" % (i+1))

channel.close()
