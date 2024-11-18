"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderCardano = exports.NAMI_TARGET = void 0;
const ProviderCardanoBase_1 = require("./ProviderCardanoBase");
const extension_bridge_injected_1 = require("@chargerwallet/extension-bridge-injected");
const utils_1 = require("./utils");
exports.NAMI_TARGET = 'nami-wallet';
const PROVIDER_EVENTS = {
    'connect': 'connect',
    'disconnect': 'disconnect',
    'accountChanged': 'accountChanged',
    'message_low_level': 'message_low_level',
};
class ProviderCardano extends ProviderCardanoBase_1.ProviderCardanoBase {
    get account() {
        return this._account;
    }
    get isConnected() {
        return this._account !== null;
    }
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { bridge: props.bridge || (0, extension_bridge_injected_1.getOrCreateExtInjectedJsBridge)({ timeout: props.timeout }) }));
        this._account = null;
        this._registerEvents();
        this.nami = Object.assign(Object.assign({}, this.walletInfo()), { name: 'Nami' });
        this.chargerwallet = Object.assign({}, this.walletInfo());
    }
    _registerEvents() {
        window.addEventListener('chargerwallet_bridge_disconnect', () => {
            this._handleDisconnected();
        });
        this.on(PROVIDER_EVENTS.message_low_level, (payload) => {
            const { method, params } = payload;
            if ((0, utils_1.isWalletEventMethodMatch)(method, PROVIDER_EVENTS.accountChanged)) {
                this._handleAccountChange(params);
            }
        });
    }
    _callBridge(params) {
        return this.bridgeRequest(params);
    }
    postMessage(param) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return this._callBridge(param);
    }
    _handleConnected(account, options) {
        this._account = account;
        if (options.emit && this.isConnectionStatusChanged('connected')) {
            this.connectionStatus = 'connected';
            this.emit('connect', account);
            this.emit('accountChanged', account);
        }
    }
    _handleDisconnected(options = { emit: true }) {
        if (options.emit && this.isConnectionStatusChanged('disconnected')) {
            this.connectionStatus = 'disconnected';
            this.emit('disconnect');
            this.emit('accountChanged', null);
        }
    }
    isAccountsChanged(address) {
        return address !== this._account;
    }
    _handleAccountChange(payload) {
        var _a;
        const account = (_a = payload.accounts) === null || _a === void 0 ? void 0 : _a.address;
        if (this.isAccountsChanged(account)) {
            this.emit('accountChanged', account || null);
        }
        if (!account) {
            this._handleDisconnected();
            return;
        }
        if (account) {
            this._handleConnected(account, { emit: false });
        }
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    // CIP30 Wallet API 👇
    walletInfo() {
        return {
            apiVersion: '0.1.0',
            name: 'ChargerWallet',
            icon: 'https://raw.githubusercontent.com/chargerwallet/chargerwallet-assets/refs/heads/main/cw_logo.png',
            isEnabled: () => Promise.resolve(true),
            enable: () => this.enable()
        };
    }
    enable() {
        return __awaiter(this, void 0, void 0, function* () {
            const API = {
                getNetworkId: () => this.getNetworkId(),
                getUtxos: (amount, paginate) => this.getUtxos(amount, paginate),
                getBalance: () => this.getBalance(),
                getUsedAddresses: () => this.getUsedAddresses(),
                getUnusedAddresses: () => this.getUnUsedAddress(),
                getChangeAddress: () => this.getChangeAddress(),
                getRewardAddresses: () => this.getRewardAddresses(),
                signTx: (tx, partialSign) => this.signTx(tx, partialSign),
                signData: (addr, payload) => this.signData(addr, payload),
                submitTx: (tx) => this.submitTx(tx),
                experimental: {
                    on: (eventName, callback) => this.namiOn(eventName, callback),
                    off: () => this.namiOff(),
                    getCollateral: () => this.getCollateral(),
                },
            };
            if (!this.account) {
                const result = yield this._callBridge({
                    method: 'connect',
                    params: undefined
                });
                this._handleConnected(result.account, { emit: true });
                return API;
            }
            return Promise.resolve(API);
        });
    }
    // CIP30 Dapp API 👇
    getNetworkId() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callBridge({
                method: 'getNetworkId',
                params: undefined
            });
        });
    }
    getUtxos(amount, paginate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callBridge({
                method: 'getUtxos',
                params: {
                    amount,
                    paginate
                }
            });
        });
    }
    getCollateral() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve([]);
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callBridge({
                method: 'getBalance',
                params: undefined
            });
        });
    }
    getUsedAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callBridge({
                method: 'getUsedAddresses',
                params: undefined
            });
        });
    }
    getUnUsedAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callBridge({
                method: 'getUnusedAddresses',
                params: undefined
            });
        });
    }
    getChangeAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callBridge({
                method: 'getChangeAddress',
                params: undefined
            });
        });
    }
    getRewardAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callBridge({
                method: 'getRewardAddresses',
                params: undefined
            });
        });
    }
    signTx(tx, partialSign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callBridge({
                method: 'signTx',
                params: {
                    tx,
                    partialSign
                }
            });
        });
    }
    signData(addr, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callBridge({
                method: 'signData',
                params: {
                    addr,
                    payload
                }
            });
        });
    }
    submitTx(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callBridge({
                method: 'submitTx',
                params: tx
            });
        });
    }
    /**
     * @param {string} eventName
     * @param {Function} callback
     */
    namiOn(eventName, callback) {
        const handler = (event) => callback(event.detail);
        // @ts-ignore
        const events = window.cardano.nami._events[eventName] || [];
        // @ts-ignore
        window.cardano.nami._events[eventName] = [...events, [callback, handler]];
        window.addEventListener(`${exports.NAMI_TARGET}${eventName}`, handler);
    }
    namiOff() {
        // empty
    }
}
exports.ProviderCardano = ProviderCardano;
