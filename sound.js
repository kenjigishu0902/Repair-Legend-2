/* =========================================================
   Repair Legend Ver2
   sound.js - iPhone / iPad Safari BGM修正版
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
            // 読み込み前はcurrentTimeを変更できない場合があります。
        }
    }

    function loadSettings() {
        try {
            const storedMuted = localStorage.getItem(STORAGE_KEYS.MUTED);
            const storedBgmVolume = localStorage.getItem(STORAGE_KEYS.BGM_VOLUME);
            const storedSeVolume = localStorage.getItem(STORAGE_KEYS.SE_VOLUME);

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
                .then(() => context.state === "running")
                .catch(() => false);
        }

        return Promise.resolve(context.state === "running");
    }

    function initialize() {
        if (initialized) {
            return true;
        }

        loadSettings();
        muted = false;
        localStorage.removeItem("repairLegendMuted");
        localStorage.removeItem("repairLegendBgmVolume");
        bgmAudio = getAudioElement(SOUND_IDS.BGM);
        titleBgmAudio = getAudioElement(SOUND_IDS.TITLE_BGM, false);

        soundElements.tap = getAudioElement(SOUND_IDS.TAP);
        soundElements.bell = getAudioElement(SOUND_IDS.BELL);
        soundElements.correct = getAudioElement(SOUND_IDS.CORRECT);
        soundElements.wrong = getAudioElement(SOUND_IDS.WRONG);
        soundElements.repair = getAudioElement(SOUND_IDS.REPAIR);
        soundElements.coin = getAudioElement(SOUND_IDS.COIN);
        soundElements.gaugeFull = getAudioElement(SOUND_IDS.GAUGE_FULL, false);
        soundElements.repairEnd = getAudioElement(SOUND_IDS.REPAIR_END, false);

        [bgmAudio, titleBgmAudio].filter(Boolean).forEach(function (audio) {
            audio.loop = true;
            audio.preload = "auto";
            audio.muted = muted;
            audio.volume = muted ? 0 : bgmVolume;
            audio.setAttribute("playsinline", "");
            audio.setAttribute("webkit-playsinline", "");
            audio.load();
        });

        Object.values(soundElements).filter(Boolean).forEach(function (audio) {
            audio.preload = "auto";
            audio.muted = muted;
            audio.volume = muted ? 0 : seVolume;
            audio.setAttribute("playsinline", "");
            audio.setAttribute("webkit-playsinline", "");
            audio.load();
        });

        currentBgmAudio = bgmAudio;

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

        resumeWebAudioContext();
        audioUnlocked = true;

        return Promise.resolve(true);
    }

    function startAudioFromUserGesture() {
        if (!initialized) {
            initialize();
        }

        resumeWebAudioContext();
        audioUnlocked = true;

        const target = currentBgmAudio || titleBgmAudio || bgmAudio;

        if (!target || muted || !target.paused) {
            return;
        }

        target.muted = false;
        target.volume = bgmVolume;
        target.loop = true;

        const playPromise = target.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function (error) {
                console.warn("ユーザー操作時のBGM再生に失敗しました。", error);
            });
        }
    }

    function registerUnlockEvents() {
        const options = {
            once: true,
            passive: true
        };

        document.addEventListener("touchstart", startAudioFromUserGesture, options);
        document.addEventListener("pointerdown", startAudioFromUserGesture, options);
        document.addEventListener("keydown", startAudioFromUserGesture, { once: true });
    }

    async function playBgm(options = {}) {
        const {
            restart = false,
            fadeIn = false
        } = options;

        if (!initialized) {
            initialize();
        }

        if (!bgmAudio || muted) {
            return false;
        }

        if (titleBgmAudio && titleBgmAudio !== bgmAudio) {
            titleBgmAudio.pause();
        }

        currentBgmAudio = bgmAudio;
        bgmAudio.loop = true;
        bgmAudio.muted = false;

        if (restart) {
            resetAudioTime(bgmAudio);
        }

        bgmAudio.volume = fadeIn ? 0 : bgmVolume;

        try {
            await bgmAudio.play();

            if (fadeIn) {
                fadeAudioVolume(bgmAudio, bgmVolume, 500);
            }

            audioUnlocked = true;
            return true;
        } catch (error) {
            console.warn("BGM再生に失敗しました。", error);
            return false;
        }
    }

    async function playTitleBgm(options = {}) {
        if (!initialized) {
            initialize();
        }

        const target = titleBgmAudio || bgmAudio;

        if (!target || muted) {
            return false;
        }

        if (bgmAudio && target !== bgmAudio) {
            bgmAudio.pause();
        }

        currentBgmAudio = target;
        target.loop = true;
        target.muted = false;

        if (options.restart === true) {
            resetAudioTime(target);
        }

        const targetVolume = clampVolume(bgmVolume * 0.82);
        target.volume = options.fadeIn === true ? 0 : targetVolume;

        try {
            await target.play();

            if (options.fadeIn === true) {
                fadeAudioVolume(target, targetVolume, 500);
            }

            audioUnlocked = true;
            return true;
        } catch (error) {
            console.warn("タイトルBGMを再生できませんでした。", error);
            return false;
        }
    }

    function playGameBgm(options = {}) {
        return playBgm(options);
    }

    function pauseBgm(fadeOut = false) {
        const target = currentBgmAudio || bgmAudio;

        if (!target) {
            return;
        }

        if (!fadeOut) {
            target.pause();
            return;
        }

        fadeAudioVolume(target, 0, 300, function () {
            target.pause();
            target.volume = muted ? 0 : bgmVolume;
        });
    }

    function stopBgm() {
        [bgmAudio, titleBgmAudio].filter(Boolean).forEach(function (audio) {
            audio.pause();
            resetAudioTime(audio);
        });

        currentBgmAudio = null;
    }

    function isBgmPlaying() {
        const target = currentBgmAudio || bgmAudio;

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
                (now - startTime) / Math.max(1, duration)
            );

            audio.volume = clampVolume(
                startVolume +
                (safeTarget - startVolume) * progress
            );

            if (progress < 1) {
                requestAnimationFrame(update);
            } else if (typeof onComplete === "function") {
                onComplete();
            }
        }

        requestAnimationFrame(update);
    }

    function playSound(soundName, options = {}) {
        if (!initialized) {
            initialize();
        }

        if (muted) {
            return false;
        }

        const baseAudio = soundElements[soundName];

        if (!baseAudio) {
            return false;
        }

        const finalVolume = clampVolume(
            seVolume *
            (
                Number(options.volumeMultiplier) ||
                1
            )
        );

        const playbackRate = Math.max(
            0.5,
            Math.min(
                2,
                Number(options.playbackRate) ||
                1
            )
        );

        const clonedAudio = baseAudio.cloneNode(true);

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

        clonedAudio.addEventListener("ended", cleanup, { once: true });
        clonedAudio.addEventListener("error", cleanup, { once: true });

        const playPromise = clonedAudio.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function (error) {
                activeClones.delete(clonedAudio);
                console.warn(`効果音「${soundName}」を再生できませんでした。`, error);
            });
        }

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
        const safeCombo = Math.max(
            1,
            Number(combo) || 1
        );

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
        bgmVolume = clampVolume(Number(value));

        [bgmAudio, titleBgmAudio].filter(Boolean).forEach(function (audio) {
            audio.volume = muted ? 0 : bgmVolume;
        });

        saveSettings();

        return bgmVolume;
    }

    function setSeVolume(value) {
        seVolume = clampVolume(Number(value));
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

        [bgmAudio, titleBgmAudio].filter(Boolean).forEach(function (audio) {
            audio.muted = muted;
            audio.volume = muted ? 0 : bgmVolume;
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
        document.addEventListener("click", function (event) {
            const target = event.target;

            if (!(target instanceof Element)) {
                return;
            }

            const button = target.closest("button");

            if (
                !button ||
                button.disabled ||
                button.dataset.noTapSound === "true"
            ) {
                return;
            }

            playTap();
        });
    }

    function registerRepairEndGaugeObserver() {
        if (gaugeObserver) {
            return;
        }

        function checkGauge() {
            const panel = document.getElementById("repairEndPanel");

            if (!panel) {
                repairEndGaugeWasReady = false;
                return;
            }

            const ready = panel.classList.contains("ready");

            if (ready && !repairEndGaugeWasReady) {
                playGaugeFull();
            }

            repairEndGaugeWasReady = ready;
        }

        gaugeObserver = new MutationObserver(checkGauge);

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
        const target = currentBgmAudio || bgmAudio;

        if (!target) {
            return;
        }

        if (document.hidden) {
            if (!target.paused) {
                target.dataset.resumeAfterVisible = "true";
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
                target.play().catch(function () {});
            }
        }
    }

    function getStatus() {
        return {
            initialized,
            audioUnlocked,
            muted,
            bgmVolume,
            seVolume,
            bgmPlaying: isBgmPlaying(),
            bgmCurrentSrc:
                bgmAudio
                    ? bgmAudio.currentSrc
                    : "",
            bgmReadyState:
                bgmAudio
                    ? bgmAudio.readyState
                    : -1,
            bgmNetworkState:
                bgmAudio
                    ? bgmAudio.networkState
                    : -1
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

    const RepairLegendSound = Object.freeze({
        initialize,
        unlockAudio,
        startAudioFromUserGesture,
        playBgm,
        playTitleBgm,
        playGameBgm,
        pauseBgm,
        stopBgm,
        isBgmPlaying,
        playSound,
        playTap,
        playBell,
        playCorrect,
        playWrong,
        playRepairComplete,
        playGaugeFull,
        playRepairEnd,
        playCoin,
        playComboCoin,
        stopAllSoundEffects,
        setBgmVolume,
        setSeVolume,
        getBgmVolume,
        getSeVolume,
        setMuted,
        toggleMute,
        isMuted,
        getStatus
    });

    window.RepairLegendSound =
        RepairLegendSound;

})();