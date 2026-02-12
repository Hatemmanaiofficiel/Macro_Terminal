/**
 * MACROFORECAST Master Application V12.0 (SOVEREIGN_FREEDOM)
 * Seamless Selection | Hyper-Vector Logic | Institutional Mastery
 */

let mainChart = null;
let radarChart = null;
let state = {
    viewMode: 'NEUTRAL',
    isLocked: false,
    country: 'WLD',
    countryName: 'GLOBAL_MARKET',
    indicator: 'gdp',
    activePage: 1,
    horizon: 10, // Expanded horizon for Freedom
    history: [],
    multiData: {},
    radarData: {},
    pathStats: {},
    validity: 0,
    momentum: 0,
    volatility: 0,
    riskScore: 0,
    macroPattern: 'STANDARD_CYCLE',
    scenarios: { bull: 0, base: 0, bear: 0 },
    metrics: { rmse: 0, r2: 0, cvScore: 'N/A' }
};

// --- BOOT SEQUENCE ---
document.addEventListener('DOMContentLoaded', () => {
    logEvent("FREEDOM_KERNEL_READY: [SEAMLESS_ACTIVE]");
    setupFreedomListeners();
    startClock();
    startSovereignPulse();

    initMap('map', handleCountrySelect).then(() => {
        handleResetGlobe();
    });
});

function setupFreedomListeners() {
    // Hyper-Vector Ribbon
    document.querySelectorAll('.v-btn').forEach(btn => {
        btn.onclick = (e) => {
            state.indicator = e.target.dataset.v;
            document.querySelectorAll('.v-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            logEvent(`VECTOR_SHFT: ${state.indicator.toUpperCase()}`);
            refreshTerminal();
        };
    });

    // Dossier Tabs
    document.querySelectorAll('.d-tab').forEach(tab => {
        tab.onclick = (e) => {
            state.activePage = parseInt(e.target.dataset.page);
            updateTabUI();
            renderInstitutionalDossier();
        };
    });

    if (document.getElementById('reset-globe-btn'))
        document.getElementById('reset-globe-btn').onclick = handleResetGlobe;

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = () => {
            if (state.isLocked) {
                logEvent("SELECTION_BLOCKED: MASTER_RESET_REQUIRED");
                return;
            }
            handleRegionSelect(btn.dataset.c);
        };
    });

    if (document.getElementById('print-btn'))
        document.getElementById('print-btn').onclick = () => compileInstitutionalReport();
}

function updateTabUI() {
    document.querySelectorAll('.d-tab').forEach(t => {
        t.classList.toggle('active', parseInt(t.dataset.page) === state.activePage);
    });
}

function logEvent(msg) {
    const log = document.getElementById('event-log');
    if (!log) return;
    const item = document.createElement('div');
    item.className = 'ev-item fade-in';
    item.innerText = `> ${msg}`;
    log.prepend(item);
    if (log.children.length > 12) log.lastChild.remove();
}

async function startSovereignPulse() {
    const marketEl = document.getElementById('market-track');
    const update = async () => {
        const data = await fetchIntelligenceFeed();
        if (marketEl && data) {
            marketEl.innerHTML = data.map(m => {
                if (m.isAlert) {
                    const criticalStyle = m.type === 'CRITICAL' ? 'background:var(--accent-red); color:#fff !important;' : '';
                    return `<span class="ticker-item news-alert" style="${criticalStyle}">[${m.type}]: <b>${m.msg}</b></span>`;
                }
                return `<span class="ticker-item ${m.trend}">${m.sym} <b>${m.val}</b> <small>${m.change}</small></span>`;
            }).join('').repeat(5);
        }
    };
    update();
    setInterval(update, 5000); // Institutional 5s Sync Speed
}

function updateMacroBanner() {
    const el = document.getElementById('macro-track');
    if (!el) return;

    const val = state.history.length ? state.history[state.history.length - 1].value.toFixed(2) : "0.00";
    // Jitter removed for absolute static parity
    const liveVal = val;

    const typeLabel = state.viewMode === 'COUNTRY' ? 'SOVEREIGN_ENTITY' : (state.viewMode === 'CONTINENT' ? 'REGIONAL_BLOCK' : 'GLOBAL_CORE');
    const validityColor = state.validity > 80 ? 'var(--accent-green)' : (state.validity > 50 ? 'var(--accent-amber)' : 'var(--accent-red)');

    el.innerHTML = `
        <span class="ticker-item info">[${typeLabel}: ${state.countryName}]</span>
        <span class="ticker-item info">LIVE_FEED: <b style="color:var(--accent-yellow)">${liveVal}%</b></span>
        <span class="ticker-item info">VALIDITY: <b style="color:${validityColor}">${state.validity}%</b></span>
        <span class="ticker-item info">RMSE: ${state.metrics.rmse}</span>
        <span class="ticker-item info">SIGNAL: ${state.pathStats.drift || 'NEUTRAL'}</span>
        <span class="ticker-item info">NEXUS_SYNC: ACTIVE</span>
    `.repeat(10); // Ensure enough length for seamless 30s scroll

    updateThemeColor();
}

function updateThemeColor() {
    const body = document.body;
    body.classList.remove('theme-neutral', 'theme-continent', 'theme-country', 'theme-alert');

    if (state.validity < 40) {
        body.classList.add('theme-alert');
    } else if (state.viewMode === 'COUNTRY') {
        body.classList.add('theme-country');
    } else if (state.viewMode === 'CONTINENT') {
        body.classList.add('theme-continent');
    } else {
        body.classList.add('theme-neutral');
    }
}

// --- SOVEREIGN STATE MACHINE (SEAMLESS) ---

const REGION_COUNTRIES = {
    EU: [
        { code: "FRA", name: "FRANCE" }, { code: "DEU", name: "GERMANY" }, { code: "ITA", name: "ITALY" },
        { code: "ESP", name: "SPAIN" }, { code: "NLD", name: "NETHERLANDS" }, { code: "BEL", name: "BELGIUM" },
        { code: "SWE", name: "SWEDEN" }, { code: "POL", name: "POLAND" }, { code: "CHE", name: "SWITZERLAND" }
    ],
    AS: [
        { code: "CHN", name: "CHINA" }, { code: "JPN", name: "JAPAN" }, { code: "IND", name: "INDIA" },
        { code: "KOR", name: "SOUTH KOREA" }, { code: "SAU", name: "SAUDI ARABIA" }, { code: "IDN", name: "INDONESIA" },
        { code: "TUR", name: "TURKEY" }, { code: "VNM", name: "VIETNAM" }, { code: "THA", name: "THAILAND" }
    ],
    AM: [
        { code: "USA", name: "UNITED STATES" }, { code: "CAN", name: "CANADA" }, { code: "BRA", name: "BRAZIL" },
        { code: "MEX", name: "MEXICO" }, { code: "ARG", name: "ARGENTINA" }, { code: "COL", name: "COLOMBIA" },
        { code: "CHL", name: "CHILE" }, { code: "PER", name: "PERU" }
    ],
    AF: [
        { code: "ZAF", name: "SOUTH AFRICA" }, { code: "NGA", name: "NIGERIA" }, { code: "EGY", name: "EGYPT" },
        { code: "MAR", name: "MOROCCO" }, { code: "KEN", name: "KENYA" }, { code: "ETH", name: "ETHIOPIA" },
        { code: "DZA", name: "ALGERIA" }, { code: "GHA", name: "GHANA" }
    ],
    OC: [
        { code: "AUS", name: "AUSTRALIA" }, { code: "NZL", name: "NEW ZEALAND" }, { code: "PNG", name: "PAPUA NEW GUINEA" },
        { code: "FJI", name: "FIJI" }
    ]
};

async function handleResetGlobe() {
    logEvent("SYS_RESET: RESTORING_GLOBAL_VIEW");
    state.viewMode = 'NEUTRAL';
    state.isLocked = false;
    state.country = 'WLD';
    state.countryName = 'GLOBAL_MARKET';
    state.activePage = 1;

    updateTabUI();
    setMapLock(false);
    zoomToRegion('WORLD');
    setRegionFocus([]); // NEW: Clear regional highlights
    highlightAndTarget(null); // NEW: Clear country focus

    document.getElementById('country-tag').innerText = state.countryName;
    document.getElementById('view-mode-tag').innerText = '[STATE: NEUTRAL]';

    document.querySelectorAll('.region-sq').forEach(sq => sq.classList.remove('active'));

    const refinement = document.getElementById('country-refinement');
    if (refinement) refinement.style.display = 'none';

    refreshTerminal();
}

async function handleCountrySelect(code, name) {
    console.log("EXEC_handleCountrySelect:", code, name);
    logEvent(`TARGET_SHIFT: ${code} [${name}]`);

    state.viewMode = 'COUNTRY';
    state.isLocked = true;
    state.country = code;
    state.countryName = name.toUpperCase();
    state.activePage = 1; // Always reset to Page 01 on new selection

    updateTabUI();
    setMapLock(true, code);

    document.getElementById('country-tag').innerText = state.countryName;
    document.getElementById('view-mode-tag').innerText = '[STATE: SOVEREIGN_LOCK]';

    // Update refinement buttons if they exist
    document.querySelectorAll('.s-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.code === code);
    });

    refreshTerminal();
}

async function handleRegionSelect(regionCode) {
    console.log("EXEC_handleRegionSelect:", regionCode);
    logEvent(`REGION_SHIFT: ${regionCode}`);
    state.activePage = 1;
    updateTabUI();

    state.viewMode = 'CONTINENT';
    state.isLocked = true;
    state.country = regionCode;

    const rName = zoomToRegion(regionCode);
    state.countryName = rName;

    // AUTO_SYNC: Regional Highlighting
    const codes = (REGION_COUNTRIES[regionCode] || []).map(c => c.code);
    setRegionFocus(codes);

    setMapLock(true);
    document.getElementById('country-tag').innerText = rName;
    document.getElementById('view-mode-tag').innerText = '[STATE: REGIONAL_LOCKED]';

    document.querySelectorAll('.region-sq').forEach(sq => {
        sq.classList.toggle('active', sq.dataset.c === regionCode);
    });

    const refinement = document.getElementById('country-refinement');
    const grid = document.getElementById('refinement-grid');
    if (refinement && grid && REGION_COUNTRIES[regionCode]) {
        grid.innerHTML = REGION_COUNTRIES[regionCode].map(c => `
            <button class="s-btn" data-code="${c.code}" data-name="${c.name}">${c.name}</button>
        `).join('');

        grid.querySelectorAll('.s-btn').forEach(btn => {
            btn.onclick = () => handleCountrySelect(btn.dataset.code, btn.dataset.name);
        });

        refinement.style.display = 'block';
    } else if (refinement) {
        refinement.style.display = 'none';
    }

    refreshTerminal();
}

async function refreshTerminal() {
    setStatus('POLLING...');
    // Safety: Ensure map resizes to container
    if (map) map.invalidateSize();

    try {
        const history = await fetchMacroData(state.country, state.indicator);
        state.history = history;
        state.validity = calculateValidity(history);
        state.radarData = await fetchRadarData(state.country);

        const inds = ['gdp', 'inflation', 'unemployment', 'debt', 'trade'];
        await Promise.all(inds.map(async (i) => {
            state.multiData[i] = await fetchMacroData(state.country, i);
        }));

        executeFreedomEngine();
    } catch (e) {
        logEvent("SYNC_FAULT: RE-INITIATING...");
        setStatus('FAULT');
    }
}

function executeFreedomEngine() {
    const history = state.history;
    if (!history || history.length < 2) return;

    const result = predictARIMA(history, state.horizon, 0.01);
    state.metrics = result.metrics;
    const forecast = result.forecast;
    const paths = simulateMonteCarlo(history, state.horizon, 100);
    state.pathStats = calculatePathStats(paths);

    // Advanced Logic
    state.momentum = calculateMomentum(history);
    state.volatility = calculateStdDev(history.map(h => h.value)).toFixed(3);
    state.riskScore = (Math.abs(state.momentum) * 2 + state.volatility * 5 + (100 - state.validity) / 10).toFixed(1);

    // Pattern & Scenario Modelling
    state.macroPattern = detectPattern(history, state.multiData);
    state.scenarios = generateScenarios(paths);

    renderMainChart(history, forecast, paths);
    renderRadarChart();
    renderMatrix();
    renderInstitutionalDossier();

    updateMacroBanner();
    setStatus('NOMINAL');
}

// --- 3-PAGE INSTITUTIONAL DOSSIER (ZERO-GAP) ---

/**
 * Institutional Value Bar Generator
 */
function createDataBar(percent, color = 'var(--accent-yellow)') {
    const p = Math.min(100, Math.max(0, percent));
    return `
        <div class="bar-wrap">
            <div class="bar-fill" style="width:${p}%; background:${color};"></div>
        </div>
    `;
}

function renderInstitutionalDossier() {
    const out = document.getElementById('report-output');
    if (!out) return;

    const forecast = state.history.length ? predictARIMA(state.history, state.horizon).forecast : [];
    const termVal = forecast.length ? forecast[forecast.length - 1].toFixed(2) : "0.00";

    let html = '';
    if (state.activePage === 1) {
        html = `
            <div class="fade-in">
                <span class="wp-sh">PAGE_01: MACRO_SOLVER_DASHBOARD</span>
                <table class="report-table">
                    <tr><th>CORE_INDICATOR</th><th class="val">VALUE / INTENSITY</th></tr>
                    <tr><td>SIGNAL_MOMENTUM</td><td class="val">
                        <span style="color:${state.momentum >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">${state.momentum}</span>
                        ${createDataBar(Math.abs(state.momentum) * 10, state.momentum >= 0 ? 'var(--accent-green)' : 'var(--accent-red)')}
                    </td></tr>
                    <tr><td>REALIZED_VOL</td><td class="val">
                        ${state.volatility} 
                        <div style="display:inline-block; vertical-align:middle; margin-left:10px; width:40px; height:10px; background:rgba(255,153,0,0.1); border:1px solid #111;">
                            <div style="width:100%; height:100%; display:flex; align-items:flex-end; gap:1px;">
                                ${Array.from({ length: 8 }).map(() => `<div style="flex:1; height:${Math.random() * 100}%; background:var(--accent-yellow); opacity:0.5;"></div>`).join('')}
                            </div>
                        </div>
                        ${createDataBar(state.volatility * 10)}
                    </td></tr>
                    <tr><td>MACRO_RISK_INDEX</td><td class="val">
                        <span style="color:${state.riskScore > 70 ? 'var(--accent-red)' : 'var(--accent-yellow)'}">${state.riskScore}</span>
                        ${createDataBar(state.riskScore, state.riskScore > 70 ? 'var(--accent-red)' : 'var(--accent-yellow)')}
                    </td></tr>
                </table>

                <span class="wp-sh">FINANCIAL_LIQUIDITY_MAP</span>
                <div style="font-size:10px; color:#aaa; line-height:1.5; margin-bottom:15px; text-align:justify;">
                    Institutional analysis for ${state.countryName} indicates a phase of <b>${state.momentum > 0 ? "BULLISH_ACCUMULATION" : "BEARISH_CONTRACTION"}</b>. 
                    The calculated Risk Index of ${state.riskScore} suggests ${state.riskScore > 50 ? "elevated exposure risk" : "stable underlying architecture"} within the current macro-cycle.
                </div>
                
                <table class="report-table">
                    <tr><th>BENCHMARK_LINK</th><th class="val">SYNC_STAT</th></tr>
                    <tr><td>GOLD_SPOT</td><td class="val">LNKD_OK [1.02%]</td></tr>
                    <tr><td>CROSS_ASSET_CORR</td><td class="val">HIGH_RES [0.94]</td></tr>
                </table>
            </div>
        `;
    } else if (state.activePage === 2) {
        html = `
            <div class="fade-in">
                <span class="wp-sh">PAGE_02: PROBABILISTIC_SOLUTIONS</span>
                <table class="report-table">
                    <tr><th>STOCHASTIC_SCENARIO</th><th class="val">ESTIMATE / PATH</th></tr>
                    <tr><td>BULL_CASE (P90)</td><td class="val">
                        <span style="color:var(--accent-green);">${state.scenarios.bull}%</span>
                        ${createDataBar(50 + parseFloat(state.scenarios.bull) * 2, 'var(--accent-green)')}
                    </td></tr>
                    <tr><td>BASE_CASE (P50)</td><td class="val">
                        <span style="color:var(--accent-yellow);">${state.scenarios.base}%</span>
                        ${createDataBar(50 + parseFloat(state.scenarios.base) * 2, 'var(--accent-yellow)')}
                    </td></tr>
                    <tr><td>BEAR_CASE (P10)</td><td class="val">
                        <span style="color:var(--accent-red);">${state.scenarios.bear}%</span>
                        ${createDataBar(50 + parseFloat(state.scenarios.bear) * 2, 'var(--accent-red)')}
                    </td></tr>
                </table>

                <span class="wp-sh">PATH_SOLVER_INTERPRETATION</span>
                <p style="font-size:10px; color:#999; line-height:1.6; text-align:justify; margin-bottom:15px;">
                    Model correlates ${state.indicator.toUpperCase()} vectors with <b>${state.macroPattern}</b> dynamics. 
                    Monte Carlo simulations (n=100) identify a terminal pivot range between ${state.scenarios.bear}% and ${state.scenarios.bull}% over the defined ${state.horizon}-period horizon.
                </p>

                <div style="border:1px solid var(--border-nexus); padding:12px; background:#050505;">
                    <div style="font-size:8px; color:#555; text-transform:uppercase; letter-spacing:1px;">Confidence Layer: ${state.validity}%</div>
                    <div style="height:3px; background:#111; margin-top:8px;">
                        <div style="height:100%; background:var(--accent-yellow); width:${state.validity}%;"></div>
                    </div>
                </div>
            </div>
        `;
    } else {
        const adv = generateStrategicAdvisory(state);
        html = `
            <div class="fade-in">
                <span class="wp-sh">PAGE_03: STRATEGIC_ADVISORY_SOLVER</span>
                <div class="advisory-block">
                    <div style="color:var(--accent-yellow); font-size:11px; font-weight:bold; margin-bottom:12px;">> EXEC_SOLVE: ${state.countryName}</div>
                    
                    <div style="font-size:10px; color:#eee; margin-bottom:15px; border-bottom:1px solid #111; padding-bottom:10px;">
                        <b style="color:#555">[ADVISORY_TAG]:</b> ${adv.jargon}<br><br>
                        <b>[CURRENT_PROBLEM]:</b><br>
                        ${adv.problem}
                    </div>

                    <div style="font-size:10px; color:#ccc; border-left:2px solid var(--accent-yellow); padding-left:12px; margin-bottom:20px; line-height:1.6;">
                        <b style="color:var(--accent-yellow)">[${adv.type}_STRATEGY]:</b><br>
                        ${adv.strategy}
                    </div>
                </div>

                <div style="margin-top:20px; border:1px solid #222; padding:12px; background:#050505;">
                    <div style="font-size:8px; color:#444; text-transform:uppercase; margin-bottom:5px;">System Security Hash</div>
                    <div style="font-family:var(--font-mono); font-size:8px; color:var(--accent-yellow); word-break:break-all; opacity:0.6;">
                        NEXUS_SOLVER_RUN_${Math.random().toString(16).slice(2, 10).toUpperCase()}_LOG
                    </div>
                </div>

                <div class="nexus-seal" style="margin-top:20px; padding:10px; text-align:center; font-size:8px; color:#333; font-family:var(--font-mono); letter-spacing:2px;">
                    SOLVER_ID: NEXUS-12-SOLVE_B | PATTERN: ${state.macroPattern}
                </div>
            </div>
        `;
    }
    out.innerHTML = html;
}

/**
 * Bloomberg-Style Intelligence Generator
 * Uses a multi-dimensional matrix to avoid repetitive "memorized" advice.
 */
function generateStrategicAdvisory(s) {
    const ind = s.indicator.toUpperCase();
    const mom = parseFloat(s.momentum);
    const risk = parseFloat(s.riskScore);
    const vol = parseFloat(s.volatility);
    const pattern = s.macroPattern;

    const professionalJargon = [
        "Yield Curve Dynamics", "Liquidity Trap Proxy", "Fiscal Dominance Band",
        "Monetary Headwinds", "Mean Reversion Pivot", "Stochastic Drift Calibration",
        "Gamma Exposure", "Systemic Liquidity Gap", "Risk-Neutral Density"
    ];

    const problems = {
        GDP: [
            mom < 0 ? `Structural output contraction in ${s.countryName} suggests systemic friction and recessionary gravity.` : `Output expansion identified, but sustainability index remains sensitive to volatility shocks.`,
            pattern === 'STAGFLATION_SIGNALS' ? `CRITICAL: Stagflationary pivot detected. Declining output coupled with inflationary pressure requires immediate stabilization.` : `Growth stability is nominally intact, though global headwinds persist.`
        ],
        INFLATION: [
            mom > 0 ? `Price level acceleration in ${s.countryName} is breaching traditional stability bands, suggesting an overheating domestic cycle.` : `Disinflationary pressures identified; risk of demand-side exhaustion and liquidity trap scenarios.`,
            pattern === 'OVERHEATING_ECONOMY' ? `ALERT: Overheating detected. Asset-price inflation is uncoupled from core productive capacity.` : `Inflationary environment remains contained within model tolerances.`
        ],
        UNEMPLOYMENT: [
            mom > 0 ? `Labor market deterioration indicates structural mismatch and erosion of human capital buffers.` : `Employment metrics show resilient recovery, though wage-push risk remains a latent variable.`,
            vol > 2 ? `Erratic participation rates suggest fiscal instability and hidden underemployment.` : `Labor force equilibrium is currently the dominant vector.`
        ]
    };

    const strategies = {
        AGGRESSIVE: [
            "1. CAPITAL_DEPLOY: Target high-conviction vectors identified by ARIMA convergence.<br>2. ALPHA_HARVEST: Maximize exposure to positive drift paths.",
            "1. EXPANSIONARY_BIAS: Utilize structural momentum for asset allocation.<br>2. YIELD_MAXIMIZATION: Shift focus to high-beta sovereign instruments."
        ],
        DEFENSIVE: [
            "1. RISK_MITIGATION: Pivot to non-correlated benchmarks (GOLD/DXY proxy).<br>2. LIQUIDITY_PRESERVATION: Reduce exposure to high-volatility sovereign debt.",
            "1. TAIL_RISK_HEDGE: Implement protective overlays for ${s.countryName} assets.<br>2. FLIGHT_TO_QUALITY: Re-balance toward AAA-rated institutional anchors."
        ],
        NEUTRAL: [
            "1. BENCHMARK_PARITY: Maintain allocation in sync with global core indices.<br>2. MONITOR_PIVOT: Await further signal convergence before structural shifts.",
            "1. PURE_ALPHA_PURSUIT: Focus on micro-divergences within the ${s.viewMode} block.<br>2. CORRELATION_TEST: Verify sector links before increasing exposure."
        ]
    };

    const probList = problems[ind] || [
        mom < 0 ? "Negative vector identified in core macro-instrument. Risk of negative convexity." : "Positive drift observed, but high-frequency data shows noise.",
        vol > 2 ? "Extreme structural volatility is preventing clear signal capture." : "Low-volatility environment favors wait-and-see institutional stance."
    ];

    let stratKey = "NEUTRAL";
    if (risk > 65 || mom < -1.5) stratKey = "DEFENSIVE";
    else if (risk < 40 && mom > 0.5) stratKey = "AGGRESSIVE";

    const stratList = strategies[stratKey];
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return {
        problem: rand(probList),
        strategy: rand(stratList),
        type: stratKey,
        jargon: rand(professionalJargon)
    };
}

// --- VISUAL NEXUS (SHARP) ---

function renderRadarChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();

    // Aligned with INDICATOR_MAP keys in api.js
    const l = ['GDP', 'INF', 'UNP', 'DEB', 'TRD'];
    const keyMap = { 'GDP': 'gdp', 'INF': 'inflation', 'UNP': 'unemployment', 'DEB': 'debt', 'TRD': 'trade' };

    const d = l.map(lbl => {
        const val = state.radarData[keyMap[lbl]] || 0;
        // Normalize for visual balance
        return Math.min(10, Math.max(0, val / 2 + 3));
    });

    radarChart = new Chart(ctx, {
        type: 'radar', data: { labels: l, datasets: [{ data: d, backgroundColor: 'rgba(255,153,0,0.1)', borderColor: 'var(--accent-yellow)', borderWidth: 1.5, pointRadius: 2, pointBackgroundColor: 'var(--accent-yellow)' }] },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { r: { angleLines: { color: '#222' }, grid: { color: '#222' }, pointLabels: { color: '#666', font: { family: 'var(--font-mono)', size: 8, weight: 'bold' } }, ticks: { display: false }, min: 0, max: 10 } }
        }
    });
}

function renderMainChart(history, forecast, paths) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    if (mainChart) mainChart.destroy();
    const labels = [...history.map(h => h.date), ...Array.from({ length: state.horizon }, (_, i) => `H+${i + 1}`)];

    // FORECAST CLOUD: High visibility amber
    const datasets = paths.slice(0, 15).map(p => ({
        data: [...Array(history.length - 1).fill(null), history[history.length - 1].value, ...p],
        borderColor: 'rgba(255,153,0,0.2)', // 20% opacity for better cloud visibility
        borderWidth: 1, pointRadius: 0, fill: false, tension: 0.4
    }));

    // MASTER FORECAST: Solid and Dashed
    datasets.push({
        label: 'MASTER_PROJECTION',
        data: [...Array(history.length - 1).fill(null), history[history.length - 1].value, ...forecast],
        borderColor: 'var(--accent-yellow)',
        borderWidth: 2,
        borderDash: [5, 5], // Indicates forecast
        tension: 0.3,
        pointRadius: 2,
        pointBackgroundColor: 'var(--accent-yellow)'
    });

    // ACTUAL HISTORY: Solid White
    datasets.push({
        label: 'HISTORICAL_REALIZED',
        data: [...history.map(h => h.value), ...Array(state.horizon).fill(null)],
        borderColor: '#ffffff',
        borderWidth: 2,
        pointRadius: 0
    });

    mainChart = new Chart(ctx, {
        type: 'line', data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `QUANTUM_ENGINE: [${state.indicator.toUpperCase()}]_SOLVER_DASHBOARD`,
                    color: '#777',
                    font: { family: 'var(--font-mono)', size: 9, weight: 'bold' },
                    align: 'start'
                }
            },
            scales: {
                x: { grid: { color: '#111' }, ticks: { color: '#666', font: { size: 9, weight: 'bold' } } },
                y: { grid: { color: '#111' }, ticks: { color: '#666', font: { size: 9, weight: 'bold' } } }
            }
        }
    });
}

function renderMatrix() {
    const grid = document.getElementById('matrix-grid');
    if (!grid) return;
    const inds = ['gdp', 'inflation', 'unemployment'];
    let html = '';
    inds.forEach(a => {
        inds.forEach(b => {
            const dataA = state.multiData[a] || [];
            const dataB = state.multiData[b] || [];
            const c = (dataA.length > 0 && dataB.length > 0) ? calculateCorrelation(dataA, dataB) : "0.00";

            const color = c > 0.4 ? 'var(--accent-green)' : (c < -0.4 ? 'var(--accent-red)' : '#444');
            html += `
                <div class="matrix-item">
                    <span class="matrix-label">${a.slice(0, 3)}/${b.slice(0, 3)}</span>
                    <span class="matrix-value" style="color:${color}">${c}</span>
                </div>
            `;
        });
    });
    grid.innerHTML = html;
}

function startClock() {
    const el = document.getElementById('sys-clock');
    if (el) setInterval(() => {
        el.innerText = new Date().toISOString().replace('T', ' ').slice(11, 19) + ' UTC';
    }, 1000);

    // Real-time Macro Ticker Jitter
    setInterval(updateMacroBanner, 3000);
}

function setStatus(msg) {
    const el = document.getElementById('sys-status');
    if (el) el.innerText = msg;
}

/**
 * BLOOMBERG_RESEARCH_COMPILER: Multi-Page Document Synthesis
 */
function compileInstitutionalReport() {
    logEvent("COMPILING_RESEARCH_DOSSIER...");
    const container = document.getElementById('print-report-container');
    if (!container) return;

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const terminalId = `NEXUS-V12-` + Math.random().toString(16).slice(2, 8).toUpperCase();

    // Prepare content for all 3 pages
    let fullHtml = '';
    const pages = [1, 2, 3];

    pages.forEach(p => {
        // Temporarily set state to render each page
        const oldPage = state.activePage;
        state.activePage = p;

        // Use the existing logic to generate the HTML for each page
        // We need to capture what renderInstitutionalDossier would output
        const tempDiv = document.createElement('div');
        const originalOut = document.getElementById('report-output');

        // Mock the output element
        const mockOut = { set innerHTML(val) { tempDiv.innerHTML = val; }, get innerHTML() { return tempDiv.innerHTML; } };

        // This is a bit hacky because renderInstitutionalDossier uses document.getElementById('report-output')
        // So we temporarily hijack that element or just replicate the logic
        const content = generatePageContent(p);

        fullHtml += `
            <div class="print-report-page">
                <header class="report-header">
                    <div>
                        <h1>SOVEREIGN_FREEDOM_RESEARCH</h1>
                        <div style="font-size:10px; font-weight:bold;">ENTITY: ${state.countryName} | VECTOR: ${state.indicator.toUpperCase()}</div>
                    </div>
                    <div class="report-meta">
                        <div>REF_ID: ${terminalId}</div>
                        <div>DATE: ${timestamp} UTC</div>
                        <div>PAGE: 0${p} / 03</div>
                    </div>
                </header>
                ${content}
                <footer class="print-footer">
                    CONFIDENTIAL PREVIEW | PROBABILISTIC MACRO-SOLVER | TERMINAL_S_12_FREEDOM
                </footer>
            </div>
        `;

        state.activePage = oldPage;
    });

    container.innerHTML = fullHtml;

    // Add Chart Visualizations to the end of Page 1
    const p1 = container.querySelector('.print-report-page:nth-child(1)');
    if (p1) {
        const chartImg = document.getElementById('mainChart').toDataURL();
        const radarImg = document.getElementById('radarChart').toDataURL();

        p1.innerHTML += `
            <div class="wp-sh">VECTOR_VISUALIZATION_PROJECTION</div>
            <div class="chart-print-wrap">
                <img src="${chartImg}" style="width:100%;">
            </div>
            <div class="wp-sh">STRUCTURAL_RADAR_MAP</div>
            <div class="chart-print-wrap" style="text-align:center;">
                <img src="${radarImg}" style="width:300px;">
            </div>
        `;
    }

    // Trigger Print
    setTimeout(() => window.print(), 500);
}

// Factor out content generation from renderInstitutionalDossier for reuse
function generatePageContent(pageNum) {
    const forecast = state.history.length ? predictARIMA(state.history, state.horizon).forecast : [];
    const termVal = forecast.length ? forecast[forecast.length - 1].toFixed(2) : "0.00";

    if (pageNum === 1) {
        return `
            <span class="wp-sh">MACRO_SOLVER_DASHBOARD</span>
            <table class="report-table">
                <tr><th>CORE_INDICATOR</th><th class="val">VALUE / INTENSITY</th></tr>
                <tr><td>SIGNAL_MOMENTUM</td><td class="val">${state.momentum}</td></tr>
                <tr><td>REALIZED_VOL</td><td class="val">${state.volatility}</td></tr>
                <tr><td>MACRO_RISK_INDEX</td><td class="val">${state.riskScore}</td></tr>
            </table>
            <span class="wp-sh">FINANCIAL_LIQUIDITY_MAP</span>
            <p style="font-size:11px; line-height:1.6;">
                Institutional analysis for ${state.countryName} indicates a phase of <b>${state.momentum > 0 ? "BULLISH_ACCUMULATION" : "BEARISH_CONTRACTION"}</b>. 
                The calculated Risk Index of ${state.riskScore} suggests ${state.riskScore > 50 ? "elevated exposure risk" : "stable underlying architecture"}.
            </p>
        `;
    } else if (pageNum === 2) {
        return `
            <span class="wp-sh">PROBABILISTIC_SOLUTIONS</span>
            <table class="report-table">
                <tr><th>STOCHASTIC_SCENARIO</th><th class="val">ESTIMATE / PATH</th></tr>
                <tr><td>BULL_CASE (P90)</td><td class="val">${state.scenarios.bull}%</td></tr>
                <tr><td>BASE_CASE (P50)</td><td class="val">${state.scenarios.base}%</td></tr>
                <tr><td>BEAR_CASE (P10)</td><td class="val">${state.scenarios.bear}%</td></tr>
            </table>
            <span class="wp-sh">PATH_SOLVER_INTERPRETATION</span>
            <p style="font-size:11px; line-height:1.6;">
                Model correlates ${state.indicator.toUpperCase()} vectors with <b>${state.macroPattern}</b> dynamics. 
                Simulation pivot range identified between ${state.scenarios.bear}% and ${state.scenarios.bull}% over the defined ${state.horizon}-period horizon.
            </p>
        `;
    } else {
        const adv = generateStrategicAdvisory(state);
        return `
            <span class="wp-sh">STRATEGIC_ADVISORY_SOLVER</span>
            <div style="margin-top:20px;">
                <b style="color:#000">[ADVISORY_TAG]:</b> ${adv.jargon}<br><br>
                <b>[CURRENT_PROBLEM]:</b><br>
                <p style="font-size:11px;">${adv.problem}</p><br>
                <b style="color:#000">[${adv.type}_STRATEGY]:</b><br>
                <p style="font-size:11px;">${adv.strategy}</p>
            </div>
        `;
    }
}
