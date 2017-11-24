// This file has been automatically generated by writePacketClasses.js

import {UUID} from '../UUID';
import {Vector3} from '../Vector3';
import Long = require('long');
import {MessageFlags} from '../../enums/MessageFlags';
import {Packet} from '../Packet';

export class AgentMovementCompletePacket implements Packet
{
    name = 'AgentMovementComplete';
    flags = MessageFlags.FrequencyLow;
    id = 4294902010;

    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    Data: {
        Position: Vector3;
        LookAt: Vector3;
        RegionHandle: Long;
        Timestamp: number;
    };
    SimData: {
        ChannelVersion: string;
    };

    getSize(): number
    {
        return (this.SimData['ChannelVersion'].length + 2) + 68;
    }

}