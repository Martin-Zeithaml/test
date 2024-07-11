import * as shell from '/zowe/runtime/bin/libs/shell'

console.log('Trying to install zowe to datasets');
const result = shell.execOutSync('sh', '-c', '/zowe/runtime/bin/zwe install --ds-prefix USER.ZOWE.TEST');
if (result.rc == 0) {
    console.log('Zowe installed.');
} else {
    console.log(`Zowe installation failed with ${result.rc}.`);
}
