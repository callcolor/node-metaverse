// This file has been automatically generated by writePacketClasses.js

import {UUID} from '../UUID';
import {Vector3} from '../Vector3';
import {MessageFlags} from '../../enums/MessageFlags';
import {Packet} from '../Packet';

export class SetStartLocationRequestPacket implements Packet
{
    name = 'SetStartLocationRequest';
    flags = MessageFlags.Zerocoded | MessageFlags.FrequencyLow;
    id = 4294902084;

    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    StartLocationData: {
        SimName: string;
        LocationID: number;
        LocationPos: Vector3;
        LocationLookAt: Vector3;
    };

    getSize(): number
    {
        return (this.StartLocationData['SimName'].length + 1) + 60;
    }

}