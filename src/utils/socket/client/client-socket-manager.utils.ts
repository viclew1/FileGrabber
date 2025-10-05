export function normalizePeerUrl(input: string): string {
    let raw = input.trim();
    if (!raw) throw new Error('Peer URL is empty');

    raw = raw.replace(/^(?:wss?:|https?:)\/\//i, '');
    const hostPort = raw.split('/')[0];

    if (/\[|\]/.test(hostPort)) {
        throw new Error('Do not use brackets [] for IPv6. Enter address like ::1:1234 or ::ffff:192.168.0.1:1234');
    }

    const lastColon = hostPort.lastIndexOf(':');
    if (lastColon <= 0 || lastColon === hostPort.length - 1) {
        throw new Error(
            'Peer must be in the form "host:port" (e.g., 123.44.55.66:1234, somehost.com:4567, or ::1:7890)',
        );
    }

    const host = hostPort.slice(0, lastColon);
    const portStr = hostPort.slice(lastColon + 1);

    if (!/^\d{2,5}$/.test(portStr)) {
        throw new Error('Port must be 2 to 5 digits');
    }

    const ipv4Regex = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
    const hostnameRegex = /^(?=.{1,253}$)(?!-)[A-Za-z0-9-]{1,63}(?:\.(?!-)[A-Za-z0-9-]{1,63})*$/;
    const isIpv6Like = host.includes(':');

    if (!(isIpv6Like || ipv4Regex.test(host) || hostnameRegex.test(host))) {
        throw new Error('Invalid host. Use IPv4, hostname, or IPv6 without brackets');
    }

    const port = portStr;
    if (isIpv6Like) {
        return `ws://[${host}]:${port}`;
    }
    return `ws://${host}:${port}`;
}
