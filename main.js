document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const toggleButton = document.querySelector(".header__toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (toggleButton && mobileNav) {
    toggleButton.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
    });
  }

  // Initialize Swiper for Featured Section
  var swiper = new Swiper(".featured__swiper-container", {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 3,
      },
    },
  });

  // Cart Drawer Elements
  const cartDrawer = document.getElementById("cartDrawer");
  const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
  const cartDrawerClose = document.getElementById("cartDrawerClose");
  const cartIcon = document.querySelector(".header__cart-icon");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartCount = document.querySelector(".cart-count");
  const checkoutButton = document.getElementById("checkoutButton");
  const cartSummary = document.querySelector(".cart-summary");

  // Initialize Cart Items from localStorage
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Function to Open Cart Drawer
  const openCartDrawer = () => {
    cartDrawer.classList.add("open");
    document.body.style.overflow = "hidden";
    renderCartItems();
  };

  // Function to Close Cart Drawer
  const closeCartDrawer = () => {
    cartDrawer.classList.remove("open");
    document.body.style.overflow = "";
  };

  // Event Listeners for Cart Drawer
  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener("click", closeCartDrawer);
  }

  if (cartDrawerClose) {
    cartDrawerClose.addEventListener("click", closeCartDrawer);
  }

  // Function to Render Cart Items
  const renderCartItems = () => {
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <p class="cart-empty__message">Your cart is empty.</p>
          <button class="button cart-empty__continue-button">Continue shopping</button>
        </div>
      `;
      cartSubtotal.textContent = "$0.00";
      cartCount.classList.remove("show");

      // Hide cart summary and checkout button
      cartSummary.style.display = "none";

      // Attach event listener to the "Continue Shopping" button
      const continueShoppingButton = document.querySelector(
        ".cart-empty__continue-button"
      );
      if (continueShoppingButton) {
        continueShoppingButton.addEventListener("click", () => {
          closeCartDrawer();
          window.location.href = "/"; // Adjust URL as needed
        });
      }
      return;
    }

    // Show cart summary and checkout button
    cartSummary.style.display = "block";

    let subtotal = 0;
    let totalItems = 0;

    cartItems.forEach((item) => {
      subtotal += item.price * item.quantity;
      totalItems += item.quantity;

      const cartItem = document.createElement("li");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item__image">
        <div class="cart-item__details">
          <p class="cart-item__name">${item.name}</p>
          <p class="cart-item__price">$${(item.price * item.quantity).toFixed(
            2
          )}</p>
          <div class="cart-item__actions">
            <input type="number" min="1" value="${
              item.quantity
            }" data-item-id="${item.id}" class="cart-item__quantity">
            <button data-item-id="${
              item.id
            }" class="cart-item__remove">Remove</button>
          </div>
        </div>
      `;

      cartItemsContainer.appendChild(cartItem);
    });

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartCount.textContent = totalItems.toString();

    // Show the cart count badge if there are items
    cartCount.classList.add("show");

    // Calculate and display the free shipping message
    const freeShippingThreshold = 150;
    const amountNeeded = freeShippingThreshold - subtotal;
    const freeShippingMessageElement = document.getElementById(
      "freeShippingMessage"
    );

    if (subtotal >= freeShippingThreshold) {
      freeShippingMessageElement.textContent = "You qualify for free shipping!";
    } else {
      freeShippingMessageElement.textContent = `Spend $${amountNeeded.toFixed(
        2
      )} more for free shipping.`;
    }

    // Save cart to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Attach event listeners for quantity change and remove buttons
    document.querySelectorAll(".cart-item__quantity").forEach((input) => {
      input.addEventListener("change", updateItemQuantity);
    });

    document.querySelectorAll(".cart-item__remove").forEach((button) => {
      button.addEventListener("click", removeItemFromCart);
    });
  };

  // Function to Update Item Quantity
  const updateItemQuantity = (event) => {
    const itemId = parseInt(event.target.dataset.itemId);
    const newQuantity = parseInt(event.target.value);

    const item = cartItems.find((item) => item.id === itemId);
    if (item && newQuantity > 0) {
      item.quantity = newQuantity;
      renderCartItems();
    }
  };

  // Function to Remove Item from Cart
  const removeItemFromCart = (event) => {
    const itemId = parseInt(event.target.dataset.itemId);
    cartItems = cartItems.filter((item) => item.id !== itemId);
    renderCartItems();
  };

  // Function to Add Item to Cart
  const addItemToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      cartItems.push(product);
    }
    renderCartItems();
  };

  // Load Cart Items on Page Load
  renderCartItems();

  // Checkout Button Click Event
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      // **Stripe Integration Point**
      // Here, you'll integrate with Stripe to create a checkout session
      // and redirect the user to the Stripe checkout page.
      // Example placeholder code:
      // fetch('/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items: cartItems }),
      // })
      //   .then(res => res.json())
      //   .then(data => {
      //     // Redirect to Stripe Checkout
      //     window.location.href = data.url;
      //   })
      //   .catch(error => console.error('Error:', error));
    });
  }

  // Example of adding an item to the cart (for testing purposes)
  // Uncomment the following lines to test adding items to the cart
  /*
  addItemToCart({
    id: 1,
    name: "Sample Product",
    price: 50.0,
    quantity: 1,
    image: "https://via.placeholder.com/80",
  });
  */
});
