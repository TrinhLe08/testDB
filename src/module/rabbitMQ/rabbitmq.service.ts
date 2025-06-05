import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { AmqpConnectionManager, ChannelWrapper, connect } from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService {
  private connection: AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  constructor(private readonly configService: ConfigService) { }

  async onModuleInit() {
    await this.initialize();
  }

  private initialize() {
    // Sử dụng URL từ CloudAMQP
    const url = this.configService.get<string>('RABBITMQ_URL');
    
    this.connection = connect([url]);
    
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: amqp.Channel) => {
        return channel.assertQueue('my_queue', { durable: true });
      },
    });
  }

  async sendToQueue(queue: string, message: any) {
    try {
      await this.channelWrapper.sendToQueue(queue, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async consume(queue: string, callback: (msg: any) => void) {
    try {
      await this.channelWrapper.addSetup((channel: amqp.Channel) => {
        return channel.consume(queue, (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            callback(content);
            channel.ack(message);
          }
        });
      });
    } catch (error) {
      console.error('Error consuming message:', error);
    }
  }
}