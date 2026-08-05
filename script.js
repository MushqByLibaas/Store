// Mushq Libaas Frontend Logic
let cart = JSON.parse(localStorage.getItem('nova_cart')) || [];

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    renderCartItems();
});

function toggleCart(open) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if(open) {
        drawer.classList.add('open');
        overlay.style.display = 'block';
    } else {
        drawer.classList.remove('open');
        overlay.style.display = 'none';
    }
}

function addToCart(id, title, price, image, size, color) {
    const existing = cart.find(item => item.id === id && item.size === size && item.color === color);
    if(existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, title, price, image, size, color, quantity: 1 });
    }
    saveCart();
    alert("Product added to bag successfully!");
    toggleCart(true);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
}

function saveCart() {
    localStorage.setItem('nova_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCartItems();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if(badge) {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalQty;
    }
}

function renderCartItems() {
    const body = document.getElementById('cartBody');
    const totalEl = document.getElementById('cartTotal');
    if(!body) return;

    if(cart.length === 0) {
        body.innerHTML = '<p style="text-align:center; color:#888; margin-top:40px;">Your bag is empty.</p>';
        if(totalEl) totalEl.innerText = '0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div style="font-size:12px; color:#aaa; margin-bottom:4px;">Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}</div>
                    <div class="cart-item-price">₹${item.price} × ${item.quantity}</div>
                </div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:16px;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });

    body.innerHTML = html;
    if(totalEl) totalEl.innerText = total;
}
