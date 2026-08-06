/* =========================================================
   Repair Legend Ver2
   quiz.js
   100問・カテゴリ別出題・選択肢シャッフル対応
   ========================================================= */

"use strict";

(function () {
    const QUIZ_DATA = Object.freeze([
    {
        "id": 1,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "落下後、画面の一部だけタッチが反応しません。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最初に優先する確認は？",
        "choices": [
            "別の正常な画面を仮付けする",
            "初期化する",
            "バッテリーを外す",
            "スピーカーを交換する"
        ],
        "correctIndex": 0,
        "explanation": "画面部品か本体側かを切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 2,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "画面が割れ、勝手にタッチされます。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最も疑うべき部品は？",
        "choices": [
            "ディスプレイ",
            "バッテリー",
            "カメラ",
            "スピーカー"
        ],
        "correctIndex": 0,
        "explanation": "ゴーストタッチは画面故障で起きることが多いです。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 3,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "充電ケーブルの角度で反応が変わります。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "最初の確認として適切なのは？",
        "choices": [
            "充電口の異物や摩耗",
            "Face ID設定",
            "音量設定",
            "壁紙設定"
        ],
        "correctIndex": 0,
        "explanation": "端子の詰まりや摩耗を先に確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 4,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "バッテリー交換後も電流が流れません。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "次に疑うべきものは？",
        "choices": [
            "基板または充電経路",
            "イヤースピーカー",
            "背面ガラス",
            "SIMトレイ"
        ],
        "correctIndex": 0,
        "explanation": "電源・充電経路の切り分けが必要です。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 5,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "画面交換後にTrue Toneが使えません。",
        "request": "画面表示と操作を正常に直したい",
        "question": "考えられる原因は？",
        "choices": [
            "必要情報が新画面へ移行されていない",
            "バッテリー容量不足",
            "マイク故障",
            "Wi-Fi不良"
        ],
        "correctIndex": 0,
        "explanation": "画面情報の移行状況を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 6,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "修理後にFace IDが使えません。",
        "request": "修理後の不具合を解消して正常に使いたい",
        "question": "最も重要な注意点は？",
        "choices": [
            "Face ID関連部品は本体と紐づく",
            "充電口交換で直る",
            "SIM交換で直る",
            "初期化で必ず直る"
        ],
        "correctIndex": 0,
        "explanation": "Face ID部品は本体固有です。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 7,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "SE2で指紋認証は使えるが押下が効きません。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "考えられる原因は？",
        "choices": [
            "ホームボタン接点や画面側配線",
            "バッテリー膨張",
            "カメラ故障",
            "スピーカー詰まり"
        ],
        "correctIndex": 0,
        "explanation": "押下信号経路を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 8,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "画面は真っ暗ですが着信音は鳴ります。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最初に行う切り分けは？",
        "choices": [
            "正常画面を仮付け",
            "初期化",
            "SIM再発行",
            "背面交換"
        ],
        "correctIndex": 0,
        "explanation": "表示部品か基板側かを切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 9,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "リンゴマークを繰り返します。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "症状名は？",
        "choices": [
            "リンゴループ",
            "ゴーストタッチ",
            "圏外病",
            "焼き付き"
        ],
        "correctIndex": 0,
        "explanation": "起動を繰り返す状態です。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 10,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "水没直後の端末です。",
        "request": "データを守りながら安全に復旧したい",
        "question": "最優先することは？",
        "choices": [
            "充電や通電を避ける",
            "何度も電源を入れる",
            "ドライヤーで加熱する",
            "長時間充電する"
        ],
        "correctIndex": 0,
        "explanation": "追加損傷を防ぎます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 11,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "バッテリーが膨張しています。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "適切な対応は？",
        "choices": [
            "使用を中止して早めに交換",
            "強く押し込む",
            "針で穴を開ける",
            "そのまま充電する"
        ],
        "correctIndex": 0,
        "explanation": "発熱・破損リスクがあります。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 12,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "充電はできるがPCに認識されません。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "確認項目として適切なのは？",
        "choices": [
            "ケーブル・充電口・データ通信経路",
            "壁紙",
            "着信音",
            "画面明るさ"
        ],
        "correctIndex": 0,
        "explanation": "充電と通信経路を切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 13,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "画面交換後、近接センサーが効きません。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最初に見る場所は？",
        "choices": [
            "センサー位置と部品移植状態",
            "バッテリー容量",
            "SIMカード",
            "スピーカー音量"
        ],
        "correctIndex": 0,
        "explanation": "位置ズレや損傷を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 14,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "通話中に画面が消えません。",
        "request": "画面表示と操作を正常に直したい",
        "question": "関連する部品は？",
        "choices": [
            "近接センサー",
            "ラウドスピーカー",
            "Taptic Engine",
            "リアカメラ"
        ],
        "correctIndex": 0,
        "explanation": "近接センサーが画面制御を行います。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 15,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "充電表示は出るが残量が増えません。",
        "request": "画面表示と操作を正常に直したい",
        "question": "確認すべき内容は？",
        "choices": [
            "バッテリー状態と実電流",
            "壁紙設定",
            "Face ID登録",
            "カメラ倍率"
        ],
        "correctIndex": 0,
        "explanation": "実電流を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 16,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "修理前は使えた部品が修理後に使えません。",
        "request": "修理後の不具合を解消して正常に使いたい",
        "question": "最優先の対応は？",
        "choices": [
            "修理工程と接続を再確認",
            "すぐ初期化",
            "放置",
            "別機種の部品を付ける"
        ],
        "correctIndex": 0,
        "explanation": "作業影響を優先確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 17,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "画面に白いシミが出ています。",
        "request": "画面表示と操作を正常に直したい",
        "question": "よくある原因は？",
        "choices": [
            "パネル圧迫や液晶損傷",
            "SIM不良",
            "スピーカー故障",
            "充電器不良"
        ],
        "correctIndex": 0,
        "explanation": "内部圧迫や表示層損傷です。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 18,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "画面に緑や紫の線が出ます。",
        "request": "画面表示と操作を正常に直したい",
        "question": "疑う部品は？",
        "choices": [
            "OLEDパネル",
            "バッテリー",
            "マイク",
            "アンテナ"
        ],
        "correctIndex": 0,
        "explanation": "OLED表示層の破損が考えられます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 19,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "落下後、カメラが揺れてピントが合いません。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "疑う部品は？",
        "choices": [
            "カメラの手ぶれ補正機構",
            "充電口",
            "イヤースピーカー",
            "SIMトレイ"
        ],
        "correctIndex": 0,
        "explanation": "OIS故障を疑います。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 20,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "スピーカー音が小さいです。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "交換前に確認することは？",
        "choices": [
            "メッシュ詰まりと設定",
            "初期化",
            "画面交換",
            "SIM交換"
        ],
        "correctIndex": 0,
        "explanation": "汚れや設定を先に確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 21,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "充電口に先端が折れて残っています。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "最初の対応は？",
        "choices": [
            "無理に通電せず除去可否を確認",
            "強く奥へ押す",
            "水をかける",
            "通電中に取る"
        ],
        "correctIndex": 0,
        "explanation": "端子損傷や短絡を避けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 22,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "バッテリー交換後に再起動を繰り返します。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "確認すべきことは？",
        "choices": [
            "コネクタ接続と部品適合",
            "壁紙",
            "音量",
            "Bluetooth名"
        ],
        "correctIndex": 0,
        "explanation": "接続不良や部品不良を切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 23,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "iPhoneが圏外です。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "最初の確認として適切なのは？",
        "choices": [
            "SIM/eSIM設定と通信障害",
            "画面交換",
            "スピーカー交換",
            "背面研磨"
        ],
        "correctIndex": 0,
        "explanation": "回線側と端末側を順に確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 24,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "MagSafeだけ反応しません。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "疑う部品は？",
        "choices": [
            "ワイヤレス充電コイル系統",
            "イヤースピーカー",
            "フロントカメラ",
            "SIMトレイ"
        ],
        "correctIndex": 0,
        "explanation": "コイルや接続経路を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 25,
        "category": "iPhone",
        "device": "iPhone 13",
        "difficulty": 2,
        "symptom": "画面交換後にタッチが不安定です。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最初の切り分けは？",
        "choices": [
            "別パネル仮付けとコネクタ確認",
            "初期化のみ",
            "SIM交換",
            "スピーカー清掃"
        ],
        "correctIndex": 0,
        "explanation": "部品不良・接続不良を切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 26,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "Pixelの画面交換後、指紋登録に失敗します。",
        "request": "画面表示と操作を正常に直したい",
        "question": "必要になる可能性がある作業は？",
        "choices": [
            "指紋キャリブレーション",
            "SIM再発行",
            "音量調整",
            "壁紙変更"
        ],
        "correctIndex": 0,
        "explanation": "Pixelは機種により校正が必要です。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 27,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "Galaxyの画面に緑線が出ています。",
        "request": "画面表示と操作を正常に直したい",
        "question": "疑う部品は？",
        "choices": [
            "OLEDパネル",
            "バッテリー",
            "スピーカー",
            "USBケーブル"
        ],
        "correctIndex": 0,
        "explanation": "OLED損傷を疑います。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 28,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "背面が浮いて本体が熱いです。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "最優先で疑うものは？",
        "choices": [
            "バッテリー膨張",
            "カメラ故障",
            "SIM不良",
            "マイク詰まり"
        ],
        "correctIndex": 0,
        "explanation": "安全上すぐ確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 29,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "充電が1%から増えません。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "確認する項目は？",
        "choices": [
            "実電流・バッテリー・充電口",
            "壁紙",
            "通知音",
            "指紋登録"
        ],
        "correctIndex": 0,
        "explanation": "充電経路を切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 30,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "画面は黒いが音は鳴ります。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最初の確認は？",
        "choices": [
            "正常画面の仮付け",
            "初期化",
            "SIM交換",
            "スピーカー交換"
        ],
        "correctIndex": 0,
        "explanation": "画面か本体側か確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 31,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "海外版Galaxyを修理します。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "重要な確認は？",
        "choices": [
            "型番と地域仕様",
            "壁紙",
            "着信音",
            "言語設定だけ"
        ],
        "correctIndex": 0,
        "explanation": "地域差で部品仕様が異なります。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 32,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "USB-C端子がぐらつきます。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "最初に見るべきものは？",
        "choices": [
            "異物・端子摩耗・基板固定",
            "画面明るさ",
            "指紋設定",
            "スピーカー音量"
        ],
        "correctIndex": 0,
        "explanation": "端子の物理状態を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 33,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "水没後に一度起動しましたが現在無反応です。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "適切な対応は？",
        "choices": [
            "通電を止め内部確認",
            "長時間充電",
            "加熱",
            "何度も再起動"
        ],
        "correctIndex": 0,
        "explanation": "追加腐食や短絡を防ぎます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 34,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "画面交換後に自動輝度が効きません。",
        "request": "画面表示と操作を正常に直したい",
        "question": "関連部品は？",
        "choices": [
            "環境光センサー",
            "バッテリー",
            "USB端子",
            "振動モーター"
        ],
        "correctIndex": 0,
        "explanation": "センサー位置を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 35,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "AQUOSで電源が入らないが画面交換で復旧しました。",
        "request": "画面表示と操作を正常に直したい",
        "question": "元の故障箇所は？",
        "choices": [
            "ディスプレイ系統",
            "SIMカード",
            "スピーカー",
            "ケース"
        ],
        "correctIndex": 0,
        "explanation": "表示不良だった可能性があります。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 36,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "バッテリー交換後に背面が浮きます。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "確認することは？",
        "choices": [
            "圧着・粘着・部品厚み",
            "壁紙",
            "着信音",
            "SIM PIN"
        ],
        "correctIndex": 0,
        "explanation": "組み立て状態を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 37,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "カメラ起動時に映像が震えます。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "疑うものは？",
        "choices": [
            "カメラモジュール",
            "バッテリー",
            "スピーカー",
            "USBケーブル"
        ],
        "correctIndex": 0,
        "explanation": "手ぶれ補正故障を疑います。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 38,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "通話で相手に声が届きません。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "確認順として適切なのは？",
        "choices": [
            "マイク穴・設定・録音テスト",
            "画面交換",
            "SIMトレイ交換",
            "背面交換"
        ],
        "correctIndex": 0,
        "explanation": "詰まり・設定・部品を切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 39,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "スピーカーが小さいです。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "交換前に確認することは？",
        "choices": [
            "汚れと音量設定",
            "初期化だけ",
            "画面交換",
            "SIM再発行"
        ],
        "correctIndex": 0,
        "explanation": "メッシュ詰まりを確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 40,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "充電は遅いが反応はあります。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "確認項目は？",
        "choices": [
            "充電器・ケーブル・規格・温度",
            "壁紙",
            "着信音",
            "カメラ倍率"
        ],
        "correctIndex": 0,
        "explanation": "急速充電条件を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 41,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "タッチが勝手に動きます。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最初に疑うものは？",
        "choices": [
            "画面部品",
            "バッテリーのみ",
            "スピーカー",
            "SIM"
        ],
        "correctIndex": 0,
        "explanation": "ゴーストタッチは画面故障が多いです。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 42,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "画面交換後に指紋だけ使えません。",
        "request": "画面表示と操作を正常に直したい",
        "question": "確認することは？",
        "choices": [
            "指紋センサー接続と校正",
            "音量",
            "Bluetooth",
            "壁紙"
        ],
        "correctIndex": 0,
        "explanation": "センサー・画面・校正を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 43,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "背面交換後にワイヤレス充電不可です。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "疑うものは？",
        "choices": [
            "コイル接続や位置",
            "スピーカー",
            "SIM",
            "フロントカメラ"
        ],
        "correctIndex": 0,
        "explanation": "位置ずれや接続不良を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 44,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "端末が異常発熱します。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "最初に行うことは？",
        "choices": [
            "使用・充電を止め原因確認",
            "冷凍庫へ入れる",
            "強制的に充電",
            "分解せず放置"
        ],
        "correctIndex": 0,
        "explanation": "安全確保を優先します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 45,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "電源は入るがタッチ不能です。",
        "request": "画面表示と操作を正常に直したい",
        "question": "切り分けとして適切なのは？",
        "choices": [
            "別画面仮付け",
            "SIM交換",
            "スピーカー交換",
            "背面研磨"
        ],
        "correctIndex": 0,
        "explanation": "画面側か基板側か確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 46,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "SDカードだけ読めません。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "確認するものは？",
        "choices": [
            "カード・スロット・設定",
            "画面",
            "バッテリー",
            "イヤースピーカー"
        ],
        "correctIndex": 0,
        "explanation": "媒体とスロットを切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 47,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "充電口交換後も充電しません。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "次に疑うべきものは？",
        "choices": [
            "基板充電回路",
            "画面",
            "スピーカー",
            "SIM"
        ],
        "correctIndex": 0,
        "explanation": "基板側を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 48,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "液晶漏れが広がっています。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "適切な案内は？",
        "choices": [
            "早めの画面交換",
            "強く押す",
            "加熱する",
            "放置で必ず直る"
        ],
        "correctIndex": 0,
        "explanation": "悪化する可能性があります。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 49,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "メーカー違いの同名機種です。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "部品選定で必要なものは？",
        "choices": [
            "正確な型番",
            "色だけ",
            "壁紙",
            "電話番号"
        ],
        "correctIndex": 0,
        "explanation": "型番違いを防ぎます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 50,
        "category": "Android",
        "device": "Androidスマートフォン",
        "difficulty": 2,
        "symptom": "画面が点滅します。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最初に確認するものは？",
        "choices": [
            "画面接続とパネル",
            "SIM",
            "スピーカー",
            "マイク"
        ],
        "correctIndex": 0,
        "explanation": "表示部品・接続を切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 51,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "TV出力はできるが本体画面だけ映りません。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最初に疑うものは？",
        "choices": [
            "液晶・バックライト系統",
            "ゲームカード",
            "Joy-Con",
            "SDカード"
        ],
        "correctIndex": 0,
        "explanation": "本体表示系統を切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 52,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "ゲームカードだけ読めずmicroSDは読めます。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "疑う部品は？",
        "choices": [
            "ゲームカードスロット",
            "SDスロット",
            "液晶",
            "バッテリー"
        ],
        "correctIndex": 0,
        "explanation": "カードスロットを確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 53,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "充電器を変えても無反応です。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "確認すべき箇所は？",
        "choices": [
            "USB-C端子と充電回路",
            "液晶のみ",
            "Joy-Conレールのみ",
            "SDカード"
        ],
        "correctIndex": 0,
        "explanation": "端子・バッテリー・基板回路を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 54,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "本体画面は黒いが音は出ます。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最初に行う切り分けは？",
        "choices": [
            "液晶仮付け",
            "初期化",
            "SD交換",
            "Joy-Con交換"
        ],
        "correctIndex": 0,
        "explanation": "表示部品を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 55,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "ゲームカードが途中までしか入りません。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "確認することは？",
        "choices": [
            "スロット内の異物や変形",
            "画面",
            "バッテリー",
            "Wi-Fi"
        ],
        "correctIndex": 0,
        "explanation": "物理的な詰まりを確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 56,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "SDカードを認識しません。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "まず確認するものは？",
        "choices": [
            "別の正常なSDカード",
            "液晶",
            "スピーカー",
            "ドック"
        ],
        "correctIndex": 0,
        "explanation": "カード側か本体側か切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 57,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "Joy-Conが本体装着時だけ認識しません。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "疑うものは？",
        "choices": [
            "レール・接点",
            "液晶",
            "ゲームカード",
            "SDカード"
        ],
        "correctIndex": 0,
        "explanation": "レール接点や配線を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 58,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "充電口が変形しています。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "適切な対応は？",
        "choices": [
            "無理に挿さず修理",
            "強く押し込む",
            "水をかける",
            "通電しながら曲げる"
        ],
        "correctIndex": 0,
        "explanation": "短絡や基板損傷を避けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 59,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "水没後に起動しません。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "最優先の対応は？",
        "choices": [
            "通電を避け内部確認",
            "長時間充電",
            "加熱",
            "何度も起動"
        ],
        "correctIndex": 0,
        "explanation": "追加損傷を防ぎます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 60,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "冷却ファンから異音がします。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "疑う部品は？",
        "choices": [
            "ファン",
            "液晶",
            "カードスロット",
            "SDカード"
        ],
        "correctIndex": 0,
        "explanation": "ファン摩耗や異物を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 61,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "高温警告で終了します。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "確認するものは？",
        "choices": [
            "ファン・グリス・吸排気",
            "画面",
            "Joy-Con",
            "SDカード"
        ],
        "correctIndex": 0,
        "explanation": "冷却系統を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 62,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "ドック接続時だけ映像が乱れます。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "確認項目は？",
        "choices": [
            "ドック・HDMI・USB-C端子",
            "ゲームカード",
            "Joy-Con",
            "SDカード"
        ],
        "correctIndex": 0,
        "explanation": "外部出力経路を切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 63,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "本体が膨らんでいます。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "疑うものは？",
        "choices": [
            "バッテリー膨張",
            "液晶のみ",
            "スピーカー",
            "SDカード"
        ],
        "correctIndex": 0,
        "explanation": "バッテリー状態を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 64,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "電源ボタンの反応が悪いです。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "確認するものは？",
        "choices": [
            "ボタン部品・フレックス",
            "液晶",
            "SDカード",
            "ゲームカード"
        ],
        "correctIndex": 0,
        "explanation": "ボタン配線や接点を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 65,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "音量ボタンだけ効きません。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "疑う部品は？",
        "choices": [
            "音量ボタンフレックス",
            "液晶",
            "バッテリー",
            "カードスロット"
        ],
        "correctIndex": 0,
        "explanation": "該当ボタン系統を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 66,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "イヤホンを挿しても本体から音が出ます。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "疑うものは？",
        "choices": [
            "イヤホンジャック検知",
            "液晶",
            "ゲームカード",
            "SDカード"
        ],
        "correctIndex": 0,
        "explanation": "ジャック接点や検知を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 67,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "タッチ操作だけ効きません。",
        "request": "画面表示と操作を正常に直したい",
        "question": "最初に疑う部品は？",
        "choices": [
            "タッチパネル",
            "バッテリー",
            "Joy-Con",
            "SDカード"
        ],
        "correctIndex": 0,
        "explanation": "タッチ系統を切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 68,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "本体が勝手にスリープします。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "確認するものは？",
        "choices": [
            "電源ボタン・センサー・設定",
            "液晶だけ",
            "SDカードだけ",
            "ゲームカードだけ"
        ],
        "correctIndex": 0,
        "explanation": "入力誤検知や設定を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 69,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "Wi-Fiがつながりにくいです。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "確認項目は？",
        "choices": [
            "設定・ルーター・アンテナ",
            "液晶",
            "カードスロット",
            "バッテリーのみ"
        ],
        "correctIndex": 0,
        "explanation": "環境要因と本体側を切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 70,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "Bluetooth接続が不安定です。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "確認項目は？",
        "choices": [
            "周辺機器・設定・無線系統",
            "画面",
            "SDカード",
            "ゲームカード"
        ],
        "correctIndex": 0,
        "explanation": "環境と本体無線を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 71,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "スピーカーから音割れします。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "疑うものは？",
        "choices": [
            "スピーカー",
            "液晶",
            "ゲームカード",
            "Joy-Conレール"
        ],
        "correctIndex": 0,
        "explanation": "スピーカー損傷や異物を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 72,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "ゲーム中に突然電源が落ちます。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "確認するものは？",
        "choices": [
            "バッテリー・発熱・電源回路",
            "壁紙",
            "SDカード名",
            "ユーザー名"
        ],
        "correctIndex": 0,
        "explanation": "電源供給と温度を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 73,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "充電マークは出るが起動しません。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "確認するものは？",
        "choices": [
            "バッテリー状態と起動電流",
            "画面色",
            "Joy-Con色",
            "SD容量だけ"
        ],
        "correctIndex": 0,
        "explanation": "蓄電できているか確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 74,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "修理後にネジが余りました。",
        "request": "修理後の不具合を解消して正常に使いたい",
        "question": "適切な対応は？",
        "choices": [
            "分解手順を再確認し正しい位置へ戻す",
            "捨てる",
            "無理に締める",
            "放置する"
        ],
        "correctIndex": 0,
        "explanation": "ネジ位置違いは故障原因です。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 75,
        "category": "Switch",
        "device": "Nintendo Switch",
        "difficulty": 2,
        "symptom": "基板修理前に重要な案内は？",
        "request": "原因を確認して安全に修理してほしい",
        "question": "基板修理前に重要な案内は？",
        "choices": [
            "データ保証不可や預かり期間",
            "必ず即日",
            "必ず初期化不要",
            "必ず成功"
        ],
        "correctIndex": 0,
        "explanation": "条件とリスクを説明します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 76,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "修理前の基本動作確認を行います。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "確認する目的は？",
        "choices": [
            "修理前後の変化を把握する",
            "時間を延ばす",
            "データを消す",
            "部品を増やす"
        ],
        "correctIndex": 0,
        "explanation": "作業前後を比較します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 77,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "端末を分解します。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "最初に重要なことは？",
        "choices": [
            "電源を切る",
            "充電しながら開ける",
            "濡らす",
            "強く加熱する"
        ],
        "correctIndex": 0,
        "explanation": "安全のため電源を切ります。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 78,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "バッテリーコネクタを外します。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "理由は？",
        "choices": [
            "通電を止め短絡を防ぐ",
            "音を大きくする",
            "画面を明るくする",
            "通信を速くする"
        ],
        "correctIndex": 0,
        "explanation": "短絡防止です。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 79,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "ネジ管理が必要です。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "理由は？",
        "choices": [
            "長さ違いで基板損傷を防ぐ",
            "色を揃える",
            "音を良くする",
            "通信改善"
        ],
        "correctIndex": 0,
        "explanation": "長いネジの誤位置を防ぎます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 80,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "部品交換前に仮付けします。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "目的は？",
        "choices": [
            "初期不良と改善有無の確認",
            "見た目だけ確認",
            "充電速度を上げる",
            "SIMを認識させる"
        ],
        "correctIndex": 0,
        "explanation": "組み上げ前に動作確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 81,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "水没端末を扱います。",
        "request": "データを守りながら安全に復旧したい",
        "question": "避けるべき行為は？",
        "choices": [
            "むやみに通電する",
            "内部確認する",
            "腐食確認する",
            "説明する"
        ],
        "correctIndex": 0,
        "explanation": "短絡が進む場合があります。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 82,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "修理後の防水性能について。",
        "request": "データを守りながら安全に復旧したい",
        "question": "適切な説明は？",
        "choices": [
            "元の防水性能は保証できない",
            "必ず新品同等",
            "絶対に水没しない",
            "何も説明しない"
        ],
        "correctIndex": 0,
        "explanation": "分解後は防水保証できません。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 83,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "データについて。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "適切な案内は？",
        "choices": [
            "データ保証はできない",
            "必ず残る",
            "必ず消える",
            "確認不要"
        ],
        "correctIndex": 0,
        "explanation": "データ保証はできません。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 84,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "修理不可時の調査費があります。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "受付時にどうする？",
        "choices": [
            "事前に説明する",
            "作業後だけ伝える",
            "隠す",
            "必ず無料にする"
        ],
        "correctIndex": 0,
        "explanation": "事前説明が必要です。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 85,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "部品に初期不良が疑われます。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "切り分け方法は？",
        "choices": [
            "別の正常部品で確認",
            "初期化だけ",
            "放置",
            "強く押す"
        ],
        "correctIndex": 0,
        "explanation": "比較用部品で切り分けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 86,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "コネクタを外します。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "正しい方法は？",
        "choices": [
            "垂直方向に慎重に外す",
            "ケーブルを引っ張る",
            "金属で短絡させる",
            "強くねじる"
        ],
        "correctIndex": 0,
        "explanation": "端子破損を防ぎます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 87,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "粘着を剥がします。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "注意点は？",
        "choices": [
            "ケーブルやバッテリーを傷つけない",
            "力任せに引く",
            "刃を深く入れる",
            "通電したまま作業"
        ],
        "correctIndex": 0,
        "explanation": "内部部品を傷つけないことが重要です。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 88,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "画面を圧着します。",
        "request": "画面表示と操作を正常に直したい",
        "question": "注意点は？",
        "choices": [
            "過度な圧力をかけない",
            "全体重をかける",
            "カメラ部を強く押す",
            "通電端子を曲げる"
        ],
        "correctIndex": 0,
        "explanation": "パネル損傷を防ぎます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 89,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "修理後に充電確認をします。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "見るべきものは？",
        "choices": [
            "表示だけでなく実電流",
            "壁紙",
            "着信音",
            "ユーザー名"
        ],
        "correctIndex": 0,
        "explanation": "実際に充電できているか確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 90,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "基板修理の見積りを案内します。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "必要な説明は？",
        "choices": [
            "期間・費用・データ保証不可",
            "必ず成功",
            "必ず即日",
            "必ず初期化"
        ],
        "correctIndex": 0,
        "explanation": "条件とリスクを明確にします。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 91,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "バッテリー膨張端末です。",
        "request": "電源・充電の不具合を診断して改善したい",
        "question": "保管時の注意は？",
        "choices": [
            "熱源を避け圧迫しない",
            "充電し続ける",
            "重い物を載せる",
            "穴を開ける"
        ],
        "correctIndex": 0,
        "explanation": "発熱・破損リスクを避けます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 92,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "ESD対策とは？",
        "request": "原因を確認して安全に修理してほしい",
        "question": "適切な対策は？",
        "choices": [
            "静電気による部品損傷を防ぐ対策",
            "防水対策",
            "音量調整",
            "通信設定"
        ],
        "correctIndex": 0,
        "explanation": "基板やICを静電気から守ります。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 93,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "顕微鏡で基板を見ます。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "主な目的は？",
        "choices": [
            "腐食・割れ・部品欠損確認",
            "画面色調整",
            "SIM設定",
            "音量確認"
        ],
        "correctIndex": 0,
        "explanation": "微細損傷を確認します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 94,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "端末を加熱して開けます。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "注意点は？",
        "choices": [
            "温度を上げすぎない",
            "最大温度で長時間",
            "バッテリーを直接加熱",
            "水をかける"
        ],
        "correctIndex": 0,
        "explanation": "温度管理が必要です。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 95,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "お客様の症状説明が曖昧です。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "適切な対応は？",
        "choices": [
            "発生条件や経緯を具体的に聞く",
            "すぐ断定する",
            "確認せず交換",
            "初期化だけ勧める"
        ],
        "correctIndex": 0,
        "explanation": "再現条件を聞きます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 96,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "修理前に端末外観を確認します。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "理由は？",
        "choices": [
            "既存傷や割れを記録する",
            "時間を延ばす",
            "音量を上げる",
            "通信改善"
        ],
        "correctIndex": 0,
        "explanation": "作業前状態を共有します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 97,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "動作確認ができない端末です。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "適切な案内は？",
        "choices": [
            "未確認機能の保証が難しいと説明",
            "すべて保証する",
            "確認不要",
            "必ず直ると言う"
        ],
        "correctIndex": 0,
        "explanation": "事前確認不可のリスクを伝えます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 98,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "修理後に不具合が再現しません。",
        "request": "修理後の不具合を解消して正常に使いたい",
        "question": "対応は？",
        "choices": [
            "再現条件を確認し経過観察を案内",
            "必ず基板交換",
            "即初期化",
            "無視する"
        ],
        "correctIndex": 0,
        "explanation": "条件を整理します。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 99,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "交換部品を選びます。",
        "request": "原因を確認して安全に修理してほしい",
        "question": "最重要情報は？",
        "choices": [
            "機種名と正確な型番",
            "ケース色だけ",
            "電話番号",
            "壁紙"
        ],
        "correctIndex": 0,
        "explanation": "型番違いを防ぎます。",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 100,
        "category": "修理知識",
        "device": "スマートフォン",
        "difficulty": 2,
        "symptom": "作業完了後に行うことは？",
        "request": "原因を確認して安全に修理してほしい",
        "question": "適切な確認は？",
        "choices": [
            "修理箇所と基本機能の再確認",
            "すぐ渡すだけ",
            "データ削除",
            "設定変更"
        ],
        "correctIndex": 0,
        "explanation": "修理後の総合確認が必要です。",
        "reward": 1000,
        "gaugeGain": 20
    }
]);
    let questionDeck = [];
    let lastQuestionId = null;

    function shuffleArray(source) {
        const array = [...source];
        for (let i = array.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function cloneQuestion(question, shuffleChoices = true) {
        const cloned = { ...question, choices: [...question.choices] };
        if (!shuffleChoices) return cloned;
        const indexed = cloned.choices.map((choice, index) => ({ choice, originalIndex: index }));
        const shuffled = shuffleArray(indexed);
        cloned.choices = shuffled.map(item => item.choice);
        cloned.correctIndex = shuffled.findIndex(item => item.originalIndex === question.correctIndex);
        return cloned;
    }

    function createQuestionDeck(forceReset = false) {
        if (questionDeck.length > 0 && !forceReset) return [...questionDeck];
        questionDeck = shuffleArray(QUIZ_DATA.map(question => question.id));
        return [...questionDeck];
    }

    function resetQuestionDeck() {
        questionDeck = [];
        lastQuestionId = null;
        return createQuestionDeck(true);
    }

    function getQuestionById(id) {
        return QUIZ_DATA.find(question => question.id === id) || null;
    }

    function getNextQuestion(options = {}) {
        const { category = null, shuffleChoices = true } = options;
        let candidates = QUIZ_DATA.filter(question => !category || question.category === category);
        if (candidates.length === 0) return null;
        if (candidates.length > 1 && lastQuestionId !== null) {
            candidates = candidates.filter(question => question.id !== lastQuestionId);
        }
        if (questionDeck.length === 0) createQuestionDeck(true);
        let selected = null;
        for (let i = 0; i < questionDeck.length; i += 1) {
            const question = getQuestionById(questionDeck[i]);
            if (question && (!category || question.category === category) && question.id !== lastQuestionId) {
                selected = question;
                questionDeck.splice(i, 1);
                break;
            }
        }
        if (!selected) selected = candidates[Math.floor(Math.random() * candidates.length)];
        lastQuestionId = selected.id;
        return cloneQuestion(selected, shuffleChoices);
    }

    function checkAnswer(question, selectedIndex) {
        if (!question) {
            return { isCorrect:false, correctIndex:-1, correctAnswer:"", explanation:"", reward:0, gaugeGain:0 };
        }
        const correctIndex = Number(question.correctIndex);
        const safeSelectedIndex = Number(selectedIndex);
        const isCorrect = Number.isInteger(safeSelectedIndex) && safeSelectedIndex === correctIndex;
        return {
            isCorrect,
            selectedIndex: safeSelectedIndex,
            correctIndex,
            correctAnswer: question.choices[correctIndex] || "",
            explanation: question.explanation || "",
            reward: isCorrect ? Number(question.reward) || 0 : 0,
            gaugeGain: isCorrect ? Number(question.gaugeGain) || 20 : 0
        };
    }

    function getAllQuestions() { return QUIZ_DATA.map(question => cloneQuestion(question, false)); }
    function getQuestionCount() { return QUIZ_DATA.length; }
    function getCategories() { return [...new Set(QUIZ_DATA.map(question => question.category))]; }

    window.RepairLegendQuiz = Object.freeze({
        createQuestionDeck,
        resetQuestionDeck,
        getNextQuestion,
        checkAnswer,
        getAllQuestions,
        getQuestionCount,
        getCategories
    });

    createQuestionDeck(true);
    console.log(`Repair Legend Quiz: ${QUIZ_DATA.length}問を読み込みました。`);
})();
