// Variables globales
let cart = [];
let subtotal = 0;
let tax = 0;
let total = 0;

// Elementos del DOM
const cartItems = document.getElementById("cart-items");
const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCount = document.getElementById("cart-count");

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    getCartFromStorage();
    renderCartItems();
    calculateTotals();
    setupEventListeners();
});

// Obtener carrito del localStorage
function getCartFromStorage() {
    const cartFromStorage = localStorage.getItem("cart");
    if (cartFromStorage) {
        cart = JSON.parse(cartFromStorage);
        updateCartCount();
    }
}

// Actualizar contador del carrito
function updateCartCount() {
    if (cartCount) {
        const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = `(${totalQty})`;
    }
}

// Renderizar elementos del carrito
function renderCartItems() {
    if (!cartItems) return;
    
    cartItems.innerHTML = "";
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h2>Tu carrito está vacío</h2>
                <p>Agrega algunos productos desde la tienda</p>
                <a href="./index.html" class="back-to-shop">Volver a la tienda</a>
            </div>
        `;
        return;
    }
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.description} ${item.name}" class="cart-item__image">
            <div class="cart-item__info">
                <h3 class="cart-item__name">${item.name}</h3>
                <p class="cart-item__description">${item.description}</p>
                <p class="cart-item__price">$${item.price} c/u</p>
            </div>
            <div class="cart-item__quantity">
                <button class="cart-item__quantity-btn" data-action="decrease" data-index="${index}">-</button>
                <span class="cart-item__quantity-value">${item.quantity}</span>
                <button class="cart-item__quantity-btn" data-action="increase" data-index="${index}">+</button>
            </div>
            <p class="cart-item__total">$${item.totalprice.toFixed(2)}</p>
            <button class="cart-item__remove" data-index="${index}">Eliminar</button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Calcular totales
function calculateTotals() {
    subtotal = cart.reduce((sum, item) => sum + item.totalprice, 0);
    tax = subtotal * 0.1; // 10% de impuestos
    total = subtotal + tax;
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Configurar event listeners
function setupEventListeners() {
    // Delegación de eventos para los botones de cantidad y eliminar
    if (cartItems) {
        cartItems.addEventListener("click", (e) => {
            if (e.target.classList.contains("cart-item__quantity-btn")) {
                const action = e.target.getAttribute("data-action");
                const index = parseInt(e.target.getAttribute("data-index"));
                updateQuantity(index, action);
            }
            
            if (e.target.classList.contains("cart-item__remove")) {
                const index = parseInt(e.target.getAttribute("data-index"));
                removeItem(index);
            }
        });
    }
    
    // Botón de checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", handleCheckout);
    }
}

// Actualizar cantidad
function updateQuantity(index, action) {
    if (action === "increase") {
        cart[index].quantity += 1;
    } else if (action === "decrease" && cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else if (action === "decrease" && cart[index].quantity === 1) {
        // Si la cantidad es 1 y se presiona disminuir, eliminar el producto
        removeItem(index);
        return;
    }
    
    cart[index].totalprice = cart[index].price * cart[index].quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    calculateTotals();
    updateCartCount();
}

// Eliminar item
function removeItem(index) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto del carrito?")) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems();
        calculateTotals();
        updateCartCount();
    }
}

// Manejar checkout
function handleCheckout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega algunos productos antes de proceder al pago.");
        return;
    }
    
    if (confirm("¿Estás seguro de que quieres proceder con la compra?")) {
        alert("¡Gracias por tu compra! Tu pedido ha sido procesado.");
        
        // Actualizar el stock de productos
        updateProductStock();
        
        localStorage.removeItem("cart");
        cart = [];
        renderCartItems();
        calculateTotals();
        updateCartCount();
    }
}

// Actualizar el stock de productos después de una compra
function updateProductStock() {
    // Obtener productos del localStorage
    const productsFromStorage = localStorage.getItem("products");
    if (productsFromStorage) {
        let products = JSON.parse(productsFromStorage);
        
        // Actualizar el stock para cada producto en el carrito
        cart.forEach(cartItem => {
            const productIndex = products.findIndex(p => p.id === cartItem.id);
            if (productIndex !== -1) {
                products[productIndex].stock -= cartItem.quantity;
            }
        });
        
        // Guardar los productos actualizados
        localStorage.setItem("products", JSON.stringify(products));
    }
}