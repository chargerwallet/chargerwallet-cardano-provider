import { IInjectedProviderNames } from '@chargerwallet/cross-inpage-provider-types';
import { ProviderBase } from '@chargerwallet/cross-inpage-provider-core';
class ProviderCardanoBase extends ProviderBase {
    constructor(props) {
        super(props);
        this.providerName = IInjectedProviderNames.cardano;
    }
    request(data) {
        return this.bridgeRequest(data);
    }
}
export { ProviderCardanoBase };