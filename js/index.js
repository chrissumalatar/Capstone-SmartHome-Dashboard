document.addEventListener("DOMContentLoaded", () => {

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

    // Map of page IDs to their elements
    const pages = {
        dashboard: document.getElementById("dashboard"),
        rooms: document.getElementById("rooms"),
        lighting: document.getElementById("lighting"),
        ventilation: document.getElementById("ventilation"),
        aircon: document.getElementById("aircon"),
        sensor: document.getElementById("sensor"),
        curtain: document.getElementById("curtain"),
        power: document.getElementById("power"),
        settings: document.getElementById("settings")
    };

    // Add click event to all nav links
    navLinks.forEach(link => {
        link.addEventListener("click", () => {

            // Remove 'active' class from all links and add to clicked link
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Hide all pages
            Object.values(pages).forEach(p => { if (p) p.style.display = "none"; });

            // Show clicked page
            const pageName = link.dataset.page;
            const currentPage = pages[pageName];
            if (currentPage) currentPage.style.display = "block";

            // If the page has tabs, click the first tab automatically
            if (currentPage) {
                const firstTab = currentPage.querySelector(".room-tab");
                if (firstTab) firstTab.click();
            }
        });
    });

    // ===============================
    // ROOM TABS
    // ===============================
    const roomTabs = document.querySelectorAll('.room-tab');
    const roomControls = document.querySelectorAll('.room-controls');

    function showRoom(roomId) {
        roomControls.forEach(room => room.style.display = 'none');
        const selectedRoom = document.getElementById(roomId);
        if (selectedRoom) selectedRoom.style.display = 'flex';
    }

    if (roomTabs.length > 0) {
        const firstRoom = roomTabs[0].dataset.room;
        roomTabs[0].classList.add('active');
        showRoom(firstRoom);
    }

    roomTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            roomTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showRoom(tab.dataset.room);
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
    // LIGHT CONTROL
    // ===========================
    const lightPower = document.getElementById('light-power');
    const brightnessSlider = document.getElementById('brightness-slider');
    const brightnessValue = document.getElementById('brightness-value');
    const colorPicker = document.getElementById('color-picker');
    const bulbIcon = document.getElementById('bulb-icon');

    // Initialize light state
    let lightOn = false;          // OFF by default
    let brightness = 50;          // default brightness
    let bulbColor = '#ffffff';    // default color

    // Update bulb function
    function updateBulb() {
        if (lightOn) {
            bulbIcon.style.color = bulbColor;
            bulbIcon.style.opacity = brightness / 100;
            bulbIcon.style.textShadow = `0 0 ${brightness / 5}px ${bulbColor}`;
        } else {
            bulbIcon.style.color = '#555';   // OFF color
            bulbIcon.style.opacity = 0.3;    // dimmed
            bulbIcon.style.textShadow = 'none';
        }
    }

    // Event listeners
    lightPower.addEventListener('change', function() {
        lightOn = this.checked;
        updateBulb();
        updateCardStatus('light', lightOn);
    });

    brightnessSlider.addEventListener('input', function() {
        brightness = this.value;
        brightnessValue.textContent = brightness;
        updateBulb();
    });

    colorPicker.addEventListener('input', function() {
        bulbColor = this.value;
        updateBulb();
    });
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

    // Get elements
    const ventDial = document.getElementById('ventDial');
    const ventDialValue = document.getElementById('ventDialValue');
    const targetTempSlider = document.getElementById('targetTemp');
    const ventPower = document.getElementById('vent-power');
    const ventStateSelect = document.getElementById('ventState');
    const dialTicks = document.getElementById('dialTicks');

    // State
    let ventValue = parseInt(targetTempSlider.value);
    let ventState = ventStateSelect.value;

    // ===============================
    // CREATE TICKS (RUN ONCE)
    // ===============================
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

            // Bigger tick every 5
            if (i % 5 === 0) {
                line.setAttribute("stroke-width", "3");
            } else {
                line.setAttribute("stroke-width", "1.5");
            }

            dialTicks.appendChild(line);
        }
    }

    // Run once
    createTicks();

    // ===============================
    // UPDATE DIAL
    // ===============================
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

        // ===============================
        // TICK HIGHLIGHTING
        // ===============================
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

    // Initialize
    updateDial(ventValue);

    // ===============================
    // DRAG CONTROL
    // ===============================
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

    // ===============================
    // SLIDER SYNC
    // ===============================
    targetTempSlider.addEventListener('input', () => {
        ventValue = parseInt(targetTempSlider.value);
        updateDial(ventValue);
    });

    // ===============================
    // POWER SWITCH
    // ===============================
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

    // ===============================
    // STATE CHANGE
    // ===============================
    ventStateSelect.addEventListener('change', () => {
        ventState = ventStateSelect.value;

        // Sync toggle
        ventPower.checked = ventState !== 'off';

        updateDial(ventValue);
    });
    // ===============================
    // AIRCON CONTROL PAGE JS
    // ===============================
    const acContainer = document.getElementById('living-aircon');

    const acPower = acContainer.querySelector('#ac-power');
    const tempUpBtn = acContainer.querySelector('#temp-up');
    const tempDownBtn = acContainer.querySelector('#temp-down');
    const tempValue = acContainer.querySelector('#temp-value');
    const tempDisplay = acContainer.querySelector('#temp-display');
    const acIcon = acContainer.querySelector('#ac-icon');

    // Initialize AC state
    let acOn = false;
    let temperature = 24;

    acPower.addEventListener('change', function () {
        acOn = this.checked;
        updateAC();
        updateCardStatus('ac', acOn);
    });

    tempUpBtn.addEventListener('click', function () {
        if (temperature < 30) {
            temperature++;
            updateTemperature();
        }
    });

    tempDownBtn.addEventListener('click', function () {
        if (temperature > 16) {
            temperature--;
            updateTemperature();
        }
    });

    function updateTemperature() {
        tempValue.textContent = temperature;
        tempDisplay.textContent = `${temperature}°C`;
    }

    function updateAC() {
        if (acOn) {
            acContainer.classList.add('aircon-on'); // ✅ ADD THIS

            acIcon.style.animation = 'ac-cooling 2s ease-in-out infinite';
            acIcon.style.opacity = 1;
        } else {
            acContainer.classList.remove('aircon-on'); // ✅ AND THIS

            acIcon.style.animation = 'none';
            acIcon.style.opacity = 0.3;
        }
    }
    // POWER TAB SWITCHING
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

    if (profileIcon && profileMenu) {
        profileIcon.addEventListener('click', e => {
            e.preventDefault();
            profileMenu.classList.toggle('show');
            if (notifMenu) notifMenu.classList.remove('show');
        });
    }

    // ===============================
    // NOTIFICATION MENU TOGGLE
    // ===============================
    const notifIcon = document.getElementById("notificationIcon");
    const notifMenu = document.getElementById("notificationMenu");

    if (notifIcon && notifMenu) {
        notifIcon.addEventListener("click", e => {
            e.preventDefault();
            notifMenu.classList.toggle("show");
            if (profileMenu) profileMenu.classList.remove('show');
        });
    }

    // Close menus if clicked outside
    window.addEventListener('click', e => {
        if (!e.target.closest('.profile') && !e.target.closest('.profile-menu') && profileMenu) {
            profileMenu.classList.remove('show');
        }
        if (!e.target.closest('.notification') && !e.target.closest('.notification-menu') && notifMenu) {
            notifMenu.classList.remove('show');
        }
    });

});
// ===============================
// UNIVERSAL ROOM TAB SYSTEM
// ===============================
const roomTabs = document.querySelectorAll('.room-tab');

function showRoom(roomId) {
    // hide EVERYTHING that could be a panel
    const allPanels = document.querySelectorAll(
        '.room-controls, .lighting-controls, .light-control-container, .ventilation-controls, .aircon-controls, .sensor-panel, .curtain-panel, .power-panel'
    );

    allPanels.forEach(panel => panel.style.display = 'none');

    // show selected
    const selected = document.getElementById(roomId);
    if (selected) {
        // detect correct display type
        if (selected.classList.contains('room-controls') ||
            selected.classList.contains('ventilation-controls') ||
            selected.classList.contains('aircon-controls')) {
            selected.style.display = 'flex';
        } else {
            selected.style.display = 'block';
        }
    }
}

// activate default tab per page
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
