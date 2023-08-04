import { CustomRepository } from "src/config/typeorm_ex/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { ChatRoom } from "./chat_rooms.entity";

@CustomRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {
    /**
     * ID를 통해 채팅방을 조회합니다.
     * @param roomId 조회할 채팅방의 고유 식별자(ID)입니다.
     * @returns 채팅방 데이터를 반환합니다.
     */
    async findOneRoom(roomId: number): Promise<ChatRoom> {
        return await this.findOne({ where: { room_id: roomId } });
    }

    /**
     * 모든 채팅방을 조회합니다.
     * @returns 채팅방 데이터를 담은 배열을 반환합니다.
     */
    async findAllRoom(): Promise<ChatRoom[]> {
        return await this.find();
    }

    /**
     * 7일 이상 채팅 입력이 없는 채팅방을 조회합니다.
     * @returns 7일 이상 채팅 입력이 없는 채팅방 데이터를 담은 배열입니다.
     */
    async findObsoleteRoom(): Promise<ChatRoom[]> {
        const sevenDaysAgo:Date = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
        const obsoleteRoom: ChatRoom[] = await this
            .createQueryBuilder('chatRoom')
            .leftJoin('chatRoom.chatMessages', 'chatMessage', 'chatMessage.send_at >= :sevenDaysAgo', { sevenDaysAgo })
            .where('chatMessage.send_at IS NULL')
            .getMany();
        return obsoleteRoom;
    }

    /**
     * 채팅방을 생성합니다.
     * @param roomName 생성할 채팅방의 이름입니다.
     * @returns 생성한 채팅방 데이터를 반환합니다.
     */
    async createRoom(roomName: string): Promise<ChatRoom> {
        const newEntity: ChatRoom = this.create({ room_name: roomName });
        await this.save(newEntity);
        return newEntity;
    }

    /**
     * 채팅방을 삭제합니다.
     * @param roomId 삭제할 채팅방의 고유 식별자(ID)입니다.
     */
    async deleteRoom(roomId: number) {
        await this.delete(roomId);
    }

    /**
     * 채팅방의 이름을 변경합니다.
     * @param roomId 이름을 변경할 채팅방의 고유 식별자(ID)입니다.
     * @param roomName 변경할 이름입니다.
     * @returns 변경한 채팅방 데이터를 반환합니다.
     */
    async updateRoomName(roomId: number, roomName: string): Promise<ChatRoom> {
        const updateEntity: ChatRoom = await this.findOneRoom(roomId);
        updateEntity.room_name = roomName;
        await this.save(updateEntity);
        return updateEntity;
    }
}