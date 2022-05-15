declare var PassThrough: any;
declare var pluginMgr: any;
declare var wsParser: any;
declare var util: any;
declare var config: any;
declare var Buffer: any;
declare var pendingReqList: any;
declare var INTERVAL: number;
declare var proxy: any;
declare var index: number;
declare var MAX_PAYLOAD: number;
declare var conns: {};
declare var PING: any;
declare var PONG: any;
declare var PAUSE_STATUS: number;
declare var IGNORE_STATUS: number;
declare var MAX_COMPOSE_FRAME_COUNT: number;
declare function getFrameId(): string;
declare function handleSocketEnd(req: any, res: any, callback: any): void;
declare function handleClose(req: any, res: any, justTunnel: any): void;
declare function getStatus(ctx: any, status: any, name: any): any;
declare function setConnStatus(ctx: any, status: any, statusObj: any, name: any): void;
declare function initStatus(ctx: any, enable: any): void;
declare function removePending(reqId: any): void;
declare function pipeStream(src: any, target: any, useSrc: any): any;
declare function isHide(req: any): any;
declare function emitDataToProxy(req: any, chunk: any, fromClient: any, ignore: any): void;
declare function handleConnSend(ctx: any, reqTrans: any, sendStatus: any): void;
declare function handleConnReceive(ctx: any, resTrans: any, receiveStatus: any): void;
declare function clearupStatus(conns: any, reqId: any, sendStatus: any, receiveStatus: any): void;
declare function getBinary(data: any, len: any): any;
declare function drainData(status: any, socket: any, receiver: any, toServer: any): void;
declare function clearTimer(status: any): void;
declare function handleWsSend(ctx: any, reqTrans: any, sendStatus: any, isTunnel: any): void;
declare function handleWsReceive(ctx: any, resTrans: any, receiveStatus: any, isTunnel: any): void;
declare function getContext(req: any, res: any, hasEvent: any, sendStatus: any, receiveStatus: any): {
    customParser: any;
    req: any;
    res: any;
    hasEvent: any;
    url: any;
    charset: any;
    clearup: () => void;
    setSendStatus: (status: any) => void;
    setReceiveStatus: (status: any) => void;
};