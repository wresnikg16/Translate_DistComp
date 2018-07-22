import pika
import sqlite3
from websocket import create_connection

print("started python worker")

# define connection which is located at "localhost"
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# define channel, in this case named "findQueue"
channel.queue_declare(queue='findQueue')

# connect to db and create a cursor
conn = sqlite3.connect('./db/dictionary.db')
c = conn.cursor()

# define method to search for occurrence in db
def get_entry(search_word):
    with conn:
        c.execute("SELECT * FROM translate WHERE german=:search OR english=:search", {'search': search_word, 'search': search_word})
        result_tpl = c.fetchone()
        if result_tpl is not None:
            result = list(result_tpl)
        else:
            result = None 
    return result

# create method which will be called at receiving new message in findQueue
def callback(ch, method, properties, body):
    search_word = body.decode("utf-8")
    print(f' [x] Received {search_word}')
    result = get_entry(search_word)
    if result is not None:
        german = result[0]
        english = result[1]
        print(f' [x] Worker found german: {german} english {english}')
        ws = create_connection("ws://localhost:8082")
        ws.send(f'german: {german} english {english}')
        print(" [x] Sent Message to Websocket")
        response =  ws.recv()
        print(" [x] Received '%s'" % response)
        ws.close()
        print(" [x] Connection to Websocket closed")
    else:
        print(f" [x] Worker couldn't find {search_word}")
        ws = create_connection("ws://localhost:8082")
        ws.send(f"couldn't find {search_word} in db")
        print(" [x] Sent Message to Websocket")
        response =  ws.recv()
        print(" [x] Received '%s'" % response)
        ws.close()
        print(" [x] Connection to Websocket closed")

channel.basic_consume(callback,
                      queue='findQueue',
                      no_ack=True)

print(' [*] Waiting for messages in findQueue. To exit press CTRL+C')
channel.start_consuming()