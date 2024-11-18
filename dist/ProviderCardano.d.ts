import { ProviderBase } from '@chargerwallet/cross-inpage-provider-core';
import { ProviderCardanoBase } from './ProviderCardanoBase';
import { IInpageProviderConfig } from '@chargerwallet/cross-inpage-provider-core';
import { IJsonRpcRequest } from '@chargerwallet/cross-inpage-provider-types';
import { Cbor, Bytes, Cip30DataSignature, Cip30Wallet, NetworkId, Paginate, WalletApi } from './types';
import * as TypeUtils from './type-utils';
export declare const NAMI_TARGET = "nami-wallet";
export type CardanoRequest = WalletApi & {
    connect: () => Promise<{
        account: string;
    }>;
    getUtxos: (params: {
        amount?: Cbor;
        paginate?: Paginate;
    }) => Promise<Cbor[] | undefined>;
    signTx: (params: {
        tx: Cbor;
        partialSign?: boolean;
    }) => Promise<Cbor>;
    signData: (params: {
        addr: Cbor;
        payload: Bytes;
    }) => Promise<Cip30DataSignature>;
};
export type JsBridgeRequest = {
    [K in keyof CardanoRequest]: (params: Parameters<CardanoRequest[K]>[0]) => Promise<TypeUtils.WireStringified<TypeUtils.ResolvePromise<ReturnType<CardanoRequest[K]>>>>;
};
declare const PROVIDER_EVENTS: {
    readonly connect: "connect";
    readonly disconnect: "disconnect";
    readonly accountChanged: "accountChanged";
    readonly message_low_level: "message_low_level";
};
type CardanoProviderEventsMap = {
    [PROVIDER_EVENTS.connect]: (account: string) => void;
    [PROVIDER_EVENTS.disconnect]: () => void;
    [PROVIDER_EVENTS.accountChanged]: (account: string | null) => void;
    [PROVIDER_EVENTS.message_low_level]: (payload: IJsonRpcRequest) => void;
};
interface IProviderCardano extends ProviderBase {
    isConnected: boolean;
    chargerwallet: Cip30Wallet;
    getNetworkId(): Promise<NetworkId>;
}
type ChargerWalletCardanoProviderProps = IInpageProviderConfig & {
    timeout?: number;
};
declare class ProviderCardano extends ProviderCardanoBase implements IProviderCardano {
    private _account;
    get account(): string | null;
    get isConnected(): boolean;
    chargerwallet: Cip30Wallet;
    nami: Cip30Wallet;
    constructor(props: ChargerWalletCardanoProviderProps);
    private _registerEvents;
    private _callBridge;
    private postMessage;
    private _handleConnected;
    private _handleDisconnected;
    isAccountsChanged(address: string): boolean;
    private _handleAccountChange;
    on<E extends keyof CardanoProviderEventsMap>(event: E, listener: CardanoProviderEventsMap[E]): this;
    emit<E extends keyof CardanoProviderEventsMap>(event: E, ...args: Parameters<CardanoProviderEventsMap[E]>): boolean;
    walletInfo(): Cip30Wallet;
    enable(): Promise<{
        getNetworkId: () => Promise<NetworkId>;
        getUtxos: (amount?: Cbor, paginate?: Paginate) => Promise<string[] | undefined>;
        getBalance: () => Promise<string>;
        getUsedAddresses: () => Promise<string[]>;
        getUnusedAddresses: () => Promise<string[]>;
        getChangeAddress: () => Promise<string>;
        getRewardAddresses: () => Promise<string[]>;
        signTx: (tx: Cbor, partialSign?: boolean) => Promise<string>;
        signData: (addr: Cbor, payload: Bytes) => Promise<{
            key: string;
            signature: string;
        }>;
        submitTx: (tx: Cbor) => Promise<string>;
        experimental: {
            on: (eventName: string, callback: (detail: any) => void) => void;
            off: () => void;
            getCollateral: () => Promise<never[]>;
        };
    }>;
    getNetworkId(): Promise<NetworkId>;
    getUtxos(amount?: Cbor, paginate?: Paginate): Promise<string[] | undefined>;
    getCollateral(): Promise<never[]>;
    getBalance(): Promise<string>;
    getUsedAddresses(): Promise<Cbor[]>;
    getUnUsedAddress(): Promise<string[]>;
    getChangeAddress(): Promise<string>;
    getRewardAddresses(): Promise<string[]>;
    signTx(tx: Cbor, partialSign?: boolean): Promise<string>;
    signData(addr: Cbor, payload: Bytes): Promise<{
        key: string;
        signature: string;
    }>;
    submitTx(tx: Cbor): Promise<string>;
    /**
     * @param {string} eventName
     * @param {Function} callback
     */
    namiOn(eventName: string, callback: (detail: any) => void): void;
    namiOff(): void;
}
export { ProviderCardano };
