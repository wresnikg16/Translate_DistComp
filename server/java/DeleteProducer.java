import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.MessageProperties; 
import java.io.IOException; 
import java.util.concurrent.TimeoutException;

public class DeleteProducer {

    private final static String QUEUE_NAME = "DeleteQueue";

    public static void main(String[] argv) throws java.io.IOException {

        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");   //set different! name or IP
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        channel.queueDeclare(QUEUE_NAME, true, false, false, null);

        String message = getMessage(argv) ;
        
        channel.basicPublish("", QUEUE_NAME, 
            MessageProperties.PERSISTENT_TEXT_PLAIN,
            message.getBytes());
        System.out.println(" [x] Sent '" + message + "'");

        channel.close();
        connection.close();
    }
}