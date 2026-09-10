let cart = [];

function addToCart(productName, price) {

    let existingProduct = cart.find(
        product => product.name === productName
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });

    }

    displayCart();
}


function displayCart() {

    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = "<p>Your cart is empty.</p>";

        cartTotal.textContent = "Total: ₹0";

        return;
    }

    let total = 0;

    cart.forEach(function(product, index) {

        let itemTotal = product.price * product.quantity;

        total = total + itemTotal;

        cartItems.innerHTML += `
        
        <div class="cart-item">

            <div>
                <h3>${product.name}</h3>
                <p>₹${product.price} × ${product.quantity}</p>
            </div>

            <div>

                <button onclick="changeQuantity(${index}, -1)">
                    −
                </button>

                <span>${product.quantity}</span>

                <button onclick="changeQuantity(${index}, 1)">
                    +
                </button>

                <button onclick="removeFromCart(${index})">
                    Remove
                </button>

            </div>

        </div>
        
        `;
    });

    cartTotal.textContent = "Total: ₹" + total;
}


function changeQuantity(index, change) {

    cart[index].quantity =
        cart[index].quantity + change;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    displayCart();
}


function removeFromCart(index) {

    cart.splice(index, 1);

    displayCart();
}


function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

document.getElementById("checkout".scrollIntoView({ behavior: "smooth" }));
}
document.getElementById("checkoutForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const order = {
            orderDate: new Date().toLocaleString(),
            customerName:
                document.getElementById("customerName").value,

            customerPhone:
                document.getElementById("customerPhone").value,

            customerAddress:
                document.getElementById("customerAddress").value,

            customerCity:
                document.getElementById("customerCity").value,

            customerPincode:
                document.getElementById("customerPincode").value,

            products: cart
        };

        try {

            const response = await fetch(
                "http://localhost:5000/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(order)
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert(
                    "Order placed successfully! Order ID: " +
                    data.orderId
                );

                cart = [];

                displayCart();

                document
                    .getElementById("checkoutForm")
                    .reset();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server. Make sure the backend is running."
            );

        }

    });