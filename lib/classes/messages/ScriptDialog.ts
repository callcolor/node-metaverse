// This file has been automatically generated by writeMessageClasses.js

import {UUID} from '../UUID';
import {MessageFlags} from '../../enums/MessageFlags';
import {MessageBase} from '../MessageBase';
import {Message} from '../../enums/Message';

export class ScriptDialogMessage implements MessageBase
{
    name = 'ScriptDialog';
    messageFlags = MessageFlags.Trusted | MessageFlags.Zerocoded | MessageFlags.FrequencyLow;
    id = Message.ScriptDialog;

    Data: {
        ObjectID: UUID;
        FirstName: string;
        LastName: string;
        ObjectName: string;
        Message: string;
        ChatChannel: number;
        ImageID: UUID;
    };
    Buttons: {
        ButtonLabel: string;
    }[];
    OwnerData: {
        OwnerID: UUID;
    }[];

    getSize(): number
    {
        return (this.Data['FirstName'].length + 1 + this.Data['LastName'].length + 1 + this.Data['ObjectName'].length + 1 + this.Data['Message'].length + 2) + ((this.calculateVarVarSize(this.Buttons, 'ButtonLabel', 1)) * this.Buttons.length) + ((16) * this.OwnerData.length) + 38;
    }

    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number
    {
        let size = 0;
        block.forEach((bl: any) =>
        {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
    }

    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        this.Data['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.Data['FirstName'].length, pos++);
        buf.write(this.Data['FirstName'], pos);
        pos += this.Data['FirstName'].length;
        buf.writeUInt8(this.Data['LastName'].length, pos++);
        buf.write(this.Data['LastName'], pos);
        pos += this.Data['LastName'].length;
        buf.writeUInt8(this.Data['ObjectName'].length, pos++);
        buf.write(this.Data['ObjectName'], pos);
        pos += this.Data['ObjectName'].length;
        buf.writeUInt16LE(this.Data['Message'].length, pos);
        pos += 2;
        buf.write(this.Data['Message'], pos);
        pos += this.Data['Message'].length;
        buf.writeInt32LE(this.Data['ChatChannel'], pos);
        pos += 4;
        this.Data['ImageID'].writeToBuffer(buf, pos);
        pos += 16;
        let count = this.Buttons.length;
        buf.writeUInt8(this.Buttons.length, pos++);
        for (let i = 0; i < count; i++)
        {
            buf.writeUInt8(this.Buttons[i]['ButtonLabel'].length, pos++);
            buf.write(this.Buttons[i]['ButtonLabel'], pos);
            pos += this.Buttons[i]['ButtonLabel'].length;
        }
        count = this.OwnerData.length;
        buf.writeUInt8(this.OwnerData.length, pos++);
        for (let i = 0; i < count; i++)
        {
            this.OwnerData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }

    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        let varLength = 0;
        const newObjData: {
            ObjectID: UUID,
            FirstName: string,
            LastName: string,
            ObjectName: string,
            Message: string,
            ChatChannel: number,
            ImageID: UUID
        } = {
            ObjectID: UUID.zero(),
            FirstName: '',
            LastName: '',
            ObjectName: '',
            Message: '',
            ChatChannel: 0,
            ImageID: UUID.zero()
        };
        newObjData['ObjectID'] = new UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjData['FirstName'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjData['LastName'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjData['ObjectName'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjData['Message'] = buf.toString('utf8', pos, pos + (varLength - 1));
        pos += varLength;
        newObjData['ChatChannel'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['ImageID'] = new UUID(buf, pos);
        pos += 16;
        this.Data = newObjData;
        let count = buf.readUInt8(pos++);
        this.Buttons = [];
        for (let i = 0; i < count; i++)
        {
            const newObjButtons: {
                ButtonLabel: string
            } = {
                ButtonLabel: ''
            };
            varLength = buf.readUInt8(pos++);
            newObjButtons['ButtonLabel'] = buf.toString('utf8', pos, pos + (varLength - 1));
            pos += varLength;
            this.Buttons.push(newObjButtons);
        }
        count = buf.readUInt8(pos++);
        this.OwnerData = [];
        for (let i = 0; i < count; i++)
        {
            const newObjOwnerData: {
                OwnerID: UUID
            } = {
                OwnerID: UUID.zero()
            };
            newObjOwnerData['OwnerID'] = new UUID(buf, pos);
            pos += 16;
            this.OwnerData.push(newObjOwnerData);
        }
        return pos - startPos;
    }
}
