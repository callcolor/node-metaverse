const messages = require('./msg_template.json');
const path = require('path');
const fs = require('fs');

for (const message of messages)
{
    let classString = '// This file has been automatically generated by writeMessageClasses.js\r\n\r\n';

    //First import required classes
    let uuid = false;
    let ipaddr = false;
    let vector3 = false;
    let vector4 = false;
    let long = false;
    let quaternion = false;
    for (const block of message.blocks)
    {
        for (const param of block.params)
        {
            switch(param.type)
            {
                case 'BOOL':
                case 'U32':
                case 'S32':
                case 'S8':
                case 'U8':
                case 'U16':
                case 'S16':
                case 'F32':
                case 'F64':
                case "IPPORT":
                case "Fixed":
                case 'Variable':
                    break;
                case "LLVector3d":
                    vector3 = true;
                    break;
                case "LLVector3":
                    vector3 = true;
                    break;
                case "LLVector4":
                    vector4 = true;
                    break;
                case "LLQuaternion":
                    quaternion = true;
                    break;
                case "LLUUID":
                    uuid = true;
                    break;
                case "IPADDR":
                    ipaddr = true;
                    break;
                case "U64":
                    long = true;
                    break;
                default:
                    console.log("UNKNOWN TYPE: "+param.type);
            }
        }
    }
    if (uuid)
    {
        classString += 'import { UUID } from \'../UUID\';\r\n'
    }
    if (ipaddr)
    {
        classString += 'import { IPAddress } from \'../IPAddress\';\r\n'
    }
    if (vector3)
    {
        classString += 'import { Vector3 } from \'../Vector3\';\r\n'
    }
    if (vector4)
    {
        classString += 'import { Vector4 } from \'../Vector4\';\r\n'
    }
    if (long)
    {
        classString += 'import * as Long from \'long\';\r\n'
    }
    if (quaternion)
    {
        classString += 'import { Quaternion } from \'../Quaternion\';\r\n'
    }
    classString += 'import { MessageFlags } from \'../../enums/MessageFlags\';\r\n' +
        'import { MessageBase } from \'../MessageBase\';\r\n' +
        'import { Message } from \'../../enums/Message\';\r\n\r\n';

    classString += 'export class ' + message.name + 'Message implements MessageBase\r\n';
    classString += '{\r\n';
    classString += '    name = \''+message.name+'\';\r\n';


    let flags = [];
    for (const flag of message.flags)
    {
       switch(flag.toUpperCase())
       {
           case 'TRUSTED':
               flags.push('MessageFlags.Trusted');
               break;
           case 'UDPDEPRECATED':
           case 'DEPRECATED':
               flags.push('MessageFlags.Deprecated');
               break;
           case 'ZEROCODED':
               flags.push('MessageFlags.Zerocoded');
               break;
           case 'UNENCODED':
               break;
           case 'NOTTRUSTED':
               break;
           case 'UDPBLACKLISTED':
               flags.push('MessageFlags.Blacklisted');
               break;
           default:
               console.log("UNKNOWN FLAG: "+flag);
               break;

       }
    }
    let id = parseInt(message.id);
    switch(message.frequency)
    {
        case 'Low':
            id += 4294901760;
            flags.push('MessageFlags.FrequencyLow');
            break;
        case 'Medium':
            id += 65280;
            flags.push('MessageFlags.FrequencyMedium');
            break;
        case 'Fixed':
            flags.push('MessageFlags.FrequencyFixed');
            break;
        case 'High':
            flags.push('MessageFlags.FrequencyHigh');
            break;
        default:
            console.log("UNKNOWN FREQUENCY: "+message.frequency);
            break;
    }
    classString += '    messageFlags = ' + flags.join(' | ')+';\r\n';




    classString += '    id = Message.' + message.name+';\r\n';
    classString += '\r\n';

    let messageFixedSize = 0;
    let messageVariableSize = [];
    let calcVarVar = false;

    for (const block of message.blocks)
    {
        classString += '    '+block.name+': {\r\n';

        let blockFixedSize = 0;
        let blockVariableSize = [];

        for (const param of block.params)
        {
            classString += '        '+param.name+': ';
            let jstype = 'string';
            param.size = parseInt(param.size);
            switch(param.type)
            {
                case 'LLUUID':
                    jstype = 'UUID';
                    blockFixedSize += 16;
                    break;
                case 'F32':
                case 'S32':
                case 'U32':
                    blockFixedSize += 4;
                    jstype = 'number';
                    break;
                case 'IPPORT':
                case 'S16':
                case 'U16':
                    blockFixedSize += 2;
                    jstype = 'number';
                    break;
                case 'U64':
                case 'S64':
                    jstype = 'Long';
                    blockFixedSize += 8;
                    break;
                case 'F64':
                    blockFixedSize += 8;
                    jstype = 'number';
                    break;
                case 'S8':
                case 'U8':
                    blockFixedSize += 1;
                    jstype = 'number';
                    break;
                case 'BOOL':
                    blockFixedSize += 1;
                    jstype = 'boolean';
                    break;
                case 'Variable':
                    jstype = 'Buffer';

                    if (block.type === 'Single')
                    {
                        blockVariableSize.push('this.' + block.name + '[\'' + param.name + '\'].length + ' + param.size);
                    }
                    else
                    {
                        //Variable parameter in variable or multi block - tricky edge case
                        messageVariableSize.push('this.calculateVarVarSize(this.'+block.name+', \''+param.name+'\', '+param.size+')');
                        calcVarVar = true;
                    }
                    break;
                case 'LLVector4':
                    blockFixedSize += 16;
                    jstype = 'Vector4';
                    break;
                case 'LLQuaternion':
                    // because it's always a unit quaternion, transmitted in messages as a triplet of floats, 12 bytes wide (represented in memory as a quad of floats, 16 bytes wide)
                    blockFixedSize += 12;
                    jstype = 'Quaternion';
                    break;
                case 'LLVector3d':
                    blockFixedSize += 24;
                    jstype = 'Vector3';
                    break;
                case 'LLVector3':
                    blockFixedSize += 12;
                    jstype = 'Vector3';
                    break;
                case 'IPADDR':
                    blockFixedSize += 4;
                    jstype = 'IPAddress';
                    break;
                case 'Fixed':
                    blockFixedSize += parseInt(param.size);
                    jstype = 'Buffer';
                    break;
                default:
                    console.log('Unknown type: '+param.type);
            }
            classString += jstype + ';\r\n';
        }

        if (block.type === 'Single')
        {
            messageFixedSize += blockFixedSize;
            if (blockVariableSize.length > 0)
            {
                messageVariableSize.push('(' + blockVariableSize.join(' + ') + ')');
            }
        }
        else if (block.type === 'Multiple')
        {
            messageFixedSize += blockFixedSize * block.count;
            if (blockVariableSize.length > 0)
            {
                messageVariableSize.push('((' + blockVariableSize.join(' + ') + ') * ' + block.count + ')');
            }
        }
        else if (block.type === 'Variable')
        {
            messageFixedSize += 1; //variable block starts with a U8
            if (blockFixedSize > 0)
            {
                blockVariableSize.push(blockFixedSize);
            }
            if (blockVariableSize.length > 0)
            {
                messageVariableSize.push('((' + blockVariableSize.join(' + ') + ') * this.' + block.name + '.length)');
            }
        }

        switch(block.type)
        {
            case 'Single':
                classString += '    };\r\n';
                break;
            case 'Variable':
            case 'Multiple':
                classString += '    }[];\r\n';

                break;
            default:
                console.log("Unknown type: "+block.type);
        }
    }

    classString+='\r\n';
    classString+='    getSize(): number\r\n';
    classString+='    {\r\n';
    if (messageFixedSize > 0)
    {
        messageVariableSize.push(messageFixedSize);
    }
    if (messageVariableSize.length === 0)
    {
        classString += '        return 0;\r\n';
    }
    else
    {
        classString += '        return ' + messageVariableSize.join(' + ') + ';\r\n';
    }
    classString+='    }\r\n';
    classString+='\r\n';
    if (calcVarVar)
    {
        classString+='    calculateVarVarSize(block: { [key: string]: any }[], paramName: string, extraPerVar: number): number\r\n' +
            '    {\r\n' +
            '        let size = 0;\r\n' +
            '        for (const bl of block)\r\n' +
            '        {\r\n' +
            '            size += bl[paramName].length + extraPerVar;\r\n' +
            '        }\r\n' +
            '        return size;\r\n' +
            '    }\r\n\r\n';
    }
    classString+='    // @ts-ignore\r\n';
    classString+='    writeToBuffer(buf: Buffer, pos: number): number\r\n';
    classString+='    {\r\n';
    if (message.blocks.length > 0)
    {
        classString += '        const startPos = pos;\r\n';

        let firstCount = true;

        let letConst      = 'const';
        let varBlockCount = 0;
        for (const block of message.blocks)
        {
            if (block.type === 'Variable' || block.type === 'Multiple')
            {
                varBlockCount++;
            }
        }
        if (varBlockCount > 1)
        {
            letConst = 'let';
        }

        for (const block of message.blocks)
        {
            let single     = false;
            let blockIndex = '';
            if (block.type === 'Variable')
            {
                let first = '';
                if (firstCount)
                {
                    firstCount = false;
                    first      = letConst + ' ';
                }
                blockIndex = '        ' + first + 'count = this.' + block.name + '.length;\r\n';
                blockIndex += '        buf.writeUInt8(this.' + block.name + '.length, pos++);\r\n';
            }
            else if (block.type === 'Multiple')
            {
                let first = '';
                if (firstCount)
                {
                    firstCount = false;
                    first      = letConst + ' ';
                }
                blockIndex = '        ' + first + 'count = ' + block.count + ';\r\n';
            }
            else
            {
                single = true;
            }
            let spaces = '';
            if (!single)
            {
                spaces = '    ';
                classString += blockIndex;
                classString += '        for (let i = 0; i < count; i++)\r\n';
                classString += '        {\r\n';
            }
            for (const param of block.params)
            {
                let val = '';
                if (!single)
                {
                    val = 'this.' + block.name + '[i][\'' + param.name + '\']';
                }
                else
                {
                    val = 'this.' + block.name + '[\'' + param.name + '\']';
                }
                switch (param.type)
                {
                    case 'LLUUID':
                        classString += spaces + '        ' + val + '.writeToBuffer(buf, pos);\r\n';
                        classString += spaces + '        pos += 16;\r\n';
                        break;
                    case 'F32':
                        classString += spaces + '        buf.writeFloatLE(' + val + ', pos);\r\n';
                        classString += spaces + '        pos += 4;\r\n';
                        break;
                    case 'S32':
                        classString += spaces + '        buf.writeInt32LE(' + val + ', pos);\r\n';
                        classString += spaces + '        pos += 4;\r\n';
                        break;
                    case 'U32':
                        classString += spaces + '        buf.writeUInt32LE(' + val + ', pos);\r\n';
                        classString += spaces + '        pos += 4;\r\n';
                        break;
                    case 'U16':
                    case 'IPPORT':
                        classString += spaces + '        buf.writeUInt16LE(' + val + ', pos);\r\n';
                        classString += spaces + '        pos += 2;\r\n';
                        break;
                    case 'S16':
                        classString += spaces + '        buf.writeInt16LE(' + val + ', pos);\r\n';
                        classString += spaces + '        pos += 2;\r\n';
                        break;
                    case 'U64':
                    case 'S64':
                        classString += spaces + '        buf.writeInt32LE(' + val + '.low, pos);\r\n';
                        classString += spaces + '        pos += 4;\r\n';
                        classString += spaces + '        buf.writeInt32LE(' + val + '.high, pos);\r\n';
                        classString += spaces + '        pos += 4;\r\n';
                        break;
                    case 'F64':
                        classString += spaces + '        buf.writeDoubleLE(' + val + ', pos);\r\n';
                        classString += spaces + '        pos += 8;\r\n';
                        break;
                    case 'S8':
                        classString += spaces + '        buf.writeInt8(' + val + ', pos++);\r\n';
                        break;
                    case 'U8':
                        classString += spaces + '        buf.writeUInt8(' + val + ', pos++);\r\n';
                        break;
                    case 'BOOL':
                        classString += spaces + '        buf.writeUInt8((' + val + ') ? 1 : 0, pos++);\r\n';
                        break;
                    case 'Variable':
                        if (param.size === 1)
                        {
                            classString += spaces + '        buf.writeUInt8(' + val + '.length, pos++);\r\n';
                        }
                        if (param.size === 2)
                        {
                            classString += spaces + '        buf.writeUInt16LE(' + val + '.length, pos);\r\n';
                            classString += spaces + '        pos += 2;\r\n';
                        }
                        classString += spaces + '        ' + val + '.copy(buf, pos);\r\n';
                        classString += spaces + '        pos += ' + val + '.length;\r\n';
                        break;
                    case 'LLVector4':
                        classString += spaces + '        ' + val + '.writeToBuffer(buf, pos);\r\n';
                        classString += spaces + '        pos += 16;\r\n';
                        break;
                    case 'LLQuaternion':
                        classString += spaces + '        ' + val + '.writeToBuffer(buf, pos);\r\n';
                        classString += spaces + '        pos += 12;\r\n';
                        break;
                    case 'LLVector3d':
                        classString += spaces + '        ' + val + '.writeToBuffer(buf, pos, true);\r\n';
                        classString += spaces + '        pos += 24;\r\n';
                        break;
                    case 'LLVector3':
                        classString += spaces + '        ' + val + '.writeToBuffer(buf, pos, false);\r\n';
                        classString += spaces + '        pos += 12;\r\n';
                        break;
                    case 'IPADDR':
                        classString += spaces + '        ' + val + '.writeToBuffer(buf, pos);\r\n';
                        classString += spaces + '        pos += 4;\r\n';
                        break;
                    case 'Fixed':
                        classString += spaces + '        ' + val + '.copy(buf, pos);\r\n';
                        classString += spaces + '        pos += ' + param.size + ';\r\n';
                        break;
                    default:
                        console.log('Unknown type: ' + param.type);
                }
            }
            if (!single)
            {
                classString += '        }\r\n';
            }

        }
        classString += '        return pos - startPos;\r\n';
    }
    else
    {
        classString += '        return 0;\r\n';
    }
    classString +='    }\r\n';
    classString +='\r\n';
    classString+='    // @ts-ignore\r\n';
    classString+='    readFromBuffer(buf: Buffer, pos: number): number\r\n';
    classString+='    {\r\n';
    if (message.blocks.length > 0)
    {
        classString += '        const startPos = pos;\r\n';

        let foundVarLength = false;
        for (const block of message.blocks)
        {
            for (const param of block.params)
            {
                if (param.type === 'Variable')
                {
                    classString += '        let varLength = 0;\r\n';
                    foundVarLength = true;
                    break;
                }
            }
            if (foundVarLength)
            {
                break;
            }
        }

        let firstCount = true;

        let letConst      = 'const';
        let varBlockCount = 0;
        for (const block of message.blocks)
        {
            if (block.type === 'Variable' || block.type === 'Multiple')
            {
                varBlockCount++;
            }
        }
        if (varBlockCount > 1)
        {
            letConst = 'let';
        }

        let varBlockConst = 'const';
        if (message.blocks.count > 1)
        {
            varBlockConst = 'let';
        }
        let firstBlock = true;
        let donelet = false;
        for (const block of message.blocks)
        {
            let single     = false;
            let blockIndex = '';
            block.count = parseInt(block.count);
            if (block.type === 'Variable')
            {
                let first = '';
                if (firstCount)
                {
                    firstCount = false;
                    first      = letConst + ' ';
                }
                blockIndex = '        if (pos >= buf.length)\r\n        {\r\n            return pos - startPos;\r\n        }\r\n';
                blockIndex += '        ' + first + 'count = buf.readUInt8(pos++);\r\n';
                blockIndex += '        this.' + block.name + ' = [];\r\n';
            }
            else if (block.type === 'Multiple')
            {
                let first = '';
                if (firstCount)
                {
                    firstCount = false;
                    first      = letConst + ' ';
                }
                blockIndex = '        ' + first + 'count = ' + block.count + ';\r\n';
                blockIndex += '        this.' + block.name + ' = [];';
            }
            else
            {
                single = true;
            }
            let spaces = '';
            let decl = '';
            if (firstBlock)
            {
                firstBlock = false;
                decl = varBlockConst + ' ';
            }
            if (!single)
            {
                spaces = '    ';
                classString += blockIndex;
                classString += '        for (let i = 0; i < count; i++)\r\n';
                classString += '        {\r\n';
                classString += '            const newObj' + block.name + ': {\r\n';
            }
            else
            {
                classString += '        const newObj' + block.name + ': {\r\n';
            }
            const paramTypes = [];
            const paramValues = [];
            for (const param of block.params)
            {
                let jstype = 'string';
                let jsvalue = '\'\'';
                switch(param.type)
                {
                    case 'LLUUID':
                        jstype = 'UUID';
                        jsvalue = 'UUID.zero()';
                        break;
                    case 'F32':
                    case 'S32':
                    case 'U32':
                        jstype = 'number';
                        jsvalue = '0';
                        break;
                    case 'IPPORT':
                    case 'S16':
                    case 'U16':
                        jstype = 'number';
                        jsvalue = '0';
                        break;
                    case 'U64':
                    case 'S64':
                        jstype = 'Long';
                        jsvalue = 'Long.ZERO';
                        break;
                    case 'F64':
                        jstype = 'number';
                        jsvalue = '0';
                        break;
                    case 'S8':
                    case 'U8':
                        jstype = 'number';
                        jsvalue = '0';
                        break;
                    case 'BOOL':
                        jstype = 'boolean';
                        jsvalue = 'false';
                        break;
                    case 'Variable':
                        jstype = 'Buffer';
                        jsvalue = 'Buffer.allocUnsafe(0)';
                        break;
                    case 'LLVector4':
                        jstype = 'Vector4';
                        jsvalue = 'Vector4.getZero()';
                        break;
                    case 'LLQuaternion':
                        jstype = 'Quaternion';
                        jsvalue = 'Quaternion.getIdentity()';
                        break;
                    case 'LLVector3d':
                        jstype = 'Vector3';
                        jsvalue = 'Vector3.getZero()';
                        break;
                    case 'LLVector3':
                        jstype = 'Vector3';
                        jsvalue = 'Vector3.getZero()';
                        break;
                    case 'IPADDR':
                        jstype = 'IPAddress';
                        jsvalue = 'IPAddress.zero()';
                        break;
                    case 'Fixed':
                        jstype = 'Buffer';
                        jsvalue = 'Buffer.allocUnsafe(0)';
                        break;
                    default:
                        console.log('Unknown type: '+param.type);
                }
                paramTypes.push(spaces + '            ' + param.name + ': '+jstype);
                paramValues.push(spaces + '            ' + param.name + ': '+jsvalue);
            }
            classString += paramTypes.join(',\r\n')+'\r\n';
            classString += spaces + '        } = {\r\n';
            classString += paramValues.join(',\r\n')+'\r\n';
            classString += spaces + '        };\r\n';
            for (const param of block.params)
            {
                let val = '';
                switch (param.type)
                {
                    case 'LLUUID':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = new UUID(buf, pos);\r\n';
                        classString += spaces + '        pos += 16;\r\n';
                        break;
                    case 'F32':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = buf.readFloatLE(pos);\r\n';
                        classString += spaces + '        pos += 4;\r\n';
                        break;
                    case 'S32':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = buf.readInt32LE(pos);\r\n';
                        classString += spaces + '        pos += 4;\r\n';
                        break;
                    case 'U32':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = buf.readUInt32LE(pos);\r\n';
                        classString += spaces + '        pos += 4;\r\n';
                        break;
                    case 'U16':
                    case 'IPPORT':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = buf.readUInt16LE(pos);\r\n';
                        classString += spaces + '        pos += 2;\r\n';
                        break;
                    case 'S16':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = buf.readInt16LE(pos);\r\n';
                        classString += spaces + '        pos += 2;\r\n';
                        break;
                    case 'U64':
                    case 'S64':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));\r\n';
                        classString += spaces + '        pos += 8;\r\n';
                        break;
                    case 'F64':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = buf.readDoubleLE(pos);\r\n';
                        classString += spaces + '        pos += 8;\r\n';
                        break;
                    case 'S8':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = buf.readInt8(pos++);\r\n';
                        break;
                    case 'U8':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = buf.readUInt8(pos++);\r\n';
                        break;
                    case 'BOOL':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = (buf.readUInt8(pos++) === 1);\r\n';
                        break;
                    case 'Variable':
                        if (param.size === 1)
                        {
                            classString += spaces + '        varLength = buf.readUInt8(pos++);\r\n';
                        }
                        else if (param.size === 2)
                        {
                            classString += spaces + '        varLength = buf.readUInt16LE(pos);\r\n';
                            classString += spaces + '        pos += 2;\r\n';
                        }
                        else
                        {
                            console.error("INVALID VARIABLE LENGTH: " + param.size);
                        }
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = buf.slice(pos, pos + varLength);\r\n';
                        classString += spaces + '        pos += varLength;\r\n';
                        break;
                    case 'LLVector4':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = new Vector4(buf, pos);\r\n';
                        classString += spaces + '        pos += 16;\r\n';
                        break;
                    case 'LLQuaternion':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = new Quaternion(buf, pos);\r\n';
                        classString += spaces + '        pos += 12;\r\n';
                        break;
                    case 'LLVector3d':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = new Vector3(buf, pos, true);\r\n';
                        classString += spaces + '        pos += 24;\r\n';
                        break;
                    case 'LLVector3':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = new Vector3(buf, pos, false);\r\n';
                        classString += spaces + '        pos += 12;\r\n';
                        break;
                    case 'IPADDR':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = new IPAddress(buf, pos);\r\n';
                        classString += spaces + '        pos += 4;\r\n';
                        break;
                    case 'Fixed':
                        classString += spaces + '        newObj' + block.name + '[\'' + param.name + '\'] = buf.slice(pos, pos + ' + param.size + ');\r\n';
                        classString += spaces + '        pos += ' + param.size + ';\r\n';
                        break;
                    default:
                        console.log('Unknown type: ' + param.type);
                }
            }
            if (!single)
            {
                classString += '            this.'+block.name+'.push(newObj' + block.name + ');\r\n';
                classString += '        }\r\n';
            }
            else
            {
                classString += '        this.'+block.name+' = newObj' + block.name + ';\r\n';
            }


        }
        classString += '        return pos - startPos;\r\n';
    }
    else
    {
        classString += '        return 0;\r\n';
    }
    classString +='    }\r\n';
    classString += '}\r\n';
    classString +='\r\n';

    const p = path.join(__dirname+'/../lib/classes/messages/'+message.name+'.ts');
    fs.writeFile(p, classString, (err) =>
    {

    });

}
//Now write the Messages class
let classString = '// This file has been automatically generated by writePacketClasses.js\r\n\r\n';
for (const message of messages)
{
    const name = message.name;
    classString += 'export * from \'./messages/'+name+'\';\r\n';
}
classString += 'import { Message } from \'../enums/Message\';\r\n';
classString += '\r\n';
classString += 'const messages: { [index: number]: string } = {};\r\n';
const msgs = [];
for (const message of messages)
{
    msgs.push('messages[<number>Message.' + message.name + '] = \'' + message.name + 'Message\'');
}
classString += msgs.join(';\r\n')+';\r\n';
classString += '\r\n';
classString += 'export function nameFromID(id: Message): string\r\n';
classString += '{\r\n';
classString += '    return messages[id];\r\n';
classString += '}\r\n';
const p = path.join(__dirname+'/../lib/classes/MessageClasses.ts');
fs.writeFile(p, classString, (err) =>
{

});

classString = 'export enum Message\r\n{\r\n';
const msgArr = [];
for (const message of messages)
{
    let id = parseInt(message.id);
    switch(message.frequency)
    {
        case 'Low':
            id += 4294901760;
            break;
        case 'Medium':
            id += 65280;
            break;
        case 'Fixed':
            break;
        case 'High':
            break;
        default:
            console.log("UNKNOWN FREQUENCY: "+message.frequency);
            break;
    }
    msgArr.push('    '+message.name+' = '+id);
}
classString += msgArr.join(',\r\n')+'\r\n';
classString += '}\r\n';
const e = path.join(__dirname+'/../lib/enums/Message.ts');
fs.writeFile(e, classString, (err) =>
{

});
