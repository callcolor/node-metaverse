// This file has been automatically generated by writeMessageClasses.js

import {UUID} from '../UUID';
import {Vector3} from '../Vector3';
import {MessageFlags} from '../../enums/MessageFlags';
import {MessageBase} from '../MessageBase';
import {Message} from '../../enums/Message';

export class SendPostcardMessage implements MessageBase
{
    name = 'SendPostcard';
    messageFlags = MessageFlags.FrequencyLow;
    id = Message.SendPostcard;

    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        AssetID: UUID;
        PosGlobal: Vector3;
        To: string;
        From: string;
        Name: string;
        Subject: string;
        Msg: string;
        AllowPublish: boolean;
        MaturePublish: boolean;
    };

    getSize(): number
    {
        return (this.AgentData['To'].length + 1 + this.AgentData['From'].length + 1 + this.AgentData['Name'].length + 1 + this.AgentData['Subject'].length + 1 + this.AgentData['Msg'].length + 2) + 74;
    }

    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['AssetID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['PosGlobal'].writeToBuffer(buf, pos, true);
        pos += 24;
        buf.writeUInt8(this.AgentData['To'].length, pos++);
        buf.write(this.AgentData['To'], pos);
        pos += this.AgentData['To'].length;
        buf.writeUInt8(this.AgentData['From'].length, pos++);
        buf.write(this.AgentData['From'], pos);
        pos += this.AgentData['From'].length;
        buf.writeUInt8(this.AgentData['Name'].length, pos++);
        buf.write(this.AgentData['Name'], pos);
        pos += this.AgentData['Name'].length;
        buf.writeUInt8(this.AgentData['Subject'].length, pos++);
        buf.write(this.AgentData['Subject'], pos);
        pos += this.AgentData['Subject'].length;
        buf.writeUInt16LE(this.AgentData['Msg'].length, pos);
        pos += 2;
        buf.write(this.AgentData['Msg'], pos);
        pos += this.AgentData['Msg'].length;
        buf.writeUInt8((this.AgentData['AllowPublish']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AgentData['MaturePublish']) ? 1 : 0, pos++);
        return pos - startPos;
    }

    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData: {
            AgentID: UUID,
            SessionID: UUID,
            AssetID: UUID,
            PosGlobal: Vector3,
            To: string,
            From: string,
            Name: string,
            Subject: string,
            Msg: string,
            AllowPublish: boolean,
            MaturePublish: boolean
        } = {
            AgentID: UUID.zero(),
            SessionID: UUID.zero(),
            AssetID: UUID.zero(),
            PosGlobal: Vector3.getZero(),
            To: '',
            From: '',
            Name: '',
            Subject: '',
            Msg: '',
            AllowPublish: false,
            MaturePublish: false
        };
        newObjAgentData['AgentID'] = new UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID(buf, pos);
        pos += 16;
        newObjAgentData['AssetID'] = new UUID(buf, pos);
        pos += 16;
        newObjAgentData['PosGlobal'] = new Vector3(buf, pos, true);
        pos += 24;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['To'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['From'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['Name'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['Subject'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjAgentData['Msg'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        newObjAgentData['AllowPublish'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['MaturePublish'] = (buf.readUInt8(pos++) === 1);
        this.AgentData = newObjAgentData;
        return pos - startPos;
    }
}
