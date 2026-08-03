/* =========================================================
   Repair Legend Ver2
   quiz.js - 100問統合・構文修正版

   ・問題1〜100をQUIZ_DATAへ統合
   ・4択シャッフル対応
   ・問題重複防止
   ・難易度1〜5対応
   ・game.jsのcategory指定とplatform指定に対応
   ・getQuestionById / checkAnswer対応
   ========================================================= */　

"use strict";

(function () {
    const QUIZ_PLATFORMS = Object.freeze({
        IPHONE: "iPhone",
        ANDROID: "Android",
        SWITCH: "Switch",
        REPAIR: "修理知識"
    });

    const QUIZ_DIFFICULTIES = Object.freeze({
        EASY: 1,
        NORMAL: 2,
        HARD: 3,
        EXPERT: 4,
        LEGEND: 5
    });

    const QUIZ_DATA = [
    {
        id: 1,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 2,
        symptom: "落下後、表示は正常ですが画面の一部だけタッチが反応しません。",
        question: "この症状の切り分けとして最初に優先する確認は？",
        choices: [
            "別の正常な画面を仮付けしてタッチ範囲を確認する",
            "バッテリーを交換して最大容量を確認する",
            "リアカメラを外して再起動する",
            "SIMカードを入れ直して通信を確認する"
        ],
        correctIndex: 0,
        explanation: "表示とタッチは別系統で故障することがあります。まず正常な画面でタッチ不良が画面側か本体側かを切り分けます。",
        repairName: "タッチ不良診断",
        reward: 1500,
        gaugeGain: 20
    },

    {
        id: 2,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "画面交換後、触っていないのに勝手に操作されます。",
        question: "最も優先度の高い確認項目は？",
        choices: [
            "バッテリー最大容量と充電回数",
            "SIM契約と通信制限",
            "スピーカー穴の詰まり",
            "交換画面の初期不良・コネクター接続・フレーム干渉"
        ],
        correctIndex: 3,
        explanation: "画面交換直後のゴーストタッチは、パネル不良、接続不良、フレーム圧迫などを優先して確認します。",
        repairName: "ゴーストタッチ診断",
        reward: 1800,
        gaugeGain: 22
    },

    {
        id: 3,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 2,
        symptom: "着信音とバイブはありますが、画面は真っ暗です。",
        question: "分解前の切り分けとして最も適切なのは？",
        choices: [
            "SIMカードを交換して圏外を確認する",
            "充電口を交換してから画面を見る",
            "強制再起動と画面表示系の確認を行う",
            "すぐに初期化してソフト不良を除外する"
        ],
        correctIndex: 2,
        explanation: "本体が動作している可能性が高いため、強制再起動と表示系の切り分けを先に行います。",
        repairName: "画面表示診断",
        reward: 1500,
        gaugeGain: 20
    },

    {
        id: 4,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "画面交換後、スクロールが以前より明らかに滑らかではありません。",
        question: "最も可能性が高い原因は？",
        choices: [
            "SIMカードの通信速度が低い",
            "交換パネルが本来のリフレッシュレートに対応していない",
            "近接センサーの位置がずれている",
            "バッテリー最大容量が80％未満"
        ],
        correctIndex: 1,
        explanation: "高リフレッシュレート対応機では、交換パネルの仕様により滑らかさが低下することがあります。",
        repairName: "パネル性能確認",
        reward: 1900,
        gaugeGain: 22
    },

    {
        id: 5,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "画面交換後、True Toneの項目が消えました。",
        question: "最も適切な説明は？",
        choices: [
            "元画面の表示情報が引き継がれていない可能性がある",
            "Face IDの登録数が上限に達している",
            "バッテリーが非純正だから表示されない",
            "iCloudからサインアウトしていない"
        ],
        correctIndex: 0,
        explanation: "機種や修理方法によりますが、元画面情報の移行がTrue Tone維持に関係します。",
        repairName: "True Tone確認",
        reward: 1900,
        gaugeGain: 22
    },

    {
        id: 6,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換後、Face IDだけが使用できなくなりました。",
        question: "最初に確認すべき箇所は？",
        choices: [
            "Lightning端子のデータライン",
            "バッテリーセルの電圧",
            "リアカメラの手ぶれ補正",
            "上部センサーフレックスの損傷・接続・位置"
        ],
        correctIndex: 3,
        explanation: "画面交換後のFace ID不良は、上部センサー周辺の損傷や接続不良を優先して確認します。",
        repairName: "Face ID関連点検",
        reward: 2200,
        gaugeGain: 24
    },

    {
        id: 7,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "インカメラは映りますがFace IDは使用できません。",
        question: "この状態から判断できることとして正しいものは？",
        choices: [
            "必ずiOSの不具合だけが原因である",
            "画面交換で必ず改善する",
            "インカメラが映ってもFace ID関連センサーが正常とは限らない",
            "インカメラが映るならFace ID故障はあり得ない"
        ],
        correctIndex: 2,
        explanation: "インカメラとFace IDは関連しますが同一機能ではなく、一部センサーだけ故障する場合があります。",
        repairName: "Face ID切り分け",
        reward: 2300,
        gaugeGain: 24
    },

    {
        id: 8,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "通話中、端末を耳に当てても画面が消えません。",
        question: "画面交換後なら特に確認すべきものは？",
        choices: [
            "SIMトレーの変形",
            "近接センサーの位置・汚れ・パネル側の透過部",
            "ラウドスピーカーの抵抗値",
            "バッテリーの充電回数"
        ],
        correctIndex: 1,
        explanation: "近接センサーの位置ずれやパネル側の仕様で検知できないことがあります。",
        repairName: "近接センサー調整",
        reward: 1800,
        gaugeGain: 22
    },

    {
        id: 9,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "画面交換後、明るさの自動調整が不自然です。",
        question: "最も関連が深い確認箇所は？",
        choices: [
            "環境光センサー周辺の位置・汚れ・遮光状態",
            "充電口内部の異物",
            "リアカメラのレンズ曇り",
            "バッテリーコネクターの電圧"
        ],
        correctIndex: 0,
        explanation: "自動輝度は環境光センサーに依存するため、画面交換後は位置や遮光状態を確認します。",
        repairName: "環境光センサー調整",
        reward: 1800,
        gaugeGain: 22
    },

    {
        id: 10,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "指紋認証は使えますが、ホームボタンを押しても反応しません。",
        question: "優先して確認する組み合わせは？",
        choices: [
            "SIMトレー・アンテナ・ベースバンド",
            "リアカメラ・フラッシュ・NFC",
            "バッテリーセル・充電IC・MagSafe",
            "ホームボタン周辺ケーブル・接点・パネル側経路"
        ],
        correctIndex: 3,
        explanation: "Touch IDが生きていて押下だけ無反応なら、押下信号の経路を優先して確認します。",
        repairName: "ホームボタン押下診断",
        reward: 2300,
        gaugeGain: 24
    },

    {
        id: 11,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "別端末のホームボタンへ交換したところ、押下はできますが指紋認証が使えません。",
        question: "最も適切な説明は？",
        choices: [
            "SIMカードが別契約のため",
            "バッテリー最大容量が低いため",
            "Touch ID部品は本体と関連付けられているため",
            "画面の色が異なるため"
        ],
        correctIndex: 2,
        explanation: "Touch ID関連部品は本体とペアリングされており、単純交換では指紋認証を維持できません。",
        repairName: "Touch ID仕様説明",
        reward: 2400,
        gaugeGain: 24
    },

    {
        id: 12,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "落下後、画面に縦線が出ていますがタッチはできます。",
        question: "最初に行う切り分けとして適切なのは？",
        choices: [
            "スピーカーを外して再起動する",
            "正常な画面の仮付けで表示不良が画面側か確認する",
            "初期化して表示設定を戻す",
            "SIMカードを交換して通信を確認する"
        ],
        correctIndex: 1,
        explanation: "落下後の縦線は画面破損が多いですが、仮付けで画面側か本体側かを確認します。",
        repairName: "縦線表示診断",
        reward: 1700,
        gaugeGain: 20
    },

    {
        id: 13,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "黒いにじみが徐々に広がっています。",
        question: "最も可能性が高い状態は？",
        choices: [
            "液晶または有機ELの内部破損が進行している",
            "近接センサーが誤作動している",
            "バッテリー残量表示がずれている",
            "SIMカードが読み込めていない"
        ],
        correctIndex: 0,
        explanation: "黒いにじみや液晶漏れは表示パネル内部の破損で、時間とともに広がる場合があります。",
        repairName: "液晶漏れ診断",
        reward: 1700,
        gaugeGain: 20
    },

    {
        id: 14,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換後、フレームに収まらず一部が浮きます。",
        question: "無理に閉じる前に最優先で確認すべきものは？",
        choices: [
            "iOSのバージョン",
            "SIMカードの向き",
            "スピーカー音量",
            "ケーブル・部品・粘着残り・フレーム変形の干渉"
        ],
        correctIndex: 3,
        explanation: "無理な圧着は画面やケーブルを損傷するため、物理的な干渉を先に確認します。",
        repairName: "組み立て干渉確認",
        reward: 2200,
        gaugeGain: 24
    },

    {
        id: 15,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "画面交換直後は正常でしたが、閉じるとタッチ不良が出ます。",
        question: "優先して疑うべき原因は？",
        choices: [
            "バッテリー最大容量の低下",
            "リアカメラの手ぶれ補正",
            "フレーム圧迫やケーブルの挟み込み",
            "SIM契約の不具合"
        ],
        correctIndex: 2,
        explanation: "仮組みで正常、閉じると不良なら、圧迫や挟み込みなど組み立て条件を疑います。",
        repairName: "圧迫タッチ不良診断",
        reward: 2100,
        gaugeGain: 24
    },

    {
        id: 16,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換後、一定時間で画面が暗くなり操作しづらくなります。",
        question: "最も適切な切り分けは？",
        choices: [
            "壁紙を変更する",
            "自動輝度・環境光センサー・発熱による輝度制限を確認する",
            "SIMカードを抜いて圏外にする",
            "スピーカーを交換する"
        ],
        correctIndex: 1,
        explanation: "自動輝度だけでなく、センサー異常や端末発熱による輝度制限も確認します。",
        repairName: "輝度低下診断",
        reward: 2200,
        gaugeGain: 24
    },

    {
        id: 17,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "画面交換後、タッチ反応が端末を再起動すると一時的に戻ります。",
        question: "優先順位の高い確認は？",
        choices: [
            "パネル相性・接続・iOSとの互換性を切り分ける",
            "SIM会社を変更する",
            "リアカメラを交換する",
            "バッテリーシールを貼り直す"
        ],
        correctIndex: 0,
        explanation: "一時復旧する場合でも、パネル相性や接続、ソフトとの組み合わせを確認します。",
        repairName: "断続的タッチ不良診断",
        reward: 2100,
        gaugeGain: 24
    },

    {
        id: 18,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換後、上部だけタッチできません。",
        question: "最も有効な次の一手は？",
        choices: [
            "バッテリー交換で改善するか確認する",
            "SIMカードを初期化する",
            "スピーカー穴を清掃する",
            "正常な別パネルで同じ範囲のタッチ不良が再現するか確認する"
        ],
        correctIndex: 3,
        explanation: "同一範囲の不良が別パネルでも出るかで、画面側と本体側を切り分けます。",
        repairName: "部分タッチ不良切り分け",
        reward: 2300,
        gaugeGain: 24
    },

    {
        id: 19,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "画面は割れていませんが、落下後から白く点滅します。",
        question: "最初に確認するべきものは？",
        choices: [
            "SIMカードの契約状態",
            "Bluetoothの登録数",
            "画面コネクター・パネル・フレーム変形",
            "充電器の出力規格だけ"
        ],
        correctIndex: 2,
        explanation: "落下後の点滅は、画面・接続部・フレーム変形など表示系を優先して確認します。",
        repairName: "画面点滅診断",
        reward: 1900,
        gaugeGain: 22
    },

    {
        id: 20,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "交換画面では表示しますが、色味が純正と大きく異なります。",
        question: "お客様への説明として最も適切なのは？",
        choices: [
            "バッテリー最大容量が100％なら元に戻る",
            "パネル方式や品質により色味・輝度・視野角が異なる場合がある",
            "iPhone本体のストレージ容量が原因である",
            "SIMカードの種類で色味が変わる"
        ],
        correctIndex: 1,
        explanation: "LCD/OLEDや部品品質の違いにより、色味や輝度などが純正と異なる場合があります。",
        repairName: "交換パネル品質説明",
        reward: 2100,
        gaugeGain: 22
    },

    {
        id: 21,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "有機EL対応機種へLCDパネルを取り付けています。",
        question: "起こり得る違いとして最も適切なのは？",
        choices: [
            "黒表現・厚み・消費電力・表示品質が純正仕様と異なる可能性がある",
            "Face IDが必ず強化される",
            "ストレージ容量が増える",
            "通信速度が上がる"
        ],
        correctIndex: 0,
        explanation: "表示方式が異なるため、黒表現、厚み、消費電力、視認性などに差が出る場合があります。",
        repairName: "LCD代替パネル説明",
        reward: 2300,
        gaugeGain: 24
    },

    {
        id: 22,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "画面交換後、通話時に誤操作が増えました。",
        question: "最も関連が深い原因は？",
        choices: [
            "充電口のデータ通信が切れている",
            "リアカメラの手ぶれ補正が故障している",
            "バッテリー最大容量が低い",
            "近接センサーが耳を正しく検知できていない"
        ],
        correctIndex: 3,
        explanation: "通話中に画面が消えず頬などで操作される場合、近接センサーの検知不良を疑います。",
        repairName: "通話時誤操作診断",
        reward: 1900,
        gaugeGain: 22
    },

    {
        id: 23,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換後、Face IDと近接センサーの両方が使えません。",
        question: "最も優先する確認箇所は？",
        choices: [
            "Lightning端子のホコリ",
            "リアカメラレンズの曇り",
            "上部センサーフレックス一式の接続・損傷・取り付け位置",
            "バッテリーコネクターの電圧"
        ],
        correctIndex: 2,
        explanation: "複数の上部センサー機能が同時に失われた場合、共通するフレックスや接続を優先します。",
        repairName: "上部センサー総合診断",
        reward: 2500,
        gaugeGain: 26
    },

    {
        id: 24,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "画面交換後、仮組みでは正常ですが圧着後だけFace IDが不安定です。",
        question: "最も妥当な推定は？",
        choices: [
            "スピーカー穴の詰まり",
            "上部センサー周辺が圧迫・位置ずれ・干渉している可能性",
            "SIMカードの通信が不安定",
            "バッテリー最大容量の表示ずれ"
        ],
        correctIndex: 1,
        explanation: "仮組みと圧着後で差が出る場合、物理的な圧迫や位置ずれを強く疑います。",
        repairName: "圧着後Face ID不良診断",
        reward: 2800,
        gaugeGain: 28
    },

    {
        id: 25,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "落下後、画面は黒いままですがPC認識・着信・バイブは正常です。新しい画面でも表示しません。",
        question: "次に優先する診断は？",
        choices: [
            "表示回路・コネクター周辺・基板側損傷の確認",
            "SIMカードの再発行",
            "バッテリー最大容量の校正",
            "スピーカー交換"
        ],
        correctIndex: 0,
        explanation: "正常な画面でも表示しない場合、画面以外の表示回路や基板側の診断へ進みます。",
        repairName: "表示回路基板診断",
        reward: 3000,
        gaugeGain: 30
    },

    {
        id: 26,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "画面交換後、Face IDは登録画面まで進みますが顔を認識しません。",
        question: "最初に確認するべき項目は？",
        choices: [
            "バッテリー最大容量",
            "Lightning端子の摩耗",
            "リアカメラの手ぶれ補正",
            "上部センサーの位置ずれ・汚れ・遮光部の状態"
        ],
        correctIndex: 3,
        explanation: "登録画面まで進む場合でも、上部センサーの位置や遮光状態が不適切だと認識できないことがあります。",
        repairName: "Face ID認識不良診断",
        reward: 2000,
        gaugeGain: 22
    },

    {
        id: 27,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "落下後、Face IDが使用できずインカメラ映像も一部乱れます。",
        question: "切り分けとして最も妥当なのは？",
        choices: [
            "SIMカードを再発行する",
            "バッテリーを校正する",
            "フロントカメラ系と上部センサー系を個別に診断する",
            "画面だけ交換して様子を見る"
        ],
        correctIndex: 2,
        explanation: "複数機能が同時に不安定な場合は、共通部分だけでなく各系統を個別に切り分けます。",
        repairName: "フロント系統複合診断",
        reward: 2400,
        gaugeGain: 24
    },

    {
        id: 28,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換前はFace ID正常、交換後に『Face IDを設定できません』と表示されます。",
        question: "優先順位が最も高い確認は？",
        choices: [
            "SIMロック状態",
            "交換作業で触れた上部センサーフレックスと接続部",
            "iCloud容量",
            "スピーカー音量"
        ],
        correctIndex: 1,
        explanation: "修理直後に発生した不具合は、作業で触れた部品と接続部を最優先で確認します。",
        repairName: "修理後Face ID不良診断",
        reward: 2500,
        gaugeGain: 26
    },

    {
        id: 29,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "Face IDは時々使えますが、暗所で失敗が増えます。",
        question: "最も関連性が高い可能性は？",
        choices: [
            "赤外線系センサーの性能低下や遮蔽",
            "Lightning端子のデータライン",
            "バッテリー温度センサー",
            "ラウドスピーカーの抵抗値"
        ],
        correctIndex: 0,
        explanation: "暗所では赤外線系センサーへの依存が高く、不具合や遮蔽の影響が出やすくなります。",
        repairName: "暗所Face ID診断",
        reward: 2800,
        gaugeGain: 28
    },

    {
        id: 30,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "通話中は画面が消えますが、通話終了後も画面が戻らないことがあります。",
        question: "優先して確認する項目は？",
        choices: [
            "バッテリー最大容量",
            "SIMカードの通信品質",
            "リアカメラのフォーカス",
            "近接センサーの誤検知と取り付け位置"
        ],
        correctIndex: 3,
        explanation: "通話後も暗い場合、近接センサーが塞がれた状態を誤検知している可能性があります。",
        repairName: "近接センサー誤検知診断",
        reward: 2200,
        gaugeGain: 24
    },

    {
        id: 31,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "画面交換後、自動輝度が常に暗めに調整されます。",
        question: "最初に行うべき切り分けは？",
        choices: [
            "SIMカードを入れ直す",
            "リアカメラを交換する",
            "環境光センサー周辺の汚れ・位置・遮光材を確認する",
            "充電口を清掃する"
        ],
        correctIndex: 2,
        explanation: "自動輝度の異常は環境光センサー周辺の取り付け状態を優先して確認します。",
        repairName: "自動輝度診断",
        reward: 1900,
        gaugeGain: 22
    },

    {
        id: 32,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換後、True Toneは表示されますが色温度が不自然です。",
        question: "最も適切な確認は？",
        choices: [
            "スピーカーの音圧",
            "交換パネルの色特性と表示データの適合性",
            "SIMカードの種類",
            "バッテリー充電回数"
        ],
        correctIndex: 1,
        explanation: "True Tone項目が存在しても、パネル特性やデータ適合性により見え方が異なる場合があります。",
        repairName: "True Tone色温度診断",
        reward: 2300,
        gaugeGain: 24
    },

    {
        id: 33,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "元画面の表示データを移行した後もTrue Toneが復元しません。",
        question: "次に確認するべき内容は？",
        choices: [
            "機種・画面IC・書き込み手順の対応状況",
            "バッテリー電圧",
            "SIM契約",
            "マイク穴の詰まり"
        ],
        correctIndex: 0,
        explanation: "機種や交換パネルのIC仕様によっては、同じ手順で復元できない場合があります。",
        repairName: "True Tone書き込み診断",
        reward: 2800,
        gaugeGain: 28
    },

    {
        id: 34,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "Touch IDは使えますがホームへ戻る操作だけ反応しません。",
        question: "最も有効な切り分けは？",
        choices: [
            "SIMカードを交換する",
            "リアカメラを外す",
            "バッテリーを初期化する",
            "押下信号経路とパネル側延長ケーブルを確認する"
        ],
        correctIndex: 3,
        explanation: "指紋認証と押下操作は切り分けて考え、押下信号の経路を確認します。",
        repairName: "Touch ID押下経路診断",
        reward: 2500,
        gaugeGain: 26
    },

    {
        id: 35,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換後、ホームボタンが異常に硬く感じます。",
        question: "優先して疑う原因は？",
        choices: [
            "SIMカードの向き",
            "スピーカー穴の汚れ",
            "ブラケットの締め付け・位置ずれ・部品干渉",
            "バッテリー最大容量"
        ],
        correctIndex: 2,
        explanation: "修理後に押し心地が変わった場合、ブラケットや取り付け圧を確認します。",
        repairName: "ホームボタン組付け診断",
        reward: 2200,
        gaugeGain: 24
    },

    {
        id: 36,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "ホームボタン交換後、押下は可能ですが再起動後に操作が不安定になります。",
        question: "最も妥当な切り分けは？",
        choices: [
            "リアカメラを交換する",
            "交換部品の互換性・接続・iOS側挙動を確認する",
            "SIMを再発行する",
            "バッテリーを100％まで充電する"
        ],
        correctIndex: 1,
        explanation: "断続的な不具合では部品相性、接続、ソフトウェアとの組み合わせを確認します。",
        repairName: "ホームボタン互換性診断",
        reward: 2800,
        gaugeGain: 28
    },

    {
        id: 37,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "インカメラ映像は正常ですが、ポートレート撮影だけ不安定です。",
        question: "優先して確認する系統は？",
        choices: [
            "深度認識に関係するフロントセンサー系",
            "Lightning端子",
            "バッテリーセル",
            "ラウドスピーカー"
        ],
        correctIndex: 0,
        explanation: "通常撮影と深度認識は使用する機能が異なるため、フロントセンサー系を確認します。",
        repairName: "フロント深度認識診断",
        reward: 2500,
        gaugeGain: 26
    },

    {
        id: 38,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 3,
        symptom: "インカメラに白いもやが映ります。",
        question: "分解前に最初に確認するべきものは？",
        choices: [
            "SIMカードの状態",
            "バッテリー最大容量",
            "スピーカー音量",
            "保護フィルム・汚れ・レンズ内側の曇り"
        ],
        correctIndex: 3,
        explanation: "外部要因と内部曇りを切り分けてから部品交換を判断します。",
        repairName: "インカメラ曇り診断",
        reward: 1900,
        gaugeGain: 22
    },

    {
        id: 39,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換後、インカメラのピントが合いにくくなりました。",
        question: "最も関連性が高い原因は？",
        choices: [
            "SIM通信速度",
            "Lightning端子の摩耗",
            "カメラ位置ずれ・保護材干渉・レンズ汚れ",
            "バッテリー劣化"
        ],
        correctIndex: 2,
        explanation: "修理後のピント不良は、物理的な位置やレンズ周辺の状態を優先します。",
        repairName: "インカメラ焦点診断",
        reward: 2300,
        gaugeGain: 24
    },

    {
        id: 40,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "画面交換後、Face ID・自動輝度・近接センサーが同時に不調です。",
        question: "最も合理的な診断順序は？",
        choices: [
            "バッテリー交換を先に行う",
            "共通する上部センサー部の接続と損傷を先に確認する",
            "各機能を個別交換して結果を見る",
            "初期化してから判断する"
        ],
        correctIndex: 1,
        explanation: "複数機能の共通経路を先に確認すると、効率的に原因を絞れます。",
        repairName: "上部センサー共通経路診断",
        reward: 3000,
        gaugeGain: 30
    },

    {
        id: 41,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "交換画面の色が青白く、最大輝度も低く感じます。",
        question: "最も適切な説明は？",
        choices: [
            "パネル品質・方式・個体差により純正と表示特性が異なる",
            "SIMカードが古いため",
            "バッテリーが非純正のため",
            "Face ID登録数が多いため"
        ],
        correctIndex: 0,
        explanation: "交換パネルの品質や表示方式により、色温度や輝度が異なる場合があります。",
        repairName: "表示品質説明",
        reward: 2200,
        gaugeGain: 24
    },

    {
        id: 42,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "OLED対応機種にLCDパネルを装着後、発熱と電池消費が増えたように感じます。",
        question: "考えられる説明として適切なのは？",
        choices: [
            "SIMカードの電波が強すぎる",
            "Touch IDが無効だから",
            "リアカメラの倍率が高いから",
            "表示方式や消費電力特性の違いが影響する可能性がある"
        ],
        correctIndex: 3,
        explanation: "OLEDとLCDでは表示方式や消費電力特性が異なり、体感差が出る場合があります。",
        repairName: "LCD代替パネル影響説明",
        reward: 2500,
        gaugeGain: 26
    },

    {
        id: 43,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "交換画面では低輝度時だけちらつきが目立ちます。",
        question: "優先して疑うべきものは？",
        choices: [
            "バッテリーシール",
            "スピーカーメッシュ",
            "パネルの調光方式・品質・相性",
            "SIMカード"
        ],
        correctIndex: 2,
        explanation: "低輝度時のちらつきは、調光制御やパネル品質の影響を受けることがあります。",
        repairName: "低輝度ちらつき診断",
        reward: 2800,
        gaugeGain: 28
    },

    {
        id: 44,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換後、タッチは正常ですが3D Touchまたは感圧操作の感覚が異なります。",
        question: "最も適切な説明は？",
        choices: [
            "カメラ手ぶれ補正の故障",
            "機種・パネル構造・交換部品の仕様差による可能性",
            "SIMカードの契約差",
            "バッテリー容量表示のずれ"
        ],
        correctIndex: 1,
        explanation: "機種やパネル構造、交換部品の仕様によって操作感が変わる場合があります。",
        repairName: "感圧操作仕様説明",
        reward: 2400,
        gaugeGain: 24
    },

    {
        id: 45,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "画面交換後、画面上部だけ色むらが出ています。",
        question: "仮組み時に正常だった場合、最も疑うべきものは？",
        choices: [
            "圧着時の局所圧迫やフレーム干渉",
            "SIM通信の不安定",
            "バッテリー最大容量",
            "スピーカーの故障"
        ],
        correctIndex: 0,
        explanation: "仮組みで正常、圧着後に色むらが出る場合は物理的な圧迫を疑います。",
        repairName: "圧着色むら診断",
        reward: 2800,
        gaugeGain: 28
    },

    {
        id: 46,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "画面交換後、ロック解除直後だけ一瞬緑がかって見えます。",
        question: "優先して確認する内容は？",
        choices: [
            "SIMカードの契約",
            "Lightning端子のデータ通信",
            "バッテリー充電回数",
            "交換パネルの表示特性と相性"
        ],
        correctIndex: 3,
        explanation: "一時的な色変化はパネル特性や制御との相性が関係する場合があります。",
        repairName: "瞬間色変化診断",
        reward: 2400,
        gaugeGain: 24
    },

    {
        id: 47,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "画面交換後、Face IDは数回使うと一時的に無効になります。",
        question: "最も適切な次の確認は？",
        choices: [
            "バッテリー最大容量だけ",
            "リアカメラの倍率",
            "センサー接続の安定性・発熱・圧迫状態",
            "SIMカードの通信速度"
        ],
        correctIndex: 2,
        explanation: "断続的なFace ID不良は、接続不安定や物理的圧迫、発熱条件も確認します。",
        repairName: "断続的Face ID診断",
        reward: 2900,
        gaugeGain: 28
    },

    {
        id: 48,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 4,
        symptom: "近接センサーは動作しますが、自動輝度だけ反応しません。",
        question: "判断として正しいものは？",
        choices: [
            "画面交換では確認できない",
            "上部センサー部の一部機能だけ故障している可能性がある",
            "近接が動けば全センサーは必ず正常",
            "必ずiOSだけが原因"
        ],
        correctIndex: 1,
        explanation: "同じフレックス上でも各センサーは別機能のため、一部だけ故障することがあります。",
        repairName: "センサー部分故障診断",
        reward: 2500,
        gaugeGain: 26
    },

    {
        id: 49,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "画面交換後、Face IDは正常ですが通話時の画面消灯だけ不安定です。",
        question: "最も優先する確認は？",
        choices: [
            "近接センサーの位置とパネル透過部",
            "TrueDepthカメラの交換",
            "バッテリーセル",
            "Lightning端子"
        ],
        correctIndex: 0,
        explanation: "Face IDが正常でも近接センサーだけ不安定なことがあり、位置と透過部を確認します。",
        repairName: "近接単独不良診断",
        reward: 2700,
        gaugeGain: 28
    },

    {
        id: 50,
        platform: "iPhone",
        category: "iPhone",
        difficulty: 5,
        symptom: "画面交換後、Face ID・近接・自動輝度が圧着前は正常、圧着後にすべて不安定になります。",
        question: "最も可能性が高い原因は？",
        choices: [
            "SIMカード不良",
            "バッテリー最大容量低下",
            "リアカメラ故障",
            "上部センサー周辺への圧迫・位置ずれ・粘着干渉"
        ],
        correctIndex: 3,
        explanation: "圧着前後で状態が変わる場合、上部センサー周辺への物理的干渉を強く疑います。",
        repairName: "上部センサー圧着干渉診断",
        reward: 3200,
        gaugeGain: 30
    },

    {
        id: 51,
        platform: "iPhone",
        category: "バッテリー",
        difficulty: 2,
        symptom: "バッテリー最大容量が78％です。",
        question: "最も適切な案内は？",
        choices: [
            "まだ新品同様なので交換不要",
            "交換を検討する時期と案内する",
            "基板修理が必要",
            "画面交換が必要"
        ],
        correctIndex: 1,
        explanation: "80％前後は劣化の目安となるため交換を案内します。",
        repairName: "バッテリー交換",
        reward: 1800,
        gaugeGain: 20
    },

    {
        id: 52,
        platform: "iPhone",
        category: "バッテリー",
        difficulty: 3,
        symptom: "背面が浮いています。",
        question: "最も疑う症状は？",
        choices: [
            "液晶漏れ",
            "バッテリー膨張",
            "Face ID故障",
            "SIM故障"
        ],
        correctIndex: 1,
        explanation: "背面や画面が浮く場合は膨張を疑います。",
        repairName: "膨張診断",
        reward: 2000,
        gaugeGain: 22
    },

    {
        id: 53,
        platform: "iPhone",
        category: "バッテリー",
        difficulty: 3,
        symptom: "膨張したまま使用しています。",
        question: "危険性として最も適切なのは？",
        choices: [
            "発火・破裂の危険",
            "通信速度低下",
            "Face ID故障",
            "Bluetooth故障"
        ],
        correctIndex: 0,
        explanation: "膨張したバッテリーは発火の危険があります。",
        repairName: "安全説明",
        reward: 2200,
        gaugeGain: 24
    },

    {
        id: 54,
        platform: "iPhone",
        category: "充電",
        difficulty: 3,
        symptom: "角度を変えると充電できます。",
        question: "最も疑う箇所は？",
        choices: [
            "充電口内部",
            "画面",
            "カメラ",
            "スピーカー"
        ],
        correctIndex: 0,
        explanation: "充電口の摩耗や異物混入が多い症状です。",
        repairName: "充電口診断",
        reward: 2100,
        gaugeGain: 22
    },

    {
        id: 55,
        platform: "iPhone",
        category: "充電",
        difficulty: 4,
        symptom: "充電できません。",
        question: "最初に確認するものは？",
        choices: [
            "充電器・ケーブル",
            "SIMカード",
            "Face ID",
            "カメラ"
        ],
        correctIndex: 0,
        explanation: "周辺機器の切り分けを最初に行います。",
        repairName: "充電診断",
        reward: 2000,
        gaugeGain: 22
    },

    {
        id: 56,
        platform: "iPhone",
        category: "充電",
        difficulty: 4,
        symptom: "充電口にホコリがあります。",
        question: "適切な対応は？",
        choices: [
            "安全に清掃する",
            "水で洗う",
            "金属ピンで強く削る",
            "そのまま使う"
        ],
        correctIndex: 0,
        explanation: "端子を傷付けないよう注意して清掃します。",
        repairName: "充電口清掃",
        reward: 2200,
        gaugeGain: 24
    },

    {
        id: 57,
        platform: "iPhone",
        category: "MagSafe",
        difficulty: 4,
        symptom: "有線充電はできますがMagSafeだけ反応しません。",
        question: "最も疑う部品は？",
        choices: [
            "MagSafeコイル",
            "液晶",
            "SIM",
            "近接センサー"
        ],
        correctIndex: 0,
        explanation: "MagSafeのみ不良ならコイル系を疑います。",
        repairName: "MagSafe診断",
        reward: 2400,
        gaugeGain: 24
    },

    {
        id: 58,
        platform: "iPhone",
        category: "USB-C",
        difficulty: 3,
        symptom: "USB-C端末が充電できません。",
        question: "最も多い原因は？",
        choices: [
            "USB-Cコネクタ故障",
            "液晶故障",
            "Face ID",
            "SIM故障"
        ],
        correctIndex: 0,
        explanation: "USB-C端子の破損や摩耗は非常に多い故障です。",
        repairName: "USB-C診断",
        reward: 2200,
        gaugeGain: 22
    },

    {
        id: 59,
        platform: "iPhone",
        category: "バッテリー",
        difficulty: 4,
        symptom: "交換後も電源が入りません。",
        question: "次に疑うものは？",
        choices: [
            "基板故障",
            "ガラスフィルム",
            "スピーカー",
            "SIMカード"
        ],
        correctIndex: 0,
        explanation: "交換後も改善しない場合は基板診断へ進みます。",
        repairName: "基板切り分け",
        reward: 2600,
        gaugeGain: 26
    },

    {
        id: 60,
        platform: "iPhone",
        category: "ボス",
        difficulty: 5,
        symptom: "充電できず、角度を変えると反応し、PC認識もしません。",
        question: "最も疑うものは？",
        choices: [
            "充電口故障",
            "画面",
            "リアカメラ",
            "Face ID"
        ],
        correctIndex: 0,
        explanation: "複数症状から充電口故障の可能性が高いと判断できます。",
        repairName: "ボス診断",
        reward: 3000,
        gaugeGain: 30
    },

    {
        id: 61,
        platform: "iPhone",
        category: "電流値",
        difficulty: 4,
        symptom: "電流計に接続しても0.00Aのままです。",
        question: "最初に疑うべきものは？",
        choices: [
            "本体が正常起動している",
            "バッテリーまたは基板への通電不良",
            "液晶漏れ",
            "Face ID故障"
        ],
        correctIndex: 1,
        explanation: "0.00Aは通電していない可能性が高く、バッテリーや基板を切り分けます。",
        repairName: "0.00A診断",
        reward: 2500,
        gaugeGain: 24
    },

    {
        id: 62,
        platform: "iPhone",
        category: "電流値",
        difficulty: 5,
        symptom: "0.02A付近で止まります。",
        question: "最も考えられる状態は？",
        choices: [
            "正常起動",
            "起動初期で停止している",
            "画面割れのみ",
            "スピーカー故障"
        ],
        correctIndex: 1,
        explanation: "0.02A付近停止は起動初期で止まる症状としてよく見られます。",
        repairName: "起動初期診断",
        reward: 2700,
        gaugeGain: 26
    },

    {
        id: 63,
        platform: "iPhone",
        category: "電流値",
        difficulty: 5,
        symptom: "0.40A付近まで流れますが起動しません。",
        question: "次に疑うものは？",
        choices: [
            "基板起動異常",
            "SIMカード",
            "リアカメラ",
            "スピーカー"
        ],
        correctIndex: 0,
        explanation: "途中まで電流が流れる場合は起動シーケンス異常を疑います。",
        repairName: "0.40A診断",
        reward: 2800,
        gaugeGain: 26
    },

    {
        id: 64,
        platform: "iPhone",
        category: "起動不良",
        difficulty: 4,
        symptom: "PCでは認識しますが画面は映りません。",
        question: "最初に疑う部品は？",
        choices: [
            "画面・表示回路",
            "SIMカード",
            "Face ID",
            "充電器"
        ],
        correctIndex: 0,
        explanation: "PC認識するなら本体は動作している可能性があり、表示系を優先します。",
        repairName: "表示回路診断",
        reward: 2500,
        gaugeGain: 24
    },

    {
        id: 65,
        platform: "iPhone",
        category: "起動不良",
        difficulty: 4,
        symptom: "PCにも認識されません。",
        question: "最も疑うものは？",
        choices: [
            "基板故障",
            "ガラス割れ",
            "スピーカー",
            "カメラ"
        ],
        correctIndex: 0,
        explanation: "PC認識なしは基板側の可能性が高くなります。",
        repairName: "基板診断",
        reward: 2600,
        gaugeGain: 24
    },

    {
        id: 66,
        platform: "iPhone",
        category: "充電",
        difficulty: 4,
        symptom: "充電はできますがPC認識しません。",
        question: "最も考えられる原因は？",
        choices: [
            "データライン故障",
            "画面故障",
            "バッテリー膨張",
            "Face ID"
        ],
        correctIndex: 0,
        explanation: "充電だけできる場合はデータライン断線の可能性があります。",
        repairName: "USBデータ診断",
        reward: 2600,
        gaugeGain: 24
    },

    {
        id: 67,
        platform: "iPhone",
        category: "MagSafe",
        difficulty: 5,
        symptom: "MagSafeも有線充電も反応しません。",
        question: "最も疑うものは？",
        choices: [
            "基板側充電回路",
            "画面",
            "スピーカー",
            "SIM"
        ],
        correctIndex: 0,
        explanation: "両方充電できない場合は基板側を疑います。",
        repairName: "充電回路診断",
        reward: 2800,
        gaugeGain: 28
    },

    {
        id: 68,
        platform: "iPhone",
        category: "充電",
        difficulty: 4,
        symptom: "充電中に異常発熱します。",
        question: "最も適切な案内は？",
        choices: [
            "使用を中止して点検する",
            "そのまま使い続ける",
            "再起動だけする",
            "Wi-Fiを切る"
        ],
        correctIndex: 0,
        explanation: "異常発熱は安全上すぐ点検を案内します。",
        repairName: "発熱診断",
        reward: 2500,
        gaugeGain: 24
    },

    {
        id: 69,
        platform: "iPhone",
        category: "バッテリー",
        difficulty: 5,
        symptom: "新品バッテリーでも0.00Aです。",
        question: "次に行うべき診断は？",
        choices: [
            "基板診断",
            "画面交換",
            "SIM交換",
            "スピーカー交換"
        ],
        correctIndex: 0,
        explanation: "バッテリー交換で改善しない場合は基板側を疑います。",
        repairName: "基板切り分け",
        reward: 3000,
        gaugeGain: 28
    },

    {
        id: 70,
        platform: "iPhone",
        category: "ボス",
        difficulty: 5,
        symptom: "0.00A・PC認識なし・充電口交換でも改善なし。",
        question: "最も疑う故障は？",
        choices: [
            "基板故障",
            "液晶漏れ",
            "Face ID",
            "リアカメラ"
        ],
        correctIndex: 0,
        explanation: "すべて切り分けても改善しない場合は基板故障の可能性が高くなります。",
        repairName: "ボス診断",
        reward: 3500,
        gaugeGain: 30
    },

    {
        id: 71,
        platform: "iPhone",
        category: "バッテリー",
        difficulty: 5,
        symptom: "充電すると本体がかなり熱くなり、充電速度も極端に遅いです。",
        question: "最も疑うべき箇所は？",
        choices: [
            "充電IC・電源回路",
            "液晶パネル",
            "SIMカード",
            "スピーカー"
        ],
        correctIndex: 0,
        explanation: "異常発熱と充電異常が同時に起きる場合は、充電ICや電源回路を疑います。",
        repairName: "充電IC診断",
        reward: 3200,
        gaugeGain: 30
    },

    {
        id: 72,
        platform: "iPhone",
        category: "充電",
        difficulty: 5,
        symptom: "充電器を挿すと反応はしますが、数秒後に切れてしまいます。",
        question: "最も考えられる原因は？",
        choices: [
            "充電口の接触不良・破損",
            "リアカメラ故障",
            "Face ID故障",
            "液晶漏れ"
        ],
        correctIndex: 0,
        explanation: "接触不良や端子摩耗では、一瞬だけ通電して切れる症状がよく見られます。",
        repairName: "充電口診断",
        reward: 3000,
        gaugeGain: 28
    },

    {
        id: 73,
        platform: "iPhone",
        category: "起動不良",
        difficulty: 5,
        symptom: "バッテリー交換後も0.00A、PC認識もありません。",
        question: "次に行うべき診断は？",
        choices: [
            "基板故障を疑い回路診断する",
            "画面交換する",
            "SIMカードを交換する",
            "スピーカー交換"
        ],
        correctIndex: 0,
        explanation: "新品バッテリーでも通電しない場合は基板側の故障を優先して確認します。",
        repairName: "基板診断",
        reward: 3500,
        gaugeGain: 30
    },

    {
        id: 74,
        platform: "iPhone",
        category: "電流値",
        difficulty: 5,
        symptom: "0.80A付近まで流れますがAppleロゴから進みません。",
        question: "最も考えられる状態は？",
        choices: [
            "リンゴループ・起動シーケンス異常",
            "画面割れ",
            "SIMカード故障",
            "近接センサー故障"
        ],
        correctIndex: 0,
        explanation: "0.80A付近で停止しAppleロゴから進まない場合は、リンゴループや起動シーケンス異常が考えられます。",
        repairName: "リンゴループ診断",
        reward: 3800,
        gaugeGain: 32
    },

    {
        id: 75,
        platform: "iPhone",
        category: "BOSS",
        difficulty: 5,
        symptom: "充電不可・PC認識なし・0.00A・新品バッテリーでも改善せず・充電口交換でも改善しません。",
        question: "最も可能性が高い故障は？",
        choices: [
            "基板故障",
            "画面故障",
            "リアカメラ故障",
            "スピーカー故障"
        ],
        correctIndex: 0,
        explanation: "すべての切り分けを行っても改善しない場合は、基板故障の可能性が最も高くなります。",
        repairName: "BOSS 基板診断",
        reward: 5000,
        gaugeGain: 40
    },

    {
        id: 76,
        platform: "修理知識",
        category: "水没",
        difficulty: 4,
        symptom: "スマホを水に落とした直後です。",
        question: "最初に行うべき対応は？",
        choices: [
            "電源を切る",
            "充電器を挿す",
            "再起動する",
            "何度も電源を入れる"
        ],
        correctIndex: 0,
        explanation: "水没直後は通電を防ぐため、まず電源を切ります。",
        repairName: "水没初期対応",
        reward: 2500,
        gaugeGain: 24
    },

    {
        id: 77,
        platform: "修理知識",
        category: "水没",
        difficulty: 4,
        symptom: "水没後も普通に使えています。",
        question: "最も適切な案内は？",
        choices: [
            "内部腐食の可能性があることを説明する",
            "問題ないのでそのまま使う",
            "初期化する",
            "SIMカード交換だけ行う"
        ],
        correctIndex: 0,
        explanation: "正常に見えても内部腐食が進行する場合があります。",
        repairName: "水没説明",
        reward: 2600,
        gaugeGain: 24
    },

    {
        id: 78,
        platform: "修理知識",
        category: "水没",
        difficulty: 5,
        symptom: "海水へ落としてしまいました。",
        question: "真水より危険な理由は？",
        choices: [
            "塩分で腐食が進みやすい",
            "画面だけ壊れる",
            "Face IDだけ壊れる",
            "Wi-Fiだけ壊れる"
        ],
        correctIndex: 0,
        explanation: "塩分は基板腐食を早めます。",
        repairName: "海水水没",
        reward: 2800,
        gaugeGain: 26
    },

    {
        id: 79,
        platform: "修理知識",
        category: "リンゴループ",
        difficulty: 5,
        symptom: "Appleロゴから進みません。",
        question: "この症状を何と呼びますか？",
        choices: [
            "リンゴループ",
            "ブラックアウト",
            "液晶漏れ",
            "圏外病"
        ],
        correctIndex: 0,
        explanation: "Appleロゴから進まない状態をリンゴループと呼びます。",
        repairName: "リンゴループ診断",
        reward: 3000,
        gaugeGain: 28
    },

    {
        id: 80,
        platform: "修理知識",
        category: "リンゴループ",
        difficulty: 5,
        symptom: "データが最優先です。",
        question: "最初に案内するべき内容は？",
        choices: [
            "基板診断・データ優先修理",
            "初期化する",
            "復元する",
            "SIM交換"
        ],
        correctIndex: 0,
        explanation: "データ優先なら初期化前に基板診断を検討します。",
        repairName: "データ優先受付",
        reward: 3200,
        gaugeGain: 28
    },

    {
        id: 81,
        platform: "Android",
        category: "Android",
        difficulty: 4,
        symptom: "Galaxyに緑線が入りました。",
        question: "最も多い原因は？",
        choices: [
            "画面故障",
            "SIMカード",
            "充電器",
            "スピーカー"
        ],
        correctIndex: 0,
        explanation: "Galaxyでは有機EL故障による緑線が多く見られます。",
        repairName: "Galaxy診断",
        reward: 2600,
        gaugeGain: 24
    },

    {
        id: 82,
        platform: "Android",
        category: "Pixel",
        difficulty: 5,
        symptom: "画面交換後に指紋認証が使えません。",
        question: "最も必要な作業は？",
        choices: [
            "キャリブレーション",
            "初期化",
            "SIM交換",
            "カメラ交換"
        ],
        correctIndex: 0,
        explanation: "Pixelは画面交換後にキャリブレーションが必要な機種があります。",
        repairName: "Pixel診断",
        reward: 3000,
        gaugeGain: 28
    },

    {
        id: 83,
        platform: "Switch",
        category: "Switch",
        difficulty: 4,
        symptom: "テレビでは映るが本体画面だけ真っ暗です。",
        question: "最も疑う部品は？",
        choices: [
            "液晶",
            "ゲームカード",
            "SDカード",
            "Joy-Con"
        ],
        correctIndex: 0,
        explanation: "TV出力が正常なら液晶系統を疑います。",
        repairName: "Switch液晶診断",
        reward: 2600,
        gaugeGain: 24
    },

    {
        id: 84,
        platform: "Switch",
        category: "Switch",
        difficulty: 4,
        symptom: "ゲームカードだけ読み込みません。",
        question: "最も疑う部品は？",
        choices: [
            "ゲームカードスロット",
            "液晶",
            "バッテリー",
            "Joy-Con"
        ],
        correctIndex: 0,
        explanation: "SDが読めるならカードスロットの故障が考えられます。",
        repairName: "カードスロット診断",
        reward: 2600,
        gaugeGain: 24
    },

    {
        id: 85,
        platform: "Switch",
        category: "Switch",
        difficulty: 5,
        symptom: "充電できず電源も入りません。",
        question: "最も疑う箇所は？",
        choices: [
            "USB-C・充電回路",
            "液晶",
            "スピーカー",
            "ゲームカード"
        ],
        correctIndex: 0,
        explanation: "充電できない場合はUSB-Cや充電回路を確認します。",
        repairName: "Switch充電診断",
        reward: 3000,
        gaugeGain: 28
    },

    {
        id: 86,
        platform: "修理知識",
        category: "データ",
        difficulty: 5,
        symptom: "データだけ取り出したいです。",
        question: "最優先は？",
        choices: [
            "データ優先で診断する",
            "初期化する",
            "SIM交換",
            "画面交換"
        ],
        correctIndex: 0,
        explanation: "データ優先の場合は初期化を避けて診断します。",
        repairName: "データ救出",
        reward: 3200,
        gaugeGain: 28
    },

    {
        id: 87,
        platform: "修理知識",
        category: "基板",
        difficulty: 5,
        symptom: "画面交換・バッテリー交換でも改善しません。",
        question: "次に疑うものは？",
        choices: [
            "基板",
            "SIMカード",
            "スピーカー",
            "カメラ"
        ],
        correctIndex: 0,
        explanation: "主要部品交換で改善しない場合は基板故障を疑います。",
        repairName: "基板診断",
        reward: 3400,
        gaugeGain: 30
    },

    {
        id: 88,
        platform: "Android",
        category: "Android",
        difficulty: 4,
        symptom: "バッテリーが膨張しています。",
        question: "適切な案内は？",
        choices: [
            "使用を控え交換を勧める",
            "そのまま使用",
            "初期化",
            "SIM交換"
        ],
        correctIndex: 0,
        explanation: "膨張したバッテリーは危険です。",
        repairName: "膨張説明",
        reward: 2600,
        gaugeGain: 24
    },

    {
        id: 89,
        platform: "修理知識",
        category: "水没",
        difficulty: 5,
        symptom: "水没後、一度電源が入りましたが今は入りません。",
        question: "考えられる原因は？",
        choices: [
            "内部腐食",
            "画面フィルム",
            "SIM",
            "ケース"
        ],
        correctIndex: 0,
        explanation: "腐食が進行して後から起動しなくなるケースがあります。",
        repairName: "腐食診断",
        reward: 3200,
        gaugeGain: 28
    },

    {
        id: 90,
        platform: "修理知識",
        category: "ボス",
        difficulty: 5,
        symptom: "水没・リンゴループ・データ最優先です。",
        question: "最も適切な受付は？",
        choices: [
            "基板診断・データ優先で案内",
            "初期化",
            "復元",
            "画面交換のみ"
        ],
        correctIndex: 0,
        explanation: "データ優先なら初期化前に基板診断を優先します。",
        repairName: "ボス受付",
        reward: 5000,
        gaugeGain: 40
    },

    {
        id: 91,
        platform: "修理知識",
        category: "FINAL",
        difficulty: 5,
        symptom: "iPhoneを水没させたあと充電器を挿してしまいました。",
        question: "最も心配されることは？",
        choices: [
            "内部ショートによる基板故障",
            "画面が綺麗になる",
            "バッテリー容量が増える",
            "SIMカードが初期化される"
        ],
        correctIndex: 0,
        explanation: "水没直後の通電は基板故障のリスクを高めます。",
        repairName: "水没診断",
        reward: 3500,
        gaugeGain: 30
    },

    {
        id: 92,
        platform: "修理知識",
        category: "FINAL",
        difficulty: 5,
        symptom: "Appleロゴから進まず、お客様はデータ最優先です。",
        question: "最初に案内する内容は？",
        choices: [
            "データ優先で基板診断を案内する",
            "初期化する",
            "復元する",
            "SIMカード交換"
        ],
        correctIndex: 0,
        explanation: "データが必要な場合は初期化を急がず診断を優先します。",
        repairName: "データ優先受付",
        reward: 3600,
        gaugeGain: 30
    },

    {
        id: 93,
        platform: "修理知識",
        category: "FINAL",
        difficulty: 5,
        symptom: "新品画面・新品バッテリーでも起動しません。",
        question: "次に疑うものは？",
        choices: [
            "基板故障",
            "ガラスフィルム",
            "SIMカード",
            "ケース"
        ],
        correctIndex: 0,
        explanation: "主要部品交換でも改善しない場合は基板を疑います。",
        repairName: "基板診断",
        reward: 3800,
        gaugeGain: 32
    },

    {
        id: 94,
        platform: "Android",
        category: "FINAL",
        difficulty: 5,
        symptom: "Galaxyに緑線が入り、タッチも効きます。",
        question: "最も可能性が高い故障は？",
        choices: [
            "有機ELパネル故障",
            "バッテリー膨張",
            "充電口故障",
            "SIMカード故障"
        ],
        correctIndex: 0,
        explanation: "Galaxyでは有機EL故障による緑線が多く見られます。",
        repairName: "Galaxy診断",
        reward: 3600,
        gaugeGain: 30
    },

    {
        id: 95,
        platform: "Switch",
        category: "FINAL",
        difficulty: 5,
        symptom: "Switchはテレビ出力だけ正常です。",
        question: "最も疑う部品は？",
        choices: [
            "液晶ユニット",
            "Joy-Con",
            "ゲームカード",
            "スピーカー"
        ],
        correctIndex: 0,
        explanation: "TV出力できる場合は液晶側を優先して確認します。",
        repairName: "Switch液晶診断",
        reward: 3600,
        gaugeGain: 30
    },

    {
        id: 96,
        platform: "Android",
        category: "FINAL",
        difficulty: 5,
        symptom: "Pixel画面交換後に指紋認証が使えません。",
        question: "最も必要な作業は？",
        choices: [
            "キャリブレーション",
            "初期化",
            "SIM交換",
            "カメラ交換"
        ],
        correctIndex: 0,
        explanation: "対応機種ではキャリブレーションが必要です。",
        repairName: "Pixel診断",
        reward: 3800,
        gaugeGain: 32
    },

    {
        id: 97,
        platform: "修理知識",
        category: "FINAL",
        difficulty: 5,
        symptom: "0.00A・PC認識なし・新品バッテリーでも改善しません。",
        question: "最も疑う故障は？",
        choices: [
            "基板故障",
            "液晶",
            "Face ID",
            "近接センサー"
        ],
        correctIndex: 0,
        explanation: "通電しない場合は基板故障の可能性が高くなります。",
        repairName: "電流診断",
        reward: 4000,
        gaugeGain: 34
    },

    {
        id: 98,
        platform: "修理知識",
        category: "FINAL",
        difficulty: 5,
        symptom: "充電口交換後も充電できません。",
        question: "次に行うべき診断は？",
        choices: [
            "充電回路・基板診断",
            "SIM交換",
            "画面交換",
            "カメラ交換"
        ],
        correctIndex: 0,
        explanation: "充電口交換で改善しない場合は基板側を確認します。",
        repairName: "充電回路診断",
        reward: 4200,
        gaugeGain: 36
    },

    {
        id: 99,
        platform: "修理知識",
        category: "FINAL",
        difficulty: 5,
        symptom: "水没・リンゴループ・画面割れ・データ最優先です。",
        question: "最も適切な受付内容は？",
        choices: [
            "基板診断とデータ優先修理を案内する",
            "初期化してから修理する",
            "画面交換だけ行う",
            "SIM交換する"
        ],
        correctIndex: 0,
        explanation: "データ優先の場合は初期化を避け、基板診断を優先します。",
        repairName: "最終受付",
        reward: 4500,
        gaugeGain: 38
    },

    {
        id: 100,
        platform: "修理知識",
        category: "LAST BOSS",
        difficulty: 5,
        symptom: "充電不可・0.00A・PC認識なし・水没歴あり・新品バッテリー・新品画面・充電口交換でも改善しません。",
        question: "画面・バッテリー・充電口で改善しない場合、次に進むべき対応は？",
        choices: [
            "基板の電源・充電回路を診断し、データ優先条件も確認する",
            "初期化して起動できるかだけ確認する",
            "同じ画面をもう一度交換する",
            "SIMカードを交換して通信を確認する"
        ],
        correctIndex: 0,
        explanation: "主要部品で改善せず水没歴もあるため、基板の電源・充電回路へ診断を進めます。リペアエンドはゲージ満タン時に任意発動する別機能です。",
        repairName: "最終基板診断",
        reward: 10000,
        gaugeGain: 100
    }
    ];

    let questionDeck = [];
    let usedQuestionIds = [];
    let lastQuestionId = null;

    function shuffleArray(array) {
        const shuffled = [...array];

        for (let index = shuffled.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [shuffled[index], shuffled[randomIndex]] =
                [shuffled[randomIndex], shuffled[index]];
        }

        return shuffled;
    }

    function cloneQuestion(question) {
        return {
            ...question,
            choices: [...question.choices]
        };
    }

    function shuffleQuestionChoices(question) {
        const cloned = cloneQuestion(question);
        const entries = cloned.choices.map((text, index) => ({
            text,
            correct: index === cloned.correctIndex
        }));
        const shuffled = shuffleArray(entries);

        cloned.choices = shuffled.map((entry) => entry.text);
        cloned.correctIndex = shuffled.findIndex((entry) => entry.correct);
        return cloned;
    }

    function matchesFilter(question, category = null, difficulty = null) {
        const categoryMatches =
            category === null ||
            question.category === category ||
            question.platform === category;

        const difficultyMatches =
            difficulty === null || question.difficulty === difficulty;

        return categoryMatches && difficultyMatches;
    }

    function createQuestionDeck(shuffleChoices = true) {
        let deck = shuffleArray(QUIZ_DATA);

        if (
            lastQuestionId !== null &&
            deck.length > 1 &&
            deck[0].id === lastQuestionId
        ) {
            [deck[0], deck[1]] = [deck[1], deck[0]];
        }

        questionDeck = deck.map((question) =>
            shuffleChoices
                ? shuffleQuestionChoices(question)
                : cloneQuestion(question)
        );

        usedQuestionIds = [];
        return questionDeck.map(cloneQuestion);
    }

    function resetQuestionDeck() {
        questionDeck = [];
        usedQuestionIds = [];
        lastQuestionId = null;
    }

    function findQuestionIndex(deck, category = null, difficulty = null) {
        return deck.findIndex((question) =>
            matchesFilter(question, category, difficulty)
        );
    }

    function getNextQuestion(options = {}) {
        const {
            category = null,
            difficulty = null,
            shuffleChoices = true
        } = options;

        if (questionDeck.length === 0) {
            createQuestionDeck(shuffleChoices);
        }

        let index = findQuestionIndex(questionDeck, category, difficulty);

        if (index === -1) {
            createQuestionDeck(shuffleChoices);
            index = findQuestionIndex(questionDeck, category, difficulty);
        }

        if (index === -1) {
            return null;
        }

        const selected = questionDeck.splice(index, 1)[0];
        usedQuestionIds.push(selected.id);
        lastQuestionId = selected.id;
        return cloneQuestion(selected);
    }

    function getQuestionById(questionId, shuffleChoices = false) {
        const question = QUIZ_DATA.find(
            (item) => item.id === Number(questionId)
        );

        if (!question) {
            return null;
        }

        return shuffleChoices
            ? shuffleQuestionChoices(question)
            : cloneQuestion(question);
    }

    function getQuestionsByCategory(category, shuffleChoices = false) {
        return QUIZ_DATA
            .filter((question) => matchesFilter(question, category, null))
            .map((question) =>
                shuffleChoices
                    ? shuffleQuestionChoices(question)
                    : cloneQuestion(question)
            );
    }

    function getQuestionsByDifficulty(difficulty) {
        return QUIZ_DATA
            .filter((question) => question.difficulty === Number(difficulty))
            .map(cloneQuestion);
    }

    function isCorrectAnswer(question, selectedIndex) {
        return Boolean(
            question && Number(selectedIndex) === question.correctIndex
        );
    }

    function checkAnswer(question, selectedIndex) {
        if (!question) {
            return {
                isCorrect: false,
                selectedIndex: Number(selectedIndex),
                correctIndex: -1,
                correctAnswer: "",
                explanation: "",
                reward: 0,
                gaugeGain: 0
            };
        }

        const selected = Number(selectedIndex);
        const correct = isCorrectAnswer(question, selected);

        return {
            isCorrect: correct,
            selectedIndex: selected,
            correctIndex: question.correctIndex,
            correctAnswer: question.choices[question.correctIndex] || "",
            explanation: question.explanation,
            reward: correct ? question.reward : 0,
            gaugeGain: correct ? question.gaugeGain : 0
        };
    }

    function getCategoryCounts() {
        return QUIZ_DATA.reduce((counts, question) => {
            counts[question.category] =
                (counts[question.category] || 0) + 1;
            return counts;
        }, {});
    }

    function getPlatformCounts() {
        return QUIZ_DATA.reduce((counts, question) => {
            counts[question.platform] =
                (counts[question.platform] || 0) + 1;
            return counts;
        }, {});
    }

    function validateQuizData() {
        const errors = [];
        const ids = new Set();

        QUIZ_DATA.forEach((question, index) => {
            if (!Number.isInteger(question.id)) {
                errors.push(`問題${index + 1}: idが不正です。`);
            }

            if (ids.has(question.id)) {
                errors.push(`問題${question.id}: idが重複しています。`);
            }
            ids.add(question.id);

            if (!Object.values(QUIZ_PLATFORMS).includes(question.platform)) {
                errors.push(`問題${question.id}: platformが不正です。`);
            }

            if (typeof question.category !== "string" || !question.category) {
                errors.push(`問題${question.id}: categoryが不正です。`);
            }

            if (
                !Number.isInteger(question.difficulty) ||
                question.difficulty < 1 ||
                question.difficulty > 5
            ) {
                errors.push(`問題${question.id}: difficultyが不正です。`);
            }

            if (!Array.isArray(question.choices) || question.choices.length !== 4) {
                errors.push(`問題${question.id}: 選択肢は4件必要です。`);
            }

            if (
                !Number.isInteger(question.correctIndex) ||
                question.correctIndex < 0 ||
                question.correctIndex > 3
            ) {
                errors.push(`問題${question.id}: correctIndexが不正です。`);
            }
        });

        if (QUIZ_DATA.length !== 100) {
            errors.push(
                `問題数が100問ではありません。現在${QUIZ_DATA.length}問です。`
            );
        }

        return {
            isValid: errors.length === 0,
            questionCount: QUIZ_DATA.length,
            categoryCounts: getCategoryCounts(),
            platformCounts: getPlatformCounts(),
            errors
        };
    }

    const validation = validateQuizData();

    if (!validation.isValid) {
        console.error(
            "Repair Legendの問題データにエラーがあります。",
            validation.errors
        );
    } else {
        console.log(
            `Repair Legend Quiz: ${validation.questionCount}問を読み込みました。`,
            validation.platformCounts
        );
    }

    window.RepairLegendQuiz = Object.freeze({
        platforms: QUIZ_PLATFORMS,
        difficulties: QUIZ_DIFFICULTIES,
        createQuestionDeck,
        resetQuestionDeck,
        getNextQuestion,
        getRandomQuestion: getNextQuestion,
        getQuestionById,
        getQuestionsByCategory,
        getQuestionsByDifficulty,
        getAllQuestions: () => QUIZ_DATA.map(cloneQuestion),
        getCategories: () => [...new Set(QUIZ_DATA.map((item) => item.category))],
        getPlatforms: () => Object.values(QUIZ_PLATFORMS),
        getCategoryCounts,
        getPlatformCounts,
        getTotalQuestionCount: () => QUIZ_DATA.length,
        getRemainingQuestionCount: () => questionDeck.length,
        getUsedQuestionIds: () => [...usedQuestionIds],
        isCorrectAnswer,
        checkAnswer,
        shuffleArray,
        shuffleQuestionChoices,
        validateQuizData
    });

    window.quizData = QUIZ_DATA.map(cloneQuestion);
})();
