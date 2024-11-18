export function isWalletEventMethodMatch(method, name) {
    return method === `metamask_${name}` || method === `wallet_events_${name}`;
}
