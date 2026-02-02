/* ============================================
   PRODUCTS DATA MANAGEMENT
   ============================================
   Products are stored in browser localStorage
   This allows them to be edited via admin panel
*/

// Default products (loaded on first visit)
const defaultProducts = [
    {
        id: 1,
        name: "Gothic Rose Choker",
        category: "Jewelry",
        price: 89,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        name: "Serpent Ring Set",
        category: "Jewelry",
        price: 125,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Midnight Lace Bodysuit",
        category: "Lingerie",
        price: 165,
        image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop"
    },
    {
        id: 4,
        name: "Obsidian Pendant",
        category: "Jewelry",
        price: 145,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Velvet Garter Belt",
        category: "Lingerie",
        price: 95,
        image: "https://images.unsplash.com/photo-1583225214464-9296029427aa?w=400&h=400&fit=crop"
    },
    {
        id: 6,
        name: "Crescent Moon Earrings",
        category: "Jewelry",
        price: 75,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
    },
    {
        id: 7,
        name: "Silk Robe - Crimson",
        category: "Lingerie",
        price: 185,
        image: "https://images.unsplash.com/photo-1596783047899-a923e0d04e8c?w=400&h=400&fit=crop"
    },
    {
        id: 8,
        name: "Victorian Brooch",
        category: "Accessories",
        price: 110,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop"
    },
    {
        id: 9,
        name: "Lace Stockings",
        category: "Lingerie",
        price: 65,
        image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=400&fit=crop"
    },
    {
        id: 10,
        name: "Onyx Cuff Bracelet",
        category: "Jewelry",
        price: 135,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop"
    },
    {
        id: 11,
        name: "Mesh Bodysuit - Black",
        category: "Lingerie",
        price: 155,
        image: "https://images.unsplash.com/photo-1583225214464-9296029427aa?w=400&h=400&fit=crop"
    },
    {
        id: 12,
        name: "Raven Feather Necklace",
        category: "Jewelry",
        price: 99,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"
    },
    {
        id: 13,
        name: "Satin Gloves",
        category: "Accessories",
        price: 55,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop"
    },
    {
        id: 14,
        name: "Blood Stone Ring",
        category: "Jewelry",
        price: 115,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop"
    },
    {
        id: 15,
        name: "Thigh-High White Stockings",
        category: "Lingerie",
        price: 125,
        image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=400&fit=crop"
    }
];

// Get products from localStorage or use defaults
function getProducts() {
    const stored = localStorage.getItem('products');
    if (!stored) {
        // First time - save defaults
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return JSON.parse(stored);
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Get next available product ID
function getNextProductId() {
    const products = getProducts();
    if (products.length === 0) return 1;
    return Math.max(...products.map(p => p.id)) + 1;
}

// Export for use in other files
window.ProductManager = {
    getProducts,
    saveProducts,
    getNextProductId,
    defaultProducts
};
