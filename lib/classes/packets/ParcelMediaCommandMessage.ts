// This file has been automatically generated by writePacketClasses.js

import {MessageFlags} from '../../enums/MessageFlags';
import {Packet} from '../Packet';

export class ParcelMediaCommandMessagePacket implements Packet
{
    name = 'ParcelMediaCommandMessage';
    flags = MessageFlags.Trusted | MessageFlags.FrequencyLow;
    id = 4294902179;

    CommandBlock: {
        Flags: number;
        Command: number;
        Time: number;
    };

    getSize(): number
    {
        return 12;
    }

}