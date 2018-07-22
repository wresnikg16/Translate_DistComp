import pika
import sqlite3

print("started python worker")

# define connection which is located at "localhost"
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# define channel, in this case named "findQueue"
channel.queue_declare(queue='findQueue')

# connect to db and create a cursor
conn = sqlite3.connect('./db/dictionary.db')
c = conn.cursor()

# define method to search for occurence in db
def get_entry(search_word):
    with conn:
        c.execute("SELECT * FROM translate WHERE german=:search OR english=:search", {'search': search_word, 'search': search_word})
        result = c.fetchone()
    return result

# create method which will be called at receiving new message in findQueue
def callback(ch, method, properties, body):
    search_word = body.decode("utf-8")
    print(f' [x] Received {search_word}')
    result = get_entry(search_word)
    print(result)

	# hint: https://stackoverflow.com/questions/31529421/weird-output-value-bvalue-r-n-python-serial-read
    # print(" [x] Received %r" % body.decode('utf-8'))

# receive / "consume" message => "consumer"
# take care (!) -> no_ack -> worker die -> message not handled correctly -> message will be lost
channel.basic_consume(callback,
                      queue='findQueue',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()