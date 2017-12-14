"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class BulkUpdateInventoryPacket {
    constructor() {
        this.name = 'BulkUpdateInventory';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902041;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.FolderData, 'Name', 1) + 33) * this.FolderData.length) + ((this.calculateVarVarSize(this.ItemData, 'Name', 1) + this.calculateVarVarSize(this.ItemData, 'Description', 1) + 140) * this.ItemData.length) + 34;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        let count = this.FolderData.length;
        buf.writeUInt8(this.FolderData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.FolderData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
            this.FolderData[i]['ParentID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt8(this.FolderData[i]['Type'], pos++);
            buf.write(this.FolderData[i]['Name'], pos);
            pos += this.FolderData[i]['Name'].length;
        }
        count = this.ItemData.length;
        buf.writeUInt8(this.ItemData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ItemData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt32LE(this.ItemData[i]['CallbackID'], pos);
            pos += 4;
            this.ItemData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ItemData[i]['CreatorID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ItemData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ItemData[i]['GroupID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt32LE(this.ItemData[i]['BaseMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ItemData[i]['OwnerMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ItemData[i]['GroupMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ItemData[i]['EveryoneMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ItemData[i]['NextOwnerMask'], pos);
            pos += 4;
            buf.writeUInt8((this.ItemData[i]['GroupOwned']) ? 1 : 0, pos++);
            this.ItemData[i]['AssetID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt8(this.ItemData[i]['Type'], pos++);
            buf.writeInt8(this.ItemData[i]['InvType'], pos++);
            buf.writeUInt32LE(this.ItemData[i]['Flags'], pos);
            pos += 4;
            buf.writeUInt8(this.ItemData[i]['SaleType'], pos++);
            buf.writeInt32LE(this.ItemData[i]['SalePrice'], pos);
            pos += 4;
            buf.write(this.ItemData[i]['Name'], pos);
            pos += this.ItemData[i]['Name'].length;
            buf.write(this.ItemData[i]['Description'], pos);
            pos += this.ItemData[i]['Description'].length;
            buf.writeInt32LE(this.ItemData[i]['CreationDate'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ItemData[i]['CRC'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            TransactionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        let count = buf.readUInt8(pos++);
        this.FolderData = [];
        for (let i = 0; i < count; i++) {
            const newObjFolderData = {
                FolderID: UUID_1.UUID.zero(),
                ParentID: UUID_1.UUID.zero(),
                Type: 0,
                Name: ''
            };
            newObjFolderData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjFolderData['ParentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjFolderData['Type'] = buf.readInt8(pos++);
            newObjFolderData['Name'] = buf.toString('utf8', pos, length);
            pos += length;
            this.FolderData.push(newObjFolderData);
        }
        count = buf.readUInt8(pos++);
        this.ItemData = [];
        for (let i = 0; i < count; i++) {
            const newObjItemData = {
                ItemID: UUID_1.UUID.zero(),
                CallbackID: 0,
                FolderID: UUID_1.UUID.zero(),
                CreatorID: UUID_1.UUID.zero(),
                OwnerID: UUID_1.UUID.zero(),
                GroupID: UUID_1.UUID.zero(),
                BaseMask: 0,
                OwnerMask: 0,
                GroupMask: 0,
                EveryoneMask: 0,
                NextOwnerMask: 0,
                GroupOwned: false,
                AssetID: UUID_1.UUID.zero(),
                Type: 0,
                InvType: 0,
                Flags: 0,
                SaleType: 0,
                SalePrice: 0,
                Name: '',
                Description: '',
                CreationDate: 0,
                CRC: 0
            };
            newObjItemData['ItemID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['CallbackID'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['CreatorID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['OwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['GroupID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['BaseMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['OwnerMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['GroupMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['EveryoneMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['NextOwnerMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['GroupOwned'] = (buf.readUInt8(pos++) === 1);
            newObjItemData['AssetID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['Type'] = buf.readInt8(pos++);
            newObjItemData['InvType'] = buf.readInt8(pos++);
            newObjItemData['Flags'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['SaleType'] = buf.readUInt8(pos++);
            newObjItemData['SalePrice'] = buf.readInt32LE(pos);
            pos += 4;
            newObjItemData['Name'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjItemData['Description'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjItemData['CreationDate'] = buf.readInt32LE(pos);
            pos += 4;
            newObjItemData['CRC'] = buf.readUInt32LE(pos);
            pos += 4;
            this.ItemData.push(newObjItemData);
        }
        return pos - startPos;
    }
}
exports.BulkUpdateInventoryPacket = BulkUpdateInventoryPacket;
//# sourceMappingURL=BulkUpdateInventory.js.map