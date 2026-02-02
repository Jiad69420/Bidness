/* ============================================
   ADMIN PANEL LOGIC
   ============================================ */

let currentEditId = null;

// Check if logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    if (isLoggedIn()) {
        showAdminPanel();
    }
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    
    if (password === CONFIG.adminPassword) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        showToast('Login successful!', 'success');
    } else {
        showToast('Incorrect password', 'danger');
        document.getElementById('password').value = '';
    }
});

// Check if logged in
function isLoggedIn() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminPanel').classList.add('active');
    loadDashboard();
}

// Logout
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.reload();
}

// Load dashboard
function loadDashboard() {
    updateStats();
    displayProductsTable();
}

// Update statistics
function updateStats() {
    const products = ProductManager.getProducts();
    
    // Total products
    document.getElementById('totalProducts').textContent = products.length;
    
    // Unique categories
    const categories = new Set(products.map(p => p.category));
    document.getElementById('totalCategories').textContent = categories.size;
    
    // Total inventory value
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    document.getElementById('totalValue').textContent = `${CONFIG.currency}${totalValue}`;
}

// Display products table
function displayProductsTable() {
    const products = ProductManager.getProducts();
    const container = document.getElementById('productsTableContainer');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No products yet</h3>
                <p>Click "Add Product" to create your first product</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <table class="products-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>
                            <img src="${product.image}" 
                                 alt="${product.name}" 
                                 class="product-image-small"
                                 onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
                        </td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${CONFIG.currency}${product.price}</td>
                        <td>
                            <div class="product-actions">
                                <button class="btn btn-secondary btn-small" onclick="editProduct(${product.id})">Edit</button>
                                <button class="btn btn-danger btn-small" onclick="confirmDeleteProduct(${product.id})">Delete</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Open add product modal
function openAddProductModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').classList.add('active');
}

// Close product modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    currentEditId = null;
}

// Edit product
function editProduct(id) {
    const products = ProductManager.getProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) {
        showToast('Product not found', 'danger');
        return;
    }
    
    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    
    document.getElementById('productModal').classList.add('active');
}

// Confirm delete product
function confirmDeleteProduct(id) {
    const products = ProductManager.getProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) {
        showToast('Product not found', 'danger');
        return;
    }
    
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        deleteProduct(id);
    }
}

// Delete product
function deleteProduct(id) {
    let products = ProductManager.getProducts();
    products = products.filter(p => p.id !== id);
    ProductManager.saveProducts(products);
    
    loadDashboard();
    showToast('Product deleted successfully', 'success');
}

// Product form submission
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value.trim();
    
    // Validation
    if (!name || !category || !price || !image) {
        showToast('Please fill in all fields', 'danger');
        return;
    }
    
    if (price <= 0) {
        showToast('Price must be greater than 0', 'danger');
        return;
    }
    
    // Check if valid URL
    try {
        new URL(image);
    } catch (e) {
        showToast('Please enter a valid image URL', 'danger');
        return;
    }
    
    let products = ProductManager.getProducts();
    
    if (currentEditId) {
        // Edit existing product
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            products[index] = {
                id: currentEditId,
                name,
                category,
                price,
                image
            };
            showToast('Product updated successfully', 'success');
        }
    } else {
        // Add new product
        const newProduct = {
            id: ProductManager.getNextProductId(),
            name,
            category,
            price,
            image
        };
        products.push(newProduct);
        showToast('Product added successfully', 'success');
    }
    
    ProductManager.saveProducts(products);
    closeProductModal();
    loadDashboard();
});

// Toast notification
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    if (type) {
        toast.classList.add(type);
    }
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modal on background click
document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeProductModal();
    }
});
