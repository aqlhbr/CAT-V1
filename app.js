
        // Database State (In-Memory mock database)
        let state = {
            users: [
                {
                    nama: "Admin Al Faiz",
                    email: "admin@alfaiz.com",
                    hp: "081234567890",
                    password: "admin123",
                    gender: "Laki-laki",
                    dob: "1995-04-12",
                    source: "Founder",
                    isAdmin: true
                },
                {
                    nama: "Andi Saputra",
                    email: "andi@gmail.com",
                    hp: "081122334455",
                    password: "user123",
                    gender: "Laki-laki",
                    dob: "2000-08-19",
                    source: "YouTube",
                    isAdmin: false
                }
            ],
            currentUser: null,
            activeTab: 'dashboard',
            cart: [],
            purchasedPackages: [],
            packageSettings: {
                tryout: { title: "Tryout SKD CPNS Premium", price: 49000 },
                latihan: { title: "Kumpulan Latihan Soal Premium", price: 29000 },
                materi: { title: "E-Book Materi Master SKD", price: 39000 }
            }
        };

        let dbTryoutExam = [];

        window.onload = function() {
            generateTryoutQuestions();
            updateAuthHeader();
            renderDashboard();
            switchTab('dashboard');
        };

        function showNotification(message, success = true) {
            const toast = document.getElementById('notification-toast');
            const msgText = document.getElementById('notif-message');
            const icon = document.getElementById('notif-icon');

            msgText.innerText = message;
            if (success) {
                icon.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-400 text-lg"></i>';
            } else {
                icon.innerHTML = '<i class="fa-solid fa-circle-exclamation text-rose-500 text-lg"></i>';
            }

            toast.classList.remove('translate-y-20', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');

            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
                toast.classList.remove('translate-y-0', 'opacity-100');
            }, 3500);
        }

        function generateTryoutQuestions() {
            let list = [];
            // Generate mock CAT questions (30 TWK, 35 TIU, 45 TKP)
            for (let i = 1; i <= 30; i++) {
                let base = dbLatihanSoal.TWK[(i - 1) % dbLatihanSoal.TWK.length];
                list.push({ id: i, type: "TWK", text: `[TWK Soal ${i}] ${base.text}`, a: base.a, b: base.b, c: base.c, d: base.d, e: base.e, correct: base.correct });
            }
            for (let i = 1; i <= 35; i++) {
                let base = dbLatihanSoal.TIU[(i - 1) % dbLatihanSoal.TIU.length];
                list.push({ id: 30 + i, type: "TIU", text: `[TIU Soal ${i}] ${base.text}`, a: base.a, b: base.b, c: base.c, d: base.d, e: base.e, correct: base.correct });
            }
            for (let i = 1; i <= 45; i++) {
                let base = dbLatihanSoal.TKP[(i - 1) % dbLatihanSoal.TKP.length];
                list.push({ id: 65 + i, type: "TKP", text: `[TKP Soal ${i}] ${base.text}`, a: base.a, b: base.b, c: base.c, d: base.d, e: base.e, correct: base.correct });
            }
            dbTryoutExam = list;
        }

        function toggleAuthMode(mode) {
            const btnLogin = document.getElementById('btn-tab-login');
            const btnReg = document.getElementById('btn-tab-register');
            const cardLogin = document.getElementById('card-login');
            const cardReg = document.getElementById('card-register');

            if (mode === 'login') {
                btnLogin.className = "flex-1 py-2.5 text-sm font-semibold rounded-lg text-slate-900 bg-white shadow-sm transition-all";
                btnReg.className = "flex-1 py-2.5 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 transition-all";
                cardLogin.classList.remove('hidden');
                cardReg.classList.add('hidden');
            } else {
                btnReg.className = "flex-1 py-2.5 text-sm font-semibold rounded-lg text-slate-900 bg-white shadow-sm transition-all";
                btnLogin.className = "flex-1 py-2.5 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 transition-all";
                cardReg.classList.remove('hidden');
                cardLogin.classList.add('hidden');
            }
        }

        function updateAuthHeader() {
            const headerArea = document.getElementById('auth-header-area');
            const desktopNav = document.getElementById('desktop-nav');
            const mobileDrawer = document.getElementById('mobile-drawer');

            if (state.currentUser) {
                headerArea.innerHTML = `
                    <div class="flex items-center space-x-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                            ${state.currentUser.nama.charAt(0).toUpperCase()}
                        </div>
                        <div class="hidden lg:block text-left">
                            <span class="text-xs font-bold text-slate-900 block leading-none">${state.currentUser.nama}</span>
                        </div>
                        <button onclick="logoutUser()" class="text-slate-400 hover:text-red-500 p-1"><i class="fa-solid fa-power-off"></i></button>
                    </div>
                `;

                let links = `
                    <button onclick="switchTab('dashboard')" class="nav-item px-3 py-2 text-sm font-semibold rounded-lg ${state.activeTab === 'dashboard' ? 'text-amber-600 bg-amber-50' : 'text-slate-600'}">Dashboard</button>
                    <button onclick="switchTab('latihan')" class="nav-item px-3 py-2 text-sm font-semibold rounded-lg ${state.activeTab === 'latihan' ? 'text-amber-600 bg-amber-50' : 'text-slate-600'}">Latihan Soal</button>
                    <button onclick="switchTab('materi')" class="nav-item px-3 py-2 text-sm font-semibold rounded-lg ${state.activeTab === 'materi' ? 'text-amber-600 bg-amber-50' : 'text-slate-600'}">Modul Materi</button>
                    <button onclick="switchTab('tryout')" class="nav-item px-3 py-2 text-sm font-semibold rounded-lg ${state.activeTab === 'tryout' ? 'text-amber-600 bg-amber-50' : 'text-slate-600'}">CAT Tryout</button>
                    <button onclick="switchTab('paket-saya')" class="nav-item px-3 py-2 text-sm font-semibold rounded-lg ${state.activeTab === 'paket-saya' ? 'text-amber-600 bg-amber-50' : 'text-slate-600'}">Paket Saya</button>
                `;

                if (state.currentUser.isAdmin) {
                    links += `<button onclick="switchTab('admin')" class="nav-item px-3 py-2 text-sm font-bold text-slate-900 bg-amber-100 rounded-lg">Panel Admin</button>`;
                }
                desktopNav.innerHTML = links;
            } else {
                headerArea.innerHTML = `<button onclick="switchTab('auth')" class="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">Masuk / Daftar</button>`;
                desktopNav.innerHTML = `<button onclick="switchTab('dashboard')" class="px-3 py-2 text-sm font-semibold text-slate-600">Dashboard</button>`;
            }
        }

        function switchTab(tabId) {
            if (tabId !== 'dashboard' && tabId !== 'auth' && !state.currentUser) {
                showNotification("Silakan masuk atau daftar akun terlebih dahulu!", false);
                switchTab('auth');
                return;
            }

            document.getElementById('mobile-drawer').classList.add('hidden');
            state.activeTab = tabId;

            ['auth', 'dashboard', 'latihan', 'materi', 'tryout', 'keranjang', 'paket-saya', 'admin'].forEach(tab => {
                const el = document.getElementById(`page-${tab}`);
                if (el) el.classList.add('hidden');
            });

            const target = document.getElementById(`page-${tabId}`);
            if (target) target.classList.remove('hidden');

            updateAuthHeader();

            if (tabId === 'latihan') renderLatihanDashboard();
            else if (tabId === 'materi') renderMateriDashboard();
            else if (tabId === 'tryout') renderTryoutDashboard();
            else if (tabId === 'keranjang') renderCart();
            else if (tabId === 'paket-saya') renderMyPackages();
            else if (tabId === 'admin') renderAdminPanel();
            else if (tabId === 'dashboard') renderDashboard();
        }

        // Auth Logic
        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-password').value;
            const user = state.users.find(u => u.email === email && u.password === pass);

            if (user) {
                state.currentUser = user;
                showNotification(`Selamat datang kembali, ${user.nama}!`);
                if (user.isAdmin) switchTab('admin');
                else switchTab('dashboard');
            } else {
                showNotification("Email atau password salah!", false);
            }
        }

        function handleRegister(e) {
            e.preventDefault();
            const nama = document.getElementById('reg-nama').value;
            const email = document.getElementById('reg-email').value;
            const hp = document.getElementById('reg-hp').value;
            const password = document.getElementById('reg-password').value;
            const gender = document.getElementById('reg-gender').value;
            const dob = document.getElementById('reg-dob').value;
            const source = document.getElementById('reg-source').value;

            if (state.users.some(u => u.email === email)) {
                showNotification("Email sudah terdaftar!", false);
                return;
            }

            const newUser = { nama, email, hp, password, gender, dob, source, isAdmin: false };
            state.users.push(newUser);
            state.currentUser = newUser;
            showNotification("Pendaftaran berhasil!");
            switchTab('dashboard');
        }

        function logoutUser() {
            state.currentUser = null;
            state.cart = [];
            state.purchasedPackages = [];
            showNotification("Anda telah keluar.");
            switchTab('dashboard');
        }

        function showResetPasswordModal() { document.getElementById('modal-reset-password').classList.remove('hidden'); }
        function closeResetPasswordModal() { document.getElementById('modal-reset-password').classList.add('hidden'); }
        function handleResetPassword() {
            const email = document.getElementById('reset-email').value;
            showNotification(`Tautan reset password dikirim ke ${email}`);
            closeResetPasswordModal();
        }

        function renderDashboard() {
            document.getElementById('dash-to-title').innerText = state.packageSettings.tryout.title + " (110 Soal)";
            document.getElementById('dash-to-price').innerText = `Rp ${state.packageSettings.tryout.price.toLocaleString('id-ID')}`;
            document.getElementById('dash-latihan-title').innerText = state.packageSettings.latihan.title;
            document.getElementById('dash-latihan-price').innerText = `Rp ${state.packageSettings.latihan.price.toLocaleString('id-ID')}`;
            document.getElementById('dash-materi-title').innerText = state.packageSettings.materi.title;
            document.getElementById('dash-materi-price').innerText = `Rp ${state.packageSettings.materi.price.toLocaleString('id-ID')}`;
        }

        // Latihan Soal Engine
        let activeLatihanSubtest = '';
        let currentLatihanIndex = 0;
        let activeLatihanQuestions = [];
        let userLatihanAnswers = {};

        function renderLatihanDashboard() {
            const hasLatihan = state.purchasedPackages.includes('latihan');
            const lockedScreen = document.getElementById('latihan-locked-screen');
            const activeScreen = document.getElementById('latihan-active-screen');
            if (hasLatihan || (state.currentUser && state.currentUser.isAdmin)) {
                lockedScreen.classList.add('hidden');
                activeScreen.classList.remove('hidden');
            } else {
                lockedScreen.classList.remove('hidden');
                activeScreen.classList.add('hidden');
            }
        }

        function startLatihanSubtest(subtest) {
            activeLatihanSubtest = subtest;
            activeLatihanQuestions = dbLatihanSoal[subtest];
            currentLatihanIndex = 0;
            userLatihanAnswers = {};
            document.getElementById('latihan-active-screen').classList.add('hidden');
            document.getElementById('latihan-interface-container').classList.remove('hidden');
            document.getElementById('latihan-title-active').innerText = `Latihan Mandiri: Subtest ${subtest}`;
            document.getElementById('latihan-total-num').innerText = activeLatihanQuestions.length;
            renderLatihanQuestion();
        }

        function renderLatihanQuestion() {
            const q = activeLatihanQuestions[currentLatihanIndex];
            document.getElementById('latihan-curr-num').innerText = currentLatihanIndex + 1;
            document.getElementById('latihan-soal-text').innerText = q.text;

            const optList = document.getElementById('latihan-options-list');
            optList.innerHTML = '';

            ['a', 'b', 'c', 'd', 'e'].forEach(key => {
                const isSelected = userLatihanAnswers[currentLatihanIndex] === key;
                const optBtn = document.createElement('button');
                optBtn.className = `w-full text-left p-3 rounded-xl border text-sm font-semibold transition-all flex items-center space-x-3 ${isSelected ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200'}`;
                optBtn.onclick = () => { userLatihanAnswers[currentLatihanIndex] = key; renderLatihanQuestion(); };
                optBtn.innerHTML = `<span class="w-6 h-6 flex items-center justify-center rounded-lg ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100'} uppercase font-bold text-xs">${key}</span><span>${q[key]}</span>`;
                optList.appendChild(optBtn);
            });

            document.getElementById('latihan-btn-prev').disabled = currentLatihanIndex === 0;
            if (currentLatihanIndex === activeLatihanQuestions.length - 1) {
                document.getElementById('latihan-btn-next').classList.add('hidden');
                document.getElementById('latihan-btn-finish').classList.remove('hidden');
            } else {
                document.getElementById('latihan-btn-next').classList.remove('hidden');
                document.getElementById('latihan-btn-finish').classList.add('hidden');
            }
        }

        function navigateLatihan(dir) {
            currentLatihanIndex += dir;
            renderLatihanQuestion();
        }

        function finishLatihanSession() {
            let correctCount = 0;
            activeLatihanQuestions.forEach((q, idx) => { if (userLatihanAnswers[idx] === q.correct) correctCount++; });
            document.getElementById('latihan-interface-container').classList.add('hidden');
            document.getElementById('latihan-result-container').classList.remove('hidden');
            document.getElementById('latihan-score-val').innerText = `${correctCount} / ${activeLatihanQuestions.length}`;
            document.getElementById('latihan-accuracy-val').innerText = `${Math.round((correctCount/activeLatihanQuestions.length)*100)}%`;
        }

        function exitLatihanSession() { backToLatihanDashboard(); }
        function backToLatihanDashboard() { renderLatihanDashboard(); }

        // Modul Materi
        function renderMateriDashboard() {
            const hasMateri = state.purchasedPackages.includes('materi');
            if (hasMateri || (state.currentUser && state.currentUser.isAdmin)) {
                document.getElementById('materi-locked-screen').classList.add('hidden');
                document.getElementById('materi-active-screen').classList.remove('hidden');
            } else {
                document.getElementById('materi-locked-screen').classList.remove('hidden');
                document.getElementById('materi-active-screen').classList.add('hidden');
            }
        }

        function toggleMateriSub(sub) {
            ['twk', 'tiu', 'tkp'].forEach(s => {
                document.getElementById(`tab-mat-${s}`).className = "px-5 py-3 text-sm font-medium border-b-2 border-transparent text-slate-500";
                document.getElementById(`content-mat-${s}`).classList.add('hidden');
            });
            document.getElementById(`tab-mat-${sub}`).className = "px-5 py-3 text-sm font-semibold border-b-2 border-amber-500 text-amber-600";
            document.getElementById(`content-mat-${sub}`).classList.remove('hidden');
        }

        // Tryout Engine (CAT BKN CPNS simulator)
        let isExamActive = false;
        let toTimerInterval = null;
        let toSecondsRemaining = 100 * 60;
        let toCurrentIndex = 0;
        let userToAnswers = {};
        let userToRagu = {};

        function renderTryoutDashboard() {
            const hasTO = state.purchasedPackages.includes('tryout');
            if (hasTO || (state.currentUser && state.currentUser.isAdmin)) {
                document.getElementById('to-locked-screen').classList.add('hidden');
                document.getElementById('to-active-screen').classList.remove('hidden');
            } else {
                document.getElementById('to-locked-screen').classList.remove('hidden');
                document.getElementById('to-active-screen').classList.add('hidden');
            }
        }

        function startTryoutExam() {
            isExamActive = true;
            toSecondsRemaining = 100 * 60;
            toCurrentIndex = 0;
            userToAnswers = {};
            userToRagu = {};

            document.getElementById('to-active-screen').classList.add('hidden');
            document.getElementById('to-exam-interface').classList.remove('hidden');
            document.querySelector('header').classList.add('hidden');

            startTryoutTimer();
            renderExamGridNums();
            renderTryoutQuestion();
        }

        function startTryoutTimer() {
            clearInterval(toTimerInterval);
            toTimerInterval = setInterval(() => {
                toSecondsRemaining--;
                if (toSecondsRemaining <= 0) { clearInterval(toTimerInterval); autoSubmitTryout(); return; }
                const mins = Math.floor(toSecondsRemaining / 60);
                const secs = toSecondsRemaining % 60;
                document.getElementById('to-timer').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }, 1000);
        }

        function renderTryoutQuestion() {
            const q = dbTryoutExam[toCurrentIndex];
            document.getElementById('to-curr-num').innerText = toCurrentIndex + 1;
            document.getElementById('to-soal-text').innerText = q.text;

            const optList = document.getElementById('to-options-list');
            optList.innerHTML = '';

            ['a', 'b', 'c', 'd', 'e'].forEach(key => {
                const isSelected = userToAnswers[q.id] === key;
                const btn = document.createElement('button');
                btn.className = `w-full text-left p-3.5 rounded-xl border text-sm font-semibold transition-all flex items-center space-x-3 ${isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'}`;
                btn.onclick = () => { userToAnswers[q.id] = key; renderTryoutQuestion(); };
                btn.innerHTML = `<span class="w-6 h-6 flex items-center justify-center rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100'} uppercase font-bold text-xs">${key}</span><span>${q[key]}</span>`;
                optList.appendChild(btn);
            });

            document.getElementById('to-ragu-checkbox').checked = !!userToRagu[q.id];
            document.getElementById('to-btn-prev').disabled = toCurrentIndex === 0;
            updateExamGridColors();
        }

        function toggleRaguRagu() {
            const q = dbTryoutExam[toCurrentIndex];
            const chk = document.getElementById('to-ragu-checkbox');
            chk.checked = !chk.checked;
            userToRagu[q.id] = chk.checked;
            updateExamGridColors();
        }

        function navigateTryout(dir) {
            toCurrentIndex += dir;
            renderTryoutQuestion();
        }

        function jumpToTryoutIndex(index) {
            toCurrentIndex = index;
            renderTryoutQuestion();
        }

        function renderExamGridNums() {
            const container = document.getElementById('to-grid-nums');
            container.innerHTML = '';
            dbTryoutExam.forEach((q, index) => {
                const numBtn = document.createElement('button');
                numBtn.id = `grid-num-${q.id}`;
                numBtn.onclick = () => jumpToTryoutIndex(index);
                numBtn.className = "h-8 w-8 text-xs font-bold rounded flex items-center justify-center transition-all";
                numBtn.innerText = q.id;
                container.appendChild(numBtn);
            });
        }

        function updateExamGridColors() {
            dbTryoutExam.forEach((q) => {
                const btn = document.getElementById(`grid-num-${q.id}`);
                if (!btn) return;

                const isOpened = dbTryoutExam[toCurrentIndex].id === q.id;
                const isRagu = !!userToRagu[q.id];
                const isAnswered = !!userToAnswers[q.id];

                btn.className = "h-8 w-8 text-xs font-bold rounded flex items-center justify-center transition-all ";
                if (isOpened) btn.classList.add('ring-2', 'ring-indigo-600');
                if (isRagu) btn.classList.add('bg-amber-400', 'text-slate-950');
                else if (isAnswered) btn.classList.add('bg-indigo-600', 'text-white');
                else btn.classList.add('bg-slate-100');
            });
        }

        function confirmFinishTryout() {
            if (confirm("Apakah Anda yakin ingin menyelesaikan ujian?")) submitTryoutScores();
        }

        function submitTryoutScores() {
            clearInterval(toTimerInterval);
            isExamActive = false;

            let scoreTWK = 0, scoreTIU = 0, scoreTKP = 0;
            dbTryoutExam.forEach(q => {
                const ans = userToAnswers[q.id];
                if (q.type === 'TWK' && ans === q.correct) scoreTWK += 5;
                if (q.type === 'TIU' && ans === q.correct) scoreTIU += 5;
                if (q.type === 'TKP' && ans) {
                    if (ans === q.correct) scoreTKP += 5;
                    else scoreTKP += 3; // Simulating scale distribution
                }
            });

            document.querySelector('header').classList.remove('hidden');
            document.getElementById('to-exam-interface').classList.add('hidden');
            document.getElementById('to-result-container').classList.remove('hidden');

            document.getElementById('to-score-twk').innerText = scoreTWK;
            document.getElementById('to-score-tiu').innerText = scoreTIU;
            document.getElementById('to-score-tkp').innerText = scoreTKP;
            document.getElementById('to-total-score').innerText = scoreTWK + scoreTIU + scoreTKP;
        }

        function exitExamWithoutSave() {
            clearInterval(toTimerInterval);
            document.querySelector('header').classList.remove('hidden');
            backToTryoutDashboard();
        }

        // Cart & Checkout
        function addToCart(type, name, price) {
            if (!state.currentUser) { showNotification("Silakan masuk dahulu!", false); switchTab('auth'); return; }
            if (state.purchasedPackages.includes(type)) { showNotification("Paket sudah dimiliki!", false); return; }
            if (state.cart.some(i => i.type === type)) { showNotification("Sudah ada di keranjang!", false); return; }

            state.cart.push({ type, name, price });
            showNotification("Berhasil masuk keranjang");
            updateCartBadge();
        }

        function updateCartBadge() {
            const badge = document.getElementById('cart-badge');
            if (state.cart.length > 0) { badge.classList.remove('hidden'); badge.innerText = state.cart.length; }
            else badge.classList.add('hidden');
        }

        function renderCart() {
            const container = document.getElementById('cart-items-container');
            if (state.cart.length === 0) {
                container.innerHTML = `<div class="p-8 text-center bg-white border rounded-xl">Keranjang Kosong</div>`;
                document.getElementById('cart-total-price').innerText = "Rp 0";
                return;
            }

            container.innerHTML = '';
            let total = 0;
            state.cart.forEach((item, idx) => {
                total += item.price;
                const row = document.createElement('div');
                row.className = "bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between";
                row.innerHTML = `<span>${item.name}</span><span class="font-bold">Rp ${item.price.toLocaleString('id-ID')}</span>`;
                container.appendChild(row);
            });
            document.getElementById('cart-total-price').innerText = `Rp ${total.toLocaleString('id-ID')}`;
        }

        function renderMyPackages() {
            const grid = document.getElementById('paket-saya-grid');
            if (state.purchasedPackages.length === 0) {
                document.getElementById('paket-saya-empty').classList.remove('hidden');
                grid.classList.add('hidden');
                return;
            }
            document.getElementById('paket-saya-empty').classList.add('hidden');
            grid.classList.remove('hidden');
            grid.innerHTML = '';

            state.purchasedPackages.forEach(pType => {
                const info = state.packageSettings[pType];
                const card = document.createElement('div');
                card.className = "bg-white p-5 border rounded-xl shadow-sm space-y-3";
                card.innerHTML = `<h4 class="font-extrabold text-sm">${info.title}</h4><p class="text-xs text-slate-500">Premium Lifetime Access</p>`;
                grid.appendChild(card);
            });
        }

        // Admin Management Panel
        function renderAdminPanel() {
            document.getElementById('adm-to-title').value = state.packageSettings.tryout.title;
            document.getElementById('adm-to-price').value = state.packageSettings.tryout.price;
            document.getElementById('adm-lat-title').value = state.packageSettings.latihan.title;
            document.getElementById('adm-lat-price').value = state.packageSettings.latihan.price;
            document.getElementById('adm-mat-title').value = state.packageSettings.materi.title;
            document.getElementById('adm-mat-price').value = state.packageSettings.materi.price;

            const list = document.getElementById('admin-users-list');
            list.innerHTML = '';
            state.users.forEach(u => {
                const item = document.createElement('div');
                item.className = "p-3 border rounded bg-slate-50 text-xs flex justify-between items-center";
                item.innerHTML = `<div><span class="font-bold block">${u.nama}</span><span>${u.email}</span></div>`;
                list.appendChild(item);
            });
        }

        function updatePricesAndTitles(e) {
            e.preventDefault();
            state.packageSettings.tryout.title = document.getElementById('adm-to-title').value;
            state.packageSettings.tryout.price = parseInt(document.getElementById('adm-to-price').value);
            state.packageSettings.latihan.title = document.getElementById('adm-lat-title').value;
            state.packageSettings.latihan.price = parseInt(document.getElementById('adm-lat-price').value);
            state.packageSettings.materi.title = document.getElementById('adm-mat-title').value;
            state.packageSettings.materi.price = parseInt(document.getElementById('adm-mat-price').value);

            showNotification("Konfigurasi disimpan!");
            renderDashboard();
            renderAdminPanel();
        }