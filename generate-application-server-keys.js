const fs = require('fs');
const path = require('path');

const webPush = require('web-push');

// Push 通知に使用する鍵ペアを生成する

const applicationServerKeysFileName = 'application-server-keys.json';
const applicationServerKeysFilePath = path.resolve(__dirname, './server/', applicationServerKeysFileName);
if(fs.existsSync(applicationServerKeysFilePath)) return console.log(`[${applicationServerKeysFileName}] ファイルが既に存在します。中止します。`);

const { publicKey, privateKey } = webPush.generateVAPIDKeys();
fs.writeFileSync(applicationServerKeysFilePath, JSON.stringify({ publicKey, privateKey }, null, '  ') + '\n', 'utf-8');
console.log(`[${applicationServerKeysFileName}] ファイルを生成しました。`);
console.log('ファイル内の `publicKey` の文字列を `./client/index.html` 内の定数 `applicationPublicKey` に記述してください。');
