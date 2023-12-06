import { Subscription } from 'rxjs';
import { EventQueueClient } from './EventQueueClient';
import { UUID } from './UUID';
import { ClientEvents } from './ClientEvents';
import { Agent } from './Agent';
import { Subject } from 'rxjs';
import { ICapResponse } from './interfaces/ICapResponse';
import { HTTPAssets } from '../enums/HTTPAssets';

import * as LLSD from '@caspertech/llsd';
import * as url from 'url';
import got from 'got';

export const Capabilities = [
    'AbuseCategories',
    'AcceptFriendship',
    'AcceptGroupInvite',
    'AgentPreferences',
    'AgentProfile',
    'AgentState',
    'AttachmentResources',
    'AvatarPickerSearch',
    'AvatarRenderInfo',
    'CharacterProperties',
    'ChatSessionRequest',
    'CopyInventoryFromNotecard',
    'CreateInventoryCategory',
    'DeclineFriendship',
    'DeclineGroupInvite',
    'DispatchRegionInfo',
    'DirectDelivery',
    'EnvironmentSettings',
    'EstateAccess',
    'EstateChangeInfo',
    'EventQueueGet',
    'ExtEnvironment',
    'FetchLib2',
    'FetchLibDescendents2',
    'FetchInventory2',
    'FetchInventoryDescendents2',
    'IncrementCOFVersion',
    'InterestList',
    'InventoryThumbnailUpload',
    'GetDisplayNames',
    'GetExperiences',
    'AgentExperiences',
    'FindExperienceByName',
    'GetExperienceInfo',
    'GetAdminExperiences',
    'GetCreatorExperiences',
    'ExperiencePreferences',
    'GroupExperiences',
    'UpdateExperience',
    'IsExperienceAdmin',
    'IsExperienceContributor',
    'InventoryAPIv3',
    'RegionExperiences',
    'ExperienceQuery',
    'GetMesh',
    'GetMesh2',
    'GetMetadata',
    'GetObjectCost',
    'GetObjectPhysicsData',
    'GetTexture',
    'GroupAPIv1',
    'GroupMemberData',
    'GroupProposalBallot',
    'HomeLocation',
    'LandResources',
    'LSLSyntax',
    'MapLayer',
    'MapLayerGod',
    'MeshUploadFlag',
    'ModifyMaterialParams',
    'NavMeshGenerationStatus',
    'NewFileAgentInventory',
    'ObjectAnimation',
    'ObjectMedia',
    'ObjectMediaNavigate',
    'ObjectNavMeshProperties',
    'ParcelPropertiesUpdate',
    'ParcelVoiceInfoRequest',
    'ProductInfoRequest',
    'ProvisionVoiceAccountRequest',
    'ReadOfflineMsgs',
    'RegionObjects',
    'RemoteParcelRequest',
    'RenderMaterials',
    'RequestTextureDownload',
    'ResourceCostSelected',
    'RetrieveNavMeshSrc',
    'SearchStatRequest',
    'SearchStatTracking',
    'SendPostcard',
    'SendUserReport',
    'SendUserReportWithScreenshot',
    'ServerReleaseNotes',
    'SetDisplayName',
    'SimConsoleAsync',
    'SimulatorFeatures',
    'StartGroupProposal',
    'TerrainNavMeshProperties',
    'TextureStats',
    'UntrustedSimulatorMessage',
    'UpdateAgentInformation',
    'UpdateAgentLanguage',
    'UpdateAvatarAppearance',
    'UpdateGestureAgentInventory',
    'UpdateGestureTaskInventory',
    'UpdateNotecardAgentInventory',
    'UpdateNotecardTaskInventory',
    'UpdateScriptAgent',
    'UpdateScriptTask',
    'UpdateSettingsAgentInventory',
    'UpdateSettingsTaskInventory',
    'UploadAgentProfileImage',
    'UpdateMaterialAgentInventory',
    'UpdateMaterialTaskInventory',
    'UploadBakedTexture',
    'UserInfo',
    'ViewerAsset',
    'ViewerBenefits',
    'ViewerMetrics',
    'ViewerStartAuction',
    'ViewerStats',
] as const;

export type CapabilitiesEnum = typeof Capabilities[number];

export class Caps
{
    static CAP_INVOCATION_DELAY_MS: { [key: string]: number } = {
        'NewFileAgentInventory': 2000,
        'FetchInventory2': 200
    };

    private onGotSeedCap: Subject<void> = new Subject<void>();
    private gotSeedCap = false;
    private capabilities: { [key: string]: string } = {};
    private clientEvents: ClientEvents;
    private agent: Agent;
    private active = false;
    private timeLastCapExecuted: { [key: string]: number } = {};
    eventQueueClient: EventQueueClient | null = null;

    constructor(agent: Agent, seedURL: string, clientEvents: ClientEvents)
    {
        this.agent = agent;
        this.clientEvents = clientEvents;
        const req = Capabilities;

        this.active = true;
        this.requestPost(seedURL, LLSD.LLSD.formatXML(req), 'application/llsd+xml').then((resp: ICapResponse) =>
        {
            this.capabilities = LLSD.LLSD.parseXML(resp.body);
            this.gotSeedCap = true;
            this.onGotSeedCap.next();
            if (this.capabilities['EventQueueGet'])
            {
                if (this.eventQueueClient !== null)
                {
                    this.eventQueueClient.shutdown();
                }
                this.eventQueueClient = new EventQueueClient(this.agent, this, this.clientEvents);
            }
        }).catch((err) =>
        {
            console.error('Error getting seed capability');
            console.error(err);
        });
    }

    public async downloadAsset(uuid: UUID, type: HTTPAssets): Promise<Buffer>
    {
        if (type === HTTPAssets.ASSET_LSL_TEXT || type === HTTPAssets.ASSET_NOTECARD)
        {
            throw new Error('Invalid Syntax');
        }
        const capURL = await this.getCapability('ViewerAsset');
        const assetURL = capURL + '/?' + type + '_id=' + uuid.toString();

        const response = await got.get(assetURL, {
            https: {
                rejectUnauthorized: false,
            },
            method: 'GET',
            responseType: 'buffer'
        });

        if (response.statusCode < 200 || response.statusCode > 299)
        {
            throw new Error(response.body.toString('utf-8'));
        }

        return response.body;
    }

    public async requestPost(capURL: string, data: string | Buffer, contentType: string): Promise<{ status: number; body: string }>
    {
        const response = await got.post(capURL, {
            headers: {
                'Content-Length': String(Buffer.byteLength(data)),
                'Content-Type': contentType
            },
            body: data,
            https: {
                rejectUnauthorized: false,
            },
        });

        return { status: response.statusCode, body: response.body };
    }

    public async requestPut(capURL: string, data: string | Buffer, contentType: string): Promise<ICapResponse>
    {
        const response = await got.put(capURL, {
            headers: {
                'Content-Length': String(Buffer.byteLength(data)),
                'Content-Type': contentType
            },
            body: data,
            https: {
                rejectUnauthorized: false,
            },
        });

        return { status: response.statusCode, body: response.body };
    }

    public async requestGet(requestURL: string): Promise<ICapResponse>
    {
        const response = await got.get(requestURL, {
            https: {
                rejectUnauthorized: false,
            },
        });

        return { status: response.statusCode, body: response.body };
    }

    public async requestDelete(requestURL: string): Promise<ICapResponse>
    {
        const response = await got.delete(requestURL, {
            https: {
                rejectUnauthorized: false,
            },
        });

        return { status: response.statusCode, body: response.body };
    }

    waitForSeedCapability(): Promise<void>
    {
        return new Promise((resolve) =>
        {
            if (this.gotSeedCap)
            {
                resolve();
            }
            else
            {
                const sub: Subscription = this.onGotSeedCap.subscribe(() =>
                {
                    sub.unsubscribe();
                    resolve();
                });
            }
        });
    }

    async isCapAvailable(capability: string): Promise<boolean>
    {
        await this.waitForSeedCapability();
        return (this.capabilities[capability] !== undefined);
    }

    getCapability(capability: CapabilitiesEnum): Promise<string>
    {
        return new Promise<string>((resolve, reject) =>
        {
            if (!this.active)
            {
                reject(new Error('Requesting getCapability to an inactive Caps instance'));
                return;
            }
            this.waitForSeedCapability().then(() =>
            {
                if (this.capabilities[capability])
                {
                    resolve(this.capabilities[capability]);
                }
                else
                {
                    reject(new Error('Capability ' + capability + ' not available'));
                }
            });
        });
    }

    public capsRequestUpload(capURL: string, data: Buffer): Promise<any>
    {
        return new Promise<any>((resolve, reject) =>
        {
            this.requestPost(capURL, data, 'application/octet-stream').then((resp: ICapResponse) =>
            {
                try
                {
                    resolve(LLSD.LLSD.parseXML(resp.body));
                }
                catch (err)
                {
                    if (resp.status === 201)
                    {
                        resolve({});
                    }
                    else if (resp.status === 403)
                    {
                        reject(new Error('Access Denied'));
                    }
                    else
                    {
                        reject(err);
                    }
                }
            }).catch((err) =>
            {
                console.error(err);
                reject(err);
            });
        });
    }

    private waitForCapTimeout(capName: string): Promise<void>
    {
        return new Promise((resolve) =>
        {
            if (!Caps.CAP_INVOCATION_DELAY_MS[capName])
            {
                resolve();
            }
            else
            {
                if (!this.timeLastCapExecuted[capName] || this.timeLastCapExecuted[capName] < (new Date().getTime() - Caps.CAP_INVOCATION_DELAY_MS[capName]))
                {
                    this.timeLastCapExecuted[capName] = new Date().getTime();
                }
                else
                {
                    this.timeLastCapExecuted[capName] += Caps.CAP_INVOCATION_DELAY_MS[capName];
                }
                const timeToWait = this.timeLastCapExecuted[capName] - new Date().getTime();
                if (timeToWait > 0)
                {
                    setTimeout(() =>
                    {
                        resolve();
                    }, timeToWait);
                }
                else
                {
                    resolve();
                }
            }
        });
    }

    public capsPerformXMLPost(capURL: string, data: any): Promise<any>
    {
        return new Promise<any>(async(resolve, reject) =>
        {
            const xml = LLSD.LLSD.formatXML(data);
            this.requestPost(capURL, xml, 'application/llsd+xml').then(async(resp: ICapResponse) =>
            {
                let result: any = null;
                try
                {
                    result = LLSD.LLSD.parseXML(resp.body);
                    resolve(result);
                }
                catch (err)
                {
                    if (resp.status === 201)
                    {
                        resolve({});
                    }
                    else if (resp.status === 403)
                    {
                        reject(new Error('Access Denied'));
                    }
                    else if (resp.status === 404)
                    {
                        reject(new Error('Not found'));
                    }
                    else
                    {
                        reject(resp.body);
                    }
                }
            }).catch((err) =>
            {
                console.error(err);
                reject(err);
            });
        });
    }

    capsPerformXMLPut(capURL: string, data: any): Promise<any>
    {
        return new Promise<any>(async(resolve, reject) =>
        {
            const xml = LLSD.LLSD.formatXML(data);
            this.requestPut(capURL, xml, 'application/llsd+xml').then((resp: ICapResponse) =>
            {
                let result: any = null;
                try
                {
                    result = LLSD.LLSD.parseXML(resp.body);
                    resolve(result);
                }
                catch (err)
                {
                    if (resp.status === 201)
                    {
                        resolve({});
                    }
                    else if (resp.status === 403)
                    {
                        reject(new Error('Access Denied'));
                    }
                    else
                    {
                        reject(err);
                    }
                }
            }).catch((err) =>
            {
                console.error(err);
                reject(err);
            });
        });
    }

    capsPerformXMLGet(capURL: string): Promise<any>
    {
        return new Promise<any>(async(resolve, reject) =>
        {
            this.requestGet(capURL).then((resp: ICapResponse) =>
            {
                let result: any = null;
                try
                {
                    result = LLSD.LLSD.parseXML(resp.body);
                    resolve(result);
                }
                catch (err)
                {
                    if (resp.status === 201)
                    {
                        resolve({});
                    }
                    else if (resp.status === 403)
                    {
                        reject(new Error('Access Denied'));
                    }
                    else
                    {
                        reject(err);
                    }
                }
            }).catch((err) =>
            {
                console.error(err);
                reject(err);
            });
        });
    }

    async capsGetXML(capability: CapabilitiesEnum | [CapabilitiesEnum, { [key: string]: string }]): Promise<any>
    {
        let capName;
        let queryParams: { [key: string]: string } = {};
        if (typeof capability === 'string')
        {
            capName = capability;
        }
        else
        {
            capName = capability[0];
            queryParams = capability[1];
        }

        await this.waitForCapTimeout(capName);

        let capURL = await this.getCapability(capName);
        if (Object.keys(queryParams).length > 0)
        {
            const parsedURL = url.parse(capURL, true);
            for (const key of Object.keys(queryParams))
            {
                parsedURL.query[key] = queryParams[key];
            }
            capURL = url.format(parsedURL);
        }
        try
        {
            return await this.capsPerformXMLGet(capURL);
        }
        catch (error)
        {
            console.log('Error with cap ' + capName);
            console.log(error);
            throw error;
        }
    }

    async capsPostXML(capability: CapabilitiesEnum | [CapabilitiesEnum, { [key: string]: string }], data: any): Promise<any>
    {
        let capName;
        let queryParams: { [key: string]: string } = {};
        if (typeof capability === 'string')
        {
            capName = capability;
        }
        else
        {
            capName = capability[0];
            queryParams = capability[1];
        }

        await this.waitForCapTimeout(capName);

        let capURL = await this.getCapability(capName);
        if (Object.keys(queryParams).length > 0)
        {
            const parsedURL = url.parse(capURL, true);
            for (const key of Object.keys(queryParams))
            {
                parsedURL.query[key] = queryParams[key];
            }
            capURL = url.format(parsedURL);
        }
        try
        {
            return await this.capsPerformXMLPost(capURL, data);
        }
        catch (error)
        {
            console.log('Error with cap ' + capName);
            console.log(error);
            throw error;
        }
    }

    async capsPutXML(capability: CapabilitiesEnum | [CapabilitiesEnum, { [key: string]: string }], data: any): Promise<any>
    {
        let capName;
        let queryParams: { [key: string]: string } = {};
        if (typeof capability === 'string')
        {
            capName = capability;
        }
        else
        {
            capName = capability[0];
            queryParams = capability[1];
        }

        await this.waitForCapTimeout(capName);

        let capURL = await this.getCapability(capName);
        if (Object.keys(queryParams).length > 0)
        {
            const parsedURL = url.parse(capURL, true);
            for (const key of Object.keys(queryParams))
            {
                parsedURL.query[key] = queryParams[key];
            }
            capURL = url.format(parsedURL);
        }
        try
        {
            return await this.capsPerformXMLPut(capURL, data);
        }
        catch (error)
        {
            console.log('Error with cap ' + capName);
            console.log(error);
            throw error;
        }
    }

    shutdown(): void
    {
        this.onGotSeedCap.complete();
        if (this.eventQueueClient)
        {
            this.eventQueueClient.shutdown();
        }
        this.active = false;
    }
}
