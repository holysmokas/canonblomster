
// ⚠️ CORRECT URL - DO NOT CHANGE THIS
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1YN-F-UFBNswqo_9DCqV_rhfQdZ22yMtEk1VveVv2jBs/export?format=csv&gid=0";

const imageGrid = document.getElementById("imageGrid");
const categoryFilter = document.getElementById("categoryFilter");

let allProducts = []; // Store all products for filtering

// Fix Drive URLs
function fixDriveUrl(url) {
    if (!url) return "";

    // Remove any quotes or extra whitespace
    url = url.replace(/^"|"$/g, '').trim();

    let fileId = "";

    if (url.includes("drive.google.com/uc")) {
        const match = url.match(/[?&]id=([^&]+)/);
        if (match) fileId = match[1];
    } else if (url.includes("drive.google.com/thumbnail")) {
        // Already in thumbnail format - just return it
        return url;
    }

    if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    }

    return url;
}

async function loadProducts() {
    try {
        const res = await fetch(SHEET_URL);
        const text = await res.text();

        // Parse CSV
        const lines = text.trim().split('\n');
        allProducts = [];

        // Skip header row (index 0), start from 1
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];

            // Handle CSV with commas in quoted fields
            const cols = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));

            if (cols.length >= 3 && cols[0]) { // At least name must exist
                const originalUrl = cols[3] || "";
                const fixedUrl = fixDriveUrl(originalUrl);
                const category = cols[4] ? cols[4].toLowerCase().trim() : "normalt";

                allProducts.push({
                    name: cols[0] || "Ukendt produkt",
                    price: cols[1] || "",
                    description: cols[2] || "",
                    imageUrl: fixedUrl,
                    category: category
                });
            }
        }

        console.log("Loaded products:", allProducts);
        console.log("Categories found:", allProducts.map(p => p.category));
        renderProducts(allProducts);
    } catch (err) {
        console.error("Fejl ved indlæsning af produkter:", err);
        imageGrid.innerHTML = "<p style='text-align: center; color: red;'>Kunne ikke indlæse produkter. Tjek konsollen for fejl. 🌸</p>";
    }
}

function renderProducts(products) {
    imageGrid.innerHTML = "";

    if (products.length === 0) {
        imageGrid.innerHTML = "<p style='text-align: center; color: #df20af;'>Ingen produkter fundet i denne kategori 🌸</p>";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        // Add error handling for images
        const imageHtml = product.imageUrl
            ? `<img src="${product.imageUrl}" alt="${product.name}"
        onerror="this.src='images/placeholder.jpg'; this.onerror=null;"
        loading="lazy">`
            : `<div style="width:100%;height:220px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;border-radius:10px;">
            <span style="color:#999;">📷 Intet billede</span>
        </div>`;

        card.innerHTML = `
        ${imageHtml}
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        ${product.price ? `<p><b>${product.price} kr</b></p>` : ""}
        `;
        imageGrid.appendChild(card);
    });
}

// Filter products based on category selection
function filterProducts(category) {
    console.log("Filtering by category:", category);

    if (category === 'all') {
        console.log("Showing all products:", allProducts.length);
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(product => {
            console.log(`Product: ${product.name}, Category: "${product.category}", Match: ${product.category === category}`);
            return product.category === category;
        });
        console.log(`Found ${filtered.length} products in category "${category}"`);
        renderProducts(filtered);
    }
}

// Load products on page load
document.addEventListener("DOMContentLoaded", loadProducts);

// Category filter functionality
categoryFilter.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    console.log("Filter changed to:", selectedCategory);
    filterProducts(selectedCategory);
});
