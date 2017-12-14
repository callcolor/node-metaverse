/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ObjectImageMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ObjectData: {
        ObjectLocalID: number;
        MediaURL: Buffer;
        TextureEntry: Buffer;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}