package at.tww.dict;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DeleteWorker {

  private final static String QUEUE_NAME = "deleteQueue";
  private final static String TABLE_NAME = "translate"; 

  public static void main(String[] argv) throws Exception {
    
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    //factory.setPort(15672);

    Connection rMQconnection = factory.newConnection();
    Channel channel = rMQconnection.createChannel();

    channel.queueDeclare(QUEUE_NAME, false, false, false, null);
    
    System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

    Consumer consumer = new DefaultConsumer(channel) {

      @Override
      public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
        
        String message = new String(body, "UTF-8");     
        System.out.println(" [x] Received '" + message + "'");

        try{
          // ändern!
          System.out.println("speichere Daten in DB");
          // delete(TABLE_NAME, message);
        } finally {
            System.out.println(" [x] Done"); 
            channel.basicAck(envelope.getDeliveryTag(), false); 
        }
      }
    };
    boolean autoAck = false; 

    channel.basicConsume(QUEUE_NAME, autoAck, consumer);
  }

  private static void delete(java.sql.Connection sqlConnection, String tablename, String word) {
    PreparedStatement ps = null; 
    try {
      String stmt = "DELETE FROM ? WHERE german = ? OR english = ?"; 
      ps = sqlConnection.prepareStatement(stmt);
      ps.setString(1, tablename); 
      ps.setString(2, word);
      ps.setString(3, word); 
      ps.executeUpdate(); 
    }catch (SQLException e){
      e.printStackTrace();
    }
  }

}