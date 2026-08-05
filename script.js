const initialProducts = [
    { 
        id: "1", 
        title: "Winish Maroon Soft Cotton Semiformal Suit", 
        price: 2499, 
        oldPrice: 3499, 
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
        collection_tag: "New Arrivals",
        category: "Designer Suit"
    },
    { 
        id: "2", 
        title: "Goldenish Beige Tasser Silk A-Line Party Wear", 
        price: 3199, 
        oldPrice: 4500, 
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500",
        collection_tag: "New Arrivals",
        category: "Party Wear"
    },
    { 
        id: "3", 
        title: "Green Chiffon Embroidered Festive Suit", 
        price: 2899, 
        oldPrice: 3999, 
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500",
        collection_tag: "Trending",
        category: "Festive Suit"
    },
    { 
        id: "4", 
        title: "Classic Designer Lawn Suit", 
        price: 1999, 
        oldPrice: 2999, 
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
        collection_tag: "Special Offer",
        category: "Lawn Suit"
    }
];

let storeProducts = [...initialProducts];
let cart = JSON.parse(localStorage.getItem('novaCart')) || [];

function sanitizePath(path) {
    if (!path) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return path.replace(/^\/+/, '');
}

// Simple YAML frontmatter parser for Decap CMS Markdown files (.md)
function parseFrontmatter(markdownText) {
    const frontmatter = {};
    const match = markdownText.match(/^---([\s\S]*?)---/);
    if (!match) return null;
    
    const lines = match[1].split('\n');
    let currentKey = null;
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        if (line.includes(':')) {
            const colonIdx = line.indexOf(':');
            const key = line.substring(0, colonIdx).trim();
            let val = line.substring(colonIdx + 1).trim();
            
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1);
            } else if (val.startsWith("'") && val.endsWith("'")) {
                val = val.slice(1, -1);
            }
            
            frontmatter[key] = val;
            currentKey = key;
        }
    }
    return frontmatter;
}

async function loadCMSContent() {
    try {
        const response = await fetch('https://api.github.com/repos/NovaStoreKSA/store/contents/products');
        if (response.ok) {
            const files = await response.json();
            for (const file of files) {
                if (file.name.endsWith('.md') || file.name.endsWith('.json')) {
                    const res = await fetch(file.download_url);
                    const text = await res.text();
                    
                    let item = null;
                    if (file.name.endsWith('.json')) {
                        try { item = JSON.parse(text); } catch(err){}
                    } else {
                        item = parseFrontmatter(text);
                    }

                    if (item && item.id) {
                        if (item.section && !item.collection_tag) {
                            item.collection_tag = item.section === 'special-offers' ? 'Special Offer' : 
                                                  item.section === 'new-arrivals' ? 'New Arrivals' : 'Trending';
                        }
                        
                        if (!storeProducts.some(p => String(p.id) === String(item.id))) {
                            item.price = Number(item.price) || 0;
                            if (item.old_price) item.oldPrice = Number(item.old_price);
                            item.image = sanitizePath(item.image);
                            storeProducts.push(item);
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.log("Using default fallback items");
    } finally {
        renderAllCollections();
        renderCartUI();
    }
}

function renderAllCollections() {
    const pinnedItems = storeProducts.filter(p => p.is_pinned === true).slice(0, 4);
    const offerItems = storeProducts.filter(p => p.collection_tag === "Special Offer" || p.collection_tag === "special-offers");
    const newItems = storeProducts.filter(p => p.collection_tag === "New Arrivals" || p.collection_tag === "new-arrivals" || p.collection_tag === "General" || !p.collection_tag);
    const trendItems = storeProducts.filter(p => p.collection_tag === "Trending" || p.collection_tag === "trending");

    const pinnedSec = document.getElementById('pinnedSection');
    const pinnedEl = document.getElementById('pinnedSlider');
    if (pinnedSec && pinnedEl) {
        if (pinnedItems.length > 0) {
            pinnedSec.style.display = 'block';
            pinnedEl.innerHTML = generateCardsHTML(pinnedItems);
        } else {
            pinnedSec.style.display = 'none';
        }
    }

    const offerEl = document.getElementById('specialOfferSlider');
    const newEl = document.getElementById('newArrivalsSlider');
    const trendEl = document.getElementById('trendingSlider');

    if (offerEl) offerEl.innerHTML = generateCardsHTML(offerItems);
    if (newEl) newEl.innerHTML = generateCardsHTML(newItems);
    if (trendEl) trendEl.innerHTML = generateCardsHTML(trendItems);
}

function generateCardsHTML(items) {
    if (!items || items.length === 0) {
        return `<p style="color:#777; font-size:12px; padding:15px; grid-column: 1/-1; text-align:center;">No items available right now.</p>`;
    }

    return items.map(p => `
        <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'" style="cursor:pointer;">
            ${p.oldPrice ? `<div class="badge">OFFER</div>` : ''}
            <div class="product-img">
                <img src="${sanitizePath(p.image)}" alt="${p.title}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="price-box">
                    <span class="current-price">₹${p.price}</span>
                    ${p.oldPrice ? `<span class="old-price">₹${p.oldPrice}</span>` : ''}
                </div>
                <div class="card-actions" onclick="event.stopPropagation();">
                    <button class="btn-add" onclick="addToCart('${p.id}')">
                        <i class="fa-solid fa-cart-plus"></i> ADD
                    </button>
                    <button class="btn-buy" onclick="directBuyNow('${p.id}')">
                        <i class="fa-solid fa-bolt"></i> BUY
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function directBuyNow(id) {
    const found = storeProducts.find(p => String(p.id) === String(id));
    if (!found) return;
    const itemToBuy = { ...found, selectedSize: 'M', qty: 1 };
    localStorage.setItem('novaCart', JSON.stringify([itemToBuy]));
    window.location.href = 'checkout.html';
}

function handleSearch() {
    const searchInputElem = document.getElementById('searchInput');
    if (!searchInputElem) return;
    const rawQuery = searchInputElem.value.toLowerCase().trim();
    const searchSection = document.getElementById('searchGridSection');
    const mainSections = document.getElementById('mainSections');
    const searchGrid = document.getElementById('searchGrid');

    if (!rawQuery) {
        if (searchSection) searchSection.style.display = 'none';
        if (mainSections) mainSections.style.display = 'block';
        return;
    }

    const cleanQuery = rawQuery.replace(/[-_\s]/g, '');

    const matches = storeProducts.filter(p => {
        const title = (p.title || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const tag = (p.collection_tag || '').toLowerCase();
        
        const cleanTitle = title.replace(/[-_\s]/g, '');
        const cleanCategory = category.replace(/[-_\s]/g, '');
        const cleanTag = tag.replace(/[-_\s]/g, '');

        return title.includes(rawQuery) || 
               category.includes(rawQuery) || 
               tag.includes(rawQuery) ||
               cleanTitle.includes(cleanQuery) ||
               cleanCategory.includes(cleanQuery) ||
               cleanTag.includes(cleanQuery);
    });

    if (searchSection) searchSection.style.display = 'block';
    if (mainSections) mainSections.style.display = 'none';
    if (searchGrid) searchGrid.innerHTML = generateCardsHTML(matches);
}

function addToCart(id) {
    const found = storeProducts.find(p => String(p.id) === String(id));
    if (!found) return;

    const cartIdx = cart.findIndex(item => String(item.id) === String(id));
    if (cartIdx > -1) {
        cart[cartIdx].qty += 1;
    } else {
        cart.push({ ...found, selectedSize: 'M', qty: 1 });
    }

    saveCart();
    renderCartUI();
    toggleCart(true);
}

function removeFromCart(id) {
    cart = cart.filter(item => String(item.id) !== String(id));
    saveCart();
    renderCartUI();
}

function saveCart() {
    localStorage.setItem('novaCart', JSON.stringify(cart));
}

function renderCartUI() {
    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    const badge = document.getElementById('cartBadge');
    const total = document.getElementById('cartTotal');

    if (badge) badge.innerText = totalQty;
    if (total) total.innerText = totalPrice;

    const cartBody = document.getElementById('cartBody');
    if (cartBody) {
        if (cart.length === 0) {
            cartBody.innerHTML = `<p style="color:#777; font-size:13px; text-align:center; margin-top:40px;">Your shopping bag is empty.</p>`;
        } else {
            cartBody.innerHTML = cart.map(i => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #222;">
                    <div>
                        <div style="font-size:12px; font-weight:600; color:#fff;">${i.title}</div>
                        <div style="font-size:11px; color:var(--gold-primary); margin-top:3px;">${i.qty} x ₹${i.price}</div>
                    </div>
                    <button onclick="removeFromCart('${i.id}')" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:0.9rem;"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `).join('');
        }
    }
}

function toggleCart(show) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
        if (show) {
            drawer.classList.add('active');
            overlay.classList.add('active');
        } else {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', loadCMSContent);
