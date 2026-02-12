/**
 * MACROFORECAST Master Map Module XII (SOVEREIGN_FREEDOM)
 * Zero-Lock Geospatial Engine for Seamless Global Selection
 */

let map;
let geoJsonLayer;
let onCountrySelect;
let lockState = false; // Internal state still used for styling, but not blocking
let activeReticles = [];
let heatmapData = {};
let activeRegionCodes = []; // Track currently selected region
let highlightedCountryCode = null; // Track single selected country

const CONTINENTS = {
    EU: { center: [50, 10], zoom: 4, name: "EUROPE" },
    AS: { center: [34, 100], zoom: 3, name: "ASIA" },
    AM: { center: [20, -100], zoom: 3, name: "AMERICAS" },
    AF: { center: [0, 20], zoom: 3, name: "AFRICA" },
    OC: { center: [-25, 135], zoom: 4, name: "OCEANIA" },
    WORLD: { center: [20, 0], zoom: 2, name: "GLOBAL" }
};

async function initMap(containerId, callback) {
    onCountrySelect = callback;
    try {
        if (!map) {
            map = L.map(containerId, {
                center: CONTINENTS.WORLD.center,
                zoom: CONTINENTS.WORLD.zoom,
                minZoom: 2, maxZoom: 8,
                zoomControl: false, attributionControl: false,
                fadeAnimation: true, zoomAnimation: true
            });
        }

        const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
        const data = await response.json();

        geoJsonLayer = L.geoJson(data, {
            style: (feature) => ({
                color: "#111", weight: 1, fillColor: "#000", fillOpacity: 0.95
            }),
            onEachFeature: (feature, layer) => {
                layer.on({
                    mouseover: (e) => {
                        e.target.setStyle({ fillColor: "#ff9900", fillOpacity: 0.5 });
                    },
                    mouseout: (e) => {
                        updateLayerStyle(e.target);
                    },
                    click: (e) => {
                        // SOVEREIGN LOCK: Prevent selection if already locked
                        if (lockState) {
                            console.log("MAP_LOCKED: Reset required for new selection.");
                            return;
                        }
                        const props = e.target.feature.properties;
                        const code = props.ISO_A3 || props.iso_a3 || props.ADM0_A3;
                        if (onCountrySelect && code && code !== "-99") {
                            onCountrySelect(code, props.ADMIN || props.name);
                        }
                    }
                });
            }
        }).addTo(map);

    } catch (e) {
        console.error("MAP_FREEDOM_FAULT", e);
    }
}

function updateHeatmap(data) {
    heatmapData = data;
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(layer => updateLayerStyle(layer));
    }
}

function updateLayerStyle(layer) {
    const props = layer.feature.properties;
    const code = (props.ISO_A3 || props.iso_a3 || props.ADM0_A3 || "").toUpperCase();

    // 1. Single Country Focus (Highest Priority)
    if (highlightedCountryCode && code === highlightedCountryCode) {
        layer.setStyle({ fillColor: "#ffff00", fillOpacity: 0.9, color: "#fff", weight: 2 });
        return;
    }

    // 2. Regional Highlight (Medium Priority)
    if (activeRegionCodes.length > 0 && activeRegionCodes.includes(code)) {
        layer.setStyle({ fillColor: "var(--accent-yellow)", fillOpacity: 0.4, color: "#444", weight: 1 });
        return;
    }

    // 3. Heatmap / Default (Lowest Priority)
    const val = heatmapData[code];
    if (val !== undefined) {
        const color = val > 4 ? "#00ff66" : (val > 2 ? "#ff9900" : "#ff3333");
        layer.setStyle({ fillColor: color, fillOpacity: 0.3, color: "#111", weight: 1 });
    } else {
        // De-emphasize non-selected areas
        const isDistant = activeRegionCodes.length > 0;
        layer.setStyle({
            fillColor: "#000",
            fillOpacity: isDistant ? 1.0 : 0.95,
            color: isDistant ? "#222" : "#333",
            weight: 1
        });
    }
}

function setRegionFocus(codes) {
    activeRegionCodes = (codes || []).map(c => c.toUpperCase());
    highlightedCountryCode = null; // Clear country focus when region changes
    if (geoJsonLayer) geoJsonLayer.eachLayer(layer => updateLayerStyle(layer));
}

function setMapLock(isLocked, targetCode = null) {
    lockState = isLocked;
    // We don't block interaction, but we apply visual focus
    if (isLocked) {
        document.body.classList.add('locked-state');
        if (targetCode) highlightAndTarget(targetCode);
    } else {
        document.body.classList.remove('locked-state');
        if (geoJsonLayer) geoJsonLayer.eachLayer(layer => updateLayerStyle(layer));
    }
}

function highlightAndTarget(code) {
    if (!geoJsonLayer) return;
    clearReticles();
    highlightedCountryCode = code ? code.toUpperCase() : null;

    geoJsonLayer.eachLayer(layer => {
        const props = layer.feature.properties;
        const featCode = (props.ISO_A3 || props.iso_a3 || props.ADM0_A3 || props.adm0_a3 || "").toUpperCase();

        if (featCode && code && featCode === code.toUpperCase()) {
            updateLayerStyle(layer); // Applies focus style
            const center = layer.getBounds().getCenter();
            const reticleIcon = L.divIcon({
                className: 'reticle-static', // Static icon per user request
                iconSize: [40, 40], iconAnchor: [20, 20]
            });
            const marker = L.marker(center, { icon: reticleIcon }).addTo(map);
            activeReticles.push(marker);

            map.flyToBounds(layer.getBounds(), { padding: [100, 100], duration: 1.0 });
        } else {
            updateLayerStyle(layer);
        }
    });
}

function clearReticles() {
    activeReticles.forEach(r => map.removeLayer(r));
    activeReticles = [];
}

function zoomToRegion(c) {
    const config = CONTINENTS[c] || CONTINENTS.WORLD;
    if (map) map.flyTo(config.center, config.zoom, { duration: 1.2 });
    return config.name;
}
