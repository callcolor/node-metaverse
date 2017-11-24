// This file has been automatically generated by writePacketClasses.js

import Long = require('long');
import {MessageFlags} from '../../enums/MessageFlags';
import {Packet} from '../Packet';

export class ScriptDataRequestPacket implements Packet
{
    name = 'ScriptDataRequest';
    flags = MessageFlags.Trusted | MessageFlags.FrequencyLow;
    id = 4294902097;

    DataBlock: {
        Hash: Long;
        RequestType: number;
        Request: string;
    }[];

    getSize(): number
    {
        return ((this.calculateVarVarSize(this.DataBlock, 'Request', 2) + 9) * this.DataBlock.length) + 1;
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

}