import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { AmqpConnectionManager, ChannelWrapper, connect } from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private isInitialized = false;
  private initPromise: Promise<void>;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initialize();
  }

    async waitForInit(): Promise<void> {
    if (!this.isInitialized) {
      await this.initPromise;
    }
  }

  private async initialize() {
    const url = this.configService.get<string>('RABBITMQ_URL');
    this.connection = connect([url]);

    this.channelWrapper = this.connection.createChannel({
      json: true, // Tự động parse JSON
      setup: (channel: amqp.Channel) => {
        return channel.assertQueue('my_queue', { durable: true });
      },
    });

    await this.channelWrapper.waitForConnect();
    this.isInitialized = true;
    console.log('RabbitMQ connected!');
  }

  // Gửi message vào queue
  async sendToQueue(queue: string, message: any) {
    if (!this.isInitialized) {
      throw new Error('RabbitMQ not initialized');
    }

    try {
      await this.channelWrapper.sendToQueue(queue, message);
      console.log(`Message sent to ${queue}:`, message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Nhận message từ queue
async consume(queue: string, callback: (msg: any) => void) {
  await this.waitForInit();
  
  try {
    await this.channelWrapper.addSetup(async (channel: amqp.Channel) => {
      // Khai báo queue trước khi consume
      await channel.assertQueue(queue, {
        durable: true,  // Giữ queue khi server restart
        arguments: {
          'x-queue-type': 'classic' // Hoặc 'quorum' nếu dùng RabbitMQ 3.8+
        }
      });
      
      return channel.consume(queue, (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          callback(content);
          channel.ack(message);
        }
      });
    });
  } catch (error) {
    console.error(`Error setting up consumer for queue ${queue}:`, error);
    throw error;
  }
}
}