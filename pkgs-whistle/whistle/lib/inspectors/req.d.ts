declare var qs: any;
declare var iconv: any;
declare var util: any;
declare var extend: any;
declare var hparser: any;
declare var pluginMgr: any;
declare var config: any;
declare var Transform: any;
declare var WhistleTransform: any;
declare var ReplacePatternTransform: any;
declare var ReplaceStringTransform: any;
declare var FileWriterTransform: any;
declare var toMultiparts: any;
declare var MultipartParser: any;
declare var JSON_RE: RegExp;
declare var MAX_REQ_SIZE: number;
declare var REQ_TYPE: {
    urlencoded: string;
    form: string;
    json: string;
    xml: string;
    text: string;
    upload: string;
    multipart: string;
    defaultType: string;
};
/**
 * 处理请求数据
 *
 * @param req：method、body、headers，top，bottom，speed、delay，charset,timeout
 * @param data
 */
declare function handleReq(req: any, data: any): void;
declare function handleAuth(data: any, auth: any): void;
declare function handleParams(req: any, params: any, urlParams: any): void;
