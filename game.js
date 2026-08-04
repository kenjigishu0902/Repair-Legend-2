/* =========================================================
   Repair Legend Ver2
   game.js

   ゲーム進行
   ・タイトル画面
   ・お客様来店
   ・吹き出し会話
   ・受付
   ・10秒カウントダウン
   ・4択クイズ
   ・修理ゲージ
   ・コンボ
   ・レベル
   ・ランク
   ・売上
   ・修理完了
   ・任意発動の必殺技「リペアエンド！！」
   ・フェニちゃんの追加セリフ
   ・お客様退店
   ・次のお客様
   ========================================================= */

"use strict";

(function () {

    /* =====================================================
       CONFIG
       ===================================================== */

    const GAME_CONFIG = Object.freeze({

        quizTimeLimit: 10,

        repairGaugeMax: 100,

        repairEndGaugeMax: 100,

        repairEndGaugeGain: 20,

        repairEndAnimationDuration: 1750,
        correctGaugeGain: 20,

        customerEnterDuration: 2700,

        customerLeaveDuration: 2300,

        speechDelay: 500,

        receptionDelay: 900,

        answerResultDuration: 1500,

        nextQuestionDelay: 500,

        repairCompleteDuration: 2300,

        resultDelay: 900,

        baseExperience: 100,

        comboExperienceBonus: 10,

        wrongExperience: 0,

        levelBaseRequirement: 500,

        levelRequirementIncrease: 150,

        maxLevel: 99,

        comboMoneyBonusRate: 0.05,

        maximumComboBonusRate: 1.0,

        timeoutPenalty: 0,

        incorrectPenalty: 0

    });


    /* =====================================================
       GAME PHASE
       ===================================================== */

    const GAME_PHASE = Object.freeze({

        TITLE: "title",

        CUSTOMER_ENTERING: "customerEntering",

        CUSTOMER_TALKING: "customerTalking",

        RECEPTION: "reception",

        QUIZ: "quiz",

        ANSWER_RESULT: "answerResult",

        REPAIR_END: "repairEnd",

        REPAIR_COMPLETE: "repairComplete",

        RESULT: "result",

        CUSTOMER_LEAVING: "customerLeaving"

    });


    /* =====================================================
       RANK DATA
       ===================================================== */

    const RANK_DATA = Object.freeze([

        {
            name: "D",
            minimumLevel: 1
        },

        {
            name: "C",
            minimumLevel: 3
        },

        {
            name: "B",
            minimumLevel: 6
        },

        {
            name: "A",
            minimumLevel: 10
        },

        {
            name: "S",
            minimumLevel: 15
        },

        {
            name: "SS",
            minimumLevel: 22
        },

        {
            name: "SSS",
            minimumLevel: 30
        }

    ]);


    /* =====================================================
       CUSTOMER DATA
       ===================================================== */

    const CUSTOMER_SCENARIOS = Object.freeze([

        {
            id: "iphone-screen",
            opening:
                "すみません！iPhoneを落として画面が割れてしまいました……。",
            reception:
                "画面は映っていますが、タッチが時々勝手に動きます。修理できますか？",
            accepted:
                "お願いします！大事なデータが入っているんです。",
            repairing:
                "画面の状態を確認して修理します！",
            completed:
                "画面がきれいになった！操作も問題ありません！",
            category: "iPhone"
        },

        {
            id: "iphone-battery",
            opening:
                "最近、iPhoneの充電がすぐになくなってしまいます。",
            reception:
                "朝100％にしても、お昼には残り20％くらいになります。",
            accepted:
                "バッテリー交換をお願いします！",
            repairing:
                "バッテリーと電源系統を確認します！",
            completed:
                "これで安心して一日使えます！",
            category: "iPhone"
        },

        {
            id: "iphone-charge",
            opening:
                "ケーブルを挿してもiPhoneが充電できません。",
            reception:
                "角度を変えると、たまに充電できることがあります。",
            accepted:
                "充電口の修理をお願いします。",
            repairing:
                "充電口と内部の接続を確認します！",
            completed:
                "しっかり充電できるようになりました！",
            category: "iPhone"
        },

        {
            id: "android-screen",
            opening:
                "Androidスマホの画面が真っ暗になりました。",
            reception:
                "着信音は鳴りますが、画面だけ何も映りません。",
            accepted:
                "データを消さずに修理してください。",
            repairing:
                "画面と表示回路を診断します！",
            completed:
                "写真もデータもそのままです！ありがとうございます！",
            category: "Android"
        },

        {
            id: "android-battery",
            opening:
                "スマホの背面が少し浮いてきました。",
            reception:
                "最近、本体が熱くなることもあります。",
            accepted:
                "危なくないように修理をお願いします。",
            repairing:
                "バッテリー膨張の可能性を確認します！",
            completed:
                "背面もきれいに閉まりました！",
            category: "Android"
        },

        {
            id: "pixel-fingerprint",
            opening:
                "Pixelの画面を交換してから指紋認証が使えません。",
            reception:
                "指紋を登録し直そうとしても途中で失敗します。",
            accepted:
                "指紋認証も使えるようにしてください。",
            repairing:
                "画面とキャリブレーション状態を確認します！",
            completed:
                "指紋認証も正常に使えます！",
            category: "Android"
        },

        {
            id: "galaxy-screen",
            opening:
                "Galaxyを落として画面に緑の線が出ました。",
            reception:
                "海外で購入した端末ですが、修理できますか？",
            accepted:
                "型番を確認して修理をお願いします。",
            repairing:
                "販売地域と部品仕様を確認します！",
            completed:
                "きれいに表示されるようになりました！",
            category: "Android"
        },

        {
            id: "switch-display",
            opening:
                "Switchの本体画面だけ映らなくなりました。",
            reception:
                "テレビにつなぐと普通にゲームできます。",
            accepted:
                "本体画面の修理をお願いします。",
            repairing:
                "液晶とバックライトを診断します！",
            completed:
                "本体だけでも遊べるようになりました！",
            category: "Switch"
        },

        {
            id: "switch-card",
            opening:
                "Switchがゲームカードを読み込まなくなりました。",
            reception:
                "microSDカードは読み込めています。",
            accepted:
                "ゲームカードスロットを確認してください。",
            repairing:
                "カードスロットの状態を確認します！",
            completed:
                "ゲームカードを読み込めるようになりました！",
            category: "Switch"
        },

        {
            id: "switch-charge",
            opening:
                "Switchがまったく充電できません。",
            reception:
                "別の充電器を使っても反応がありません。",
            accepted:
                "原因を調べて修理してください。",
            repairing:
                "充電口と基板回路を診断します！",
            completed:
                "電源が入りました！セーブデータも残っています！",
            category: "Switch"
        },

        {
            id: "water-damage",
            opening:
                "スマホを水の中に落としてしまいました！",
            reception:
                "一度電源が入りましたが、今は反応しません。",
            accepted:
                "データが必要なので、できる限りお願いします。",
            repairing:
                "通電を止めて内部洗浄と基板診断を行います！",
            completed:
                "データを確認できました！本当に助かりました！",
            category: "修理知識"
        },

        {
            id: "speaker",
            opening:
                "スマホから音が聞こえなくなりました。",
            reception:
                "通話も動画も音が小さくて聞き取りにくいです。",
            accepted:
                "スピーカーを確認してください。",
            repairing:
                "設定、詰まり、部品故障を切り分けます！",
            completed:
                "音がはっきり聞こえるようになりました！",
            category: "修理知識"
        }

    ]);


    /* =====================================================
       SHOP INTERACTIONS
       ===================================================== */

    const SHOP_MESSAGES = Object.freeze({

        spotCounter: [
            "修理カウンターだ。受付前に端末の状態を確認しよう。",
            "ネジや部品は機種ごとに分けて管理している。",
            "修理前と修理後の動作確認を忘れないようにしよう。"
        ],

        spotPoster: [
            "店内ポスターには修理メニューが書かれている。",
            "画面交換、バッテリー交換、水没修理に対応している。",
            "お客様に分かりやすい案内を心掛けよう。"
        ],

        spotShelf: [
            "交換用パーツが並んでいる。",
            "同じ機種名でも型番違いには注意が必要だ。",
            "修理前に部品の初期不良を確認しよう。"
        ],

        spotDoor: [
            "お客様が入ってくる入口だ。",
            "来店ベルが鳴ったら、明るく挨拶しよう。",
            "次のお客様が来るまで店内を確認できる。"
        ]

    });


    /* =====================================================
       DOM REFERENCES
       ===================================================== */

    const dom = {

        game: null,

        startScreen: null,

        startButton: null,

        customer: null,

        customerSprite: null,

        feni: null,

        feniSprite: null,

        speech: null,

        speechText: null,

        receptionWindow: null,

        customerSymptom: null,

        acceptButton: null,

        quizWindow: null,

        category: null,

        timer: null,

        question: null,

        answerButtons: [],

        repairPanel: null,

        repairGauge: null,

        repairPercent: null,

        repairEndPanel: null,

        repairEndGauge: null,

        repairEndPercent: null,

        repairEndButton: null,

        repairEndEffect: null,

        comboEffect: null,

        coinEffect: null,

        rankUpEffect: null,

        completeEffect: null,

        level: null,

        rank: null,

        combo: null,

        money: null,

        resultWindow: null,

        resultRank: null,

        resultCombo: null,

        resultMoney: null,

        nextCustomer: null,

        touchSpots: []

    };


    /* =====================================================
       GAME STATE
       ===================================================== */

    const gameState = {

        phase: GAME_PHASE.TITLE,

        started: false,

        processing: false,

        answerLocked: false,

        level: 1,

        experience: 0,

        rank: "D",

        combo: 0,

        highestCombo: 0,

        money: 0,

        totalCorrect: 0,

        totalWrong: 0,

        totalAnswered: 0,

        customersCompleted: 0,

        repairGauge: 0,

        repairEndGauge: 0,

        repairEndUses: 0,

        repairEndActivating: false,

        customerEarnings: 0,

        customerCorrectAnswers: 0,

        customerWrongAnswers: 0,

        currentCustomer: null,

        currentQuestion: null,

        lastCustomerId: null,

        timerValue: GAME_CONFIG.quizTimeLimit,

        timerIntervalId: null,

        timerRunId: 0,

        sequenceId: 0,

        speechTimeoutId: null,

        titleBgmStarted: false

    };


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initializeGame() {

        try {

            cacheDomElements();

            ensureRepairEndInterface();

            configureGameLabels();

            ensureSoundSystem();

            if (!validateRequiredSystems()) {

                throw new Error(
                    "必要なHTML要素またはquiz.jsの機能が不足しています。"
                );

            }

            registerEventListeners();

            resetVisualState();

            updateHud();

            if (
                typeof RepairLegendQuiz.createQuestionDeck ===
                "function"
            ) {

                RepairLegendQuiz.createQuestionDeck(true);

            }

            setPhase(GAME_PHASE.TITLE);

            console.log(
                "Repair Legend Game: 初期化完了"
            );

        } catch (error) {

            console.error(
                "Repair Legend 初期化エラー:",
                error
            );

            const startButton =
                document.getElementById("startButton");

            if (startButton) {

                startButton.disabled = false;

                startButton.addEventListener(
                    "click",
                    function () {

                        alert(
                            "ゲームの読み込みに失敗しました。quiz.jsの内容またはファイル名を確認してください。"
                        );

                    },
                    { once: true }
                );

            }

        }

    }


    function ensureSoundSystem() {

        if (window.RepairLegendSound) {

            return;

        }

        console.warn(
            "Repair Legend: sound.jsを読み込めないため、無音モードで起動します。"
        );

        window.RepairLegendSound = Object.freeze({
            unlockAudio: async function () {},
            playBgm: function () {},
            pauseBgm: function () {},
            playBell: function () {},
            playCorrect: function () {},
            playWrong: function () {},
            playCoin: function () {},
            playComboCoin: function () {},
            playRepairComplete: function () {},
            playRepairEnd: function () {},
            playTap: function () {}
        });

    }


    function cacheDomElements() {

        dom.game =
            document.getElementById("game");

        dom.startScreen =
            document.getElementById("startScreen");

        dom.startButton =
            document.getElementById("startButton");

        dom.customer =
            document.getElementById("customer");

        dom.customerSprite =
            document.getElementById("customerSprite");

        dom.feni =
            document.getElementById("feni");

        dom.feniSprite =
            document.getElementById("feniSprite");

        dom.speech =
            document.getElementById("speech");

        dom.speechText =
            document.getElementById("speechText");

        dom.receptionWindow =
            document.getElementById("receptionWindow");

        dom.customerSymptom =
            document.getElementById("customerSymptom");

        dom.acceptButton =
            document.getElementById("acceptButton");

        dom.quizWindow =
            document.getElementById("quizWindow");

        dom.category =
            document.getElementById("category");

        dom.timer =
            document.getElementById("timer");

        dom.question =
            document.getElementById("question");

        dom.answerButtons =
            Array.from(
                document.querySelectorAll(".answerBtn")
            );

        dom.repairPanel =
            document.getElementById("repairPanel");

        dom.repairGauge =
            document.getElementById("repairGauge");

        dom.repairPercent =
            document.getElementById("repairPercent");

        dom.repairEndPanel =
            document.getElementById("repairEndPanel");

        dom.repairEndGauge =
            document.getElementById("repairEndGauge");

        dom.repairEndPercent =
            document.getElementById("repairEndPercent");

        dom.repairEndButton =
            document.getElementById("repairEndButton");

        dom.repairEndEffect =
            document.getElementById("repairEndEffect");

        dom.comboEffect =
            document.getElementById("comboEffect");

        dom.coinEffect =
            document.getElementById("coinEffect");

        dom.rankUpEffect =
            document.getElementById("rankUpEffect");

        dom.completeEffect =
            document.getElementById("completeEffect");

        dom.level =
            document.getElementById("level");

        dom.rank =
            document.getElementById("rank");

        dom.combo =
            document.getElementById("combo");

        dom.money =
            document.getElementById("money");

        dom.resultWindow =
            document.getElementById("resultWindow");

        dom.resultRank =
            document.getElementById("resultRank");

        dom.resultCombo =
            document.getElementById("resultCombo");

        dom.resultMoney =
            document.getElementById("resultMoney");

        dom.nextCustomer =
            document.getElementById("nextCustomer");

        dom.touchSpots =
            Array.from(
                document.querySelectorAll(".touchSpot")
            );

    }


    function ensureRepairEndInterface() {

        if (!dom.game || !dom.repairPanel) {

            return;

        }

        injectRepairEndStyles();

        let panel =
            document.getElementById(
                "repairEndPanel"
            );

        if (!panel) {

            panel =
                document.createElement(
                    "section"
                );

            panel.id =
                "repairEndPanel";

            panel.className =
                "repair-end-panel";

            panel.setAttribute(
                "aria-label",
                "必殺技ゲージ"
            );

            panel.innerHTML = `
                <div class="repair-end-heading">
                    <span>必殺技ゲージ</span>
                    <strong id="repairEndPercent">0%</strong>
                </div>
                <div class="repair-end-track" aria-hidden="true">
                    <div id="repairEndGauge" class="repair-end-gauge"></div>
                </div>
                <button
                    id="repairEndButton"
                    class="repair-end-button"
                    type="button"
                    disabled
                    hidden
                >🔥 リペアエンド！！</button>
            `;

            dom.repairPanel.appendChild(
                panel
            );

        }

        let effect =
            document.getElementById(
                "repairEndEffect"
            );

        if (!effect) {

            effect =
                document.createElement(
                    "div"
                );

            effect.id =
                "repairEndEffect";

            effect.className =
                "repair-end-effect";

            effect.setAttribute(
                "aria-hidden",
                "true"
            );

            effect.innerHTML = `
    <div class="repair-end-dark"></div>
    <div class="repair-end-speed-lines"></div>

    <div class="repair-end-cutin">
        <div class="repair-end-cutin-bg"></div>

        <img
            src="./feni.png"
            class="repair-end-cutin-character"
            alt=""
            draggable="false">

        <div class="repair-end-cutin-message">
            修理不能？<br>
            その言葉は俺には通用しない。
        </div>
    </div>

    <div class="repair-end-slash"></div>

    <div class="repair-end-title-wrap">
        <div class="repair-end-subtitle">
            PHOENIX SPECIAL ATTACK
        </div>
        <div class="repair-end-title">
            リペアエンド！！
        </div>
    </div>

    <div class="repair-end-flash"></div>
`;

            dom.game.appendChild(
                effect
            );

        }

        dom.repairEndPanel = panel;

        dom.repairEndGauge =
            document.getElementById(
                "repairEndGauge"
            );

        dom.repairEndPercent =
            document.getElementById(
                "repairEndPercent"
            );

        dom.repairEndButton =
            document.getElementById(
                "repairEndButton"
            );

        dom.repairEndEffect = effect;

        if (dom.customer) {

            dom.customer.classList.add(
                "customer-large"
            );

        }

    }


    function injectRepairEndStyles() {

        if (
            document.getElementById(
                "repairEndGameStyles"
            )
        ) {

            return;

        }

        const style =
            document.createElement("style");

        style.id =
            "repairEndGameStyles";

        style.textContent = `
            #customer.customer-large {
                scale: 1.15;
                transform-origin: 50% 100%;
            }

            .repair-end-panel {
                width: min(100%, 360px);
                margin: 10px auto 0;
                padding: 10px;
                border: 2px solid rgba(255, 179, 0, 0.78);
                border-radius: 12px;
                background: rgba(19, 14, 9, 0.9);
                box-shadow: 0 0 16px rgba(255, 129, 0, 0.3);
            }

            .repair-end-heading {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 7px;
                color: #ffe6a3;
                font-weight: 800;
                letter-spacing: 0.04em;
            }

            .repair-end-track {
                height: 14px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.45);
                border-radius: 999px;
                background: rgba(0,0,0,0.6);
            }

            .repair-end-gauge {
                width: 0%;
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(90deg, #ff7a00, #ffd400, #fff2a8);
                box-shadow: 0 0 12px rgba(255, 180, 0, 0.8);
                transition: width 280ms ease;
            }

            .repair-end-panel.ready {
                animation: repairEndReadyPulse 900ms ease-in-out infinite alternate;
            }

            .repair-end-button {
                width: 100%;
                min-height: 48px;
                margin-top: 9px;
                border: 2px solid #fff0a0;
                border-radius: 12px;
                background: linear-gradient(180deg, #ff4d00, #b60000);
                color: #fff;
                font: inherit;
                font-weight: 900;
                letter-spacing: 0.06em;
                text-shadow: 0 2px 0 rgba(0,0,0,0.55);
                box-shadow: 0 0 18px rgba(255, 70, 0, 0.65);
                cursor: pointer;
                touch-action: manipulation;
            }

            .repair-end-button:disabled {
                opacity: 0.55;
                cursor: default;
            }

            .repair-end-button:not(:disabled) {
                animation: repairEndButtonPulse 650ms ease-in-out infinite alternate;
            }

            .repair-end-effect {
                position: absolute;
                inset: 0;
                z-index: 9999;
                display: grid;
                place-items: center;
                overflow: hidden;
                opacity: 0;
                pointer-events: none;
            }

            .repair-end-effect.show {
                animation: repairEndOverlay 950ms ease-out both;
            }

            .repair-end-burst {
                position: absolute;
                width: 65vmax;
                height: 65vmax;
                border-radius: 50%;
                background:
                    radial-gradient(circle, rgba(255,255,210,0.98) 0 7%, rgba(255,190,0,0.95) 12%, rgba(255,55,0,0.82) 28%, rgba(135,0,0,0.35) 52%, transparent 70%);
                transform: scale(0.05) rotate(0deg);
            }

            .repair-end-effect.show .repair-end-burst {
                animation: repairEndBurst 950ms cubic-bezier(.18,.8,.2,1) both;
            }

            .repair-end-title {
                position: relative;
                z-index: 2;
                padding: 16px 22px;
                color: #fff6b0;
                font-size: clamp(30px, 8vw, 72px);
                font-weight: 1000;
                letter-spacing: 0.08em;
                text-align: center;
                text-shadow:
                    0 4px 0 #8c0000,
                    0 0 12px #ff4600,
                    0 0 28px #ffd400;
                transform: scale(0.5) rotate(-4deg);
            }

            .repair-end-effect.show .repair-end-title {
                animation: repairEndTitle 950ms cubic-bezier(.2,.9,.2,1) both;
            }

            #game.repair-end-active {
                animation: repairEndGameFlash 950ms ease-out both;
            }

            #feni.repair-end {
                animation: repairEndFeni 950ms cubic-bezier(.2,.8,.2,1) both;
                filter: drop-shadow(0 0 18px #ff9d00);
            }

            @keyframes repairEndReadyPulse {
                from { box-shadow: 0 0 12px rgba(255, 70, 0, 0.45); }
                to { box-shadow: 0 0 28px rgba(255, 213, 0, 0.9); }
            }

            @keyframes repairEndButtonPulse {
                from { transform: translateY(0) scale(1); }
                to { transform: translateY(-2px) scale(1.025); }
            }

            @keyframes repairEndOverlay {
                0% { opacity: 0; background: rgba(0,0,0,0); }
                12% { opacity: 1; background: rgba(25,0,0,0.42); }
                75% { opacity: 1; }
                100% { opacity: 0; background: rgba(0,0,0,0); }
            }

            @keyframes repairEndBurst {
                0% { transform: scale(0.05) rotate(0deg); opacity: 0; }
                28% { opacity: 1; }
                100% { transform: scale(1.3) rotate(35deg); opacity: 0; }
            }

            @keyframes repairEndTitle {
                0% { transform: scale(0.45) rotate(-5deg); opacity: 0; }
                24% { transform: scale(1.12) rotate(1deg); opacity: 1; }
                65% { transform: scale(1) rotate(0deg); opacity: 1; }
                100% { transform: scale(1.2) rotate(2deg); opacity: 0; }
            }

            @keyframes repairEndGameFlash {
                0%, 100% { filter: none; }
                22% { filter: brightness(1.45) saturate(1.45); }
                46% { filter: brightness(0.82) saturate(1.7); }
            }

            @keyframes repairEndFeni {
                0% { transform: translateY(0) scale(1); }
                30% { transform: translateY(-18px) scale(1.12); }
                62% { transform: translateY(4px) scale(1.05); }
                100% { transform: translateY(0) scale(1); }
            }

            #speech.speaker-feni {
                left: clamp(18px, 18vw, 290px);
                right: auto;
                transform-origin: left bottom;
            }

            #speech.speaker-feni::before {
                left: 29%;
                right: auto;
                border-top: 27px solid #11151a;
                border-left: 5px solid transparent;
                border-right: 18px solid transparent;
            }

            #speech.speaker-feni::after {
                left: calc(29% + 4px);
                right: auto;
                border-top: 20px solid #fffdf3;
                border-left: 3px solid transparent;
                border-right: 12px solid transparent;
            }

            #speech.speaker-customer {
                left: auto;
            }

            @media (prefers-reduced-motion: reduce) {
                .repair-end-panel.ready,
                .repair-end-button:not(:disabled),
                .repair-end-effect.show,
                .repair-end-effect.show .repair-end-burst,
                .repair-end-effect.show .repair-end-title,
                #game.repair-end-active,
                #feni.repair-end {
                    animation-duration: 1ms !important;
                    animation-iteration-count: 1 !important;
                }
            }
        `;

        document.head.appendChild(style);

    }


    function configureGameLabels() {

        if (dom.nextCustomer) {

            dom.nextCustomer.textContent =
                "お帰りいただく";

            dom.nextCustomer.setAttribute(
                "aria-label",
                "修理が完了したお客様にお帰りいただく"
            );

        }

    }


    function validateRequiredSystems() {

        const requiredElements = [

            dom.game,

            dom.startScreen,

            dom.startButton,

            dom.customer,

            dom.feni,

            dom.speech,

            dom.speechText,

            dom.receptionWindow,

            dom.acceptButton,

            dom.quizWindow,

            dom.question,

            dom.repairPanel,

            dom.repairEndPanel,

            dom.repairEndGauge,

            dom.repairEndPercent,

            dom.repairEndButton,

            dom.repairEndEffect,

            dom.resultWindow,

            dom.nextCustomer

        ];

        const missingElement =
            requiredElements.some(
                function (element) {

                    return !element;

                }
            );

        if (missingElement) {

            console.error(
                "Repair Legend: 必要なHTML要素が不足しています。"
            );

            return false;

        }

        if (!window.RepairLegendQuiz) {

            console.error(
                "Repair Legend: quiz.jsが読み込まれていません。"
            );

            return false;

        }

        if (dom.answerButtons.length !== 4) {

            console.error(
                "Repair Legend: 回答ボタンは4個必要です。"
            );

            return false;

        }

        return true;

    }


    function registerEventListeners() {

        dom.startButton.addEventListener(
            "click",
            handleStartButton
        );

        if (dom.startScreen) {

            dom.startScreen.addEventListener(
                "pointerdown",
                startTitleBgm,
                { once: true, passive: true }
            );

            dom.startScreen.addEventListener(
                "touchstart",
                startTitleBgm,
                { once: true, passive: true }
            );

        }

        document.querySelectorAll("button").forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    playButtonSound
                );

            }
        );

        dom.acceptButton.addEventListener(
            "click",
            handleAcceptButton
        );

        dom.nextCustomer.addEventListener(
            "click",
            handleNextCustomerButton
        );

        dom.repairEndButton.addEventListener(
            "click",
            handleRepairEndButton
        );

        dom.answerButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    handleAnswerButton
                );

            }
        );

        dom.touchSpots.forEach(
            function (spot) {

                spot.addEventListener(
                    "click",
                    handleShopInteraction
                );

            }
        );

        window.addEventListener(
            "pagehide",
            handlePageHide
        );

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

    }


    /* =====================================================
       GAME START
       ===================================================== */

    function startTitleBgm() {

    if (gameState.titleBgmStarted) {
        return;
    }

    if (!window.RepairLegendSound) {
        return;
    }

    gameState.titleBgmStarted = true;

    try {

        /*
         * iPhone・iPadでは、ユーザー操作中に
         * 直接play()まで進める必要があります。
         */
        if (
            typeof RepairLegendSound
                .startAudioFromUserGesture ===
            "function"
        ) {

            RepairLegendSound
                .startAudioFromUserGesture();

            return;
        }

        if (
            typeof RepairLegendSound
                .playTitleBgm ===
            "function"
        ) {

            RepairLegendSound.playTitleBgm({
                restart: false,
                fadeIn: false
            });

            return;
        }

        if (
            typeof RepairLegendSound
                .playBgm ===
            "function"
        ) {

            RepairLegendSound.playBgm({
                restart: false,
                fadeIn: false
            });
        }

    } catch (error) {

        gameState.titleBgmStarted = false;

        console.warn(
            "タイトルBGMを開始できませんでした。",
            error
        );
    }
}


    function playButtonSound() {

        if (!window.RepairLegendSound) {

            return;

        }

        const soundNames = [
            "playTap",
            "playButton",
            "playClick"
        ];

        for (const soundName of soundNames) {

            if (
                typeof RepairLegendSound[soundName] ===
                "function"
            ) {

                try {

                    RepairLegendSound[soundName]();

                } catch (error) {

                    console.warn(
                        "ボタン音を再生できませんでした。",
                        error
                    );

                }

                return;

            }

        }

        const tapAudio =
            document.getElementById("tapSound");

        if (tapAudio) {

            try {

                tapAudio.currentTime = 0;

                const playResult = tapAudio.play();

                if (
                    playResult &&
                    typeof playResult.catch ===
                        "function"
                ) {

                    playResult.catch(function () {});

                }

            } catch (error) {

                console.warn(
                    "ボタン音を再生できませんでした。",
                    error
                );

            }

        }

    }


    async function handleStartButton() {

        if (gameState.started) {

            return;

        }

        gameState.started = true;

        gameState.processing = true;

        gameState.sequenceId += 1;

        await startTitleBgm();

        dom.startScreen.classList.add(
            "hidden"
        );

        try {

            if (
                window.RepairLegendSound &&
                typeof RepairLegendSound.unlockAudio ===
                    "function"
            ) {

                try {

                    const unlockResult =
                        RepairLegendSound.unlockAudio();

                    if (
                        unlockResult &&
                        typeof unlockResult.catch ===
                            "function"
                    ) {

                        unlockResult.catch(
                            function (error) {

                                console.warn(
                                    "音声解除に失敗しました。無音で続行します。",
                                    error
                                );

                            }
                        );

                    }

                } catch (error) {

                    console.warn(
                        "音声解除に失敗しました。無音で続行します。",
                        error
                    );

                }

            }

            if (
                window.RepairLegendSound &&
                typeof RepairLegendSound.playBgm ===
                    "function"
            ) {

                RepairLegendSound.playBgm({
                    restart: false,
                    fadeIn: true
                });

            }

        } catch (error) {

            console.warn(
                "音声の開始に失敗しました。無音でゲームを続行します。",
                error
            );

        }

        await wait(350);

        try {

            resetGameProgress();

            gameState.processing = false;

            await startNextCustomer();

        } catch (error) {

            console.error(
                "ゲーム開始エラー:",
                error
            );

            gameState.started = false;

            gameState.processing = false;

            dom.startScreen.classList.remove(
                "hidden"
            );

            alert(
                "ゲームを開始できませんでした。quiz.jsの内容を確認してください。"
            );

        }

    }


    function resetGameProgress() {

        stopQuizTimer();

        gameState.level = 1;

        gameState.experience = 0;

        gameState.rank = "D";

        gameState.combo = 0;

        gameState.highestCombo = 0;

        gameState.money = 0;

        gameState.totalCorrect = 0;

        gameState.totalWrong = 0;

        gameState.totalAnswered = 0;

        gameState.customersCompleted = 0;

        gameState.repairGauge = 0;

        gameState.repairEndGauge = 0;

        gameState.repairEndUses = 0;

        gameState.repairEndActivating = false;

        gameState.customerEarnings = 0;

        gameState.customerCorrectAnswers = 0;

        gameState.customerWrongAnswers = 0;

        gameState.currentCustomer = null;

        gameState.currentQuestion = null;

        gameState.lastCustomerId = null;

        if (
            typeof RepairLegendQuiz.resetQuestionDeck ===
            "function"
        ) {

            RepairLegendQuiz.resetQuestionDeck();

        }

        if (
            typeof RepairLegendQuiz.createQuestionDeck ===
            "function"
        ) {

            RepairLegendQuiz.createQuestionDeck(true);

        }

        resetVisualState({
            keepStartHidden: true
        });

        updateHud();

    }


    /* =====================================================
       CUSTOMER FLOW
       ===================================================== */

    async function startNextCustomer() {

        if (gameState.processing) {

            return;

        }

        gameState.processing = true;

        gameState.sequenceId += 1;

        const currentSequence =
            gameState.sequenceId;

        resetCustomerSession();

        hideResultWindow();

        hideReceptionWindow();

        hideQuizWindow();

        hideSpeech();

        resetCharacterClasses();

        gameState.currentCustomer =
            selectCustomerScenario();

        setPhase(
            GAME_PHASE.CUSTOMER_ENTERING
        );

        prepareCustomerForEntrance();

        await wait(200);

        if (!isCurrentSequence(currentSequence)) {

            return;

        }

        dom.customer.style.opacity = "1";
        dom.customer.style.visibility = "visible";
        dom.customer.classList.add("walking");

        try {

            if (
                window.RepairLegendSound &&
                typeof RepairLegendSound.playBell ===
                    "function"
            ) {

                const bellResult =
                    RepairLegendSound.playBell();

                if (
                    bellResult &&
                    typeof bellResult.catch ===
                        "function"
                ) {

                    bellResult.catch(
                        function (error) {

                            console.warn(
                                "ベル音を再生できませんでした。ゲームは継続します。",
                                error
                            );

                        }
                    );

                }

            }

        } catch (error) {

            console.warn(
                "ベル音を再生できませんでした。ゲームは継続します。",
                error
            );

        }

        await wait(
            GAME_CONFIG.customerEnterDuration
        );

        if (!isCurrentSequence(currentSequence)) {

            return;

        }

        dom.customer.classList.remove("walking");

        dom.customer.style.opacity = "1";
        dom.customer.style.visibility = "visible";
        dom.customer.style.transform = "translateX(0)";

        dom.customer.classList.add("waiting");

        setPhase(
            GAME_PHASE.CUSTOMER_TALKING
        );

        await wait(
            GAME_CONFIG.speechDelay
        );

        if (!isCurrentSequence(currentSequence)) {

            return;

        }

        showSpeech(
            "いらっしゃいませ！",
            "feni"
        );

        await wait(650);

        if (!isCurrentSequence(currentSequence)) {

            return;

        }

        showSpeech(
            gameState.currentCustomer.opening,
            "customer"
        );

        await wait(
            GAME_CONFIG.receptionDelay
        );

        if (!isCurrentSequence(currentSequence)) {

            return;

        }

        showReceptionWindow();

        gameState.processing = false;

    }


    function resetCustomerSession() {

        gameState.repairGauge = 0;

        gameState.customerEarnings = 0;

        gameState.customerCorrectAnswers = 0;

        gameState.customerWrongAnswers = 0;

        gameState.currentQuestion = null;

        gameState.answerLocked = false;

        gameState.repairEndActivating = false;

        stopQuizTimer();

        updateRepairGauge();

        updateRepairEndGauge();

        clearAnswerStyles();

    }


    function selectCustomerScenario() {

        const availableScenarios =
            CUSTOMER_SCENARIOS.filter(
                function (scenario) {

                    return (
                        scenario.id !==
                        gameState.lastCustomerId
                    );

                }
            );

        const candidates =
            availableScenarios.length > 0
                ? availableScenarios
                : CUSTOMER_SCENARIOS;

        const randomIndex =
            Math.floor(
                Math.random() *
                candidates.length
            );

        const selected =
            candidates[randomIndex];

        gameState.lastCustomerId =
            selected.id;

        return {
            ...selected
        };

    }


    function prepareCustomerForEntrance() {

        dom.customer.className =
            "customer-large";

        dom.customer.style.opacity = "";
        dom.customer.style.visibility = "";
        dom.customer.style.transform = "";

        void dom.customer.offsetWidth;

        dom.customer.className =
            "customer-large";

    }


    function showReceptionWindow() {

        if (!gameState.currentCustomer) {

            return;

        }

        setPhase(GAME_PHASE.RECEPTION);

        dom.customerSymptom.textContent =
            gameState.currentCustomer.reception;

        dom.acceptButton.disabled = false;

        dom.receptionWindow.classList.add(
            "show"
        );

    }


    function hideReceptionWindow() {

        dom.receptionWindow.classList.remove(
            "show"
        );

        dom.acceptButton.disabled = false;

    }


    async function handleAcceptButton() {

        if (
            gameState.phase !==
            GAME_PHASE.RECEPTION
        ) {

            return;

        }

        if (gameState.processing) {

            return;

        }

        gameState.processing = true;

        dom.acceptButton.disabled = true;

        hideReceptionWindow();

        showSpeech(
            gameState.currentCustomer.accepted,
            "customer"
        );

        await wait(1000);

        showSpeech(
            gameState.currentCustomer.repairing,
            "feni"
        );

        dom.feni.classList.add("repairing");

        await wait(900);

        dom.feni.classList.remove("repairing");

        showSpeech(
            "この症状を疑おう！",
            "feni"
        );

        await wait(700);

        hideSpeech();

        showRepairPanel();

        gameState.processing = false;

        beginQuizQuestion();

    }


    /* =====================================================
       QUIZ FLOW
       ===================================================== */

    function beginQuizQuestion() {

        if (
            gameState.repairGauge >=
            GAME_CONFIG.repairGaugeMax
        ) {

            completeRepair();

            return;

        }

        stopQuizTimer();

        clearAnswerStyles();

        gameState.answerLocked = false;

        gameState.currentQuestion =
            getQuestionForCurrentCustomer();

        if (!gameState.currentQuestion) {

            console.error(
                "Repair Legend: 問題を取得できませんでした。"
            );

            return;

        }

        renderCurrentQuestion();

        showQuizWindow();

        setPhase(GAME_PHASE.QUIZ);

        enableAnswerButtons();

        updateRepairEndGauge();

        startQuizTimer();

    }


    function getQuestionForCurrentCustomer() {

        let question = null;

        const customerCategory =
            gameState.currentCustomer
                ? gameState.currentCustomer.category
                : null;

        if (customerCategory) {

            question =
                RepairLegendQuiz.getNextQuestion({
                    category: customerCategory,
                    shuffleChoices: true
                });

        }

        if (!question) {

            question =
                RepairLegendQuiz.getNextQuestion({
                    shuffleChoices: true
                });

        }

        return question;

    }


    function renderCurrentQuestion() {

        const question =
            gameState.currentQuestion;

        if (!question) {

            return;

        }

        dom.category.textContent =
            question.category;

        const symptomText =
    question.symptom
        ? question.symptom
        : "症状情報なし";

dom.question.textContent =
    `【症状】${symptomText}\n【問題】${question.question}`;

        dom.answerButtons.forEach(
            function (button, index) {

                const choiceText =
                    question.choices[index] || "";

                button.textContent =
                    choiceText;

                button.dataset.answer =
                    String(index);

                button.setAttribute(
                    "aria-label",
                    `${String.fromCharCode(
                        65 + index
                    )}：${choiceText}`
                );

            }
        );

        setTimerDisplay(
            GAME_CONFIG.quizTimeLimit
        );

    }


    function showQuizWindow() {

        dom.quizWindow.classList.add("show");

    }


    function hideQuizWindow() {

        stopQuizTimer();

        dom.quizWindow.classList.remove(
            "show"
        );

    }


    function handleAnswerButton(event) {

        if (
            gameState.phase !==
            GAME_PHASE.QUIZ
        ) {

            return;

        }

        if (gameState.answerLocked) {

            return;

        }

        const button =
            event.currentTarget;

        const selectedIndex =
            Number(
                button.dataset.answer
            );

        if (
            !Number.isInteger(selectedIndex) ||
            selectedIndex < 0 ||
            selectedIndex > 3
        ) {

            return;

        }

        processAnswer(
            selectedIndex,
            false
        );

    }


    async function processAnswer(
        selectedIndex,
        timedOut,
        options = {}
    ) {

        if (gameState.answerLocked) {

            return;

        }

        const usedRepairEnd =
            Boolean(
                options &&
                options.repairEnd
            );

        gameState.answerLocked = true;

        setPhase(
            GAME_PHASE.ANSWER_RESULT
        );

        stopQuizTimer();

        disableAnswerButtons();

        const answerResult =
            RepairLegendQuiz.checkAnswer(
                gameState.currentQuestion,
                selectedIndex
            );

        gameState.totalAnswered += 1;

        if (answerResult.isCorrect) {

            await processCorrectAnswer(
                selectedIndex,
                answerResult,
                usedRepairEnd
            );

        } else {

            await processWrongAnswer(
                selectedIndex,
                answerResult,
                timedOut
            );

        }

        await wait(
            GAME_CONFIG.answerResultDuration
        );

        clearAnswerStyles();

        if (
            gameState.repairGauge >=
            GAME_CONFIG.repairGaugeMax
        ) {

            completeRepair();

            return;

        }

        await wait(
            GAME_CONFIG.nextQuestionDelay
        );

        beginQuizQuestion();

    }


    async function processCorrectAnswer(
        selectedIndex,
        answerResult,
        usedRepairEnd = false
    ) {

        gameState.totalCorrect += 1;

        gameState.customerCorrectAnswers += 1;

        gameState.combo += 1;

        gameState.highestCombo =
            Math.max(
                gameState.highestCombo,
                gameState.combo
            );

        const selectedButton =
            dom.answerButtons[selectedIndex];

        if (selectedButton) {

            selectedButton.classList.add(
                "correct"
            );

        }

        dom.game.classList.add(
            "flash-correct"
        );

        RepairLegendSound.playCorrect();

        dom.feni.classList.add(
            "celebrating"
        );

        const moneyEarned =
            calculateQuestionReward(
                answerResult.reward,
                gameState.combo
            );

        gameState.money += moneyEarned;

        gameState.customerEarnings +=
            moneyEarned;

        const experienceEarned =
            GAME_CONFIG.baseExperience +
            (
                gameState.combo *
                GAME_CONFIG.comboExperienceBonus
            );

        addExperience(
            experienceEarned
        );

        const gaugeGain =
            Number(
                answerResult.gaugeGain
            ) ||
            GAME_CONFIG.correctGaugeGain;

        addRepairGauge(
            gaugeGain
        );

        if (!usedRepairEnd) {

            addRepairEndGauge(
                GAME_CONFIG.repairEndGaugeGain
            );

        }

        showComboEffect();

        showCoinEffect(
            moneyEarned
        );

        RepairLegendSound.playComboCoin(
            gameState.combo
        );

        updateHud();

        await wait(550);

        dom.feni.classList.remove(
            "celebrating"
        );

        dom.game.classList.remove(
            "flash-correct"
        );

    }


    async function processWrongAnswer(
        selectedIndex,
        answerResult,
        timedOut
    ) {

        gameState.totalWrong += 1;

        gameState.customerWrongAnswers += 1;

        gameState.combo = 0;

        if (!timedOut) {

            const selectedButton =
                dom.answerButtons[selectedIndex];

            if (selectedButton) {

                selectedButton.classList.add(
                    "wrong"
                );

            }

        }

        const correctButton =
            dom.answerButtons[
                answerResult.correctIndex
            ];

        if (correctButton) {

            correctButton.classList.add(
                "reveal"
            );

        }

        dom.game.classList.add(
            "flash-wrong",
            "screen-shake"
        );

        dom.feni.classList.add(
            "damage"
        );

        RepairLegendSound.playWrong();

        updateHud();

        if (timedOut) {

            showTemporarySpeech(
                "時間切れ！落ち着いて次の問題に挑戦しよう。",
                1300
            );

        } else {

            showTemporarySpeech(
                `不正解！正解は「${answerResult.correctAnswer}」`,
                1300
            );

        }

        await wait(550);

        dom.feni.classList.remove(
            "damage"
        );

        dom.game.classList.remove(
            "flash-wrong",
            "screen-shake"
        );

    }


    /* =====================================================
       QUIZ TIMER
       ===================================================== */

    function startQuizTimer() {

        stopQuizTimer();

        gameState.timerRunId += 1;

        const currentTimerRun =
            gameState.timerRunId;

        gameState.timerValue =
            GAME_CONFIG.quizTimeLimit;

        setTimerDisplay(
            gameState.timerValue
        );

        gameState.timerIntervalId =
            window.setInterval(
                function () {

                    if (
                        currentTimerRun !==
                        gameState.timerRunId
                    ) {

                        return;

                    }

                    gameState.timerValue -= 1;

                    setTimerDisplay(
                        gameState.timerValue
                    );

                    if (
                        gameState.timerValue <= 0
                    ) {

                        stopQuizTimer();

                        processAnswer(
                            -1,
                            true
                        );

                    }

                },
                1000
            );

    }


    function stopQuizTimer() {

        gameState.timerRunId += 1;

        if (
            gameState.timerIntervalId !==
            null
        ) {

            clearInterval(
                gameState.timerIntervalId
            );

            gameState.timerIntervalId =
                null;

        }

    }


    function setTimerDisplay(value) {

        const safeValue =
            Math.max(
                0,
                Number(value) || 0
            );

        dom.timer.textContent =
            String(safeValue);

        if (safeValue <= 3) {

            dom.timer.classList.add(
                "warning"
            );

        } else {

            dom.timer.classList.remove(
                "warning"
            );

        }

    }


    /* =====================================================
       REPAIR GAUGE
       ===================================================== */

    function addRepairGauge(amount) {

        const safeAmount =
            Math.max(
                0,
                Number(amount) || 0
            );

        gameState.repairGauge =
            Math.min(
                GAME_CONFIG.repairGaugeMax,
                gameState.repairGauge +
                safeAmount
            );

        updateRepairGauge();

    }


    function updateRepairGauge() {

        const percentage =
            Math.max(
                0,
                Math.min(
                    GAME_CONFIG.repairGaugeMax,
                    gameState.repairGauge
                )
            );

        dom.repairGauge.style.width =
            `${percentage}%`;

        dom.repairPercent.textContent =
            `${percentage}%`;

        if (
            percentage >=
            GAME_CONFIG.repairGaugeMax
        ) {

            dom.repairGauge.classList.add(
                "complete"
            );

        } else {

            dom.repairGauge.classList.remove(
                "complete"
            );

        }

    }


    function showRepairPanel() {

        dom.repairPanel.classList.add(
            "show"
        );

        updateRepairGauge();

        updateRepairEndGauge();

    }


    function hideRepairPanel() {

        dom.repairPanel.classList.remove(
            "show"
        );

    }


    /* =====================================================
       REPAIR END / SPECIAL MOVE
       ===================================================== */

    function addRepairEndGauge(amount) {

        const safeAmount =
            Math.max(
                0,
                Number(amount) || 0
            );

        gameState.repairEndGauge =
            Math.min(
                GAME_CONFIG.repairEndGaugeMax,
                gameState.repairEndGauge +
                safeAmount
            );

        updateRepairEndGauge();

    }


    function canUseRepairEnd() {

        return Boolean(
            gameState.started &&
            gameState.phase ===
                GAME_PHASE.QUIZ &&
            !gameState.processing &&
            !gameState.answerLocked &&
            !gameState.repairEndActivating &&
            gameState.currentQuestion &&
            gameState.repairEndGauge >=
                GAME_CONFIG.repairEndGaugeMax
        );

    }


    function updateRepairEndGauge() {

        if (
            !dom.repairEndPanel ||
            !dom.repairEndGauge ||
            !dom.repairEndPercent ||
            !dom.repairEndButton
        ) {

            return;

        }

        const percentage =
            Math.max(
                0,
                Math.min(
                    GAME_CONFIG.repairEndGaugeMax,
                    gameState.repairEndGauge
                )
            );

        const ready =
            percentage >=
            GAME_CONFIG.repairEndGaugeMax;

        dom.repairEndGauge.style.width =
            `${percentage}%`;

        dom.repairEndPercent.textContent =
            `${percentage}%`;

        dom.repairEndPanel.classList.toggle(
            "ready",
            ready
        );

        dom.repairEndButton.hidden =
            !ready ||
            gameState.phase !==
                GAME_PHASE.QUIZ;

        dom.repairEndButton.disabled =
            !canUseRepairEnd();

        dom.repairEndButton.setAttribute(
            "aria-disabled",
            String(
                dom.repairEndButton.disabled
            )
        );

    }


    async function handleRepairEndButton() {

        if (!canUseRepairEnd()) {

            return;

        }

        gameState.repairEndActivating =
            true;

        gameState.answerLocked = true;

        gameState.repairEndGauge = 0;

        gameState.repairEndUses += 1;

        stopQuizTimer();

        disableAnswerButtons();

        setPhase(
            GAME_PHASE.REPAIR_END
        );

        updateRepairEndGauge();

        await playRepairEndSequence();

        if (!gameState.currentQuestion) {

            gameState.answerLocked = false;

            gameState.repairEndActivating =
                false;

            setPhase(
                GAME_PHASE.QUIZ
            );

            enableAnswerButtons();

            startQuizTimer();

            return;

        }

        const correctIndex =
            gameState.currentQuestion
                .correctIndex;

        gameState.answerLocked = false;

        gameState.repairEndActivating =
            false;

        await processAnswer(
            correctIndex,
            false,
            {
                repairEnd: true
            }
        );

    }


    async function playRepairEndSequence() {

        dom.game.classList.add(
            "repair-end-active"
        );

        dom.feni.classList.add(
            "repair-end"
        );

        restartEffectClass(
            dom.repairEndEffect,
            "show"
        );

        showSpeech(
            "リペアエンド！！",
            "feni"
        );

        playRepairEndSound();

        await wait(
            GAME_CONFIG
                .repairEndAnimationDuration
        );

        dom.game.classList.remove(
            "repair-end-active"
        );

        dom.feni.classList.remove(
            "repair-end"
        );

        hideSpeech();

    }


    function playRepairEndSound() {

        if (!window.RepairLegendSound) {

            return;

        }

        if (
            typeof RepairLegendSound
                .playRepairEnd ===
            "function"
        ) {

            RepairLegendSound.playRepairEnd();

            return;

        }

        if (
            typeof RepairLegendSound
                .playRepairComplete ===
            "function"
        ) {

            RepairLegendSound
                .playRepairComplete();

        }

        if (
            typeof RepairLegendSound
                .playCorrect ===
            "function"
        ) {

            window.setTimeout(
                function () {

                    RepairLegendSound
                        .playCorrect();

                },
                180
            );

        }

    }


    /* =====================================================
       REPAIR COMPLETE
       ===================================================== */

    async function completeRepair() {

        if (
            gameState.phase ===
            GAME_PHASE.REPAIR_COMPLETE
        ) {

            return;

        }

        gameState.processing = true;

        setPhase(
            GAME_PHASE.REPAIR_COMPLETE
        );

        stopQuizTimer();

        disableAnswerButtons();

        hideQuizWindow();

        dom.repairGauge.classList.add(
            "complete"
        );

        dom.feni.classList.remove(
            "repairing",
            "damage"
        );

        dom.feni.classList.add(
            "celebrating"
        );

        dom.customer.classList.remove(
            "waiting",
            "sad"
        );

        dom.customer.classList.add(
            "happy"
        );

        showCompleteEffect();

        RepairLegendSound.playRepairComplete();

        await wait(700);

        RepairLegendSound.playCoin();

        showSpeech(
            "修理完了です！",
            "feni"
        );

        await wait(650);

        showSpeech(
            gameState.currentCustomer.completed,
            "customer"
        );

        await wait(
            GAME_CONFIG.repairCompleteDuration
        );

        dom.feni.classList.remove(
            "celebrating"
        );

        gameState.customersCompleted += 1;

        showResultWindow();

        gameState.processing = false;

    }


    function showCompleteEffect() {

        restartEffectClass(
            dom.completeEffect,
            "show"
        );

    }


    /* =====================================================
       RESULT
       ===================================================== */

    function showResultWindow() {

        setPhase(
            GAME_PHASE.RESULT
        );

        dom.resultRank.textContent =
            gameState.rank;

        dom.resultCombo.textContent =
            String(
                gameState.highestCombo
            );

        dom.resultMoney.textContent =
            formatMoney(
                gameState.customerEarnings
            );

        dom.resultWindow.classList.add(
            "show"
        );

        dom.nextCustomer.textContent =
            "お帰りいただく";

        dom.nextCustomer.disabled =
            false;

    }


    function hideResultWindow() {

        dom.resultWindow.classList.remove(
            "show"
        );

        dom.nextCustomer.disabled =
            false;

    }


    async function handleNextCustomerButton() {

        if (
            gameState.phase !==
            GAME_PHASE.RESULT
        ) {

            return;

        }

        if (gameState.processing) {

            return;

        }

        gameState.processing = true;

        dom.nextCustomer.disabled =
            true;

        hideResultWindow();

        hideSpeech();

        hideRepairPanel();

        await customerLeave();

        gameState.processing = false;

        startNextCustomer();

    }


    async function customerLeave() {

        setPhase(
            GAME_PHASE.CUSTOMER_LEAVING
        );

        dom.customer.classList.remove(
            "happy",
            "waiting",
            "walking"
        );

        void dom.customer.offsetWidth;

        dom.customer.classList.add(
            "leaving"
        );

        await wait(
            GAME_CONFIG.customerLeaveDuration
        );

        dom.customer.classList.remove(
            "leaving"
        );

    }


    /* =====================================================
       EXPERIENCE / LEVEL / RANK
       ===================================================== */

    function addExperience(amount) {

        const safeAmount =
            Math.max(
                0,
                Number(amount) || 0
            );

        if (
            gameState.level >=
            GAME_CONFIG.maxLevel
        ) {

            gameState.level =
                GAME_CONFIG.maxLevel;

            gameState.experience = 0;

            return;

        }

        gameState.experience +=
            safeAmount;

        let levelUpOccurred = false;

        while (
            gameState.level <
                GAME_CONFIG.maxLevel &&
            gameState.experience >=
                getRequiredExperience(
                    gameState.level
                )
        ) {

            gameState.experience -=
                getRequiredExperience(
                    gameState.level
                );

            gameState.level += 1;

            levelUpOccurred = true;

        }

        if (levelUpOccurred) {

            handleLevelUp();

        }

        updateRank();

    }


    function getRequiredExperience(level) {

        const normalizedLevel =
            Math.max(
                1,
                Number(level) || 1
            );

        return (
            GAME_CONFIG.levelBaseRequirement +
            (
                normalizedLevel - 1
            ) *
            GAME_CONFIG.levelRequirementIncrease
        );

    }


    function handleLevelUp() {

        restartEffectClass(
            dom.rankUpEffect,
            "show"
        );

        dom.rankUpEffect.textContent =
            `LEVEL UP！ LV.${gameState.level}`;

        RepairLegendSound.playCoin();

    }


    function updateRank() {

        const oldRank =
            gameState.rank;

        let newRank = "D";

        RANK_DATA.forEach(
            function (rankData) {

                if (
                    gameState.level >=
                    rankData.minimumLevel
                ) {

                    newRank =
                        rankData.name;

                }

            }
        );

        gameState.rank = newRank;

        if (
            oldRank !== newRank
        ) {

            showRankUpEffect(
                newRank
            );

        }

    }


    function showRankUpEffect(rank) {

        dom.rankUpEffect.textContent =
            `RANK UP！ ${rank}`;

        restartEffectClass(
            dom.rankUpEffect,
            "show"
        );

        RepairLegendSound.playRepairComplete();

    }


    /* =====================================================
       REWARD
       ===================================================== */

    function calculateQuestionReward(
        baseReward,
        combo
    ) {

        const safeBaseReward =
            Math.max(
                0,
                Number(baseReward) || 0
            );

        const safeCombo =
            Math.max(
                1,
                Number(combo) || 1
            );

        const comboBonusRate =
            Math.min(
                GAME_CONFIG.maximumComboBonusRate,
                (
                    safeCombo - 1
                ) *
                GAME_CONFIG.comboMoneyBonusRate
            );

        const finalReward =
            safeBaseReward *
            (
                1 +
                comboBonusRate
            );

        return Math.round(
            finalReward / 10
        ) * 10;

    }


    /* =====================================================
       HUD
       ===================================================== */

    function updateHud() {

        dom.level.textContent =
            String(
                gameState.level
            );

        dom.rank.textContent =
            gameState.rank;

        dom.combo.textContent =
            String(
                gameState.combo
            );

        dom.money.textContent =
            formatMoney(
                gameState.money
            );

        updateRankColor();

    }


    function updateRankColor() {

        const rankColors = {

            D: "#ffffff",

            C: "#83d97a",

            B: "#65b7ff",

            A: "#d47cff",

            S: "#ffd65a",

            SS: "#ff8a4c",

            SSS: "#ff5277"

        };

        dom.rank.style.color =
            rankColors[
                gameState.rank
            ] || "#ffffff";

    }


    function formatMoney(value) {

        const safeValue =
            Math.max(
                0,
                Math.round(
                    Number(value) || 0
                )
            );

        return `¥${safeValue.toLocaleString(
            "ja-JP"
        )}`;

    }


    /* =====================================================
       EFFECTS
       ===================================================== */

    function showComboEffect() {

        if (
            gameState.combo < 2
        ) {

            return;

        }

        dom.comboEffect.textContent =
            `${gameState.combo} COMBO！`;

        restartEffectClass(
            dom.comboEffect,
            "show"
        );

    }


    function showCoinEffect(amount) {

        dom.coinEffect.textContent =
            `＋${formatMoney(amount)}`;

        restartEffectClass(
            dom.coinEffect,
            "show"
        );

    }


    function restartEffectClass(
        element,
        className
    ) {

        if (!element) {

            return;

        }

        element.classList.remove(
            className
        );

        void element.offsetWidth;

        element.classList.add(
            className
        );

        window.setTimeout(
            function () {

                element.classList.remove(
                    className
                );

            },
            1900
        );

    }


    /* =====================================================
       SPEECH
       ===================================================== */

    function showSpeech(text, speaker = "customer") {

        clearTimeout(
            gameState.speechTimeoutId
        );

        dom.speechText.textContent =
            String(text || "");

        dom.speech.classList.remove(
            "speaker-feni",
            "speaker-customer"
        );

        dom.speech.classList.add(
            speaker === "feni"
                ? "speaker-feni"
                : "speaker-customer"
        );

        dom.speech.dataset.speaker =
            speaker === "feni"
                ? "feni"
                : "customer";

        dom.speech.classList.add(
            "show"
        );

    }


    function hideSpeech() {

        clearTimeout(
            gameState.speechTimeoutId
        );

        dom.speech.classList.remove(
            "show"
        );

    }


    function showTemporarySpeech(
        text,
        duration = 1200
    ) {

        showSpeech(text);

        gameState.speechTimeoutId =
            window.setTimeout(
                function () {

                    if (
                        gameState.phase ===
                        GAME_PHASE.ANSWER_RESULT
                    ) {

                        hideSpeech();

                    }

                },
                duration
            );

    }


    /* =====================================================
       SHOP INTERACTION
       ===================================================== */

    function handleShopInteraction(event) {

        if (
            gameState.phase ===
                GAME_PHASE.QUIZ ||
            gameState.phase ===
                GAME_PHASE.ANSWER_RESULT ||
            gameState.phase ===
                GAME_PHASE.RECEPTION ||
            gameState.phase ===
                GAME_PHASE.REPAIR_COMPLETE
        ) {

            return;

        }

        const spot =
            event.currentTarget;

        const messages =
            SHOP_MESSAGES[spot.id];

        if (
            !messages ||
            messages.length === 0
        ) {

            return;

        }

        const randomIndex =
            Math.floor(
                Math.random() *
                messages.length
            );

        showTemporarySpeech(
            messages[randomIndex],
            1800
        );

    }


    /* =====================================================
       ANSWER BUTTONS
       ===================================================== */

    function enableAnswerButtons() {

        dom.answerButtons.forEach(
            function (button) {

                button.disabled = false;

            }
        );

    }


    function disableAnswerButtons() {

        dom.answerButtons.forEach(
            function (button) {

                button.disabled = true;

            }
        );

    }


    function clearAnswerStyles() {

        dom.answerButtons.forEach(
            function (button) {

                button.classList.remove(
                    "correct",
                    "wrong",
                    "reveal"
                );

                button.disabled = false;

            }
        );

    }


    /* =====================================================
       VISUAL RESET
       ===================================================== */

    function resetVisualState(options = {}) {

        const keepStartHidden =
            Boolean(options.keepStartHidden);

        if (!keepStartHidden) {

            dom.startScreen.classList.remove(
                "hidden"
            );

        }

        hideReceptionWindow();

        hideQuizWindow();

        hideResultWindow();

        hideRepairPanel();

        hideSpeech();

        clearAnswerStyles();

        resetCharacterClasses();

        dom.repairGauge.style.width =
            "0%";

        dom.repairPercent.textContent =
            "0%";

        updateRepairEndGauge();

        dom.game.classList.remove(
            "repair-end-active"
        );

        if (dom.repairEndEffect) {

            dom.repairEndEffect.classList.remove(
                "show"
            );

        }

        dom.timer.textContent =
            String(
                GAME_CONFIG.quizTimeLimit
            );

        dom.timer.classList.remove(
            "warning"
        );

    }


    function resetCharacterClasses() {

        dom.customer.className =
            "customer-large";

        dom.feni.classList.remove(
            "repairing",
            "celebrating",
            "damage",
            "repair-end"
        );

    }


    /* =====================================================
       PAGE EVENTS
       ===================================================== */

    function handlePageHide() {

        stopQuizTimer();

        if (
            window.RepairLegendSound
        ) {

            RepairLegendSound.pauseBgm(
                false
            );

        }

    }


    function handleVisibilityChange() {

        if (document.hidden) {

            if (
                gameState.phase ===
                GAME_PHASE.QUIZ
            ) {

                stopQuizTimer();

            }

            return;

        }

        if (
            gameState.phase ===
                GAME_PHASE.QUIZ &&
            !gameState.answerLocked
        ) {

            startQuizTimer();

        }

    }


    /* =====================================================
       STATE
       ===================================================== */

    function setPhase(phase) {

        gameState.phase = phase;

        document.body.dataset.gamePhase =
            phase;

        updateRepairEndGauge();

    }


    function isCurrentSequence(
        sequenceId
    ) {

        return (
            gameState.sequenceId ===
            sequenceId
        );

    }


    /* =====================================================
       UTILITY
       ===================================================== */

    function wait(milliseconds) {

        const safeMilliseconds =
            Math.max(
                0,
                Number(milliseconds) || 0
            );

        return new Promise(
            function (resolve) {

                window.setTimeout(
                    resolve,
                    safeMilliseconds
                );

            }
        );

    }


    /* =====================================================
       DEBUG API
       ===================================================== */

    function getGameStatus() {

        return {

            phase:
                gameState.phase,

            level:
                gameState.level,

            experience:
                gameState.experience,

            requiredExperience:
                getRequiredExperience(
                    gameState.level
                ),

            rank:
                gameState.rank,

            combo:
                gameState.combo,

            highestCombo:
                gameState.highestCombo,

            money:
                gameState.money,

            totalCorrect:
                gameState.totalCorrect,

            totalWrong:
                gameState.totalWrong,

            totalAnswered:
                gameState.totalAnswered,

            customersCompleted:
                gameState.customersCompleted,

            repairGauge:
                gameState.repairGauge,

            repairEndGauge:
                gameState.repairEndGauge,

            repairEndReady:
                gameState.repairEndGauge >=
                GAME_CONFIG.repairEndGaugeMax,

            repairEndUses:
                gameState.repairEndUses,

            currentCustomer:
                gameState.currentCustomer
                    ? {
                        ...gameState.currentCustomer
                    }
                    : null,

            currentQuestion:
                gameState.currentQuestion
                    ? {
                        ...gameState.currentQuestion,
                        choices: [
                            ...gameState.currentQuestion
                                .choices
                        ]
                    }
                    : null

        };

    }


    function forceCorrectAnswer() {

        if (
            gameState.phase !==
                GAME_PHASE.QUIZ ||
            !gameState.currentQuestion
        ) {

            return false;

        }

        processAnswer(
            gameState.currentQuestion
                .correctIndex,
            false
        );

        return true;

    }


    function forceRepairComplete() {

        if (!gameState.started) {

            return false;

        }

        gameState.repairGauge =
            GAME_CONFIG.repairGaugeMax;

        updateRepairGauge();

        completeRepair();

        return true;

    }


    function fillRepairEndGauge() {

        if (!gameState.started) {

            return false;

        }

        gameState.repairEndGauge =
            GAME_CONFIG.repairEndGaugeMax;

        updateRepairEndGauge();

        return true;

    }


    function activateRepairEnd() {

        if (!canUseRepairEnd()) {

            return false;

        }

        handleRepairEndButton();

        return true;

    }


    const RepairLegendGame =
        Object.freeze({

            getStatus:
                getGameStatus,

            forceCorrectAnswer:
                forceCorrectAnswer,

            forceRepairComplete:
                forceRepairComplete,

            fillRepairEndGauge:
                fillRepairEndGauge,

            activateRepairEnd:
                activateRepairEnd,

            startNextCustomer:
                startNextCustomer

        });


    window.RepairLegendGame =
        RepairLegendGame;


    /* =====================================================
       AUTO START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeGame,
            {
                once: true
            }
        );

    } else {

        initializeGame();

    }

})();