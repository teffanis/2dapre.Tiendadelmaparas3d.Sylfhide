// VARIABLES
let lamparas3d = [];
let lamparasRusticas = [];
let lastId = 1;
let cart = JSON.parse(localStorage.getItem("Carrito")) || [];

// LLAMADO/CREACIÓN DE ELEMENTOS DEL DOM
const lamparas3dList = document.getElementById("lamparas3dList");
const lamparasRusticasList = document.getElementById("lamparasRusticasList");
const cartSection = document.getElementById("cartSection");
const cartSummaryText = document.getElementById("cartSummaryText");
const productsOrderedInfo = document.getElementById("productsOrderedInfo");
const finishOrderButton = document.getElementById("finishOrderButton");
const cartCount = document.getElementById("cartCount");

// NOTIFICACIONES
function showToastAddedToCart() {
    Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'success',
        text: "Producto agregado al carrito",
        showConfirmButton: false,
        timer: 2000,
    });
}

function showToastDeletedFromCart() {
    Swal.fire({
        toast: true,
        position: 'bottom',
        icon: 'info',
        text: "Producto eliminado del carrito",
        showConfirmButton: false,
        timer: 2000,
    });
}

function confirmDeleteProduct(name) {
    return Swal.fire({
        title: '¿Eliminar producto?',
        text: `¿Deseas eliminar "${name}" del carrito?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
    });
}

function confirmFinishOrder() {
    return Swal.fire({
        title: '¿Finalizar compra?',
        text: `Total: $${calculateTotalOrder()}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#27ae60',
        cancelButtonColor: '#95a5a6',
    });
}

// FUNCIONES DE AGREGADO DE PRODUCTOS AL STOCK
async function getProducts() {
    try {
        const response = await fetch("./data/products.json");
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        // Datos de ejemplo si falla la carga del JSON
        return {
            lamparas3d: [
                {
                    id: 1,
                    name: "Lux",
                    image: "images/lux.png",
                    description: "Lámpara 3D moderna con diseño elegante",
                    price: 12,
                    category: "3d"
                },
                {
                    id: 2,
                    name: "Afro",
                    image: "images/afro.jpg",
                    description: "Lámpara 3D con patrón africano",
                    price: 16,
                    category: "3d"
                }
            ],
            lamparasRusticas: [
                {
                    id: 3,
                    name: "Luxrrus",
                    image: "images/luxrus.jpg",
                    description: "Lámpara colgante clasica. Pintura sellada" ,
                    price: 40,
                    category: "rusticas"
                },
                {
                    id: 4,
                    name: "Afrorus",
                    image: "images/afrorus.png",
                    description: "Lámpara rústica con diseño africano.Base madera nogal",
                    price: 20,
                    category: "rusticas"
                }
            ]
        };
    }
}

async function showProducts() {
    try {
        const productsData = await getProducts();
        lamparas3d = productsData.lamparas3d || productsData.products?.filter(p => p.category === '3d') || [];
        lamparasRusticas = productsData.lamparasRusticas || productsData.products?.filter(p => p.category === 'rusticas') || [];
        
        createProductElement(lamparas3d, lamparas3dList);
        createProductElement(lamparasRusticas, lamparasRusticasList);
    } catch (error) {
        showErrorMessage(lamparas3dList);
        showErrorMessage(lamparasRusticasList);
    }
}

// FUNCIONES DEL CARRITO
const addToCart = (name, price, image, description) => {
    cart.push({
        id: lastId++,
        name: name,
        price: price,
        image: image,
        description: description
    });
    localStorage.setItem("Carrito", JSON.stringify(cart));
    showToastAddedToCart();
    showCartSummaryText();
    renderCart();
    showFinishOrderButton();
    updateCartCount();
};

const deleteProduct = (id) => {
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("Carrito", JSON.stringify(cart));
    renderCart();
    showFinishOrderButton();
    updateCartCount();
};

const calculateTotalOrder = () => {
    const total = cart.reduce((acumulador, cartItem) => acumulador + cartItem.price, 0);
    return total;
};

// FUNCIONES DE CREACIÓN DE ELEMENTOS DEL DOM
const createProductCard = (item, list) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    
    productCard.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="product-image" 
             onerror="this.src='https://via.placeholder.com/300x200/6a11cb/ffffff?text=Imagen+No+Disponible'">
        <div class="product-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="product-price">$${item.price}</div>
            <button class="btn-add-to-cart" data-id="${item.id}">
                Agregar al carrito
            </button>
        </div>
    `;
    
    list.appendChild(productCard);
    
    // Agregar event listener al botón
    const addButton = productCard.querySelector('.btn-add-to-cart');
    addButton.addEventListener("click", function () {
        addToCart(item.name, item.price, item.image, item.description);
    });
}

const createAddedItemToCart = (item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
        <div>
            <strong>${item.name}</strong><br>
            <small>${item.description}</small><br>
            Precio: $${item.price}
        </div>
        <button class="delete-button" data-id="${item.id}">Eliminar</button>
    `;
    
    productsOrderedInfo.appendChild(cartItem);
    
    // Agregar event listener al botón eliminar
    const deleteButton = cartItem.querySelector('.delete-button');
    deleteButton.addEventListener("click", async function () {
        const res = await confirmDeleteProduct(item.name);
        if (res.isConfirmed) {
            deleteProduct(item.id);
            showToastDeletedFromCart();
        }
    });
}

// FUNCIONES DE RENDERIZADO
const createProductElement = (menu, productsList) => {
    productsList.innerHTML = '';
    menu.forEach((menuItem) => {
        createProductCard(menuItem, productsList);
    });
}

function showErrorMessage(menu) {
    const errorMessage = document.createElement("p");
    errorMessage.className = "errorMessage";
    errorMessage.innerHTML = `No se ha podido cargar la información del producto. Vuelva a intentarlo más tarde.`;
    menu.appendChild(errorMessage);     
}

const showCartSummaryText = () => {
    if (cart.length !== 0) {
        cartSummaryText.innerHTML = "Productos en tu carrito:";
        cartSection.style.display = 'block';
    } else {
        cartSection.style.display = 'none';
    }
}

const showTotalOrder = () => {
    const showTotalOrder = document.createElement("div");
    showTotalOrder.className = "cart-item";
    showTotalOrder.style.fontWeight = 'bold';
    showTotalOrder.style.borderTop = '2px solid #333';
    showTotalOrder.innerHTML = `Total: <strong>$${calculateTotalOrder()}</strong>`;
    productsOrderedInfo.appendChild(showTotalOrder);
}

const renderCart = () => {
    productsOrderedInfo.innerHTML = "";
    if (cart.length > 0) {
        cart.forEach((cartItem) => {
            createAddedItemToCart(cartItem);        
        });
        showTotalOrder();
    }
    showCartSummaryText();
};

const showFinishOrderButton = () => {
    if (cart.length !== 0) {
        finishOrderButton.style.display = 'block';
        // Remover event listeners anteriores para evitar duplicados
        finishOrderButton.replaceWith(finishOrderButton.cloneNode(true));
        const newFinishButton = document.getElementById("finishOrderButton");
        
        newFinishButton.addEventListener("click", async function (event) {
            event.preventDefault();
            const res = await confirmFinishOrder();
            if (res.isConfirmed) {
                window.location.href = "order.html";
            }
        });
    } else {
        finishOrderButton.style.display = 'none';
    }
};

const updateCartCount = () => {
    cartCount.textContent = cart.length;
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    showProducts();
    renderCart();
    showFinishOrderButton();
    updateCartCount();
    
    // Event listener para el icono del carrito
    document.getElementById('cartIcon').addEventListener('click', function() {
        document.getElementById('cartSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
});