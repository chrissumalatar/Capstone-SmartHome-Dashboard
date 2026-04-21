document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // LIVE DATE AND TIME
    // ===============================
    const currentDatetime = document.getElementById("current-datetime");

    function updateDateTime() {
        if (!currentDatetime) return;

        const now = new Date();
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "numeric",
            minute: "2-digit"
        };

        currentDatetime.textContent = now.toLocaleString("en-AU", options);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    // ===============================
    // SIDEBAR TOGGLE
    // ===============================
    const menuBtn = document.querySelector(".menu-icon");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    if (menuBtn && sidebar && mainContent) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            mainContent.style.marginLeft = sidebar.classList.contains("collapsed") ? "60px" : "250px";
        });
    }

    // ===============================
    // TOGGLE BUTTONS (ON/OFF/VIEW)
    // ===============================
    const toggles = document.querySelectorAll(".toggle");

    toggles.forEach(btn => {
        if (!btn) return;

        const text = btn.innerText.trim();
        if (text === "ON") {
            btn.style.background = "#22c55e";
            btn.style.color = "white";
        } else if (text === "OFF") {
            btn.style.background = "#ef4444";
            btn.style.color = "white";
        } else if (text === "VIEW") {
            btn.style.background = "white";
            btn.style.color = "#0f172a";
        }

        btn.addEventListener("click", () => {
            if (btn.innerText.trim() === "ON") {
                btn.innerText = "OFF";
                btn.style.background = "#ef4444";
            } else if (btn.innerText.trim() === "OFF") {
                btn.innerText = "ON";
                btn.style.background = "#22c55e";
            }
        });
    });

    // ===============================
    // PAGE NAVIGATION
    // ===============================
    const navLinks = document.querySelectorAll(".nav-links li");

    const pages = {
        dashboard: document.getElementById("dashboard"),
        rooms: document.getElementById("rooms"),
        lighting: document.getElementById("lighting"),
        ventilation: document.getElementById("ventilation"),
        aircon: document.getElementById("aircon"),
        sensor: document.getElementById("sensor"),
        curtain: document.getElementById("curtain"),
        power: document.getElementById("power"),
        energy: document.getElementById("energy"),
        settings: document.getElementById("settings"),
        "building-parts": document.getElementById("building-parts"),
        "controls-page": document.getElementById("controls-page"),
        "readings-page": document.getElementById("readings-page")
    };

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // hide dashboard
            const dashboard = document.getElementById("dashboard");
            if (dashboard) dashboard.style.display = "none";

            // hide all pages
            Object.values(pages).forEach(p => {
                if (p) p.style.display = "none";
            });

            const pageName = link.dataset.page;

            if (pageName === "dashboard") {
                if (dashboard) dashboard.style.display = "block";
                return;
            }

            const currentPage = pages[pageName];
            if (currentPage) {
                currentPage.style.display = "block";
            }

            if (pageName === "readings-page") {
                setTimeout(() => {
                    if (typeof buildReadingsChart === "function") {
                        buildReadingsChart();
                    }
                }, 100);
            }

            if (currentPage) {
                const firstTab = currentPage.querySelector(".room-tab");
                if (firstTab) firstTab.click();
            }
        });
    });

    // ===============================
    // UNIVERSAL ROOM TAB SYSTEM
    // ===============================
    function showRoom(roomId) {
        const allPanels = document.querySelectorAll(
            '.room-controls, .lighting-controls, .light-control-container, .ventilation-controls, .aircon-controls, .sensor-panel, .curtain-panel, .power-panel'
        );

        allPanels.forEach(panel => panel.style.display = 'none');

        const selected = document.getElementById(roomId);
        if (selected) {
            if (
                selected.classList.contains('room-controls') ||
                selected.classList.contains('ventilation-controls') ||
                selected.classList.contains('aircon-controls')
            ) {
                selected.style.display = 'flex';
            } else {
                selected.style.display = 'block';
            }
        }
    }

    document.querySelectorAll('.room-tabs').forEach(tabGroup => {
        const tabs = tabGroup.querySelectorAll('.room-tab');

        if (tabs.length > 0) {
            tabs.forEach(t => t.classList.remove('active'));
            tabs[0].classList.add('active');
            showRoom(tabs[0].dataset.room);
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                showRoom(tab.dataset.room);
            });
        });
    });

    // ===============================
    // DEVICE CONTROL (Lights, Fan, TV, Socket, etc.)
    // ===============================
    const deviceCircles = document.querySelectorAll('.device-circle');

    deviceCircles.forEach(circle => {
        if (!circle) return;

        const type = circle.dataset.deviceType;

        if (type === "light") {
            circle.addEventListener("click", () => {
                circle.classList.toggle("active");
                const icon = circle.querySelector(".device-icon");
                if (icon) icon.classList.toggle("fa-lightbulb-on");
            });
        }

        if (type === "fan") {
            const dots = circle.querySelectorAll(".speed-dot");
            circle.addEventListener("click", () => circle.classList.toggle("fan-on"));

            dots.forEach(dot => {
                dot.addEventListener("click", e => {
                    e.stopPropagation();
                    const speed = parseInt(dot.dataset.speed);
                    circle.dataset.currentSpeed = speed;
                    dots.forEach(d => d.classList.remove("active"));
                    for (let i = 0; i < speed; i++) dots[i].classList.add("active");
                });
            });
        }

        if (type === "other" || type === "socket") {
            circle.addEventListener("click", () => circle.classList.toggle("active"));
        }
    });

    // ===========================
    // LIGHT CONTROL (FIXED)
    // ===========================
    const lightingContainer = document.getElementById('living-light');
    const lightPower = document.getElementById('living-light-power');
    const brightnessSlider = document.getElementById('living-brightness-slider');
    const brightnessValue = document.getElementById('living-brightness-value');
    const colorPicker = document.getElementById('living-color-picker');
    const bulbIcon = document.getElementById('living-bulb-icon');

    let lightOn = false;
    let brightness = 60;
    let bulbColor = '#ffff00';

    function updateBulb() {
        if (!bulbIcon || !lightingContainer) return;

        if (lightOn) {
            // 🔥 SAME LOGIC AS AIRCON
            lightingContainer.classList.add('lighting-on');

            bulbIcon.style.color = bulbColor;
            bulbIcon.style.opacity = 1;
            bulbIcon.style.textShadow = `0 0 ${brightness}px ${bulbColor}`;
        } else {
            lightingContainer.classList.remove('lighting-on');

            bulbIcon.style.color = '#555';
            bulbIcon.style.opacity = 0.3;
            bulbIcon.style.textShadow = 'none';
        }
    }

    // POWER BUTTON
    if (lightPower) {
        lightPower.addEventListener('change', function () {
            lightOn = this.checked;
            updateBulb();
        });
    }

    // BRIGHTNESS
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', function () {
            brightness = parseInt(this.value);
            if (brightnessValue) brightnessValue.textContent = brightness;
            updateBulb();
        });
    }

    // COLOR
    if (colorPicker) {
        colorPicker.addEventListener('input', function () {
            bulbColor = this.value;
            updateBulb();
        });
    }

    // INITIAL STATE
    updateBulb();
    // ===============================
    // VENTILATION CONTROL PAGE
    // ===============================
    const ventilationPage = pages.ventilation;
    if (ventilationPage) {
        const ventTabs = ventilationPage.querySelectorAll('.ventilation-room-tab');
        const ventControls = ventilationPage.querySelectorAll('.ventilation-controls');

        function showVentRoom(id) {
            ventControls.forEach(c => c.style.display = 'none');
            const selected = ventilationPage.querySelector('#' + id);
            if (selected) selected.style.display = 'flex';
        }

        if (ventTabs.length > 0) {
            const firstRoom = ventTabs[0].dataset.room;
            ventTabs[0].classList.add('active');
            showVentRoom(firstRoom);
        }

        ventTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                ventTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                showVentRoom(tab.dataset.room);
            });
        });
    }

    // ===============================
    // VENTILATION DIAL CONTROL
    // ===============================
    const ventDial = document.getElementById('ventDial');
    const ventDialValue = document.getElementById('ventDialValue');
    const targetTempSlider = document.getElementById('targetTemp');
    const ventPower = document.getElementById('vent-power');
    const ventStateSelect = document.getElementById('ventState');
    const dialTicks = document.getElementById('dialTicks');

    if (ventDial && ventDialValue && targetTempSlider && ventPower && ventStateSelect && dialTicks) {
        let ventValue = parseInt(targetTempSlider.value);
        let ventState = ventStateSelect.value;

        function createTicks() {
            const totalTicks = 30;
            const radius = 130;

            for (let i = 0; i < totalTicks; i++) {
                const angle = (i / totalTicks) * 270 - 135;
                const rad = angle * (Math.PI / 180);

                const x1 = 150 + Math.cos(rad) * (radius - 10);
                const y1 = 150 + Math.sin(rad) * (radius - 10);
                const x2 = 150 + Math.cos(rad) * radius;
                const y2 = 150 + Math.sin(rad) * radius;

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

                line.setAttribute("x1", x1);
                line.setAttribute("y1", y1);
                line.setAttribute("x2", x2);
                line.setAttribute("y2", y2);

                if (i % 5 === 0) {
                    line.setAttribute("stroke-width", "3");
                } else {
                    line.setAttribute("stroke-width", "1.5");
                }

                dialTicks.appendChild(line);
            }
        }

        function updateDial(value) {
            ventDialValue.innerText = value;

            const angle = ((value - 16) / (30 - 16)) * 270;
            ventDial.style.setProperty('--angle', angle + 'deg');

            ventDial.classList.remove('state-off', 'state-cooling', 'state-heating');

            if (ventState === 'off') {
                ventDial.classList.add('state-off');
            } else if (ventState === 'cooling') {
                ventDial.classList.add('state-cooling');
            } else if (ventState === 'heating') {
                ventDial.classList.add('state-heating');
            }

            const ticks = dialTicks.querySelectorAll('line');
            const threshold = (value - 16) / (30 - 16) * ticks.length;

            ticks.forEach((tick, i) => {
                tick.style.transition = 'all 0.2s ease';

                if (i < threshold) {
                    tick.style.stroke = ventState === 'heating' ? '#ff8c42' : '#6ce5ff';
                    tick.style.opacity = 1;
                } else {
                    tick.style.stroke = 'rgba(255,255,255,0.2)';
                    tick.style.opacity = 0.3;
                }
            });
        }

        createTicks();
        updateDial(ventValue);

        let isDragging = false;

        ventDial.addEventListener('mousedown', () => isDragging = true);
        document.addEventListener('mouseup', () => isDragging = false);

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;

            const rect = ventDial.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);

            let deg = Math.atan2(y, x) * (180 / Math.PI);
            deg = deg + 135;

            if (deg < 0) deg = 0;
            if (deg > 270) deg = 270;

            const value = Math.round(deg / 270 * 14 + 16);

            ventValue = value;
            targetTempSlider.value = value;

            updateDial(ventValue);
        });

        targetTempSlider.addEventListener('input', () => {
            ventValue = parseInt(targetTempSlider.value);
            updateDial(ventValue);
        });

        ventPower.addEventListener('change', () => {
            if (ventPower.checked) {
                if (ventStateSelect.value === 'off') {
                    ventStateSelect.value = 'cooling';
                }
            } else {
                ventStateSelect.value = 'off';
            }

            ventState = ventStateSelect.value;
            updateDial(ventValue);
        });

        ventStateSelect.addEventListener('change', () => {
            ventState = ventStateSelect.value;
            ventPower.checked = ventState !== 'off';
            updateDial(ventValue);
        });
    }

    // ===============================
    // AIRCON CONTROL PAGE JS
    // ===============================
    const acContainer = document.getElementById('living-aircon');

    if (acContainer) {
        const acPower = acContainer.querySelector('#ac-power');
        const tempUpBtn = acContainer.querySelector('#temp-up');
        const tempDownBtn = acContainer.querySelector('#temp-down');
        const tempValue = acContainer.querySelector('#temp-value');
        const tempDisplay = acContainer.querySelector('#temp-display');
        const acIcon = acContainer.querySelector('#ac-icon');

        let acOn = false;
        let temperature = 24;

        function updateTemperature() {
            if (tempValue) tempValue.textContent = temperature;
            if (tempDisplay) tempDisplay.textContent = `${temperature}°C`;
        }

        function updateAC() {
            if (!acIcon) return;

            if (acOn) {
                acContainer.classList.add('aircon-on');
                acIcon.style.animation = 'ac-cooling 2s ease-in-out infinite';
                acIcon.style.opacity = 1;
            } else {
                acContainer.classList.remove('aircon-on');
                acIcon.style.animation = 'none';
                acIcon.style.opacity = 0.3;
            }
        }

        if (acPower) {
            acPower.addEventListener('change', function () {
                acOn = this.checked;
                updateAC();
                if (typeof updateCardStatus === "function") {
                    updateCardStatus('ac', acOn);
                }
            });
        }

        if (tempUpBtn) {
            tempUpBtn.addEventListener('click', function () {
                if (temperature < 30) {
                    temperature++;
                    updateTemperature();
                }
            });
        }

        if (tempDownBtn) {
            tempDownBtn.addEventListener('click', function () {
                if (temperature > 16) {
                    temperature--;
                    updateTemperature();
                }
            });
        }
    }

    // ===============================
    // POWER TAB SWITCHING
    // ===============================
    const powerTabs = document.querySelectorAll(".power-room-tabs .room-tab");
    const powerPanels = document.querySelectorAll(".power-panel");

    powerTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const room = tab.getAttribute("data-room");

            powerTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            powerPanels.forEach(panel => {
                panel.classList.remove("active");
                if (panel.id === room) {
                    panel.classList.add("active");
                }
            });
        });
    });

    // ===============================
    // CONTROLS PAGE - ADD CONTROL MODAL
    // ===============================
    const openAddControlModalBtn = document.getElementById("openAddControlModal");
    const addControlModal = document.getElementById("addControlModal");
    const closeAddControlModalBtn = document.getElementById("closeAddControlModal");
    const cancelAddControlModalBtn = document.getElementById("cancelAddControlModal");
    const confirmAddControlModalBtn = document.getElementById("confirmAddControlModal");
    const controlsDropZone = document.getElementById("controlsDropZone");

    const controlDeviceSelect = document.getElementById("controlDeviceSelect");
    const controlBooleanColumn = document.getElementById("controlBooleanColumn");
    const controlButtonLabel = document.getElementById("controlButtonLabel");
    const graphicalAssetCards = document.querySelectorAll(".graphical-asset-card");

    let selectedAsset = "toggle-light";

    function openAddControlModal() {
        if (addControlModal) {
            addControlModal.style.display = "block";
        }
    }

    function closeAddControlModal() {
        if (addControlModal) {
            addControlModal.style.display = "none";
        }
    }

    if (openAddControlModalBtn) {
        openAddControlModalBtn.addEventListener("click", openAddControlModal);
    }

    if (closeAddControlModalBtn) {
        closeAddControlModalBtn.addEventListener("click", closeAddControlModal);
    }

    if (cancelAddControlModalBtn) {
        cancelAddControlModalBtn.addEventListener("click", closeAddControlModal);
    }

    if (addControlModal) {
        addControlModal.addEventListener("click", (e) => {
            if (e.target === addControlModal) {
                closeAddControlModal();
            }
        });
    }

    graphicalAssetCards.forEach(card => {
        card.addEventListener("click", () => {
            graphicalAssetCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            selectedAsset = card.dataset.asset || "toggle-light";
        });
    });

    if (controlDeviceSelect && controlButtonLabel) {
        controlDeviceSelect.addEventListener("change", () => {
            const selectedText = controlDeviceSelect.options[controlDeviceSelect.selectedIndex].text;
            const cleanLabel = selectedText.split("(")[0].trim();
            controlButtonLabel.value = cleanLabel;
        });
    }

    if (confirmAddControlModalBtn) {
        confirmAddControlModalBtn.addEventListener("click", () => {
            if (!controlsDropZone || !controlDeviceSelect || !controlBooleanColumn || !controlButtonLabel) return;

            const booleanText = controlBooleanColumn.value;
            const buttonLabel = controlButtonLabel.value.trim() || "New Control";

            const controlCard = document.createElement("div");
            controlCard.className = "added-control-card";

            let iconClass = "fa-lightbulb";
            if (selectedAsset === "toggle-light") {
                iconClass = "fa-lightbulb";
            }

            controlCard.innerHTML = `
                <div class="added-control-icon">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
                <div class="added-control-info">
                    <h4>${buttonLabel}</h4>
                    <p>${booleanText}</p>
                </div>
                <button class="toggle">OFF</button>
            `;

            controlsDropZone.appendChild(controlCard);

            const newToggle = controlCard.querySelector(".toggle");
            if (newToggle) {
                newToggle.style.background = "#ef4444";
                newToggle.style.color = "white";

                newToggle.addEventListener("click", () => {
                    if (newToggle.innerText.trim() === "OFF") {
                        newToggle.innerText = "ON";
                        newToggle.style.background = "#22c55e";
                    } else {
                        newToggle.innerText = "OFF";
                        newToggle.style.background = "#ef4444";
                    }
                });
            }

            closeAddControlModal();
        });
    }

    // ===============================
    // READINGS PAGE - AIR QUALITY CHART
    // ===============================
    const updateReadingsChartBtn = document.getElementById("updateReadingsChartBtn");
    const xAxisColumn = document.getElementById("xAxisColumn");
    const yAxisColumns = document.getElementById("yAxisColumns");
    const airQualityCanvas = document.getElementById("airQualityChart");

    let airQualityChartInstance = null;

    const airQualityData = [
        { co: 0.0, co2: 499.320, humidity: 54.2, tvoc: 0.22, pm10: 9.1 },
        { co: 0.1, co2: 499.990, humidity: 54.8, tvoc: 0.25, pm10: 8.9 },
        { co: 0.3, co2: 499.870, humidity: 55.1, tvoc: 0.28, pm10: 8.7 },
        { co: 0.4, co2: 499.710, humidity: 55.4, tvoc: 0.30, pm10: 8.5 },
        { co: 0.6, co2: 499.720, humidity: 55.6, tvoc: 0.32, pm10: 8.2 },
        { co: 0.7, co2: 499.680, humidity: 55.9, tvoc: 0.35, pm10: 8.0 },
        { co: 0.8, co2: 499.830, humidity: 56.1, tvoc: 0.37, pm10: 7.8 },
        { co: 1.0, co2: 499.750, humidity: 56.5, tvoc: 0.40, pm10: 7.6 },
        { co: 1.1, co2: 499.860, humidity: 56.8, tvoc: 0.42, pm10: 7.5 },
        { co: 1.2, co2: 499.990, humidity: 57.0, tvoc: 0.45, pm10: 7.3 },
        { co: 1.4, co2: 499.890, humidity: 57.2, tvoc: 0.48, pm10: 7.1 },
        { co: 1.5, co2: 499.960, humidity: 57.5, tvoc: 0.50, pm10: 7.0 },
        { co: 1.7, co2: 499.820, humidity: 57.8, tvoc: 0.52, pm10: 6.9 },
        { co: 1.8, co2: 499.950, humidity: 58.0, tvoc: 0.55, pm10: 6.8 },
        { co: 1.9, co2: 499.630, humidity: 58.2, tvoc: 0.58, pm10: 6.7 },
        { co: 2.1, co2: 499.860, humidity: 58.5, tvoc: 0.60, pm10: 6.6 },
        { co: 2.2, co2: 499.990, humidity: 58.7, tvoc: 0.63, pm10: 6.5 },
        { co: 2.3, co2: 499.960, humidity: 59.0, tvoc: 0.65, pm10: 6.4 },
        { co: 2.5, co2: 499.960, humidity: 59.2, tvoc: 0.68, pm10: 6.3 },
        { co: 2.6, co2: 499.650, humidity: 59.4, tvoc: 0.70, pm10: 6.2 },
        { co: 2.8, co2: 499.600, humidity: 59.7, tvoc: 0.72, pm10: 6.1 },
        { co: 2.9, co2: 499.980, humidity: 59.9, tvoc: 0.75, pm10: 6.0 },
        { co: 3.0, co2: 499.830, humidity: 60.1, tvoc: 0.78, pm10: 5.9 },
        { co: 3.2, co2: 499.810, humidity: 60.4, tvoc: 0.80, pm10: 5.8 },
        { co: 3.3, co2: 499.790, humidity: 60.7, tvoc: 0.83, pm10: 5.7 },
        { co: 3.5, co2: 499.950, humidity: 61.0, tvoc: 0.85, pm10: 5.6 },
        { co: 3.6, co2: 499.740, humidity: 61.3, tvoc: 0.88, pm10: 5.5 },
        { co: 3.7, co2: 499.950, humidity: 61.5, tvoc: 0.90, pm10: 5.4 },
        { co: 3.9, co2: 499.620, humidity: 61.8, tvoc: 0.92, pm10: 5.3 },
        { co: 4.0, co2: 499.920, humidity: 62.0, tvoc: 0.95, pm10: 5.2 },
        { co: 4.1, co2: 499.810, humidity: 62.3, tvoc: 0.98, pm10: 5.1 },
        { co: 4.3, co2: 499.990, humidity: 62.5, tvoc: 1.00, pm10: 5.0 },
        { co: 4.4, co2: 499.950, humidity: 62.7, tvoc: 1.03, pm10: 4.9 },
        { co: 4.6, co2: 499.380, humidity: 63.0, tvoc: 1.05, pm10: 4.8 },
        { co: 4.7, co2: 499.770, humidity: 63.2, tvoc: 1.08, pm10: 4.7 },
        { co: 4.8, co2: 499.800, humidity: 63.5, tvoc: 1.10, pm10: 4.6 },
        { co: 5.0, co2: 498.160, humidity: 63.8, tvoc: 1.12, pm10: 4.5 }
    ];

    const readingsColumnMap = {
        "Carbon Monoxide (CO)": {
            key: "co",
            label: "CO",
            borderColor: "#f59e0b",
            backgroundColor: "#f59e0b"
        },
        "Carbon Dioxide (CO2)": {
            key: "co2",
            label: "CO2",
            borderColor: "#2563eb",
            backgroundColor: "#2563eb"
        },
        "Humidity": {
            key: "humidity",
            label: "Humidity",
            borderColor: "#10b981",
            backgroundColor: "#10b981"
        },
        "Total VOCs": {
            key: "tvoc",
            label: "TVOCs",
            borderColor: "#8b5cf6",
            backgroundColor: "#8b5cf6"
        },
        "PM10 (Large Dust)": {
            key: "pm10",
            label: "PM10",
            borderColor: "#ef4444",
            backgroundColor: "#ef4444"
        }
    };

    function getSelectedReadingsYColumns() {
        if (!yAxisColumns) return [];
        return Array.from(yAxisColumns.selectedOptions).map(option => option.value);
    }

    function buildReadingsChart() {
        if (!airQualityCanvas || typeof Chart === "undefined") return;

        const selectedX = xAxisColumn ? xAxisColumn.value : "Carbon Monoxide (CO)";
        let selectedY = getSelectedReadingsYColumns();

        if (selectedY.length === 0) {
            selectedY = ["Carbon Dioxide (CO2)"];
        }

        const xConfig = readingsColumnMap[selectedX];
        const datasets = selectedY.map(columnName => {
            const config = readingsColumnMap[columnName];

            return {
                label: config.label,
                data: airQualityData.map(item => ({
                    x: item[xConfig.key],
                    y: item[config.key]
                })),
                showLine: false,
                pointRadius: 6,
                pointHoverRadius: 7,
                borderWidth: 0,
                borderColor: config.borderColor,
                backgroundColor: config.backgroundColor
            };
        });

        if (airQualityChartInstance) {
            airQualityChartInstance.destroy();
        }

        airQualityChartInstance = new Chart(airQualityCanvas, {
            type: "scatter",
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: selectedY.length > 1
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const xLabel = xConfig.label;
                                const yLabel = context.dataset.label;
                                const xValue = context.raw.x;
                                const yValue = context.raw.y;
                                return `${xLabel}: ${xValue} | ${yLabel}: ${yValue}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: "linear",
                        title: {
                            display: true,
                            text: xConfig.label
                        },
                        grid: {
                            color: "rgba(0,0,0,0.08)"
                        },
                        ticks: {
                            color: "#6b7280"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: selectedY.length === 1
                                ? readingsColumnMap[selectedY[0]].label
                                : "Selected Values"
                        },
                        grid: {
                            color: "rgba(0,0,0,0.08)"
                        },
                        ticks: {
                            color: "#6b7280"
                        }
                    }
                }
            }
        });
    }

    if (updateReadingsChartBtn) {
        updateReadingsChartBtn.addEventListener("click", buildReadingsChart);
    }

    if (airQualityCanvas) {
        buildReadingsChart();
    }

    // ===============================
    // DARK / LIGHT MODE SWITCH
    // ===============================
    const switchMode = document.getElementById('switch-mode');
    if (switchMode) {
        if (localStorage.getItem("theme") === "light") {
            document.body.classList.add("light-mode");
            switchMode.checked = true;
        }
        switchMode.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem("theme", "light");
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem("theme", "dark");
            }
        });
    }

    // ===============================
    // PROFILE MENU TOGGLE
    // ===============================
    const profileIcon = document.getElementById('profileIcon');
    const profileMenu = document.getElementById('profileMenu');

    // ===============================
    // NOTIFICATION MENU TOGGLE
    // ===============================
    const notifIcon = document.getElementById("notificationIcon");
    const notifMenu = document.getElementById("notificationMenu");

    if (profileIcon && profileMenu) {
        profileIcon.addEventListener('click', e => {
            e.preventDefault();
            profileMenu.classList.toggle('show');
            if (notifMenu) notifMenu.classList.remove('show');
        });
    }

    if (notifIcon && notifMenu) {
        notifIcon.addEventListener("click", e => {
            e.preventDefault();
            notifMenu.classList.toggle("show");
            if (profileMenu) profileMenu.classList.remove('show');
        });
    }

    window.addEventListener('click', e => {
        if (!e.target.closest('.profile') && !e.target.closest('.profile-menu') && profileMenu) {
            profileMenu.classList.remove('show');
        }
        if (!e.target.closest('.notification') && !e.target.closest('.notification-menu') && notifMenu) {
            notifMenu.classList.remove('show');
        }
    });

});
