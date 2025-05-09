import * as amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

class MessageQueue {
  private channelModel: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private normalQueue: string =
    process.env.RABBITMQ_QUEUE_NORMAL || "normal_messages";
  private urgentQueue: string =
    process.env.RABBITMQ_QUEUE_URGENT || "urgent_messages";

  async connect(): Promise<void> {
    try {
      const url = process.env.RABBITMQ_URL || "amqp://localhost";
      this.channelModel = await amqp.connect(url);
      this.channel = await this.channelModel.createChannel();

      // Declare queues with different priorities
      await this.channel.assertQueue(this.normalQueue, {durable: true});
      await this.channel.assertQueue(this.urgentQueue, {durable: true});

      console.log("Connected to RabbitMQ");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  }

  async sendMessage(
    message: any,
    priority: "normal" | "urgent"
  ): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }

    const queue = priority === "urgent" ? this.urgentQueue : this.normalQueue;

    try {
      if (this.channel) {
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
          persistent: true,
          priority: priority === "urgent" ? 10 : 1,
        });
        console.log(`Message sent to ${priority} queue`);
      }
    } catch (error) {
      console.error(`Error sending message to ${priority} queue:`, error);
      throw error;
    }
  }

  async consumeMessages(
    callback: (message: any) => Promise<void>,
    priority: "normal" | "urgent"
  ): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }

    const queue = priority === "urgent" ? this.urgentQueue : this.normalQueue;

    try {
      if (this.channel) {
        await this.channel.consume(
          queue,
          async (msg) => {
            if (msg) {
              const content = JSON.parse(msg.content.toString());
              await callback(content);
              this.channel?.ack(msg);
            }
          },
          {noAck: false}
        );
        console.log(`Consuming messages from ${priority} queue`);
      }
    } catch (error) {
      console.error(`Error consuming messages from ${priority} queue:`, error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.channelModel) {
        await this.channelModel.close();
      }
      console.log("Disconnected from RabbitMQ");
    } catch (error) {
      console.error("Error disconnecting from RabbitMQ:", error);
      throw error;
    }
  }
}

export default new MessageQueue();
