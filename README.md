# Practice Service Worker Notification

Service Worker と Push API を利用して、ブラウザタブを閉じていても通知が表示される仕組みを実現します。


## 試し方

```bash
$ npm install
```

`postinstall` スクリプト (`./generate-application-server-keys.js`) が実行され `./server/application-server-keys.json` ファイルが生成される。

この JSON ファイル内にある `publicKey` の値を、`./client/index.html` 内にある定数 `const applicationServerPublicKey` の値に貼り付けておく。

```bash
$ npm start

2022-01-01T00:00:00.000Z サーバ起動 : http://localhost:8080/
```

サーバを起動したら <http://localhost:8080/> にアクセスし、画面に従ってボタンを押下していく。

```
# 「Service Worker 登録」ボタン押下時 : クライアントの開発者コンソール例
Register : Start
service-worker.js: 【SW】Install : Service Worker のインストールが開始された
  Service Worker を初回登録しています…
  Service Worker の初回インストール状況 :  installed
  Service Worker の初回インストール状況 :  activated
Register : Finished … Service Worker を登録しました

# 「Subscribe」ボタン押下 : クライアントの開発者コンソール例
Subscribe : Start
  Service Worker を取得
  Subscribe 成功
Subscribe : Finished … Subscribe しました

# サーバ側のログ出力例
2022-01-01T00:00:00.000Z [/subscribe] 0
2022-01-01T00:00:00.000Z [/subscribe] : クライアントを登録した :  1

# 「Push」ボタン押下 : クライアントの開発者コンソール例
Push : Start
service-worker.js: 【SW】Push : メッセージを受信した
Push : Finished … サーバに Push 通知を要求しました

# サーバ側のログ出力例
2022-01-01T00:00:00.000Z [/push] 1
2022-01-01T00:00:00.000Z [/push] : 一斉通知成功 :  [
  {
    statusCode: 201,
    body: '',
    headers: {
      location: 'https://fcm.googleapis.com/0:0000000000000000%ffffffffffffffff',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'SAMEORIGIN',
      'x-xss-protection': '0',
      date: 'Sat, 01 Jan 2022 00:00:00 GMT',
      'content-length': '0',
      'content-type': 'text/html; charset=UTF-8',
      'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000,h3-Q050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"',
      connection: 'close'
    }
  }
]
```

Service Worker の登録と Subscribe がうまくできていれば、ブラウザタブを閉じた後でも Push 通知を受信できる。

```bash
# curl から Push 通知の送信要求をして動作確認してみる
$ curl http://localhost:8080/push
```


## Links

- [Neo's World](https://neos21.net/)
