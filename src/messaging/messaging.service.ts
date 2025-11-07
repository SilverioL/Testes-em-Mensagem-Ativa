import { Inject, Injectable } from '@nestjs/common';
import { MessageSender } from './interfaces/message-sender.interface';

@Injectable()
export class MessagingService {
  constructor(
    @Inject('MessageSender') private readonly sender: MessageSender,
  ) {}
  findAll() {
    return `This action returns all messaging`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messaging`;
  }

  remove(id: number) {
    return `This action removes a #${id} messaging`;
  }
}
