/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class FetchInventoryDescendentsPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    InventoryData: {
        FolderID: UUID;
        OwnerID: UUID;
        SortOrder: number;
        FetchFolders: boolean;
        FetchItems: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}