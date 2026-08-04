/* =========================================================
   Repair Legend Ver2
   sound.js
   タイトル画面BGM / ゲーム中BGM 分離版
   ========================================================= */

"use strict";

(function () {

    const STORAGE_KEYS = Object.freeze({
        MUTED: "repairLegendMuted",
        BGM_VOLUME: "repairLegendBgmVolume",
        SE_VOLUME: "repairLegendSeVolume"
    });

    const DEFAULT_VOLUMES = Object.freeze({
        BGM: 0.38,
        TITLE_RATIO: 0.82,
        SE: 0.78
    });

    const SOUND_IDS = Object.freeze({
        BGM: "bgm",
        TITLE_BGM: "titleBgm",
        TAP: "tapSound",
        BELL: "bellSound",
        CORRECT: "correctSound",
        WRONG: "wrongSound",
        REPAIR: "repairSound",
        COIN: "coinSound",
        GAUGE_FULL: "gaugeFullSound",
        REPAIR_END: "repairEndSound"
    });

    let initialized = false;
    let audioUnlocked = false;
    let muted = false;
    let bgmVolume = DEFAULT_VOLUMES.BGM;
    let seVolume = DEFAULT_VOLUMES.SE;

    let bgmAudio = null;
    let titleBgmAudio = null;
    let currentBgmAudio = null;
    let webAudioContext = null;
    let gaugeObserver = null;
    let repairEndGaugeWasReady = false;

    const soundElements = {
        tap: null,
        bell: null,
        correct: null,
        wrong: null,
        repair: null,
        coin: null,
        gaugeFull: null,
        repairEnd: null
    };

    const activeClones = new Set();

    function clampVolume(value) {
        if (!Number.isFinite(value)) {
            return 0;
        }
        return Math.min(1, Math.max(0, value));
    }

    function getTitleVolume() {
        return clampVolume(
            bgmVolume * DEFAULT_VOLUMES.TITLE_RATIO
        );
    }

    function getAudioElement(id, required = true) {
        const element = document.getElementById(id);

        if (!(element instanceof HTMLAudioElement)) {
            if (required) {
                console.warn(`audio要素 #${id} が見つかりません。`);
            }
            return null;
        }

        return element;
    }

    function resetAudioTime(audio) {
        if (!audio) {
            return;
        }

        try {
            audio.currentTime = 0;
        } catch (error) {
            // 読み込み前は変更できない場合があります。
        }
    }

    function safePlay(audio, label) {
        if (!audio) {
            return Promise.resolve(false);
        }

        try {
            const result = audio.play();

            if (result && typeof result.then === "function") {
                return result
                    .then(function () {
                        return true;
                    })
                    .catch(function (error) {
                        if (
                            error &&
                            error.name !== "AbortError" &&
                            error.name !== "NotAllowedError"
                        ) {
                            console.warn(`${label}を再生できませんでした。`, error);
                        }
                        return false;
                    });
            }

            return Promise.resolve(true);

        } catch (error) {
            console.warn(`${label}を再生できませんでした。`, error);
            return Promise.resolve(false);
        }
    }

    function loadSettings() {
        try {
            const storedMuted =
                localStorage.getItem(STORAGE_KEYS.MUTED);
            const storedBgmVolume =
                localStorage.getItem(STORAGE_KEYS.BGM_VOLUME);
            const storedSeVolume =
                localStorage.getItem(STORAGE_KEYS.SE_VOLUME);

            if (storedMuted !== null) {
                muted = storedMuted === "true";
            }

            if (storedBgmVolume !== null) {
                bgmVolume = clampVolume(Number(storedBgmVolume));
            }

            if (storedSeVolume !== null) {
                seVolume = clampVolume(Number(storedSeVolume));
            }

        } catch (error) {
            console.warn("サウンド設定を読み込めませんでした。", error);
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEYS.MUTED, String(muted));
            localStorage.setItem(STORAGE_KEYS.BGM_VOLUME, String(bgmVolume));
            localStorage.setItem(STORAGE_KEYS.SE_VOLUME, String(seVolume));
        } catch (error) {
            console.warn("サウンド設定を保存できませんでした。", error);
        }
    }

    function getWebAudioContext() {
        if (webAudioContext) {
            return webAudioContext;
        }

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        try {
            webAudioContext = new AudioContextClass();
            return webAudioContext;
        } catch (error) {
            console.warn("Web Audioを初期化できませんでした。", error);
            return null;
        }
    }

    function resumeWebAudioContext() {
        const context = getWebAudioContext();

        if (!context) {
            return Promise.resolve(false);
        }

        if (context.state === "suspended") {
            return context.resume()
                .then(function () {
                    return context.state === "running";
                })
                .catch(function () {
                    return false;
                });
        }

        return Promise.resolve(context.state === "running");
    }

    function configureBgm(audio, volume) {
        if (!audio) {
            return;
        }

        audio.loop = true;
        audio.preload = "auto";
        audio.muted = muted;
        audio.volume = muted ? 0 : volume;
        audio.setAttribute("playsinline", "");
        audio.setAttribute("webkit-playsinline", "");
        audio.load();
    }

    function configureEffect(audio) {
        if (!audio) {
            return;
        }

        audio.preload = "auto";
        audio.muted = muted;
        audio.volume = muted ? 0 : seVolume;
        audio.setAttribute("playsinline", "");
        audio.setAttribute("webkit-playsinline", "");
        audio.load();
    }

    function initialize() {
        if (initialized) {
            return true;
        }

        loadSettings();

        bgmAudio = getAudioElement(SOUND_IDS.BGM);
        titleBgmAudio = getAudioElement(SOUND_IDS.TITLE_BGM, false);

        soundElements.tap = getAudioElement(SOUND_IDS.TAP);
        soundElements.bell = getAudioElement(SOUND_IDS.BELL);
        soundElements.correct = getAudioElement(SOUND_IDS.CORRECT);
        soundElements.wrong = getAudioElement(SOUND_IDS.WRONG);
        soundElements.repair = getAudioElement(SOUND_IDS.REPAIR);
        soundElements.coin = getAudioElement(SOUND_IDS.COIN);
        soundElements.gaugeFull =
            getAudioElement(SOUND_IDS.GAUGE_FULL, false);
        soundElements.repairEnd =
            getAudioElement(SOUND_IDS.REPAIR_END, false);

        configureBgm(bgmAudio, bgmVolume);
        configureBgm(titleBgmAudio, getTitleVolume());

        Object.values(soundElements)
            .filter(Boolean)
            .forEach(configureEffect);

        currentBgmAudio = titleBgmAudio || bgmAudio;

        registerUnlockEvents();
        registerGlobalButtonSounds();
        registerRepairEndGaugeObserver();

        initialized = true;

        console.log("Repair Legend Sound: 初期化完了");
        return true;
    }

    function unlockAudio() {
        if (!initialized) {
            initialize();
        }

        audioUnlocked = true;

        return resumeWebAudioContext()
            .then(function () {
                return true;
            });
    }

    function startAudioFromUserGesture(mode = "title") {
        if (!initialized) {
            initialize();
        }

        resumeWebAudioContext();
        audioUnlocked = true;

        const target =
            mode === "game"
                ? bgmAudio
                : titleBgmAudio || bgmAudio;

        if (!target || muted) {
            return false;
        }

        if (
            target === bgmAudio &&
            titleBgmAudio &&
            titleBgmAudio !== target
        ) {
            titleBgmAudio.pause();
        }

        if (
            target === titleBgmAudio &&
            bgmAudio &&
            bgmAudio !== target
        ) {
            bgmAudio.pause();
        }

        currentBgmAudio = target;
        target.loop = true;
        target.muted = false;
        target.volume =
            target === titleBgmAudio
                ? getTitleVolume()
                : bgmVolume;

        safePlay(
            target,
            mode === "game"
                ? "ゲームBGM"
                : "タイトルBGM"
        );

        return true;
    }

    function registerUnlockEvents() {
        const options = {
            once: true,
            passive: true
        };

        document.addEventListener(
            "touchstart",
            function () {
                startAudioFromUserGesture("title");
            },
            options
        );

        document.addEventListener(
            "pointerdown",
            function () {
                startAudioFromUserGesture("title");
            },
            options
        );

        document.addEventListener(
            "keydown",
            function () {
                startAudioFromUserGesture("title");
            },
            { once: true }
        );
    }

    async function playTitleBgm(options = {}) {
        const {
            restart = false,
            fadeIn = false,
            fadeDuration = 500
        } = options;

        if (!initialized) {
            initialize();
        }

        const target = titleBgmAudio || bgmAudio;

        if (!target || muted) {
            return false;
        }

        if (bgmAudio && target !== bgmAudio) {
            bgmAudio.pause();
            resetAudioTime(bgmAudio);
        }

        currentBgmAudio = target;
        target.loop = true;
        target.muted = false;

        if (restart) {
            resetAudioTime(target);
        }

        const targetVolume =
            target === titleBgmAudio
                ? getTitleVolume()
                : bgmVolume;

        target.volume = fadeIn ? 0 : targetVolume;

        const played = await safePlay(target, "タイトルBGM");

        if (played && fadeIn) {
            fadeAudioVolume(
                target,
                targetVolume,
                fadeDuration
            );
        }

        if (played) {
            audioUnlocked = true;
        }

        return played;
    }

    async function playGameBgm(options = {}) {
        const {
            restart = true,
            fadeIn = false,
            fadeDuration = 500
        } = options;

        if (!initialized) {
            initialize();
        }

        if (!bgmAudio || muted) {
            return false;
        }

        if (
            titleBgmAudio &&
            titleBgmAudio !== bgmAudio
        ) {
            titleBgmAudio.pause();
            resetAudioTime(titleBgmAudio);
        }

        currentBgmAudio = bgmAudio;
        bgmAudio.loop = true;
        bgmAudio.muted = false;

        if (restart) {
            resetAudioTime(bgmAudio);
        }

        bgmAudio.volume = fadeIn ? 0 : bgmVolume;

        const played = await safePlay(bgmAudio, "ゲームBGM");

        if (played && fadeIn) {
            fadeAudioVolume(
                bgmAudio,
                bgmVolume,
                fadeDuration
            );
        }

        if (played) {
            audioUnlocked = true;
        }

        return played;
    }

    function playBgm(options = {}) {
        return playGameBgm(options);
    }

    function pauseBgm(
        fadeOut = false,
        fadeDuration = 300
    ) {
        const target =
            currentBgmAudio || bgmAudio;

        if (!target) {
            return;
        }

        if (!fadeOut) {
            target.pause();
            return;
        }

        fadeAudioVolume(
            target,
            0,
            fadeDuration,
            function () {
                target.pause();
                target.volume =
                    target === titleBgmAudio
                        ? getTitleVolume()
                        : bgmVolume;
            }
        );
    }

    function stopBgm() {
        [bgmAudio, titleBgmAudio]
            .filter(Boolean)
            .forEach(function (audio) {
                audio.pause();
                resetAudioTime(audio);
            });

        currentBgmAudio = null;
    }

    function isBgmPlaying() {
        const target =
            currentBgmAudio || bgmAudio;

        return Boolean(
            target &&
            !target.paused &&
            !target.ended
        );
    }

    function fadeAudioVolume(
        audio,
        targetVolume,
        duration = 500,
        onComplete = null
    ) {
        if (!audio) {
            return;
        }

        const safeTarget = clampVolume(targetVolume);
        const startVolume = audio.volume;
        const startTime = performance.now();

        function update(now) {
            const progress = Math.min(
                1,
                (now - startTime) /
                Math.max(1, duration)
            );

            audio.volume = clampVolume(
                startVolume +
                (safeTarget - startVolume) *
                progress
            );

            if (progress < 1) {
                requestAnimationFrame(update);
            } else if (
                typeof onComplete === "function"
            ) {
                onComplete();
            }
        }

        requestAnimationFrame(update);
    }

    function playSound(
        soundName,
        options = {}
    ) {
        if (!initialized) {
            initialize();
        }

        if (muted) {
            return false;
        }

        const baseAudio =
            soundElements[soundName];

        if (!baseAudio) {
            return false;
        }

        const multiplier =
            Number.isFinite(
                Number(options.volumeMultiplier)
            )
                ? Number(options.volumeMultiplier)
                : 1;

        const finalVolume =
            clampVolume(seVolume * multiplier);

        const playbackRate =
            Math.max(
                0.5,
                Math.min(
                    2,
                    Number(options.playbackRate) || 1
                )
            );

        const clonedAudio =
            baseAudio.cloneNode(true);

        clonedAudio.muted = false;
        clonedAudio.volume = finalVolume;
        clonedAudio.playbackRate = playbackRate;
        clonedAudio.setAttribute("playsinline", "");
        clonedAudio.setAttribute("webkit-playsinline", "");

        activeClones.add(clonedAudio);

        const cleanup = function () {
            clonedAudio.pause();
            activeClones.delete(clonedAudio);
        };

        clonedAudio.addEventListener(
            "ended",
            cleanup,
            { once: true }
        );

        clonedAudio.addEventListener(
            "error",
            cleanup,
            { once: true }
        );

        safePlay(
            clonedAudio,
            `効果音「${soundName}」`
        ).then(function (played) {
            if (!played) {
                activeClones.delete(clonedAudio);
            }
        });

        return true;
    }

    function playTap() {
        return playSound("tap", {
            volumeMultiplier: 0.68
        });
    }

    function playBell() {
        return playSound("bell", {
            volumeMultiplier: 0.92
        });
    }

    function playCorrect() {
        return playSound("correct");
    }

    function playWrong() {
        return playSound("wrong", {
            volumeMultiplier: 0.95
        });
    }

    function playRepairComplete() {
        return playSound("repair");
    }

    function playGaugeFull() {
        return playSound("gaugeFull");
    }

    function playRepairEnd() {
        return playSound("repairEnd");
    }

    function playCoin() {
        return playSound("coin", {
            volumeMultiplier: 0.88
        });
    }

    function playComboCoin(combo = 1) {
        const safeCombo =
            Math.max(1, Number(combo) || 1);

        return playSound("coin", {
            volumeMultiplier: 0.9,
            playbackRate:
                1 +
                Math.min(
                    0.5,
                    (safeCombo - 1) * 0.045
                )
        });
    }

    function stopAllSoundEffects() {
        activeClones.forEach(function (audio) {
            audio.pause();
        });

        activeClones.clear();
    }

    function setBgmVolume(value) {
        bgmVolume =
            clampVolume(Number(value));

        if (bgmAudio) {
            bgmAudio.volume =
                muted ? 0 : bgmVolume;
        }

        if (titleBgmAudio) {
            titleBgmAudio.volume =
                muted ? 0 : getTitleVolume();
        }

        saveSettings();
        return bgmVolume;
    }

    function setSeVolume(value) {
        seVolume =
            clampVolume(Number(value));

        saveSettings();
        return seVolume;
    }

    function getBgmVolume() {
        return bgmVolume;
    }

    function getSeVolume() {
        return seVolume;
    }

    function setMuted(value) {
        muted = Boolean(value);

        if (bgmAudio) {
            bgmAudio.muted = muted;
            bgmAudio.volume =
                muted ? 0 : bgmVolume;
        }

        if (titleBgmAudio) {
            titleBgmAudio.muted = muted;
            titleBgmAudio.volume =
                muted ? 0 : getTitleVolume();
        }

        activeClones.forEach(function (audio) {
            audio.muted = muted;
        });

        saveSettings();
        return muted;
    }

    function toggleMute() {
        return setMuted(!muted);
    }

    function isMuted() {
        return muted;
    }

    function registerGlobalButtonSounds() {
        document.addEventListener(
            "click",
            function (event) {
                const target = event.target;

                if (!(target instanceof Element)) {
                    return;
                }

                const button =
                    target.closest("button");

                if (
                    !button ||
                    button.disabled ||
                    button.dataset.noTapSound === "true"
                ) {
                    return;
                }

                playTap();
            }
        );
    }

    function registerRepairEndGaugeObserver() {
        if (gaugeObserver) {
            return;
        }

        function checkGauge() {
            const panel =
                document.getElementById(
                    "repairEndPanel"
                );

            if (!panel) {
                repairEndGaugeWasReady = false;
                return;
            }

            const ready =
                panel.classList.contains("ready");

            if (
                ready &&
                !repairEndGaugeWasReady
            ) {
                playGaugeFull();
            }

            repairEndGaugeWasReady = ready;
        }

        gaugeObserver =
            new MutationObserver(checkGauge);

        gaugeObserver.observe(
            document.documentElement,
            {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ["class"]
            }
        );

        checkGauge();
    }

    function handleVisibilityChange() {
        const target =
            currentBgmAudio || bgmAudio;

        if (!target) {
            return;
        }

        if (document.hidden) {
            if (!target.paused) {
                target.dataset.resumeAfterVisible =
                    "true";
                target.pause();
            }
            return;
        }

        if (
            target.dataset.resumeAfterVisible ===
            "true"
        ) {
            delete target.dataset.resumeAfterVisible;

            if (!muted) {
                safePlay(target, "BGM");
            }
        }
    }

    function getStatus() {
        return {
            initialized: initialized,
            audioUnlocked: audioUnlocked,
            muted: muted,
            bgmVolume: bgmVolume,
            seVolume: seVolume,
            bgmPlaying: isBgmPlaying(),
            currentBgm:
                currentBgmAudio === titleBgmAudio
                    ? "title"
                    : currentBgmAudio === bgmAudio
                        ? "game"
                        : "none",
            titleBgmCurrentSrc:
                titleBgmAudio
                    ? titleBgmAudio.currentSrc
                    : "",
            gameBgmCurrentSrc:
                bgmAudio
                    ? bgmAudio.currentSrc
                    : ""
        };
    }

    function handleDomReady() {
        initialize();
    }

    document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
    );

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            handleDomReady,
            { once: true }
        );
    } else {
        handleDomReady();
    }

    const RepairLegendSound =
        Object.freeze({
            initialize: initialize,
            unlockAudio: unlockAudio,
            startAudioFromUserGesture:
                startAudioFromUserGesture,
            playBgm: playBgm,
            playTitleBgm: playTitleBgm,
            playGameBgm: playGameBgm,
            pauseBgm: pauseBgm,
            stopBgm: stopBgm,
            isBgmPlaying: isBgmPlaying,
            playSound: playSound,
            playTap: playTap,
            playBell: playBell,
            playCorrect: playCorrect,
            playWrong: playWrong,
            playRepairComplete:
                playRepairComplete,
            playGaugeFull: playGaugeFull,
            playRepairEnd: playRepairEnd,
            playCoin: playCoin,
            playComboCoin: playComboCoin,
            stopAllSoundEffects:
                stopAllSoundEffects,
            setBgmVolume: setBgmVolume,
            setSeVolume: setSeVolume,
            getBgmVolume: getBgmVolume,
            getSeVolume: getSeVolume,
            setMuted: setMuted,
            toggleMute: toggleMute,
            isMuted: isMuted,
            getStatus: getStatus
        });

    window.RepairLegendSound =
        RepairLegendSound;

})();