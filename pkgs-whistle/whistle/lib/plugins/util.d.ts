declare var util: any;
declare var config: any;
declare var protocols: any;
declare var ORG_RE: RegExp;
declare var WHISLTE_PLUGIN_RE: RegExp;
declare var HTTP_RE: RegExp;
declare var PLUGIN_NAME_RE: RegExp;
declare function isOrgModule(name: any): boolean;
declare function isWhistleModule(name: any): boolean;
declare function getHomePageFromPackage(pkg: any): any;
declare function extractUrl(repository: any): any;