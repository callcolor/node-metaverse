import { ChatSourceType } from '../enums/ChatSourceType';
import { UUID } from '../classes/UUID';
import { InstantMessageEventFlags } from '../enums/InstantMessageEventFlags';
import { Vector3 } from '../classes/Vector3';

export class InstantMessageEvent
{
    source: ChatSourceType;
    fromName: string;
    from: UUID;
    owner: UUID;
    message: string;
    regionId: UUID;
    position: Vector3;
    binaryBucket: string;
    flags: InstantMessageEventFlags;
}
