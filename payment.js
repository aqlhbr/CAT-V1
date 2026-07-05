// Encapsulated Midtrans Simulator Object
        const MidtransGateway = {
            selectSnapMethod: function(method) {
                document.getElementById('snap-selected-area').classList.remove('hidden');
                document.getElementById('snap-selected-name').innerText = method;

                const qrisDisplay = document.getElementById('snap-qris-display');
                const vaDisplay = document.getElementById('snap-va-display');

                if (method === 'QRIS') {
                    qrisDisplay.classList.remove('hidden');
                    vaDisplay.classList.add('hidden');
                } else {
                    qrisDisplay.classList.add('hidden');
                    vaDisplay.classList.remove('hidden');
                }
            },
            processSnapPaymentSuccess: function() {
                if (document.getElementById('snap-selected-area').classList.contains('hidden')) {
                    showNotification("Silakan pilih metode pembayaran terlebih dahulu!", false);
                    return;
                }

                // Move items from cart to active purchased packages
                state.cart.forEach(item => {
                    if (!state.purchasedPackages.includes(item.type)) {
                        state.purchasedPackages.push(item.type);
                    }
                });

                state.cart = [];
                updateCartBadge();
                closeMidtransSnap();
                showNotification("Pembayaran Berhasil! Paket belajar premium Anda kini telah aktif.");
                switchTab('paket-saya');
            }
        };

        function triggerMidtransPayment() {
            if (state.cart.length === 0) {
                showNotification("Keranjang belanja Anda kosong!", false);
                return;
            }

            let total = 0;
            state.cart.forEach(i => total += i.price);

            document.getElementById('snap-total-val').innerText = `Rp ${total.toLocaleString('id-ID')}`;
            document.getElementById('snap-selected-area').classList.add('hidden');
            document.getElementById('modal-midtrans-snap').classList.remove('hidden');
        }

        function closeMidtransSnap() {
            document.getElementById('modal-midtrans-snap').classList.add('hidden');
        }
