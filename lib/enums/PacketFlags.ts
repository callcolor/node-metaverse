export enum PacketFlags
{
    None = 0,
    Ack = 0x10,
    Resent = 0x20,
    Reliable = 0x40,
    Zerocoded = 0x80
}
