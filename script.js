/**
 * @copyright 2026 S.E.N.O. All rights Reserved.
 * @file MusicSync Web Application
 * @description Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */
const masterVideo = { id: 'uU0Tj9L-DrQ', name: '원음' };
const followVideos = [
    { id: 'empty', name: 'empty' },
    { id: '-J0I4fK0HaI', name: 'Bass' },
    { id: 'empty', name: 'empty' },
    { id: 'empty', name: 'empty' },
    { id: 'empty', name: 'empty' },
    { id: 'empty', name: 'empty' },
    { id: 'empty', name: 'empty' },
    { id: 'empty', name: 'empty' },
    { id: 'empty', name: 'empty' }
];

let players = [];
let isSyncing = false;
let currentLang = 'en';
let isManualToggle = false;
let isDragging = false;
let isInitialized = false;
let isSyncFinished = false;
let isInAdSession = false;
let savedScrollY = 0;

const container = document.getElementById('follower-container');

const originalTexts = {
    guideTitle: document.getElementById('lang-guide-title').innerText,
    guide0: document.getElementById('lang-guide-0').innerText,
    guide1: document.getElementById('lang-guide-1').innerText,
    guide2: document.getElementById('lang-guide-2').innerText,
    guide3: document.getElementById('lang-guide-3').innerText,
    guide4: document.getElementById('lang-guide-4').innerText,
    guide5: document.getElementById('lang-guide-5').innerText,
    viewAll: document.getElementById('lang-view-all').innerText,
    singleSelect: document.getElementById('lang-single-select').innerText,
    btnInit: document.getElementById('lang-btn-init').innerHTML,
    btnToggle: document.getElementById('lang-btn-toggle').innerHTML,
    btnAdd: document.getElementById('lang-btn-add').innerHTML
};

const languages = {
    ko: {
        guideTitle: "사용 방법",
        guide0: "※ 유튜브영상 내부의 재생바나 재생버튼을 직접 누르면 싱크 동기화로 화면이 멈추게되니, 페이지 하단에 있는 컨트롤러의 재생바와 [▶ 동시 재생] 버튼을 이용해주세요.",
        guide1: "1. [🔄 초기 싱크정렬]이 완료되면 다른 버튼들이 활성화됩니다.",
        guide2: "2. [▶ 동시 재생]이 진행되면 싱크를 자동으로 보정합니다.",
        guide3: "3. 미세한 싱크오차가 자주 발생할 경우는 [🔧 추가 싱크정렬]을 눌러주세요.",
        guide4: "4. 싱크보정 및 재생시간 변경 후에는 동기화를 위해 영상이 멈추게되니 다시 재생버튼을 눌러주세요.",
        guide5: "5. [단독 연주 선택]에서 원하는 악기를 골라서 확대한 영상으로 감상할 수 있습니다.",
        statusAdOverlay: "유튜브 광고 중입니다. 모든 광고가 스킵되거나 종료되면 버튼이 활성화됩니다.",
        btnInit: "🔄 초기<span class='mobile-br'><br></span>싱크정렬",
        btnInitDone: "싱크정렬<span class='mobile-br'><br></span>완료",
        btnToggle: "[ ▶ ]<span class='mobile-br'><br></span>동시 재생",
        btnPause: "[ ❚❚ ]<span class='mobile-br'><br></span>일시 정지",
        btnAdd: "🔧 추가<span class='mobile-br'><br></span>싱크정렬",
        btnAddDone: "싱크정렬<span class='mobile-br'><br></span>완료",
        loading: "로딩중...",
        viewAll: "전체 합주 보기",
        singleSelect: "단독 연주 선택",
        syncFine: "싱크 정상",
        syncMinor: "미세 싱크오차발생",
        syncAuto: "자동보정 적용중",
        statusStopped: "정지 상태",
        statusEnded: "재생 종료",
        statusSyncing: "동기화 중...",
        statusMismatch: "상태 불일치 - 자동보정",
        btnFullscreen: "⛶ 화면전환",
        statusAdLoading: "광고 - 대기중...",
        landscapeSyncNotice: "추가적인 싱크 조정은 전체화면을 종료한 후 기본 화면의 싱크 버튼을 통해서 가능합니다."
    },
    en: {
        guideTitle: "Instructions",
        guide0: "※ If you click the playback bar or playback button inside the YouTube video, playback may pause for synchronization, so please use the controller's playback bar and [▶ Play Together] button at the bottom of the page.",
        guide1: "1. Other buttons will be enabled once [🔄 Initial Sync] is finished.",
        guide2: "2. Synchronization is automatically adjusted during [▶ Play Together]",
        guide3: "3. If minor sync errors occur, press [🔧 Additional Sync].",
        guide4: "4. After syncing or changing time, videos pause for calibration. Press play again.",
        guide5: "5. Select an instrument in [Select Performance] for a zoomed view.",
        statusAdOverlay: "YouTube advertisement is playing. All buttons will be enabled once all ads are skipped or finished.",
        btnInit: "🔄 Initial<span class='mobile-br'><br></span>Sync",
        btnInitDone: "Sync<span class='mobile-br'><br></span>Complete",
        btnToggle: "[ ▶ ]<span class='mobile-br'><br></span>Play Together",
        btnPause: "[ ❚❚ ]<span class='mobile-br'><br></span>Pause Together",
        btnAdd: "🔧 Additional<span class='mobile-br'><br></span>Sync",
        btnAddDone: "Sync<span class='mobile-br'><br></span>Complete",
        loading: "Loading...",
        viewAll: "View All Parts",
        singleSelect: "Select Performance",
        syncFine: "Sync Normal",
        syncMinor: "Minor Sync Error",
        syncAuto: "Auto-syncing",
        statusStopped: "Stopped",
        statusEnded: "Playback Ended",
        statusSyncing: "Syncing...",
        statusMismatch: "State Mismatch<span class='mobile-br'><br></span>Auto-syncing",
        btnFullscreen: "⛶ Switch View",
        statusAdLoading: "Ad - Waiting...",
        landscapeSyncNotice: "Additional sync adjustments can be made after exiting fullscreen using the default screen's sync button."
    },
    jp: {
        guideTitle: "利用方法",
        guide0: "※ YouTube動画内の再生バーや再生ボタンを直接クリックすると同期のために再生が一時停止することがありますので、ページ下部にあるコントローラーの再生バーと [▶ Play Together] ボタンをご利用ください。",
        guide1: "1. [🔄 初期同期調整]が完了すると、他のボタンが有効になります。",
        guide2: "2. [▶ 同時再生]中は自動的に同期補正が行われます。",
        guide3: "3. 微細なズレが頻繁に発生する場合は、[🔧 追加同期調整]を押してください。",
        guide4: "4. 同期補正や再生時間の変更後は、同期のために動画が一時停止します。再度再生ボタンを押してください。",
        guide5: "5. [単独演奏選択]から好きな楽器を選ぶと、その動画を拡大して視聴できます。",
        statusAdOverlay: "YouTube広告再生中です。すべての広告がスキップまたは終了すると、ボタンが有効になります。",
        btnInit: "🔄 初期<span class='mobile-br'><br></span>同期調整",
        btnInitDone: "同期調整<span class='mobile-br'><br></span>完了",
        btnToggle: "[ ▶ ]<span class='mobile-br'><br></span>同時再生",
        btnPause: "[ ❚❚ ]<span class='mobile-br'><br></span>一時停止",
        btnAdd: "🔧 追加<span class='mobile-br'><br></span>同期調整",
        btnAddDone: "同期調整<span class='mobile-br'><br></span>完了",
        loading: "読み込み中...",
        viewAll: "全体合奏を見る",
        singleSelect: "単独演奏選択",
        syncFine: "同期正常",
        syncMinor: "微細なズレ発生",
        syncAuto: "自動補正中",
        statusStopped: "停止中",
        statusEnded: "再生終了",
        statusSyncing: "同期中...",
        statusMismatch: "状態不一致 - 自動補正",
        btnFullscreen: "⛶ 画面切替",
        statusAdLoading: "広告 - 待機中...",
        landscapeSyncNotice: "追加の同期調整は、全画面を終了してデフォルト画面の同期ボタンから行ってください。"
    },
    ch: {
        guideTitle: "使用方法",
        guide0: "※ 如果在YouTube视频内部点击播放条或播放按钮，可能会因同步而暂停播放，请使用页面底部控制器上的播放条和 [▶ Play Together] 按钮。",
        guide1: "1. 完成 [🔄 初始化同步调整] 后，其他按钮将变为可用状态。",
        guide2: "2. 在 [▶ 同步播放] 过程中，系统会自动进行同步校正。",
        guide3: "3. 如果频繁出现微小的不同步，请点击 [🔧 追加同步调整]。",
        guide4: "4. 执行同步校正或更改播放时间后，视频将暂停以进行同步。请再次点击播放按钮。",
        guide5: "5. 通过 [选择单项演奏]，可以放大观看您喜欢的乐器视频。",
        statusAdOverlay: "YouTube正在播放广告。所有广告跳过或播放完毕后, 按钮将恢复可用。",
        btnInit: "🔄 初始化<span class='mobile-br'><br></span>同步调整",
        btnInitDone: "同步调整<span class='mobile-br'><br></span>完成",
        btnToggle: "[ ▶ ]<span class='mobile-br'><br></span>同步播放",
        btnPause: "[ ❚❚ ]<span class='mobile-br'><br></span>暂停",
        btnAdd: "🔧 追加<span class='mobile-br'><br></span>同步调整",
        btnAddDone: "同步调整<span class='mobile-br'><br></span>完成",
        loading: "加载中...",
        viewAll: "观看合奏全景",
        singleSelect: "选择单项演奏",
        syncFine: "同步正常",
        syncMinor: "出现微小偏差",
        syncAuto: "正在自动校正",
        statusStopped: "已停止",
        statusEnded: "播放结束",
        statusSyncing: "正在同步...",
        statusMismatch: "状态不匹配 - 自動校正中",
        btnFullscreen: "⛶ 画面切换",
        statusAdLoading: "广告 - 等待中...",
        landscapeSyncNotice: "如需进行额外的同步调整，请退出全屏后使用默认屏幕上的同步按钮。"
    }
}

function getStatusText(key) {
    const t = languages[currentLang];
    return t[key] || key;
}

function getButtonText(key) {
    const t = languages[currentLang];
    return t[key] || key;
}

function changeLanguage(lang) {
    currentLang = lang;

    document.getElementById('lang-guide-title').innerText = getStatusText('guideTitle');
    document.getElementById('lang-guide-0').innerText = getStatusText('guide0');
    document.getElementById('lang-guide-1').innerText = getStatusText('guide1');
    document.getElementById('lang-guide-2').innerText = getStatusText('guide2');
    document.getElementById('lang-guide-3').innerText = getStatusText('guide3');
    document.getElementById('lang-guide-4').innerText = getStatusText('guide4');
    document.getElementById('lang-guide-5').innerText = getStatusText('guide5');

    const btnInit = document.getElementById('lang-btn-init');
    const btnAdd = document.getElementById('lang-btn-add');
    const playBtn = document.getElementById('lang-btn-toggle');
    const btnFullscreen = document.getElementById('lang-btn-fullscreen');
    const landscapeNotice = document.getElementById('landscape-sync-notice');

    if (playBtn) {
        const masterState = players[0]?.getPlayerState ? players[0].getPlayerState() : null;
        const isPlaying = (masterState === YT.PlayerState.PLAYING);
        playBtn.innerHTML = isPlaying ? getStatusText('btnPause') : getStatusText('btnToggle');
    }

    if (btnInit.innerHTML !== getStatusText('loading')) {
        btnInit.innerHTML = isSyncFinished ? getStatusText('btnInitDone') : getStatusText('btnInit');
    }

    if (btnAdd.innerHTML !== getStatusText('loading')) {
        btnAdd.innerHTML = isSyncFinished ? getStatusText('btnAddDone') : getStatusText('btnAdd');
    }

    if (btnFullscreen) {
        btnFullscreen.innerText = getStatusText('btnFullscreen');
    }

    if (landscapeNotice) {
        landscapeNotice.innerText = getStatusText('landscapeSyncNotice');
    }

    document.getElementById('lang-view-all').innerText = getStatusText('viewAll');
    document.getElementById('lang-single-select').innerText = getStatusText('singleSelect');

    updatePlayButtonState();

    const statusBox = document.getElementById('sync-status');
    const masterState = (players[0] && typeof players[0].getPlayerState === 'function')
        ? players[0].getPlayerState()
        : null;

    if (isSyncing) {
        statusBox.innerText = getStatusText('statusSyncing');
    } else {
        if (masterState === YT.PlayerState.PLAYING) {
            statusBox.innerText = getStatusText('syncFine');
        } else {
            statusBox.innerText = (masterState === 0) ? getStatusText('statusEnded') : getStatusText('statusStopped');
        }
    }
}

function onYouTubeIframeAPIReady() {
    players.push(new YT.Player('player-0', {
        height: '270', width: '480', videoId: masterVideo.id,
        playerVars: { 'disablekb': 0, 'controls': 1, 'modestbranding': 1, 'rel': 0 },
        events: { 'onStateChange': onPlayerStateChange }
    }));
    const selector = document.getElementById('videoSelector');
    followVideos.forEach((v, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'player-wrapper';
        const div = document.createElement('div');
        div.id = 'player-' + (i + 1);
        wrapper.appendChild(div);

        const guard = document.createElement('div');
        guard.className = 'center-play-guard';
        wrapper.appendChild(guard);

        if (v.id === 'empty') {
            div.className = 'empty-placeholder';
            guard.style.display = 'none';
            players.push(null);
            container.appendChild(wrapper);
        } else {
            container.appendChild(wrapper);
            const opt = document.createElement('option');
            opt.value = i + 1; opt.innerHTML = v.name;
            selector.appendChild(opt);
            players.push(new YT.Player(div.id, { height: '270', width: '480', videoId: v.id, playerVars: { 'disablekb': 0, 'controls': 1, 'modestbranding': 1, 'rel': 0 } }));
        }
    });
    changeLanguage(currentLang);
    const toggleBtn = document.getElementById('lang-btn-toggle');
    const addSyncBtn = document.getElementById('lang-btn-add');
    const videoSelector = document.getElementById('videoSelector');

    if (typeof setButtonState === 'function') {
        if (toggleBtn) setButtonState(toggleBtn, true);
        if (addSyncBtn) setButtonState(addSyncBtn, true);
    }

    if (videoSelector) {
        videoSelector.disabled = true;
        videoSelector.style.opacity = '0.5';
    }

    console.log("API 로드 완료 및 버튼 비활성화 적용 완료");

    initProgressBar();

    console.log("[SCROLL TEST] 플레이어 생성 완료, 바닥으로 이동 시도. 전체 높이:", document.body.scrollHeight);

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'instant'
    });

    setTimeout(() => {
        console.log("[SCROLL TEST] 맨 위로 스크롤 업 실행");
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 100);
}

function initProgressBar() {
    const bar = document.getElementById('progress-bar-container');
    const tooltip = document.getElementById('time-tooltip');
    if (!bar || !tooltip) {
        console.warn("감시 대상(재생바)을 찾지 못했습니다. 잠시 후 재시도합니다.");
        setTimeout(initProgressBar, 500);
        return;
    }
    bar.style.pointerEvents = 'none';
    bar.style.opacity = '0.5';
    tooltip.style.display = 'none';

    const updateSeek = (e, shouldSync = false) => {
        if (!isInitialized || !players[0]) return;
        const rect = bar.getBoundingClientRect();
        let percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = (percent * 100) + '%';

        if (shouldSync) {
            const targetTime = players[0].getDuration() * percent;
            syncAllPlayers(targetTime);
        }
    };

    bar.addEventListener('mousedown', (e) => {
        if (!isInitialized) return;
        isDragging = true;
        document.querySelectorAll('iframe, video').forEach(el => {
            el.classList.add('is-dragging-global');
        });
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'pointer';
        e.preventDefault();
        updateSeek(e, false);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isInitialized) {
            tooltip.style.display = 'none';
            return;
        }
        if (isDragging) {
            updateSeek(e, false);
        }

        const rect = bar.getBoundingClientRect();
        const isInsideBar = e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom;

        if ((isInsideBar || isDragging) && players[0]) {
            const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));

            tooltip.style.left = mouseX + 'px';
            const percent = mouseX / rect.width;
            tooltip.innerText = formatTime(players[0].getDuration() * percent);
            tooltip.style.display = 'block';
        } else {
            tooltip.style.display = 'none';
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (isDragging) {
            isDragging = false;
            document.querySelectorAll('iframe, video').forEach(el => {
                el.classList.remove('is-dragging-global');
            });
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
            updateSeek(e, true);
        }
    });

    bar.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    bar.addEventListener('touchstart', (e) => {
        if (!isInitialized) return;
        isDragging = true;
        e.preventDefault();

        const rect = bar.getBoundingClientRect();
        const touchX = Math.max(0, Math.min(rect.width, e.touches[0].clientX - rect.left));
        tooltip.style.left = touchX + 'px';
        const percent = touchX / rect.width;
        tooltip.innerText = formatTime(players[0].getDuration() * percent);
        tooltip.style.display = 'block';

        updateSeek(e.touches[0], false);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (isDragging && players[0]) {
            updateSeek(e.touches[0], false);

            const rect = bar.getBoundingClientRect();
            const touchX = Math.max(0, Math.min(rect.width, e.touches[0].clientX - rect.left));
            tooltip.style.left = touchX + 'px';
            const percent = touchX / rect.width;
            tooltip.innerText = formatTime(players[0].getDuration() * percent);
        }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
        if (isDragging) {
            isDragging = false;
            tooltip.style.display = 'none';
            updateSeek(e.changedTouches[0], true);
        }
    }, { passive: false });
}

async function changeView(index) {
    await exitLandscapeMode();
    const masterTime = players[0].getCurrentTime();

    const container = document.getElementById('follower-container');
    const fullscreenWrapper = document.getElementById('fullscreen-sticky-wrapper');
    const allWrappers = container.querySelectorAll('.player-wrapper');

    if (index === "all") {
        container.style.display = "grid";
        container.className = "grid-view";
        fullscreenWrapper.style.display = "none";

        allWrappers.forEach((wrapper, i) => {
            wrapper.style.display = "";
            wrapper.style.gap = "";
        });
    } else {
        container.style.display = "flex";
        container.className = "single-view";
        fullscreenWrapper.style.display = "";

        allWrappers.forEach((wrapper, i) => {
            const playerIndex = i + 1;

            if (playerIndex == index && players[playerIndex]) {
                wrapper.classList.add('is-selected');
                wrapper.style.gap = "";
            } else {
                wrapper.classList.remove('is-selected');
                wrapper.style.gap = "0px";
            }
        });
    }

    await new Promise(resolve => setTimeout(resolve, 50));

    await syncAllPlayers(masterTime);

    setTimeout(() => {
        if (index === "all") {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            const selectedWrapper = container.querySelector('.player-wrapper.is-selected');
            if (selectedWrapper) {
                selectedWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, 120)
}

async function toggleLandscape() {
    savedScrollY = window.scrollY;
    const mainWrapper = document.getElementById('main-page-wrapper');
    const isLandscape = mainWrapper.classList.contains('landscape-mode');
    const topSection = document.getElementById('top-section');
    const controls = document.querySelector('.controls');
    const syncStatus = document.getElementById('sync-status');
    const masterWrapper = document.querySelector('.master-wrapper');
    const fullscreenWrapper = document.getElementById('fullscreen-sticky-wrapper');

    if (!isLandscape) {
        await document.documentElement.requestFullscreen();

        mainWrapper.classList.add('landscape-mode');
        topSection.classList.add('landscape-mode');

        masterWrapper.style.display = "none";

        controls.prepend(syncStatus);
        syncStatus.style.width = "100%";
        syncStatus.style.marginBottom = "10px";

        controls.appendChild(fullscreenWrapper);
        fullscreenWrapper.style.display = "flex";

        if (screen.orientation?.lock) screen.orientation.lock('landscape').catch(() => { });
    } else {
        await exitLandscapeMode();
    }
}

async function exitLandscapeMode() {
    if (document.fullscreenElement) {
        await document.exitFullscreen();
    }

    const mainWrapper = document.getElementById('main-page-wrapper');
    const topSection = document.getElementById('top-section');
    const masterWrapper = document.querySelector('.master-wrapper');
    const syncStatus = document.getElementById('sync-status');
    const followerContainer = document.getElementById('follower-container');
    const fullscreenWrapper = document.getElementById('fullscreen-sticky-wrapper');

    topSection.insertBefore(syncStatus, followerContainer);
    syncStatus.style.width = "";
    syncStatus.style.marginBottom = "";

    topSection.appendChild(fullscreenWrapper);
    fullscreenWrapper.style.display = "";

    mainWrapper.classList.remove('landscape-mode');
    topSection.classList.remove('landscape-mode');

    masterWrapper.style.display = "";

    if (screen.orientation?.unlock) screen.orientation.unlock();

    setTimeout(() => {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            const originalContent = metaViewport.getAttribute('content');

            metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');

            setTimeout(() => {
                metaViewport.setAttribute('content', originalContent);
            }, 50);
        }

        window.scrollTo(0, savedScrollY);
    }, 450);
}

document.addEventListener('fullscreenchange', () => {
    const mainWrapper = document.getElementById('main-page-wrapper');

    if (!document.fullscreenElement && mainWrapper.classList.contains('landscape-mode')) {
        exitLandscapeMode();
    }
});

async function initSyncAllPlayers(targetTime) {
    if (isSyncing) return;
    isSyncing = true;
    console.log(`[INIT SYNC START] 초기 싱크 시작, targetTime: ${targetTime}`);

    let normalPlayers = [];

    try {
        const originalTargetTime = targetTime;
        const activePlayers = players.filter(p => p !== null);

        if (activePlayers.length === 0) {
            console.log("[INIT SYNC] 활성화된 플레이어가 없어 종료합니다.");
            isSyncing = false;
            return;
        }

        console.log("[INIT SYNC - 1차] 예전 3회 반복 플레이 보정 시작");

        activePlayers.forEach(p => {
            if (!p) return;
            p.mute();
            p.seekTo(targetTime, true);
            p.playVideo();
        });

        await new Promise(resolve => setTimeout(resolve, 800));

        for (let idx = 0; idx < players.length; idx++) {
            let p = players[idx];
            if (!p) continue;

            let s = p.getPlayerState();

            if (s === -1) {
                await new Promise(resolve => setTimeout(resolve, 500));
                s = p.getPlayerState();
            }

            if (s === -1) {
                console.log(`[EXTERNAL ESCAPE] Player [${idx}] 최종 광고(-1) 감지, 외부 탈출 및 unMute`);
                p.unMute();
                continue;
            }

            normalPlayers.push({ player: p, index: idx });
        }

        for (let i = 0; i < 2; i++) {
            normalPlayers.forEach(({ player }) => {
                player.mute();
                player.seekTo(targetTime, true);
                player.playVideo();
            });

            await new Promise(resolve => setTimeout(resolve, 500));
        }



        console.log("[INIT SYNC - 2차] 최근 캐시 점프 및 버퍼링/광고 감지 로직 진입");

        normalPlayers = [];
        players.forEach((p, index) => {
            if (p !== null && typeof p.getDuration === 'function') {
                normalPlayers.push({ player: p, index: index });
            }
        });

        const adStateMap = new Map();

        normalPlayers.forEach(({ player: p, index }) => {
            if (!p || typeof p.getDuration !== 'function') return;

            p.mute();
            p.playVideo();

            const duration = p.getDuration();
            const endSeekTime = Math.max(0, duration - 0.1);
            p.seekTo(endSeekTime, true);

            adStateMap.set(p, false);
        });

        let isWaiting = true;
        let maxBufferWaitTime = 3000;
        let elapsedBufferTime = 0;
        let loopCount = 0;

        while (isWaiting) {
            loopCount++;
            await new Promise(resolve => setTimeout(resolve, 300));

            let hasAd = false;
            let hasBuffer = false;

            normalPlayers.forEach(({ player: p, index }) => {
                if (!p || typeof p.getPlayerState !== 'function') return;
                const state = p.getPlayerState();
                const wasInAd = adStateMap.get(p) || false;

                if (state === -1) {
                    hasAd = true;
                    adStateMap.set(p, true);
                    p.unMute();
                } else {
                    if (wasInAd) {
                        adStateMap.set(p, false);
                        const duration = p.getDuration();
                        if (duration > 0) {
                            p.playVideo();
                            p.seekTo(Math.max(0, duration - 0.1), true);
                        }
                    }

                    if (state === 3) {
                        hasBuffer = true;
                    }
                }
            });

            if (hasAd) continue;

            if (hasBuffer) {
                elapsedBufferTime += 300;
                console.log(`[SYNC LOOP #${loopCount}] 버퍼링 대기 중... 누적 시간: ${elapsedBufferTime}ms / 최대 ${maxBufferWaitTime}ms`);
                if (elapsedBufferTime >= maxBufferWaitTime) {
                    console.log(`[SYNC LOOP #${loopCount}] 최대 버퍼 대기 시간 초과로 대기를 강제 종료합니다.`);
                    // 🛠️ 누락되었던 타임아웃 탈출 시 끝부분 재점프 로직 복구
                    normalPlayers.forEach(({ player: p, index }) => {
                        if (!p || typeof p.getDuration !== 'function') return;
                        const duration = p.getDuration();
                        const endSeekTime = Math.max(0, duration - 0.1);
                        console.log(`[SYNC] 타임아웃 탈출 - 플레이어 [${index}] endSeekTime(${endSeekTime})으로 재점프`);
                        p.playVideo();
                        p.seekTo(endSeekTime, true);
                    });
                    isWaiting = false;
                }
            } else {
                console.log(`[SYNC LOOP #${loopCount}] 버퍼링 및 광고 요소가 없으므로 대기 루프를 정상 탈출합니다.`);
                // 🛠️ 누락되었던 정상 탈출 시 끝부분 재점프 로직 복구
                normalPlayers.forEach(({ player: p, index }) => {
                    if (!p || typeof p.getDuration !== 'function') return;
                    const duration = p.getDuration();
                    const endSeekTime = Math.max(0, duration - 0.1);
                    console.log(`[SYNC] 정상 탈출 - 플레이어 [${index}] endSeekTime(${endSeekTime})으로 재점프`);
                    p.playVideo();
                    p.seekTo(endSeekTime, true);
                });
                isWaiting = false;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // ==========================================
        // 최종 목적지로 복귀 및 언뮤트
        // ==========================================
        console.log(`[INIT SYNC] 최종 복귀 목표 지점(originalTargetTime): ${originalTargetTime}초로 시크 및 언뮤트 진행`);
        normalPlayers.forEach(({ player: p, index }) => {
            if (!p) return;
            p.seekTo(originalTargetTime, true);
            p.pauseVideo();
            p.unMute();
            console.log(`[INIT SYNC] 플레이어 [${index}] 최종 복귀 및 세팅 완료`);
        });

        await new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const pState = players[0] && typeof players[0].getPlayerState === 'function'
                    ? players[0].getPlayerState()
                    : null;

                // 확실하게 정지(2) 상태가 확인되면 대기를 끝내고 finally로 진행
                if (pState === YT.PlayerState.PAUSED) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50); // 0.05초 간격으로 체크
        });

    } catch (e) {
        console.error("[INIT SYNC ERROR] 초기 싱크 작업 중 오류 발생:", e);
    } finally {
        isSyncing = false;
        updatePlayButtonState();
        enablePlayButton();
        console.log("[INIT SYNC FINISH] isSyncing 해제 완료");
    }
}

async function syncAllPlayers(targetTime) {
    if (isSyncing) return;
    isSyncing = true;
    console.log(`[SYNC START] syncAllPlayers 시작, targetTime: ${targetTime}`);

    let normalPlayers = [];

    try {
        const originalTargetTime = targetTime;

        // 🛠️ [수정됨] 누락되었던 normalPlayers 구성 로직 추가
        players.forEach((p, index) => {
            if (p !== null && typeof p.getDuration === 'function') {
                normalPlayers.push({ player: p, index: index });
            }
        });

        if (normalPlayers.length === 0) {
            console.log("[SYNC] 활성화된 플레이어가 없어 종료합니다.");
            isSyncing = false;
            return;
        }

        const adStateMap = new Map();

        // 1단계: 초기화 및 끝부분 캐시 점프 세팅
        normalPlayers.forEach(({ player: p, index }) => {
            p.mute();
            p.playVideo();

            const duration = p.getDuration();
            const endSeekTime = Math.max(0, duration - 0.1);
            console.log(`[SYNC] 플레이어 [${index}] 전체 길이: ${duration}초 -> endSeekTime(${endSeekTime})으로 점프 시도`);
            p.seekTo(endSeekTime, true);

            adStateMap.set(p, false);
        });

        let isWaiting = true;
        let maxBufferWaitTime = 3000;
        let elapsedBufferTime = 0;
        let loopCount = 0;

        // 2단계: 대기 루프 시작
        while (isWaiting) {
            loopCount++;
            await new Promise(resolve => setTimeout(resolve, 300));

            let hasAd = false;
            let hasBuffer = false;

            normalPlayers.forEach(({ player: p, index }) => {
                if (!p || typeof p.getPlayerState !== 'function') return;
                const state = p.getPlayerState();
                const wasInAd = adStateMap.get(p) || false;

                console.log(`[SYNC LOOP #${loopCount}] 플레이어 [${index}] 현재 상태(state): ${state}`);

                if (state === -1) {
                    hasAd = true;
                    adStateMap.set(p, true);
                    console.log(`[SYNC LOOP #${loopCount}] 플레이어 [${index}] 광고(-1) 감지됨. 언뮤트 수행`);
                    p.unMute();
                } else {
                    if (wasInAd) {
                        adStateMap.set(p, false);
                        const duration = p.getDuration();
                        if (duration > 0) {
                            console.log(`[SYNC LOOP #${loopCount}] 플레이어 [${index}] 광고 종료 후 재점프 수행`);
                            p.playVideo();
                            p.seekTo(Math.max(0, duration - 0.1), true);
                        }
                    }

                    if (state === 3) {
                        hasBuffer = true;
                        console.log(`[SYNC LOOP #${loopCount}] 플레이어 [${index}] 버퍼링(3) 상태 감지됨`);
                    }
                }
            });

            if (hasAd) {
                console.log(`[SYNC LOOP #${loopCount}] 광고 대기 중이므로 루프를 지속합니다. (hasAd: true)`);
                continue;
            }

            if (hasBuffer) {
                elapsedBufferTime += 300;
                console.log(`[SYNC LOOP #${loopCount}] 버퍼링 대기 중... 누적 시간: ${elapsedBufferTime}ms / 최대 ${maxBufferWaitTime}ms`);
                if (elapsedBufferTime >= maxBufferWaitTime) {
                    console.log(`[SYNC LOOP #${loopCount}] 최대 버퍼 대기 시간 초과로 대기를 강제 종료합니다.`);
                    // 🛠️ 누락되었던 타임아웃 탈출 시 끝부분 재점프 로직 복구
                    normalPlayers.forEach(({ player: p, index }) => {
                        if (!p || typeof p.getDuration !== 'function') return;
                        const duration = p.getDuration();
                        const endSeekTime = Math.max(0, duration - 0.1);
                        console.log(`[SYNC] 타임아웃 탈출 - 플레이어 [${index}] endSeekTime(${endSeekTime})으로 재점프`);
                        p.playVideo();
                        p.seekTo(endSeekTime, true);
                    });
                    isWaiting = false;
                }
            } else {
                console.log(`[SYNC LOOP #${loopCount}] 버퍼링 및 광고 요소가 없으므로 대기 루프를 정상 탈출합니다.`);
                // 🛠️ 누락되었던 정상 탈출 시 끝부분 재점프 로직 복구
                normalPlayers.forEach(({ player: p, index }) => {
                    if (!p || typeof p.getDuration !== 'function') return;
                    const duration = p.getDuration();
                    const endSeekTime = Math.max(0, duration - 0.1);
                    console.log(`[SYNC] 정상 탈출 - 플레이어 [${index}] endSeekTime(${endSeekTime})으로 재점프`);
                    p.playVideo();
                    p.seekTo(endSeekTime, true);
                });
                isWaiting = false;
            }
        }

        console.log("[SYNC] 대기 루프 탈출 완료. 500ms 안정화 대기 시작...");
        await new Promise(resolve => setTimeout(resolve, 500));

        // 3단계: 최종 목적지로 복귀 및 언뮤트 (🛠️ 변수명 및 문법 정상화)
        console.log(`[SYNC] 최종 복귀 목표 지점(originalTargetTime): ${originalTargetTime}초로 시크 및 언뮤트 진행`);
        normalPlayers.forEach(({ player: p, index }) => {
            if (!p) return;
            p.seekTo(originalTargetTime, true);
            p.pauseVideo();
            p.unMute();
            console.log(`[SYNC] 플레이어 [${index}] 최종 복귀 및 세팅 완료`);
        });

        await new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const pState = players[0] && typeof players[0].getPlayerState === 'function'
                    ? players[0].getPlayerState()
                    : null;

                // 확실하게 정지(2) 상태가 확인되면 대기를 끝내고 finally로 진행
                if (pState === YT.PlayerState.PAUSED) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50); // 0.05초 간격으로 체크
        });

    } catch (e) {
        console.error("[SYNC ERROR] 보정 작업 중 오류 발생:", e);
    } finally {
        isSyncing = false;
        updatePlayButtonState();
        enablePlayButton();
        console.log("[SYNC FINISH] isSyncing 해제 완료 및 싱크 프로세스 종료");
    }
}

function setButtonState(btn, disabled) {
    if (!btn) return;
    if (disabled) {
        btn.classList.add('btn-disabled');
    } else {
        btn.classList.remove('btn-disabled');
    }
}

function setAllSyncButtons(disabled) {
    const syncBtn = document.getElementById('lang-btn-init');
    const addSyncBtn = document.getElementById('lang-btn-add');
    setButtonState(syncBtn, disabled);
    setButtonState(addSyncBtn, disabled);
}

async function initSync() {
    if (isSyncing || isSyncFinished) return;
    setAllSyncButtons(true);

    const playBtn = document.getElementById('lang-btn-toggle');
    if (playBtn) setButtonState(playBtn, true);
    const syncBtn = document.getElementById('lang-btn-init');
    if (!syncBtn) return;

    syncBtn.innerHTML = getStatusText('loading');

    try {
        await initSyncAllPlayers(0);

        isSyncFinished = true;
        isInitialized = true;
        syncBtn.innerHTML = getStatusText('btnInitDone');

        const videoSelector = document.getElementById('videoSelector');
        if (videoSelector) {
            videoSelector.disabled = false;
            videoSelector.style.opacity = '1';
        }

        const bar = document.getElementById('progress-bar-container');
        bar.style.pointerEvents = 'auto';
        bar.style.opacity = '1';

    } catch (e) {
        console.error("초기 싱크 중 오류:", e);
        syncBtn.innerHTML = getStatusText('btnInit');
        setAllSyncButtons(false);
        updatePlayButtonState();
    }
}

async function addSync() {
    if (!isInitialized || isSyncing || isSyncFinished) return;

    setAllSyncButtons(true);

    const playBtn = document.getElementById('lang-btn-toggle');
    if (playBtn) setButtonState(playBtn, true);
    const addSyncBtn = document.getElementById('lang-btn-add');
    if (!addSyncBtn) return;

    addSyncBtn.innerHTML = getStatusText('loading');

    try {
        const masterTime = players[0].getCurrentTime();
        await syncAllPlayers(masterTime);

        isSyncFinished = true;
        addSyncBtn.innerHTML = getStatusText('btnAddDone');

    } catch (e) {
        console.error("추가 싱크 중 오류:", e);
        addSyncBtn.innerHTML = getStatusText('btnAdd');
        setAllSyncButtons(false);
        updatePlayButtonState();
    }
}

function enablePlayButton() {
    const playBtn = document.getElementById('lang-btn-toggle');
    if (playBtn) {
        playBtn.classList.remove('btn-disabled');
        playBtn.innerHTML = getStatusText('btnToggle');
        playBtn.style.opacity = '1';
        playBtn.style.cursor = 'pointer';
    }
}

function togglePlayback() {
    if (!players[0]) return;
    const playBtn = document.getElementById('lang-btn-toggle');
    const isPlaying = players[0].getPlayerState() === YT.PlayerState.PLAYING;

    if (isPlaying) {
        players.forEach(p => { if (p) p.pauseVideo(); });
        playBtn.innerHTML = getStatusText('btnToggle');
    } else {
        resetSyncButtons();
        let masterTime = players[0].getCurrentTime();
        players.forEach((p, i) => {
            if (p) {
                const pState = p.getPlayerState();
                if (pState === -1 || pState === 3) return;

                let diff = Math.abs(p.getCurrentTime() - masterTime);

                if (i === 0 || diff < 0.5) {
                    p.playVideo();
                } else {
                    p.seekTo(masterTime, true);
                    p.playVideo();
                }
            }
        });
        playBtn.innerHTML = getStatusText('btnPause');
    }
}

function resetSyncButtons() {
    isSyncFinished = false;
    const syncBtn = document.getElementById('lang-btn-init');
    const addSyncBtn = document.getElementById('lang-btn-add');
    if (syncBtn) {
        syncBtn.innerHTML = getStatusText('btnInit');
        setButtonState(syncBtn, false);
    }
    if (addSyncBtn) {
        addSyncBtn.innerHTML = getStatusText('btnAdd');
        setButtonState(addSyncBtn, false);
    }
}

function updatePlayButtonState() {
    const playBtn = document.getElementById('lang-btn-toggle');
    if (!playBtn || !players[0] || typeof players[0].getPlayerState !== 'function') return;

    if (playBtn.classList.contains('btn-disabled')) return;

    const isPlaying = players[0] && players[0].getPlayerState() === YT.PlayerState.PLAYING;
    playBtn.innerHTML = isPlaying ? getStatusText('btnPause') : getStatusText('btnToggle');
}

function onPlayerStateChange(event) {
    if (isSyncing) return;
    if (event.target.getIframe().id === 'player-0') {
        updatePlayButtonState();
    }
}

const bar = document.getElementById('progress-bar-container');
const progress = document.getElementById('progress-bar');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

document.addEventListener('DOMContentLoaded', () => {
    changeLanguage('en');
    const toggleBtn = document.getElementById('lang-btn-toggle');
    const addSyncBtn = document.getElementById('lang-btn-add');
    const videoSelector = document.getElementById('videoSelector');

    if (toggleBtn) setButtonState(toggleBtn, true);
    if (addSyncBtn) setButtonState(addSyncBtn, true);
    if (videoSelector) {
        videoSelector.disabled = true;
        videoSelector.style.opacity = '0.5';
    }
});

setInterval(async () => {
    const activePlayers = players.filter(p => p !== null);
    if (activePlayers.length === 0) return;

    const master = players[0];
    const statusBox = document.getElementById('sync-status');
    const adMask = document.getElementById('ad-overlay-mask');

    const hasNormalPlaying = activePlayers.some(p => p.getPlayerState() === 1);
    if (hasNormalPlaying) {
        isInAdSession = false;
    }

    const hasAdStarted = activePlayers.some(p => p.getPlayerState() === -1) || (master && master.getPlayerState() === -1);
    if (hasAdStarted && !hasNormalPlaying) {
        if (!isInAdSession) console.log("[INTERVAL] 광고 세션 시작 (isInAdSession = true 감지됨)");
        isInAdSession = true;
    }

    const isAdLoading = activePlayers.some(p => {
        const s = p.getPlayerState();
        return (s === -1);
    });

    if (isAdLoading) {
        if (statusBox) {
            statusBox.innerText = getStatusText('statusAdLoading');
            statusBox.style.backgroundColor = "#9c27b0";
            statusBox.style.color = "white";
        }

        if (adMask) {
            adMask.innerText = getStatusText('statusAdOverlay');
            adMask.style.display = 'flex';
        }
        return;
    } else {
        if (adMask) adMask.style.display = 'none';
    }

    if (master && master.getPlayerState() === YT.PlayerState.PLAYING) {
        const percent = (master.getCurrentTime() / master.getDuration()) * 100;
        progress.style.width = percent + '%';
    }

    if (!master) return;

    const currentTime = master.getCurrentTime();
    const duration = master.getDuration();
    const timeDisplay = document.getElementById('time-display');
    const progressBar = document.getElementById('progress-bar');

    if (duration && progressBar && timeDisplay) {
        progressBar.style.width = ((currentTime / duration) * 100) + '%';
        timeDisplay.innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }

    if (isSyncing) {
        statusBox.innerText = getStatusText('statusSyncing');
        statusBox.style.backgroundColor = "#009688";
        statusBox.style.color = "white";
        return;
    }

    const masterState = master.getPlayerState();

    const isStateMismatched = activePlayers.some(p => {
        const pState = p.getPlayerState();
        if (pState === -1 || pState === 3 || masterState === -1 || masterState === 3) return false;
        return pState !== masterState;
    });

    if (isStateMismatched) {
        statusBox.innerHTML = getStatusText('statusMismatch');
        statusBox.style.backgroundColor = "#ff5722";
        statusBox.style.color = "white";
        await syncAllPlayers(master.getCurrentTime());
        return;
    }

    if (masterState === YT.PlayerState.PLAYING) {
        const masterTime = master.getCurrentTime();
        let maxDiff = 0;

        for (let i = 1; i < players.length; i++) {
            if (!players[i] || players[i].getPlayerState() !== YT.PlayerState.PLAYING) continue;

            let diff = masterTime - players[i].getCurrentTime();
            if (Math.abs(diff) > Math.abs(maxDiff)) maxDiff = diff;

            if (Math.abs(diff) > 0.5) {
                await syncAllPlayers(masterTime);
                return;
            }
            else if (Math.abs(diff) > 0.01) {
                players[i].setPlaybackRate(diff > 0 ? 1.05 : 0.95);
            }
            else {
                players[i].setPlaybackRate(1.0);
            }
        }

        const absMax = Math.abs(maxDiff);
        if (absMax >= 0.05 && absMax <= 0.1) {
            statusBox.innerText = getStatusText('syncMinor');
            statusBox.style.backgroundColor = "#ff9800";
            statusBox.style.color = "white";
        } else if (absMax < 0.05) {
            statusBox.innerText = getStatusText('syncFine');
            statusBox.style.backgroundColor = "#e0e0e0";
            statusBox.style.color = "#000000";
            statusBox.style.border = "1px solid #4fc3f7";
        } else {
            statusBox.innerText = getStatusText('syncAuto');
            statusBox.style.backgroundColor = "#2196f3";
            statusBox.style.color = "white";
        }
    } else {
        statusBox.innerText = (masterState === 0) ? getStatusText('statusEnded') : getStatusText('statusStopped');
        statusBox.style.backgroundColor = "#e0e0e0";
        statusBox.style.color = "#000000";
        statusBox.style.border = "1px solid #4fc3f7";
    }
}, 1000);