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
        water: document.getElementById("water"),
        energy: document.getElementById("energy"),
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
    // AIRCON CONTROL PAGE JS
    // ===============================
    const airconPage = document.getElementById('aircon');
    if (airconPage) {
        const airconTabs = airconPage.querySelectorAll('.aircon-room-tabs .room-tab');
        const airconControls = airconPage.querySelectorAll('.aircon-controls');

        // Function to show selected room
        function showAirconRoom(roomId) {
            airconControls.forEach(control => control.style.display = 'none');
            const selected = document.getElementById(roomId);
            if (selected) selected.style.display = 'flex';
        }

        // Initialize first tab
        if (airconTabs.length > 0) {
            const firstRoomId = airconTabs[0].dataset.room;
            airconTabs[0].classList.add('active');
            showAirconRoom(firstRoomId);
        }

        // Tab click event
        airconTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                airconTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                showAirconRoom(tab.dataset.room);
            });
        });

        // AC power buttons
        const acButtons = airconPage.querySelectorAll('.ac-power-btn');
        acButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.innerText === 'OFF') {
                    btn.innerText = 'ON';
                    btn.style.background = '#22c55e';
                    btn.style.color = 'white';
                } else {
                    btn.innerText = 'OFF';
                    btn.style.background = '#ef4444';
                    btn.style.color = 'white';
                }
            });
        });

        // Temperature sliders
        const tempSliders = airconPage.querySelectorAll('.ac-temp-slider');
        tempSliders.forEach(slider => {
            slider.addEventListener('input', () => {
                const valueLabel = slider.previousElementSibling.querySelector('.ac-temp-value');
                if (valueLabel) valueLabel.innerText = slider.value + '°C';
            });
        });

        // Mode selector (optional: just for display)
        const modeSelects = airconPage.querySelectorAll('.ac-mode-select');
        modeSelects.forEach(select => {
            select.addEventListener('change', () => {
                // You can handle mode change logic here if needed
                console.log(`AC mode set to: ${select.value}`);
            });
        });
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
