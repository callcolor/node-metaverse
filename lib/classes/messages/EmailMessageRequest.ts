// This file has been automatically generated by writeMessageClasses.js

import {UUID} from '../UUID';
import {MessageFlags} from '../../enums/MessageFlags';
import {MessageBase} from '../MessageBase';
import {Message} from '../../enums/Message';

export class EmailMessageRequestMessage implements MessageBase
{
    name = 'EmailMessageRequest';
    messageFlags = MessageFlags.Trusted | MessageFlags.FrequencyLow;
    id = Message.EmailMessageRequest;

    DataBlock: {
        ObjectID: UUID;
        FromAddress: string;
        Subject: string;
    };

    getSize(): number
    {
        return (this.DataBlock['FromAddress'].length + 1 + this.DataBlock['Subject'].length + 1) + 16;
    }

    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        this.DataBlock['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.DataBlock['FromAddress'].length, pos++);
        buf.write(this.DataBlock['FromAddress'], pos);
        pos += this.DataBlock['FromAddress'].length;
        buf.writeUInt8(this.DataBlock['Subject'].length, pos++);
        buf.write(this.DataBlock['Subject'], pos);
        pos += this.DataBlock['Subject'].length;
        return pos - startPos;
    }

    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        let varLength = 0;
        const newObjDataBlock: {
            ObjectID: UUID,
            FromAddress: string,
            Subject: string
        } = {
            ObjectID: UUID.zero(),
            FromAddress: '',
            Subject: ''
        };
        newObjDataBlock['ObjectID'] = new UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['FromAddress'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['Subject'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
