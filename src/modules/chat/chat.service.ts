import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatMessageRepository } from './chat_messages/chat_messages.repository';
import { ChatRoomRepository } from './chat_rooms/chat_rooms.repository';
import { ReadRoomDto } from './chat_rooms/dto/read_room.dto';
import { ReadMessageDto } from './chat_messages/dto/read_message.dto';
import { CreateMessageDto } from './chat_messages/dto/create_message.dto';
import { FindMessageDto } from './chat_messages/dto/find_message.dto';
import { CreateRoomDto } from './chat_rooms/dto/create_room.dto';
import { UpdateRoomDto } from './chat_rooms/dto/update_room.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        private readonly chatMessageRepository: ChatMessageRepository,
        private readonly chatRoomRepository: ChatRoomRepository,
    ) {}

    async createRoom(roomData: CreateRoomDto): Promise<ReadRoomDto> {
        try {
            const result: ReadRoomDto = await this.chatRoomRepository.createRoom(roomData.room_name);
            return result;
        } catch (err) {
            console.error('createRoom Error:', err);
        }
    }
    
    async findRoom(roomData: UpdateRoomDto): Promise<ReadRoomDto[]> {
        try {
            const result: ReadRoomDto[] = await this.chatRoomRepository.findRoom(roomData.room_name);
            return result;
        } catch (err) {
            console.error('findRoom Error:', err);
        }
    }

    async updateRoom(roomId: number, roomData: UpdateRoomDto): Promise<ReadRoomDto> {
        try {
            const result: ReadRoomDto = await this.chatRoomRepository.updateRoomName(roomId, roomData.room_name);
            return result;
        } catch (err) {
            console.error('updateRoom Error:', err);
        }
    }

    async deleteRoom(roomId: number): Promise<DeleteResult> {
        try {
            const result: DeleteResult = await this.chatRoomRepository.deleteRoom(roomId);
            await this.chatMessageRepository.deleteRoomMessage(roomId);
            return result;
        } catch (err) {
            console.error('deleteRoom Error:', err);
        }
    }

    async createMessage(messageData: CreateMessageDto): Promise<ReadMessageDto> {
        this.validateRoomID(messageData.room_id);
        try {
            const result: ReadMessageDto = await this.chatMessageRepository.createMessage(messageData.room_id, messageData.user_name, messageData.language, messageData.message_text);
            return result;
        } catch (err) {
            console.error('createMessage Error:', err);
        }
    }

    async findMessage(messageData: FindMessageDto): Promise<ReadMessageDto[]> {
        this.validateRoomID(messageData.room_id);
        try {
            const result: ReadMessageDto[] = await this.chatMessageRepository.findRoomMessages(messageData.room_id, messageData.send_at, messageData.take);
            return result;
        } catch (err) {
            console.error('findMessage Error:', err);
        }
    }

    async validateRoomID(roomId: number): Promise<void> {
        let findRoom: ReadRoomDto;
        try {
            findRoom = await this.chatRoomRepository.findOneRoom(roomId);
        } catch (err) {
            console.error('validateRoomId Error:', err);
        }
        if (!findRoom) throw new NotFoundException('Room ID를 찾을 수 없습니다');
    }
}
