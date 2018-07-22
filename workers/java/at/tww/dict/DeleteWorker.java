package at.tww.dict;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DeleteWorker {

    private final static String QUEUE_NAME = "deleteQueue";

    private static void delete(String word) {

        String stmt = "DELETE FROM translate WHERE german = ? OR english = ?";
        java.sql.Connection sqlConnection = connect();

        try {
            java.sql.PreparedStatement ps = sqlConnection.prepareStatement(stmt);
            ps.setString(1, word);
            ps.setString(2, word);
            if (ps.executeUpdate() > 0){
                System.out.println(" [x] '" + word + "' deleted");
            }else {
                System.out.println(" [x] '" + word + "' not found in DB");
            }
        }catch (SQLException e){
            e.printStackTrace();
        }finally {
            try {
                if (sqlConnection != null) {
                    sqlConnection.close();
                    System.out.println("sqlConnection closed");
                }
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
            }
        }
    }

    private static java.sql.Connection connect(){
        java.sql.Connection sqlConnection = null;

        // SQLite connection string
        String url = "jdbc:sqlite:./db/dictionary.db";
        try {
            sqlConnection = DriverManager.getConnection(url);
            if (sqlConnection != null){
                System.out.println("Connection to SQLite has been established.");
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return sqlConnection;
    }

    public static void main(String[] argv) throws Exception {

        // register the driver
        DriverManager.registerDriver(new org.sqlite.JDBC());

        // create ConnectionFactory for RabbitMQ and connect to channel
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        com.rabbitmq.client.Connection rMQconnection = factory.newConnection();
        Channel channel = rMQconnection.createChannel();
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        System.out.println(" [*] Waiting for DELETE-messages. To exit press CTRL+C");

        Consumer consumer = new DefaultConsumer(channel) {

            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {

                String message = new String(body, "UTF-8");
                System.out.println(" [x] Received DELETE-message '" + message + "'");

                try{
                    delete(message);
                } finally {
                    channel.basicAck(envelope.getDeliveryTag(), false);
                }
            }
        };
        boolean autoAck = false;
        channel.basicConsume(QUEUE_NAME, autoAck, consumer);
    }

}