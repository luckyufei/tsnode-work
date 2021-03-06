export namespace rules {
    export const recycleBin: import("./recycle-bin");
    export function enableBackRulesFirst(backRulesFirst: any): void;
    export { moveRulesTo as moveTo };
    export function moveToTop(name: any, clientId: any): void;
    export function get(file: any): any;
    export function remove(file: any, clientId: any): void;
    export function add(file: any, data: any, clientId: any): void;
    export function rename(file: any, newFile: any, clientId: any): void;
    export { selectRulesFile as select };
    export { unselectRulesFile as unselect };
    export { getAllRulesFile as list };
    export { getDefaultRules as getDefault };
    export function setDefault(value: any, clientId: any): void;
    export { enableDefaultRules as enableDefault };
    export { disableDefaultRules as disableDefault };
    export { defaultRulesIsDisabled };
    export { parseRules };
    export { clearSelection };
    export { getSelectedRulesList as getSelectedList };
}
export namespace values {
    const recycleBin_1: import("./recycle-bin");
    export { recycleBin_1 as recycleBin };
    export function getUploadFiles(): any[];
    export function download(name: any, res: any): any;
    export function existsFile(name: any): any;
    export { MAX_FILENAME_LEN as LIMIMT_FILES_COUNT };
    export function addUploadFile(options: any, callback: any): any;
    export function removeUploadFile(name: any, callback: any): any;
    export function moveTo(fromName: any, toName: any, clientId: any): true | undefined;
    export function add_1(file: any, data: any, clientId: any): void;
    export { add_1 as add };
    export function get_1(file: any): any;
    export { get_1 as get };
    export function remove_1(file: any, clientId: any): void;
    export { remove_1 as remove };
    export function rename_1(file: any, newFile: any, clientId: any): void;
    export { rename_1 as rename };
    export function list(): any;
    export function select(file: any): void;
    export function unselect(): void;
}
export namespace properties {
    export function getLatestVersion(): string;
    export function isEnableCapture(): any;
    export function setEnableCapture(enable: any): void;
    export function isEnableHttp2(): any;
    export function setEnableHttp2(enable: any): void;
    export function set(name: any, value: any): void;
    export function remove_2(name: any): void;
    export { remove_2 as remove };
    export function get_2(name: any): any;
    export { get_2 as get };
    export function getHistory(): any[];
    export function addHistory(data: any): void;
}
export function addRules(rules: any, replace: any, clientId: any): void;
export function addValues(values: any, replace: any, clientId: any): void;
export function setup(p: any): void;
export function parseRules(): void;
declare function moveRulesTo(fromName: any, toName: any, clientId: any): true | undefined;
declare function selectRulesFile(file: any): any;
declare function unselectRulesFile(file: any, force: any): any;
declare function getAllRulesFile(): any;
declare function getDefaultRules(): any;
declare function enableDefaultRules(): void;
declare function disableDefaultRules(): void;
declare function defaultRulesIsDisabled(): any;
declare function clearSelection(): void;
declare function getSelectedRulesList(): any;
declare var MAX_FILENAME_LEN: number;
export {};
