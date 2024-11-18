/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export function defineWindowCardanoProperty(property, provider) {
    const proxyProvider = new Proxy(provider, {
        defineProperty(target, property, attributes) {
            if (property !== 'nami') {
                return Reflect.defineProperty(target, property, attributes);
            }
            // skip define Prevent overwriting
            console.log('skip define Prevent overwriting');
            return true;
        },
    });
    Object.keys(provider).forEach((key) => {
        var _a;
        ((_a = window[property]) !== null && _a !== void 0 ? _a : {})[key] = proxyProvider[key];
    });
    Object.defineProperty(window, property, {
        configurable: false,
        get() {
            return proxyProvider;
        },
        set(val) {
            // skip set
        },
    });
}
