import com.rabbitmq.client.*;

import java.io.IOException;

public class DeleteConsumer {

  private final static String QUEUE_NAME = "DeleteQueue";

  public static void main(String[] argv) throws Exception {
    
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    Connection connection = factory.newConnection();
    Channel channel = connection.createChannel();

    channel.queueDeclare(QUEUE_NAME, true, false, false, null);
    System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

    Consumer consumer = new DefaultConsumer(channel) {
      @Override
      public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
        
        String message = new String(body, "UTF-8");     
        System.out.println(" [x] Received '" + message + "'");

        try{
          doWork(message); 
        } finally {
            System.out.println(" [x] Done"); 
            channel.basicAck(envelope.getDeliveryTag(), false); 
        }
      }
    };
    boolean autoAck = false; 

    channel.basicConsume(QUEUE_NAME, autoAck, consumer);
  }

  //change it! 
  private static void doWork(String task) {
    for (char ch : task.toCharArray()) {
      if (ch == '.') {
        try {
          Thread.sleep(1000);
        } catch (InterruptedException _ignored) {
          Thread.currentThread().interrupt();
        }
      }
    }
  }

}