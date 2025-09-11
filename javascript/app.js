// Variables globales
let products = [];
let cart = [];
let qty = 0;

// Elementos del DOM
const txtSearch = document.getElementById("txt-search");
const btnSearch = document.getElementById("btn-search");
const btnAdd = document.getElementById("btn-add");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const productGrid3D = document.getElementById("product-grid-3d");
const productGridRusticas = document.getElementById("product-grid-rusticas");

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    products = getProductsFromStorage();
    getCartFromStorage();
    renderProducts(products);
    setupEventListeners();
});

// Obtener productos del localStorage
function getProductsFromStorage() {
    const productsFromStorage = localStorage.getItem("products");
    if (productsFromStorage) {
        return JSON.parse(productsFromStorage);
    } else {
        const defaultProducts = [
            {
                id: 1,
                name: "Lux",
                image: "images/lux.png",
                description: "3D",
                price: 12,
                stock: 50,
            },
            {
                id: 2,
                name: "Afro",
                image: "images/afro.jpg",
                description: "3D",
                price: 16,
                stock: 50,
            },
            {
                id: 3,
                name: "Luxrrus",
                image: "images/luxrus.jpg",
                description: "Rusticas",
                price: 40,
                stock: 50,
            },
            {
                id: 4,
                name: "Afrorus",
                image: "images/afrorus.png",
                description: "Rusticas",
                price: 20,
                stock: 100,
            },
        ];
        localStorage.setItem("products", JSON.stringify(defaultProducts));
        return defaultProducts;
    }
}

// Obtener carrito del localStorage
function getCartFromStorage() {
    const cartFromStorage = localStorage.getItem("cart");
    if (cartFromStorage) {
        cart = JSON.parse(cartFromStorage);
        qty = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = `(${qty})`;
    }
}

// Agregar producto al carrito
function fillCart(name, quantity) {
    const product = products.find((product) => product.name === name);
    if (!product) {
        alert("Código de producto no encontrado.");
        return -1;
    }
    
    if (product.stock < quantity) {
        alert("Transacción cancelada. No tenemos suficientes productos.");
        return -1;
    }
    
    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalprice = existingItem.price * existingItem.quantity;
    } else {
        cart.push({
            id: product.id,
            description: product.description,
            name: product.name,
            image: product.image,
            quantity: quantity,
            price: product.price,
            totalprice: product.price * quantity,
        });
    }
    
    product.stock -= quantity;
    return 1;
}

// Configurar event listeners
function setupEventListeners() {
    // Event delegation para los botones de agregar al carrito
    if (productGrid3D) {
        productGrid3D.addEventListener("click", handleProductClick);
    }
    
    if (productGridRusticas) {
        productGridRusticas.addEventListener("click", handleProductClick);
    }
    
    // Búsqueda
    btnSearch.addEventListener("click", handleSearch);
    
    // Tecla Enter en la búsqueda
    txtSearch.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch();
    });
    
    // Botón de carrito
    cartBtn.addEventListener("click", () => {
        if (qty !== 0) {
            window.location.href = "cart.html";
        } else {
            alert("Tu carrito está vacío. Agrega productos primero.");
        }
    });
    
    // Botón de agregar producto
    if (btnAdd) {
        btnAdd.addEventListener("click", () => {
            window.location.href = "add-products.html";
        });
    }
}

// Manejar clic en producto
function handleProductClick(e) {
    if (e.target.classList.contains("product-card__btn")) {
        const productCard = e.target.closest(".product-card");
        const productName = productCard.querySelector(".product-card__title").textContent;
        
        const result = fillCart(productName, 1);
        if (result !== -1) {
            qty += 1;
            cartCount.textContent = `(${qty})`;
            localStorage.setItem("cart", JSON.stringify(cart));
            localStorage.setItem("products", JSON.stringify(products));
            renderProducts(products);
        }
    }
}

// Manejar búsqueda
function handleSearch() {
    const search = txtSearch.value.trim().toLowerCase();
    if (search === "") {
        renderProducts(products);
        return;
    }
    
    const filteredProducts = products.filter((item) => 
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
    );
    
    renderProducts(filteredProducts);
    txtSearch.value = "";
}

// Renderizar productos
function renderProducts(productsToRender) {
    if (productGrid3D) productGrid3D.innerHTML = "";
    if (productGridRusticas) productGridRusticas.innerHTML = "";
    
    productsToRender.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.description} ${product.name}" class="product-card__image">
            <div class="product-card__info">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__description">${product.description}</p>
                <p class="product-card__price">$${product.price}</p>
                <p class="product-card__stock">Cantidad disponible: ${product.stock}</p>
                <button class="product-card__btn">Agregar al carrito</button>
            </div>
        `;
        
        if (product.description === "3D" && productGrid3D) {
            productGrid3D.appendChild(productCard);
        } else if (productGridRusticas) {
            productGridRusticas.appendChild(productCard);
        }
    });
}