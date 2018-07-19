import pika

print("started python worker")

# define connection which is located at "localhost"
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# define channel, in this case named "hello"
channel.queue_declare(queue='findQueue')

# create method which will be called at receiving new message
def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)
    search_word = body.decode("utf-8")
    print(search_word)

	# hint: https://stackoverflow.com/questions/31529421/weird-output-value-bvalue-r-n-python-serial-read
    # print(" [x] Received %r" % body.decode('utf-8'))

# receive / "consume" message => "consumer"
# take care (!) -> no_ack -> worker die -> message not handled correctly -> message will be lost
channel.basic_consume(callback,
                      queue='findQueue',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()