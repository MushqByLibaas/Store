// Cart state management using 'novaCart' storage key
let cart = JSON.parse(localStorage.getItem('novaCart')) || [];

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    renderCartItems();
});

// Add product to cart
function addToCart(id, title, price, image, size, color) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: id,
            title: title,
            price: price,
            image: image,
            size: size || 'Standard',
            color: color || '',
            qty: 1
        });
    }
    saveAndRefreshCart();
    toggleCart(true);
}

// Save cart to localStorage and update UI
function saveAndRefreshCart() {
    localStorage.setItem('novaCart', JSON.stringify(cart));
    updateCartBadge();
    renderCartItems();
}

// Update cart badge count
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.innerText = totalQty;
    }
}

// Toggle Cart Drawer
function toggleCart(show) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
        if (show) {
            drawer.classList.add('open');
            overlay.classList.add('active');
        } else {
            drawer.classList.remove('open');
            overlay.classList.remove('active');
        }
    }
}

// Render items inside Cart Drawer
function renderCartItems() {
    const cartBody = document.getElementById('cartBody');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartBody) return;

    if (cart.length === 0) {
        cartBody.innerHTML = '<p style="color:#888; text-align:center; padding:20px;">Your bag is empty.</p>';
        if (cartTotal) cartTotal.innerText = '0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        html += `
            <div style="display:flex; gap:12px; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:12px; align-items:center;">
                <img src="${item.image}" alt="${item.title}" style="width:60px; height:60px; object-fit:cover; border-radius:6px;">
                <div style="flex-grow:1;">
                    <h4 style="font-size:13px; color:#fff; margin-bottom:4px;">${item.title}</h4>
                    <div style="font-size:12px; color:var(--accent-gold);">₹${item.price} × ${item.qty}</div>
                </div>
                <button onclick="removeItem(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:14px;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });

    cartBody.innerHTML = html;
    if (cartTotal) cartTotal.innerText = total;
}

// Remove item from cart
function removeItem(index) {
    cart.splice(index, 1);
    saveAndRefreshCart();
}

// Direct Buy / Order Now function
function directOrder(title, price, image) {
    const buyNowItem = [{
        id: 'direct-1',
        title: title,
        price: price,
        image: image || '',
        qty: 1
    }];
    localStorage.setItem('novaCart', JSON.stringify(buyNowItem));
    window.location.href = 'checkout.html';
}
