import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmExModule } from 'src/config/typeorm_ex/typeorm_ex.module';
import { ChatMessageRepository } from './chat_messages/chat_messages.repository';
import { ChatRoomRepository } from './chat_rooms/chat_rooms.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ChatMessageRepository, ChatRoomRepository]),
  ],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
