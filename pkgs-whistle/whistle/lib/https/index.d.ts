declare var net: any;
declare var tls: any;
declare var http: any;
declare var url: any;
declare var socks: any;
declare var crypto: Crypto;
declare var EventEmitter: any;
declare var Buffer: any;
declare var LRU: any;
declare var checkSNI: any;
declare var util: any;
declare var extend: any;
declare var config: any;
declare var rules: any;
declare var pluginMgr: any;
declare var socketMgr: any;
declare var hparser: any;
declare var properties: any;
declare var ca: any;
declare var loadCert: any;
declare var h2Consts: any;
declare var STATUS_CODES: any;
declare var getRawHeaders: any;
declare var getRawHeaderNames: any;
declare var formatHeaders: any;
declare var parseReq: any;
declare var getDomain: any;
declare var serverAgent: any;
declare var getSNIServer: any;
declare var getHttp2Server: any;
declare var LOCALHOST: string;
declare var tunnelTmplData: any;
declare var TIMEOUT: number;
declare var CONN_TIMEOUT: number;
declare var X_RE: RegExp;
declare var proxy: any, server: any;
declare function handleWebsocket(socket: any, clientIp: any, clientPort: any): void;
declare function resolveWebsocket(socket: any, wss: any): void;
declare function getTunnelData(socket: any, clientIp: any, clientPort: any, isHttpH2: any): {
    clientIp: any;
    clientPort: any;
    remoteAddr: any;
    remotePort: any;
    clientId: any;
    proxyAuth: any;
    tunnelData: any;
    headers: any;
    tunnelFirst: any;
    isHttpH2: any;
    sniPlugin: any;
};
declare function addReqInfo(req: any): void;
declare function getStatusMessage(obj: any): any;
declare function addStreamEvents(stream: any, handleAbort: any): void;
declare function toHttp1(req: any, res: any): void;
declare var handlers: {
    request: (req: any, res: any) => void;
    upgrade: (req: any, socket: any) => void;
};
declare var h2Handlers: {
    request: (req: any, res: any) => void;
    upgrade: (req: any, socket: any) => void;
};
declare var HTTP_RE: RegExp;
declare var HTTP2_RE: RegExp;
declare var CONNECT_RE: RegExp;
declare function addClientInfo(socket: any, chunk: any, statusLine: any, clientIp: any, clientPort: any): any;