// VARIABLES
// Obtiene los datos almacenados en el localStorage (los productos agregados al carrito)
const finalCart = JSON.parse(localStorage.getItem("Carrito") || "[]");

// LLAMADO/CREACIÓN DE ELEMENTOS DEL DOM
// Contenedor que agrupa toda la información del carrito
const finalOrder = document.getElementById("finalOrder");

// Botón para volver a la Homepage
const backToHomepage = document.getElementById("backToHomepage");

// Elemento para el contador regresivo
const countdownElement = document.getElementById("countdown");

// FUNCIONES DEL CARRITO
// Suma el total del carrito almacenado en el localStorage
const calculateTotalOrder = () => {
    const total = finalCart.reduce((acumulador, item) => acumulador + (item.price * (item.quantity || 1)), 0);
    return total;
};

// FUNCIONES DE CREACIÓN DE ELEMENTOS DEL DOM
// Crea y muestra cada producto de la orden de manera individual
const purchasedItem = (item) => {
    const orderItem = document.createElement("div");
    orderItem.className = "order-item";
    orderItem.innerHTML = `
       
            <div class="order-details">
                <h4>${item.name}</h4>
                <p class="order-description">${item.description || 'Lámpara 3D de alta calidad'}</p>
                <div class="order-meta">
                    <span>Cantidad: ${item.quantity || 1}</span>
                    <span>Precio unitario: $${item.price.toFixed(2)}</span>
                </div>
                <div class="order-subtotal">Subtotal: $${((item.price) * (item.quantity || 1)).toFixed(2)}</div>
            </div>
        </div>
    `;
    finalOrder.appendChild(orderItem);
}

// Crea y muestra el total pagado por todos los productos del carrito
const showTotalPaid = () => {
    const totalPaid = document.createElement("div");
    totalPaid.className = "total-paid";
    totalPaid.innerHTML = `
        <div class="total-line"></div>
        <div class="total-amount">
            <h3>Total pagado: <span>$${calculateTotalOrder().toFixed(2)}</span></h3>
            <p class="order-date">Fecha: ${new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>
    `;
    finalOrder.appendChild(totalPaid);
}

// FUNCIONES DEL RENDERIZADO
// Renderiza en el DOM todos los productos comprados y el total de la compra
const showFinalOrder = () => {
    if (finalCart.length === 0) {
        finalOrder.innerHTML = `
            <div class="empty-order">
                <div class="empty-icon">🛒</div>
                <h3>No hay productos en tu orden</h3>
                <p>Parece que tu carrito estaba vacío</p>
            </div>
        `;
        return;
    }
    
    finalCart.forEach((item) => {
        purchasedItem(item);
    });
    showTotalPaid();
}

// Muestra el contador regresivo
const startCountdown = () => {
    let seconds = 1000;
    const countdownInterval = setInterval(() => {
        seconds--;
        countdownElement.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            goToHomePage();
        }
    }, 1000);
    
    return countdownInterval;
}

// FUNCIONES PARA VOLVER A LA HOMEPAGE
// Función para volver a la Homepage y limpiar "Carrito" del localStorage al volver
const goToHomePage = () => {
    localStorage.removeItem("Carrito");
    window.location.href = "../index.html";
}

// EVENTOS
// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    showFinalOrder();
    const countdownInterval = startCountdown();
    
    // Evento del botón 'backToHomepage' que permite volver a la Homepage y anula el setTimeOut
    backToHomepage.addEventListener("click", () => {
        clearInterval(countdownInterval);
        goToHomePage();
    });
});