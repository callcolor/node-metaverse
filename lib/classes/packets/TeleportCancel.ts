// This file has been automatically generated by writePacketClasses.js

import {UUID} from '../UUID';
import {MessageFlags} from '../../enums/MessageFlags';
import {Packet} from '../Packet';

export class TeleportCancelPacket implements Packet
{
    name = 'TeleportCancel';
    flags = MessageFlags.FrequencyLow;
    id = 4294901832;

    Info: {
        AgentID: UUID;
        SessionID: UUID;
    };

    getSize(): number
    {
        return 32;
    }

}