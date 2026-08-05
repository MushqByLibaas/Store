const products = [
    { id: 1, name: "Winish Maroon Soft Cotton Semiformal Suit", price: "₹2,499", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500" },
    { id: 2, name: "Goldenish Beige Tasser Silk A-Line Party Wear", price: "₹3,199", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500" },
    { id: 3, name: "Green Chiffon Embroidered Festive Suit", price: "₹2,899", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500" },
    { id: 4, name: "Classic Designer Lawn Suit", price: "₹1,999", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500" }
];

function loadProducts() {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    products.forEach(product => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>MRP: ${product.price}</p>
            </div>
        `;
    });
}

document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("custName").value;
    const phone = document.getElementById("custPhone").value;
    const address = document.getElementById("custAddress").value;
    const location = document.getElementById("custLocation").value;

    alert(`Thank you ${name}! Your order has been successfully placed. We will contact you soon on ${phone} for delivery to ${location}.`);
    document.getElementById("orderForm").reset();
});

window.onload = loadProducts;
