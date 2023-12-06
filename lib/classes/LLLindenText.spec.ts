import { LLLindenText } from './LLLindenText';
import * as assert from 'assert';

describe('LLLindenText', () =>
{
    it('can successfully parse a notecard asset', () =>
    {
        const buf = Buffer.from('TGluZGVuIHRleHQgdmVyc2lvbiAyCnsKTExFbWJlZGRlZEl0ZW1zIHZlcnNpb24gMQp7CmNvdW50IDAKfQpUZXh0IGxlbmd0aCA5NDAKCgogICAgSGV5LCB0aGFua3MgZm9yIHlvdXIgcHVyY2hhc2Ugb2YgdGhlIENhc3BlclZlbmQgQ29tcGxldGUgRmF0IFBhY2suCiAgICAKICAgIEVhY2ggY29tcG9uZW50IGluIHRoaXMgZmF0IHBhY2sgaXMgYSBzZXBhcmF0ZSBwcm9kdWN0IHdpdGggaXRzIG93biBpbnN0cnVjdGlvbnMuCiAgICAKICAgIElmIHlvdSdyZSBuZXcgdG8gQ2FzcGVyVmVuZCwgdGhlIGZpcnN0IHN0ZXAgaXMgdG8gc2V0IHVwIHRoZSAiUHJlbWl1bSBWZW5kb3JzIiAtIHRoaXMgaXMgCiAgICB5b3VyIG1haW4gc3lzdGVtIHRoYXQgZXZlcnl0aGluZyBlbHNlIHBsdWdzIGluIHRvLiAKICAgIAogICAgQ2FzcGVyVmVuZCAyIGhhcyBhIGNvbXBsZXRlIG9ubGluZSBtYW51YWwgYXZhaWxhYmxlIGhlcmU6CiAgICAKICAgIGh0dHBzOi8vd2lraS5jYXNwZXJkbnMuY29tL2luZGV4LnBocD90aXRsZT1DYXNwZXJWZW5kXzIKICAgIAogICAgT3VyIG1hbnVhbCBpcyBjb25zdGFudGx5IGJlaW5nIHVwZGF0ZWQgd2l0aCBtb3JlIGhlbHAsIGd1aWRlcyBhbmQgaW5mb3JtYXRpb24uIAogICAgCiAgICBEb24ndCBmb3JnZXQsIGlmIHlvdSBnZXQgc3R1Y2sgLSB3ZSd2ZSBnb3QgYSB1c2VyIHN1cHBvcnQgZ3JvdXAgZnVsbCBvZiB2ZXJ5IGhlbHBmdWwgCiAgICBhbmQgYXdlc29tZSBwZW9wbGUuIFlvdSB3ZXJlIHNlbnQgYW4gaW52aXRlIHRvIHRoZSBncm91cCB3aGVuIHlvdSBwdXJjaGFzZWQsCiAgICBob3dldmVyIGlmIHlvdSBtaXNzZWQgdGhpcywgcGxlYXNlIElNIENhc3BlciBXYXJkZW4gZm9yIGFuIGludml0ZS4KICAgIAogICAgWW91IGNhbiBhbHNvIElNIG1lIGRpcmVjdGx5IGZvciBoZWxwIChDYXNwZXIgV2FyZGVuKS4gSWYgSSdtIG5vdCBvbmxpbmUsCiAgICB5b3Ugd2lsbCByZWNlaXZlIGEgbGluayB3aGljaCBhbGxvd3MgeW91IHRvIHN1Ym1pdCBhIHN1cHBvcnQgdGlja2V0Ln0KAA==', 'base64');
        const text = new LLLindenText(buf);
        const expected = Buffer.from('CgogICAgSGV5LCB0aGFua3MgZm9yIHlvdXIgcHVyY2hhc2Ugb2YgdGhlIENhc3BlclZlbmQgQ29tcGxldGUgRmF0IFBhY2suCiAgICAKICAgIEVhY2ggY29tcG9uZW50IGluIHRoaXMgZmF0IHBhY2sgaXMgYSBzZXBhcmF0ZSBwcm9kdWN0IHdpdGggaXRzIG93biBpbnN0cnVjdGlvbnMuCiAgICAKICAgIElmIHlvdSdyZSBuZXcgdG8gQ2FzcGVyVmVuZCwgdGhlIGZpcnN0IHN0ZXAgaXMgdG8gc2V0IHVwIHRoZSAiUHJlbWl1bSBWZW5kb3JzIiAtIHRoaXMgaXMgCiAgICB5b3VyIG1haW4gc3lzdGVtIHRoYXQgZXZlcnl0aGluZyBlbHNlIHBsdWdzIGluIHRvLiAKICAgIAogICAgQ2FzcGVyVmVuZCAyIGhhcyBhIGNvbXBsZXRlIG9ubGluZSBtYW51YWwgYXZhaWxhYmxlIGhlcmU6CiAgICAKICAgIGh0dHBzOi8vd2lraS5jYXNwZXJkbnMuY29tL2luZGV4LnBocD90aXRsZT1DYXNwZXJWZW5kXzIKICAgIAogICAgT3VyIG1hbnVhbCBpcyBjb25zdGFudGx5IGJlaW5nIHVwZGF0ZWQgd2l0aCBtb3JlIGhlbHAsIGd1aWRlcyBhbmQgaW5mb3JtYXRpb24uIAogICAgCiAgICBEb24ndCBmb3JnZXQsIGlmIHlvdSBnZXQgc3R1Y2sgLSB3ZSd2ZSBnb3QgYSB1c2VyIHN1cHBvcnQgZ3JvdXAgZnVsbCBvZiB2ZXJ5IGhlbHBmdWwgCiAgICBhbmQgYXdlc29tZSBwZW9wbGUuIFlvdSB3ZXJlIHNlbnQgYW4gaW52aXRlIHRvIHRoZSBncm91cCB3aGVuIHlvdSBwdXJjaGFzZWQsCiAgICBob3dldmVyIGlmIHlvdSBtaXNzZWQgdGhpcywgcGxlYXNlIElNIENhc3BlciBXYXJkZW4gZm9yIGFuIGludml0ZS4KICAgIAogICAgWW91IGNhbiBhbHNvIElNIG1lIGRpcmVjdGx5IGZvciBoZWxwIChDYXNwZXIgV2FyZGVuKS4gSWYgSSdtIG5vdCBvbmxpbmUsCiAgICB5b3Ugd2lsbCByZWNlaXZlIGEgbGluayB3aGljaCBhbGxvd3MgeW91IHRvIHN1Ym1pdCBhIHN1cHBvcnQgdGlja2V0Lg==', 'base64');
        assert.equal(text.body, expected.toString('utf-8'));
        const reassembled = text.toAsset();
        assert.equal(reassembled.toString('base64'), buf.toString('base64'));
    });

    it('can successfully parse and reassemble a notecard asset with embedded assets', () =>
    {
        const buf = Buffer.from('TGluZGVuIHRleHQgdmVyc2lvbiAyCnsKTExFbWJlZGRlZEl0ZW1zIHZlcnNpb24gMQp7CmNvdW50IDIKewpleHQgY2hhciBpbmRleCAwCglpbnZfaXRlbQkwCgl7CgkJaXRlbV9pZAkyZjVhYzI4MC0yYjIwLTI0MmEtY2IwNS1jNGJjOGVlYzA2NDgKCQlwYXJlbnRfaWQJOWJmNmRhNTYtNTE1NS00OTEwLWJhODMtYTg2OWY3YTc0MTdjCglwZXJtaXNzaW9ucyAwCgl7CgkJYmFzZV9tYXNrCTdmZmZmZmZmCgkJb3duZXJfbWFzawk3ZmZmZmZmZgoJCWdyb3VwX21hc2sJN2ZmZmZmZmYKCQlldmVyeW9uZV9tYXNrCTdmZmZiZmZmCgkJbmV4dF9vd25lcl9tYXNrCTdmZmZmZmZmCgkJY3JlYXRvcl9pZAlkMWNkNWI3MS02MjA5LTQ1OTUtOWJmMC03NzFiZjY4OWNlMDAKCQlvd25lcl9pZAlkMWNkNWI3MS02MjA5LTQ1OTUtOWJmMC03NzFiZjY4OWNlMDAKCQlsYXN0X293bmVyX2lkCTAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMAoJCWdyb3VwX2lkCTAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMAoJfQoJCWFzc2V0X2lkCWMwYmQ5NWMxLWVmM2EtZmQ2My0xYTk5LTBhNDVkNmYwNjdhZgoJCXR5cGUJdGV4dHVyZQoJCWludl90eXBlCXRleHR1cmUKCQlmbGFncwkwMDAwMDAwMAoJc2FsZV9pbmZvCTAKCXsKCQlzYWxlX3R5cGUJbm90CgkJc2FsZV9wcmljZQkxMAoJfQoJCW5hbWUJUGVybWlzc2lvbnMgcmVxdWVzdCBkaWFsb2d8CgkJZGVzYwkoTm8gRGVzY3JpcHRpb24pfAoJCWNyZWF0aW9uX2RhdGUJMTM0MDc0Njc0NAoJfQp9CnsKZXh0IGNoYXIgaW5kZXggMQoJaW52X2l0ZW0JMAoJewoJCWl0ZW1faWQJZjNmMzYwYTgtNTkwMS00MTE3LTFiMDYtZjk4NTA0ODU5ZWJhCgkJcGFyZW50X2lkCTliZjZkYTU2LTUxNTUtNDkxMC1iYTgzLWE4NjlmN2E3NDE3YwoJcGVybWlzc2lvbnMgMAoJewoJCWJhc2VfbWFzawk3ZmZmZmZmZgoJCW93bmVyX21hc2sJN2ZmZmZmZmYKCQlncm91cF9tYXNrCTdmZmZmZmZmCgkJZXZlcnlvbmVfbWFzawk3ZmZmYmZmZgoJCW5leHRfb3duZXJfbWFzawk3ZmZmZmZmZgoJCWNyZWF0b3JfaWQJZDFjZDViNzEtNjIwOS00NTk1LTliZjAtNzcxYmY2ODljZTAwCgkJb3duZXJfaWQJZDFjZDViNzEtNjIwOS00NTk1LTliZjAtNzcxYmY2ODljZTAwCgkJbGFzdF9vd25lcl9pZAkwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAKCQlncm91cF9pZAkwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAKCX0KCQlhc3NldF9pZAk3M2QyNmE5Yy03MWQxLTYzN2MtMGFkMi00ZGVkOWYzZjU5ZWMKCQl0eXBlCXRleHR1cmUKCQlpbnZfdHlwZQl0ZXh0dXJlCgkJZmxhZ3MJMDAwMDAwMDAKCXNhbGVfaW5mbwkwCgl7CgkJc2FsZV90eXBlCW5vdAoJCXNhbGVfcHJpY2UJMTAKCX0KCQluYW1lCVBlcm1pc3Npb25zIHJlcXVlc3QgZGlhbG9nIChOZXdlcil8CgkJZGVzYwkoTm8gRGVzY3JpcHRpb24pfAoJCWNyZWF0aW9uX2RhdGUJMTM0MDc0Njc1MQoJfQp9Cn0KVGV4dCBsZW5ndGggMjM1MgoKICAgIENhc3BlclZlbmQgdXNlcyBhbmQgcmVxdWlyZXMgIkRlYml0IFBlcm1pc3Npb25zIiB0byBmdW5jdGlvbi4KICAgIAogICAgVGhlc2UgcGVybWlzc2lvbnMgYXJlIHJlcXVlc3RlZCB1c2luZyBhIGRpYWxvZyBzaW1pbGFyIHRvIHRoaXM6CiAgICAKICAgICD0gICAICAoQ2xpY2sgdGhlIGxpbmsgdG8gb3BlbiB0aGUgaW1hZ2UpCiAgICAgCiAgICAgb3IgbWF5IHBlcmhhcHMgYmUgd29yZGVkIGFzIGZvbGxvd3M6CiAgICAgCiAgICAg9ICAgQogICAgIAogICAgIAogICAgIEFzIHRoZSB3YXJuaW5nIG1lc3NhZ2VzIHN1Z2dlc3QsIHRoaXMgcGVybWlzc2lvbiBhbGxvd3MgdGhlIG9iamVjdCBhY2Nlc3MgdG8geW91ciBMaW5kZW4gRG9sbGFyIChMJCkKICAgICBhY2NvdW50LCBnaXZpbmcgaXQgdGhlIGFiaWxpdHkgdG8gc2VuZCBtb25leSBmcm9tIHlvdXIgYWNjb3VudCB0byBhbnkgb3RoZXIgYXZhdGFyLgogICAgIAogICAgIFRoaXMgcGVybWlzc2lvbiBpcyByZXF1aXJlZCBmb3Igb3VyIHZlbmRvcnMgdG8gZnVuY3Rpb24uICBXZSB1c2UgaXQgZm9yIHRoZSBmb2xsb3dpbmcgcHVycG9zZXM6CiAgICAgCiAgICAgICAgICAgICogIFRvIHJlZnVuZCBzb21lIG1vbmV5IHRvIHRoZSBjdXN0b21lciBpZiB0aGV5IHBheSB0b28gbXVjaC4KICAgICAgICAgICAgCiAgICAgICAgICAgICogIFRvIHJlZnVuZCB0aGUgY3VzdG9tZXIgaWYgd2UgY2FuJ3QgY29tcGxldGUgdGhlIGRlbGl2ZXJ5IGZvciBzb21lIHJlYXNvbi4KICAgICAgICAgICAgCiAgICAgICAgICAgICogIFRvIHJlZnVuZCB0aGUgY3VzdG9tZXIgaWYgdGhlIGl0ZW0gaXMgbm8gbG9uZ2VyIGF2YWlsYWJsZSAobGltaXRlZCBlZGl0aW9uIGl0ZW0pCiAgICAgICAgICAgIAogICAgICAgICAgICAqICBUbyBwYXkgZGlzY291bnRzIHRvIGN1c3RvbWVycyBpZiB5b3UgY2hvb3NlIHRvIHVzZSBvdXIgcmV3YXJkIHN5c3RlbS4KICAgICAgICAgICAgCiAgICAgICAgICAgICogIFRvIHBheSBwcm9maXQgc2hhcmVzIHRvIHlvdXIgcGFydG5lcnMsIGlmIHlvdSBuZWVkIHRvIHVzZSBhIHNwbGl0IHBheSBzeXN0ZW0uCiAgICAgICAgICAgIAogICAgICAgICAgICAqICBUbyBwYXkgeW91ciBjb21taXNzaW9uIGZlZSBpbiB0aGUgY2FzZSBvZiBmcmVlIHZlbmRvcnMgb3IgYWZmaWxpYXRlcy4KICAgICAgICAgICAgCiAgICAgICAgICAgICogIEluIHRoZSBjYXNlIG9mIGFmZmlsaWF0ZXMsIHRvIGZvcndhcmQgdGhlIG1vbmV5IGZyb20gdGhlIGFmZmlsaWF0ZSB0byB5b3UuCiAgICAgICAgICAgIAogICAgICBDYXNwZXJWZW5kIGlzIHVzZWQgYnkgdGVucyBvZiB0aG91c2FuZHMgb2YgbWVyY2hhbnRzIGluIFNlY29uZCBMaWZlLCBhbGwgb2Ygd2hvbSBoYXZlIGdyYW50ZWQgdGhpcwogICAgICBwZXJtaXNzaW9uLiBXZSBhcmUgYSByZXNwb25zaWJsZSBhbmQgc2VjdXJlIHNlcnZpY2UgcHJvdmlkZXIuCiAgICAgIAogICAgICBBbGwgdmVuZG9ycyBpbiBTZWNvbmQgTGlmZSByZXF1aXJlIHRoaXMgcGVybWlzc2lvbiBpbiBvcmRlciB0byBwcm9wZXJseSBmdW5jdGlvbi4gSG93ZXZlciwgaXQncyB2ZXJ5CiAgICAgIGltcG9ydGFudCB0aGF0IHlvdSBwYXkgYXR0ZW50aW9uIGV2ZXJ5IHRpbWUgeW91IHJlY2VpdmUgdGhpcyBkaWFsb2cgLSBhIG1hbGljaW91cyBvYmplY3QgY2FuIHZlcnkgZWFzaWx5IAogICAgICBlbXB0eSBhbGwgdGhlIG1vbmV5IG91dCBvZiB5b3VyIGFjY291bnQuCiAgICAgIAogICAgICBJZiB5b3UgcmVjZWl2ZSBhICJkZWJpdCBwZXJtaXNzaW9ucyIgZGlhbG9nLCBtYWtlIHN1cmUgdGhhdCBpdCBpcyBiZWluZyBzZW50IGJ5IGFuIG9iamVjdCB5b3Uga25vdyBhbmQgdHJ1c3QsCiAgICAgIGxpa2UgYSBDYXNwZXJWZW5kIHZlbmRvci4gCiAgICAgIAogICAgICBDYXNwZXJWZW5kIHZlbmRvcnMgd2lsbCByZXF1ZXN0IHBlcm1pc3Npb25zIGZyb20geW91IG9uIHRoZXNlIG9jY2FzaW9uczoKICAgICAgCiAgICAgICAgICAgIC0gV2hlbiB0aGUgdmVuZG9yIGlzIHJlenplZAogICAgICAgICAgICAKICAgICAgICAgICAgLSBXaGVuIHRoZSB2ZW5kb3IncyBzY3JpcHRzIGFyZSByZXNldAogICAgICAgICAgICAKICAgICAgICAgICAgLSBXaGVuIHRoZSB2ZW5kb3IgaXMgYmVpbmcgdXBkYXRlZCBieSBhbiBVcGdyYWRlQmVlLgogICAgICAgICAgICAKICAgIEZvciB0aGUgaGlnaGVzdCBsZXZlbCBvZiBzZWN1cml0eSwgb25lIG1pZ2h0IGNob29zZSB0byB1c2UgYSBzZXBhcmF0ZSBhdmF0YXIgZm9yIHNjcmlwdHMgdGhhdCByZXF1aXJlIGRlYml0CiAgICBwZXJtaXNzaW9ucywgd2hpY2ggd2lsbCBhdm9pZCBnaXZpbmcgYWNjZXNzIHRvIHlvdXIgcGVyc29uYWwgYmFsYW5jZS59CgA=', 'base64');
        const text = new LLLindenText(buf);
        const expected = Buffer.from('CiAgICBDYXNwZXJWZW5kIHVzZXMgYW5kIHJlcXVpcmVzICJEZWJpdCBQZXJtaXNzaW9ucyIgdG8gZnVuY3Rpb24uCiAgICAKICAgIFRoZXNlIHBlcm1pc3Npb25zIGFyZSByZXF1ZXN0ZWQgdXNpbmcgYSBkaWFsb2cgc2ltaWxhciB0byB0aGlzOgogICAgCiAgICAg9ICAgCAgKENsaWNrIHRoZSBsaW5rIHRvIG9wZW4gdGhlIGltYWdlKQogICAgIAogICAgIG9yIG1heSBwZXJoYXBzIGJlIHdvcmRlZCBhcyBmb2xsb3dzOgogICAgIAogICAgIPSAgIEKICAgICAKICAgICAKICAgICBBcyB0aGUgd2FybmluZyBtZXNzYWdlcyBzdWdnZXN0LCB0aGlzIHBlcm1pc3Npb24gYWxsb3dzIHRoZSBvYmplY3QgYWNjZXNzIHRvIHlvdXIgTGluZGVuIERvbGxhciAoTCQpCiAgICAgYWNjb3VudCwgZ2l2aW5nIGl0IHRoZSBhYmlsaXR5IHRvIHNlbmQgbW9uZXkgZnJvbSB5b3VyIGFjY291bnQgdG8gYW55IG90aGVyIGF2YXRhci4KICAgICAKICAgICBUaGlzIHBlcm1pc3Npb24gaXMgcmVxdWlyZWQgZm9yIG91ciB2ZW5kb3JzIHRvIGZ1bmN0aW9uLiAgV2UgdXNlIGl0IGZvciB0aGUgZm9sbG93aW5nIHB1cnBvc2VzOgogICAgIAogICAgICAgICAgICAqICBUbyByZWZ1bmQgc29tZSBtb25leSB0byB0aGUgY3VzdG9tZXIgaWYgdGhleSBwYXkgdG9vIG11Y2guCiAgICAgICAgICAgIAogICAgICAgICAgICAqICBUbyByZWZ1bmQgdGhlIGN1c3RvbWVyIGlmIHdlIGNhbid0IGNvbXBsZXRlIHRoZSBkZWxpdmVyeSBmb3Igc29tZSByZWFzb24uCiAgICAgICAgICAgIAogICAgICAgICAgICAqICBUbyByZWZ1bmQgdGhlIGN1c3RvbWVyIGlmIHRoZSBpdGVtIGlzIG5vIGxvbmdlciBhdmFpbGFibGUgKGxpbWl0ZWQgZWRpdGlvbiBpdGVtKQogICAgICAgICAgICAKICAgICAgICAgICAgKiAgVG8gcGF5IGRpc2NvdW50cyB0byBjdXN0b21lcnMgaWYgeW91IGNob29zZSB0byB1c2Ugb3VyIHJld2FyZCBzeXN0ZW0uCiAgICAgICAgICAgIAogICAgICAgICAgICAqICBUbyBwYXkgcHJvZml0IHNoYXJlcyB0byB5b3VyIHBhcnRuZXJzLCBpZiB5b3UgbmVlZCB0byB1c2UgYSBzcGxpdCBwYXkgc3lzdGVtLgogICAgICAgICAgICAKICAgICAgICAgICAgKiAgVG8gcGF5IHlvdXIgY29tbWlzc2lvbiBmZWUgaW4gdGhlIGNhc2Ugb2YgZnJlZSB2ZW5kb3JzIG9yIGFmZmlsaWF0ZXMuCiAgICAgICAgICAgIAogICAgICAgICAgICAqICBJbiB0aGUgY2FzZSBvZiBhZmZpbGlhdGVzLCB0byBmb3J3YXJkIHRoZSBtb25leSBmcm9tIHRoZSBhZmZpbGlhdGUgdG8geW91LgogICAgICAgICAgICAKICAgICAgQ2FzcGVyVmVuZCBpcyB1c2VkIGJ5IHRlbnMgb2YgdGhvdXNhbmRzIG9mIG1lcmNoYW50cyBpbiBTZWNvbmQgTGlmZSwgYWxsIG9mIHdob20gaGF2ZSBncmFudGVkIHRoaXMKICAgICAgcGVybWlzc2lvbi4gV2UgYXJlIGEgcmVzcG9uc2libGUgYW5kIHNlY3VyZSBzZXJ2aWNlIHByb3ZpZGVyLgogICAgICAKICAgICAgQWxsIHZlbmRvcnMgaW4gU2Vjb25kIExpZmUgcmVxdWlyZSB0aGlzIHBlcm1pc3Npb24gaW4gb3JkZXIgdG8gcHJvcGVybHkgZnVuY3Rpb24uIEhvd2V2ZXIsIGl0J3MgdmVyeQogICAgICBpbXBvcnRhbnQgdGhhdCB5b3UgcGF5IGF0dGVudGlvbiBldmVyeSB0aW1lIHlvdSByZWNlaXZlIHRoaXMgZGlhbG9nIC0gYSBtYWxpY2lvdXMgb2JqZWN0IGNhbiB2ZXJ5IGVhc2lseSAKICAgICAgZW1wdHkgYWxsIHRoZSBtb25leSBvdXQgb2YgeW91ciBhY2NvdW50LgogICAgICAKICAgICAgSWYgeW91IHJlY2VpdmUgYSAiZGViaXQgcGVybWlzc2lvbnMiIGRpYWxvZywgbWFrZSBzdXJlIHRoYXQgaXQgaXMgYmVpbmcgc2VudCBieSBhbiBvYmplY3QgeW91IGtub3cgYW5kIHRydXN0LAogICAgICBsaWtlIGEgQ2FzcGVyVmVuZCB2ZW5kb3IuIAogICAgICAKICAgICAgQ2FzcGVyVmVuZCB2ZW5kb3JzIHdpbGwgcmVxdWVzdCBwZXJtaXNzaW9ucyBmcm9tIHlvdSBvbiB0aGVzZSBvY2Nhc2lvbnM6CiAgICAgIAogICAgICAgICAgICAtIFdoZW4gdGhlIHZlbmRvciBpcyByZXp6ZWQKICAgICAgICAgICAgCiAgICAgICAgICAgIC0gV2hlbiB0aGUgdmVuZG9yJ3Mgc2NyaXB0cyBhcmUgcmVzZXQKICAgICAgICAgICAgCiAgICAgICAgICAgIC0gV2hlbiB0aGUgdmVuZG9yIGlzIGJlaW5nIHVwZGF0ZWQgYnkgYW4gVXBncmFkZUJlZS4KICAgICAgICAgICAgCiAgICBGb3IgdGhlIGhpZ2hlc3QgbGV2ZWwgb2Ygc2VjdXJpdHksIG9uZSBtaWdodCBjaG9vc2UgdG8gdXNlIGEgc2VwYXJhdGUgYXZhdGFyIGZvciBzY3JpcHRzIHRoYXQgcmVxdWlyZSBkZWJpdAogICAgcGVybWlzc2lvbnMsIHdoaWNoIHdpbGwgYXZvaWQgZ2l2aW5nIGFjY2VzcyB0byB5b3VyIHBlcnNvbmFsIGJhbGFuY2Uu', 'base64');
        assert.equal(text.body, expected.toString('utf-8'));
        const reassembled = text.toAsset();
        assert.equal(reassembled.toString('base64'), buf.toString('base64'));
    });
});
