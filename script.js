document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ ALTERE PARA O SEU NÚMERO DO WHATSAPP COM DDD (Exemplo: 5511999998888)
    const PHONE_NUMBER = "5511999998888"; 

    // Estado do Carrinho
    let cart = [];

    // Elementos DOM
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.querySelectorAll('.navbar a');
    const cartIcon = document.querySelector('.icons .icon-wrapper:last-child');
    const searchIcon = document.querySelector('.icons .icon-wrapper:first-child');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const addToCartButtons = document.querySelectorAll('.menu .box .btn');
    const header = document.querySelector('.header');

    // Badge de Contagem no Carrinho
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.style.cssText = `
        position: absolute; top: -2px; right: -2px;
        background-color: var(--main-color); color: #000;
        font-weight: bold; font-size: 1.1rem; width: 18px; height: 18px;
        border-radius: 50%; display: none; align-items: center; justify-content: center;
    `;
    if (cartIcon) {
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
    }

    // ----------------------------------------------------
    // 1. EFEITO NO HEADER AO ROLAR
    // ----------------------------------------------------
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 8, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.background = 'rgba(1, 1, 3, 0.85)';
            header.style.boxShadow = 'none';
        }
    });

    // ----------------------------------------------------
    // 2. MODAL DO CARRINHO (ABRIR E FECHAR)
    // ----------------------------------------------------
    if (cartIcon) {
        cartIcon.addEventListener('click', () => cartModal.classList.add('active'));
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
    }

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
    });

    // ----------------------------------------------------
    // 3. ADICIONAR PRODUTO AO CARRINHO
    // ----------------------------------------------------
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.box');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText.split(' ')[1]; 
            const price = parseFloat(priceText.replace(',', '.'));

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            updateCartUI();

            // Feedback visual no botão
            const originalText = btn.innerText;
            btn.innerText = 'Adicionado! ✓';
            btn.style.background = '#4CAF50';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
            }, 1200);
        });
    });

    // ----------------------------------------------------
    // 4. ATUALIZAR INTERFACE DO CARRINHO
    // ----------------------------------------------------
    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            badge.innerText = totalItems;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }

        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
            cartTotalElement.innerText = 'R$ 0,00';
            return;
        }

        let grandTotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;

            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.quantity}x - R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button class="remove-item" data-index="${index}">✕</button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        cartTotalElement.innerText = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;

        // Eventos para remover itens
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    }

    // ----------------------------------------------------
    // 5. ENVIAR PEDIDO VIA WHATSAPP
    // ----------------------------------------------------
    whatsappBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio! Adicione alguns cafés antes de fechar o pedido.');
            return;
        }

        let message = `☕ *NOVO PEDIDO - CAFETERIA DE DIEGO* ☕\n\n`;
        message += `*Itens do Pedido:*\n`;

        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            message += `• ${item.quantity}x ${item.name} - R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
        });

        message += `\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
        message += `------------------------------------\n`;
        message += `Gostaria de confirmar o pedido e combinar a entrega/retirada!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    });

    // ----------------------------------------------------
    // 6. BUSCA RÁPIDA DE ITENS NO MENU
    // ----------------------------------------------------
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            const query = prompt('O que você procura hoje? (ex: Espresso, Coado, Latte)');
            if (query) {
                const searchLower = query.toLowerCase();
                const menuItems = document.querySelectorAll('.menu .box');
                let found = false;

                menuItems.forEach(item => {
                    const title = item.querySelector('h3').innerText.toLowerCase();
                    if (title.includes(searchLower)) {
                        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        item.style.border = '2px solid var(--main-color)';
                        setTimeout(() => {
                            item.style.border = 'var(--border)';
                        }, 3000);
                        found = true;
                    }
                });

                if (!found) {
                    alert('Nenhum item encontrado no menu com esse nome.');
                }
            }
        });
    }

    // Fechar menu mobile ao clicar nos links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuBtn) menuBtn.checked = false;
        });
    });
});