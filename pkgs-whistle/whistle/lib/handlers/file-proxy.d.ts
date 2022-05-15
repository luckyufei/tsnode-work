declare var fs: any;
declare var extend: any;
declare var util: any;
declare var mime: any;
declare var qs: any;
declare var Buffer: any;
declare var PassThrough: any;
declare var protoMgr: any;
declare var pluginMgr: any;
declare var CRLF_RE: RegExp;
declare var RAW_FILE_RE: RegExp;
declare var HEADERS_SEP_RE: RegExp;
declare var MAX_HEADERS_SIZE: number;
declare var TPL_RE: RegExp;
declare function isRawFileProtocol(protocol: any): boolean;
declare function readFiles(files: any, callback: any): void;
declare function parseRes(str: any, rawHeaderNames: any, fromValue: any): {
    statusCode: any;
    headers: any;
};
declare function addLength(reader: any, length: any): void;
declare function getRawResByValue(body: any): {
    statusCode: any;
    headers: any;
};
declare function getRawResByPath(protocol: any, path: any, req: any, size: any, callback: any, body: any): void;
declare function addRangeHeaders(res: any, range: any, size: any): void;
