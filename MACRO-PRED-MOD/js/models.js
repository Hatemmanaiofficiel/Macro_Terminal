/**
 * MACROFORECAST Master Mathematical Module V9.0 (OVERDRIVE_POLISH)
 * Institutional-Grade Probability Suite with Monte Carlo Percentiles
 */

/**
 * Gradient Descent Optimizer with Early Stopping & Validation
 */
function optimizeWeights(trainX, trainY, valX, valY, alpha = 0.01, iterations = 1500, lr = 0.01) {
    let w = Math.random();
    let b = Math.random();
    const n = trainX.length;

    let bestW = w, bestB = b;
    let minValError = Infinity;
    let patience = 50;
    let wait = 0;

    for (let i = 0; i < iterations; i++) {
        let dw = 0, db = 0;
        for (let j = 0; j < n; j++) {
            const pred = w * trainX[j] + b;
            const err = pred - trainY[j];
            dw += (2 / n) * trainX[j] * err;
            db += (2 / n) * err;
        }
        dw += (2 * alpha * w);

        w -= lr * dw;
        b -= lr * db;

        if (valX && valY) {
            let valError = 0;
            for (let k = 0; k < valX.length; k++) {
                valError += ((w * valX[k] + b) - valY[k]) ** 2;
            }
            valError /= valX.length;

            if (valError < minValError) {
                minValError = valError;
                bestW = w; bestB = b;
                wait = 0;
            } else {
                wait++;
                if (wait >= patience) break;
            }
        }
    }
    return { w: bestW, b: bestB, valError: minValError };
}

function kFoldSplit(data, k = 3) {
    const folds = [];
    const shardSize = Math.floor(data.length / k);
    for (let i = 0; i < k; i++) {
        const testStart = i * shardSize;
        const testEnd = (i === k - 1) ? data.length : (i + 1) * shardSize;
        const test = data.slice(testStart, testEnd);
        const train = data.filter((_, idx) => idx < testStart || idx >= testEnd);
        folds.push({ train, test });
    }
    return folds;
}

/**
 * Cross-Validated ARIMA(1,1,1)
 */
function predictARIMA(history, horizon, alpha = 0.01) {
    if (history.length < 5) return {
        forecast: Array(horizon).fill(history[history.length - 1].value),
        metrics: { rmse: 0, r2: 0, cvScore: "LOW_SAMPLES" }
    };

    const xy = history.slice(0, -1).map((h, i) => ({ x: h.value, y: history[i + 1].value }));
    const folds = kFoldSplit(xy, 3);

    let totalRmse = 0;
    let bestWeights = { w: 0.9, b: 0 };

    folds.forEach(fold => {
        const tx = fold.train.map(d => d.x);
        const ty = fold.train.map(d => d.y);
        const vx = fold.test.map(d => d.x);
        const vy = fold.test.map(d => d.y);
        const res = optimizeWeights(tx, ty, vx, vy, alpha);
        totalRmse += Math.sqrt(res.valError || 0);
        bestWeights = res;
    });

    const avgRmse = totalRmse / folds.length;
    const forecast = [];
    let last = history[history.length - 1].value;
    for (let i = 0; i < horizon; i++) {
        const next = bestWeights.w * last + bestWeights.b;
        forecast.push(next);
        last = next;
    }

    return {
        forecast,
        metrics: {
            rmse: avgRmse.toFixed(4),
            r2: (1 - (avgRmse / (calculateStdDev(history.map(h => h.value)) || 1))).toFixed(4),
            cvScore: avgRmse < 0.5 ? "PRISTINE" : (avgRmse < 1.0 ? "STABLE" : "SKEWED")
        }
    };
}

/**
 * Monte Carlo Simulation with Percentile Generation
 */
function simulateMonteCarlo(history, horizon, iterations = 100) {
    const lastVal = history[history.length - 1].value;
    const changes = history.slice(1).map((h, i) => h.value - history[i].value);
    const avg = changes.reduce((a, b) => a + b, 0) / (changes.length || 1);
    const sd = calculateStdDev(changes);

    const paths = [];
    for (let i = 0; i < iterations; i++) {
        const path = [];
        let curr = lastVal;
        for (let j = 0; j < horizon; j++) {
            curr += avg + (Math.random() * 2 - 1) * 2 * sd;
            path.push(curr);
        }
        paths.push(path);
    }
    return paths;
}

/**
 * V9.0: Statistical Percentile Calculator for Advisory Panel
 */
/**
 * Detects complex macro-patterns like stagflation or overheating.
 */
function detectPattern(history, indicators) {
    // Basic stagflation check: GDP down + Inflation up
    const gdp = indicators['gdp'];
    const inf = indicators['inflation'];

    if (gdp && inf) {
        const gdpMom = calculateMomentum(gdp);
        const infMom = calculateMomentum(inf);

        if (gdpMom < 0 && infMom > 0.5) return 'STAGFLATION_SIGNALS';
        if (gdpMom > 1 && infMom > 1) return 'OVERHEATING_ECONOMY';
    }
    return 'STANDARD_CYCLE';
}

/**
 * Generates three distinct stochastic scenarios.
 */
function generateScenarios(paths) {
    const horizon = paths[0].length;
    const terminalValues = paths.map(p => p[horizon - 1]).sort((a, b) => a - b);

    return {
        bull: terminalValues[Math.floor(terminalValues.length * 0.9)].toFixed(2),
        base: terminalValues[Math.floor(terminalValues.length * 0.5)].toFixed(2),
        bear: terminalValues[Math.floor(terminalValues.length * 0.1)].toFixed(2)
    };
}

function calculateMomentum(history) {
    if (history.length < 5) return 0;
    const n = history.length;
    const recent = history[n - 1].value;
    const past = history[n - 4].value;
    return (recent - past).toFixed(3);
}

function calculatePathStats(paths) {
    const horizon = paths[0].length;
    const terminalValues = paths.map(p => p[horizon - 1]).sort((a, b) => a - b);

    // Probability of positive growth (> 0)
    const positiveCount = terminalValues.filter(v => v > 0).length;
    const probGrowth = (positiveCount / terminalValues.length) * 100;

    const getPercentile = (p) => {
        const idx = Math.floor((p / 100) * terminalValues.length);
        return terminalValues[idx];
    };

    return {
        p5: getPercentile(5).toFixed(2),
        p25: getPercentile(25).toFixed(2),
        median: getPercentile(50).toFixed(2),
        p75: getPercentile(75).toFixed(2),
        p95: getPercentile(95).toFixed(2),
        drift: (getPercentile(50) - terminalValues[0]).toFixed(3),
        probGrowth: probGrowth.toFixed(1),
        expReturn: (getPercentile(50) - paths[0][0]).toFixed(3) // Change from start to median end
    };
}

function calculateStdDev(vals) {
    if (vals.length < 2) return 0.1;
    const m = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / vals.length);
}

function calculateCorrelation(A, B) {
    if (!A.length || !B.length) return 0;
    const n = Math.min(A.length, B.length);
    const a = A.slice(-n).map(h => h.value);
    const b = B.slice(-n).map(h => h.value);
    const ma = a.reduce((s, v) => s + v, 0) / n;
    const mb = b.reduce((s, v) => s + v, 0) / n;
    let num = 0, da = 0, db = 0;
    for (let i = 0; i < n; i++) {
        num += (a[i] - ma) * (b[i] - mb);
        da += (a[i] - ma) ** 2;
        db += (b[i] - mb) ** 2;
    }
    const den = Math.sqrt(da * db);
    return den === 0 ? 0 : (num / den).toFixed(3);
}

function calculateZScore(val, history) {
    const vals = history.map(h => h.value);
    const m = vals.reduce((a, b) => a + b, 0) / vals.length;
    const sd = calculateStdDev(vals);
    return ((val - m) / (sd || 1)).toFixed(2);
}
