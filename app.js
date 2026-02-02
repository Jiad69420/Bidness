/* ============================================
   MAIN APPLICATION LOGIC
   ============================================ */

   let cart = JSON.parse(localStorage.getItem('cart')) || [];

   // Initialize page
   document.addEventListener('DOMContentLoaded', function() {
       displayProducts();
       updateCartCount();
   });
   
   // Display products
   function displayProducts() {
       const productGrid = document.getElementById('productGrid');
       const products = ProductManager.getProducts();
       
       if (products.length === 0) {
           productGrid.innerHTML = `
               <div class="no-products">
                   <h3>No products available yet</h3>
                   <p>Check back soon for our collection!</p>
               </div>
           `;
           return;
       }
       
       productGrid.innerHTML = products.map(product => `
           <div class="product-card">
               <div class="product-image">
                   <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
               </div>
               <div class="product-info">
                   <h3 class="product-name">${product.name}</h3>
                   <p class="product-category">${product.category}</p>
                   <p class="product-price">${CONFIG.currency}${product.price}</p>
                   <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
               </div>
           </div>
       `).join('');
   }
   
   // Add to cart
   function addToCart(productId) {
       const products = ProductManager.getProducts();
       const product = products.find(p => p.id === productId);
       
       if (!product) {
           showToast('Product not found');
           return;
       }
       
       const existingItem = cart.find(item => item.id === productId);
   
       if (existingItem) {
           existingItem.quantity += 1;
       } else {
           cart.push({
               ...product,
               quantity: 1
           });
       }
   
       saveCart();
       updateCartCount();
       showToast('Added to cart!');
   }
   
   // Remove from cart
   function removeFromCart(productId) {
       cart = cart.filter(item => item.id !== productId);
       saveCart();
       updateCartCount();
       displayCart();
       showToast('Item removed from cart');
   }
   
   // Update quantity
   function updateQuantity(productId, change) {
       const item = cart.find(item => item.id === productId);
       if (item) {
           item.quantity += change;
           if (item.quantity <= 0) {
               removeFromCart(productId);
           } else {
               saveCart();
               displayCart();
           }
       }
   }
   
   // Save cart to localStorage
   function saveCart() {
       localStorage.setItem('cart', JSON.stringify(cart));
   }
   
   // Update cart count
   function updateCartCount() {
       const count = cart.reduce((total, item) => total + item.quantity, 0);
       document.getElementById('cartCount').textContent = count;
   }
   
   // Display cart
   function displayCart() {
       const cartItems = document.getElementById('cartItems');
       const cartEmpty = document.getElementById('cartEmpty');
       const cartContainer = document.getElementById('cartContainer');
       
       // Check if cart page elements exist (might not if on different page)
       if (!cartItems || !cartEmpty || !cartContainer) {
           return;
       }
   
       if (cart.length === 0) {
           cartEmpty.style.display = 'block';
           cartContainer.style.display = 'none';
           return;
       }
   
       cartEmpty.style.display = 'none';
       cartContainer.style.display = 'block';
   
       cartItems.innerHTML = cart.map(item => `
           <div class="cart-item">
               <div class="cart-item-image">
                   <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/120x120?text=No+Image'">
               </div>
               <div class="cart-item-details">
                   <h3>${item.name}</h3>
                   <p>${item.category}</p>
                   <div class="cart-item-price">${CONFIG.currency}${item.price}</div>
                   <div class="cart-item-actions">
                       <div class="quantity-controls">
                           <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                           <span class="quantity-display">${item.quantity}</span>
                           <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                       </div>
                       <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                   </div>
               </div>
               <div class="cart-item-price">${CONFIG.currency}${item.price * item.quantity}</div>
           </div>
       `).join('');
   
       updateCartSummary();
   }
   
   // Update cart summary
   function updateCartSummary() {
       const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
       
       // Safely update elements only if they exist
       const subtotalEl = document.getElementById('subtotal');
       const totalEl = document.getElementById('total');
       const checkoutTotalEl = document.getElementById('checkoutTotal');
       
       if (subtotalEl) subtotalEl.textContent = `${CONFIG.currency}${subtotal}`;
       if (totalEl) totalEl.textContent = `${CONFIG.currency}${subtotal}`;
       if (checkoutTotalEl) checkoutTotalEl.textContent = `${CONFIG.currency}${subtotal}`;
   }
   
   // Page navigation
   function showHomePage() {
       document.getElementById('heroSection').style.display = 'flex';
       document.getElementById('productsSection').style.display = 'block';
       document.getElementById('cartPage').classList.remove('active');
       window.scrollTo({ top: 0, behavior: 'smooth' });
   }
   
   function showProductsPage() {
       document.getElementById('heroSection').style.display = 'none';
       document.getElementById('productsSection').style.display = 'block';
       document.getElementById('cartPage').classList.remove('active');
       document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
   }
   
   function showCartPage() {
       document.getElementById('heroSection').style.display = 'none';
       document.getElementById('productsSection').style.display = 'none';
       document.getElementById('cartPage').classList.add('active');
       displayCart();
       window.scrollTo({ top: 0, behavior: 'smooth' });
   }
   
   // Checkout modal
   function openCheckoutModal() {
       if (cart.length === 0) {
           showToast('Your cart is empty!');
           return;
       }
       document.getElementById('checkoutModal').classList.add('active');
       updateCartSummary();
       // Reset form validation
       document.getElementById('checkoutForm').reset();
       clearAllErrors();
   }
   
   function closeCheckoutModal() {
       document.getElementById('checkoutModal').classList.remove('active');
       // Reset form when closing
       document.getElementById('checkoutForm').reset();
       clearAllErrors();
   }
   
   // Form validation functions
   function validateName(name) {
       const trimmed = name.trim();
       const nameRegex = /^[A-Za-z\s]+$/;
       return trimmed.length >= 3 && nameRegex.test(trimmed);
   }
   
   function validatePhone(phone) {
       // Bangladesh phone number validation
       // Accepts: 01712345678, +8801712345678, 8801712345678
       const cleanPhone = phone.replace(/\s+/g, '');
       const phoneRegex = /^(\+?88)?0?1[3-9]\d{8}$/;
       return phoneRegex.test(cleanPhone);
   }
   
   function validateAddress(address) {
       const trimmed = address.trim();
       return trimmed.length >= 10;
   }
   
   function showError(inputId, errorId) {
       document.getElementById(inputId).classList.add('invalid');
       document.getElementById(errorId).classList.add('show');
   }
   
   function clearError(inputId, errorId) {
       document.getElementById(inputId).classList.remove('invalid');
       document.getElementById(errorId).classList.remove('show');
   }
   
   function clearAllErrors() {
       const errors = ['nameError', 'phoneError', 'addressError'];
       const inputs = ['customerName', 'customerPhone', 'customerAddress'];
       
       errors.forEach(errorId => {
           document.getElementById(errorId).classList.remove('show');
       });
       
       inputs.forEach(inputId => {
           document.getElementById(inputId).classList.remove('invalid');
       });
   }
   
   // Real-time validation
   document.addEventListener('DOMContentLoaded', function() {
       const nameInput = document.getElementById('customerName');
       const phoneInput = document.getElementById('customerPhone');
       const addressInput = document.getElementById('customerAddress');
       
       if (nameInput) {
           nameInput.addEventListener('blur', function() {
               if (this.value.trim() !== '') {
                   if (validateName(this.value)) {
                       clearError('customerName', 'nameError');
                   } else {
                       showError('customerName', 'nameError');
                   }
               }
           });
           
           nameInput.addEventListener('input', function() {
               if (this.classList.contains('invalid')) {
                   if (validateName(this.value)) {
                       clearError('customerName', 'nameError');
                   }
               }
           });
       }
       
       if (phoneInput) {
           phoneInput.addEventListener('blur', function() {
               if (this.value.trim() !== '') {
                   if (validatePhone(this.value)) {
                       clearError('customerPhone', 'phoneError');
                   } else {
                       showError('customerPhone', 'phoneError');
                   }
               }
           });
           
           phoneInput.addEventListener('input', function() {
               if (this.classList.contains('invalid')) {
                   if (validatePhone(this.value)) {
                       clearError('customerPhone', 'phoneError');
                   }
               }
           });
       }
       
       if (addressInput) {
           addressInput.addEventListener('blur', function() {
               if (this.value.trim() !== '') {
                   if (validateAddress(this.value)) {
                       clearError('customerAddress', 'addressError');
                   } else {
                       showError('customerAddress', 'addressError');
                   }
               }
           });
           
           addressInput.addEventListener('input', function() {
               if (this.classList.contains('invalid')) {
                   if (validateAddress(this.value)) {
                       clearError('customerAddress', 'addressError');
                   }
               }
           });
       }
   });
   
   // Handle checkout form submission
   document.getElementById('checkoutForm').addEventListener('submit', function(e) {
       e.preventDefault();
   
       const name = document.getElementById('customerName').value;
       const phone = document.getElementById('customerPhone').value;
       const address = document.getElementById('customerAddress').value;
       const notes = document.getElementById('customerNotes').value;
   
       // Validate all fields
       let isValid = true;
       
       if (!validateName(name)) {
           showError('customerName', 'nameError');
           isValid = false;
       } else {
           clearError('customerName', 'nameError');
       }
       
       if (!validatePhone(phone)) {
           showError('customerPhone', 'phoneError');
           isValid = false;
       } else {
           clearError('customerPhone', 'phoneError');
       }
       
       if (!validateAddress(address)) {
           showError('customerAddress', 'addressError');
           isValid = false;
       } else {
           clearError('customerAddress', 'addressError');
       }
       
       if (!isValid) {
           showToast('Please fix the errors in the form');
           return;
       }
   
       // Generate order ID
       const orderId = 'ORD' + Date.now().toString().slice(-6);
   
       // Create order summary
       let orderMessage = `Hello ${CONFIG.storeName}! 🛍️\n\n`;
       orderMessage += `*ORDER ${orderId}*\n`;
       orderMessage += `━━━━━━━━━━━━━━━\n\n`;
       
       orderMessage += `*PRODUCTS:*\n`;
       cart.forEach(item => {
           orderMessage += `• ${item.quantity}x ${item.name} - ${CONFIG.currency}${item.price * item.quantity}\n`;
       });
       
       const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
       orderMessage += `\n*TOTAL: ${CONFIG.currency}${total}*\n\n`;
       
       orderMessage += `━━━━━━━━━━━━━━━\n`;
       orderMessage += `*DELIVERY DETAILS:*\n`;
       orderMessage += `Name: ${name}\n`;
       orderMessage += `Phone: ${phone}\n`;
       orderMessage += `Address: ${address}\n`;
       
       if (notes) {
           orderMessage += `\nSpecial Instructions: ${notes}\n`;
       }
       
       orderMessage += `\nPlease confirm and send payment details. Thank you! 🖤`;
   
       // Encode message for WhatsApp URL
       const encodedMessage = encodeURIComponent(orderMessage);
       const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
   
       // Open WhatsApp
       window.open(whatsappUrl, '_blank');
   
       // Clear cart and close modal
       showToast('Redirecting to WhatsApp...');
       setTimeout(() => {
           cart = [];
           saveCart();
           updateCartCount();
           closeCheckoutModal();
           // Don't call showCartPage() here - user might navigate away
           this.reset();
           clearAllErrors();
       }, 1000);
   });
   
   // Toast notification
   function showToast(message) {
       const toast = document.getElementById('toast');
       toast.textContent = message;
       toast.classList.add('show');
       setTimeout(() => {
           toast.classList.remove('show');
       }, 3000);
   }
   
   // Close modal on background click
   document.getElementById('checkoutModal').addEventListener('click', function(e) {
       if (e.target === this) {
           closeCheckoutModal();
       }
   });