const path = require('path');

const express = require('express');
const webPush = require('web-push');

// サーバ

// Push 通知に使用する鍵ペアを読み込んでおく
const applicationServerKeys = require('./application-server-keys.json');
webPush.setVapidDetails('mailto:example@example.com', applicationServerKeys.publicKey, applicationServerKeys.privateKey);

// サーバ準備
const app = express();
app.use(express.urlencoded({ extended: false }));  // POST Body (URL Encoded)
app.use(express.json());  // POST JSON
app.use('/', express.static(path.resolve(__dirname, '../client')));  // 静的ファイル

/** @type {Array<PushSubscription>} 通知の送信先情報を控えておく */
const pushSubscriptions = [];

// Subscribe : 通知の送信先情報を控える
app.post('/subscribe', (req, res) => {
  console.log(new Date().toISOString(), '[/subscribe]', pushSubscriptions.length);
  
  /** @type {PushSubscription} `webPush.PushSubscription` インターフェースとも同型 */
  const pushSubscription = req.body;
  pushSubscriptions.push(pushSubscription);
  
  console.log(new Date().toISOString(), '[/subscribe] : クライアントを登録した : ', pushSubscriptions.length);
  res.json({ result: '登録しました！', pushSubscription });  // 確認用に受信した内容も返信しておく
});

// Push : 控えておいた通知先に一斉送信する
app.get('/push', async (_req, res) => {
  console.log(new Date().toISOString(), '[/push]', pushSubscriptions.length);
  
  try {
    // Payload はテキトーに用意しておく
    const payload = JSON.stringify({
      title: 'Message From Server',
      body: 'サーバからの通知メッセージです。Service Worker が受け取ってくれるはず'
    });
    
    /** @type {Array<webPush.SendResult>} Push 送信の結果 */
    const sendResults = await Promise.all(pushSubscriptions.map((pushSubscription) => webPush.sendNotification(pushSubscription, payload)));
    console.log(new Date().toISOString(), '[/push] : 一斉通知成功 : ', sendResults);
    
    res.json({ result: '一斉通知しました！', sendResults });  // 確認用に通知した内容も返信しておく
  }
  catch(error) {
    console.warn(new Date().toISOString(), '[/push] : 一斉通知に失敗 : ', error);
    res.json({ result: '一斉通知に失敗しました', error: error.toString() });
  }
});

// サーバ起動
const port = 8080;
app.listen(port, () => {
  console.log(new Date().toISOString(), `サーバ起動 : http://localhost:${port}/`);
});
