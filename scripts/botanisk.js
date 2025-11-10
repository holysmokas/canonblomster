// ⚠️ CORRECT URL - DO NOT CHANGE THIS
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1YN-F-UFBNswqo_9DCqV_rhfQdZ22yMtEk1VveVv2jBs/export?format=csv&gid=0";

const imageGrid = document.getElementById("imageGrid");
const categoryFilter = document.getElementById("categoryFilter");

let allProducts = []; // Store all products for filtering

// Proper CSV parser that handles quoted fields with commas
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // Add last field
    result.push(current.trim());

    return result;
}

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
    } else if (url.includes("drive.google.com/file/d/")) {
        // Extract file ID from /file/d/ format
        const match = url.match(/\/file\/d\/([^\/]+)/);
        if (match) fileId = match[1];
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

        console.log(`Total lines in CSV: ${lines.length}`);

        // Skip header row (index 0), start from 1
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];

            // Use proper CSV parser
            const cols = parseCSVLine(line);

            console.log(`Row ${i}: ${cols.length} columns`, cols);

            if (cols.length >= 3 && cols[0]) { // At least name must exist
                const originalUrl = cols[3] || "";
                const fixedUrl = fixDriveUrl(originalUrl);
                const category = cols[4] ? cols[4].toLowerCase().trim() : "normalt";
                const paymentLink = cols[5] ? cols[5].trim() : ""; // Get payment link from column 6

                const product = {
                    name: cols[0] || "Ukendt produkt",
                    price: cols[1] || "",
                    description: cols[2] || "",
                    imageUrl: fixedUrl,
                    category: category,
                    paymentLink: paymentLink
                };

                console.log(`Product ${i}:`, product);
                allProducts.push(product);
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

        // Add error handling for images with hover zoom effect
        const imageHtml = product.imageUrl
            ? `<div class="product-image-container" style="position:relative;overflow:hidden;border-radius:10px;height:220px;">
                 <img src="${product.imageUrl}" alt="${product.name}"
                   class="product-image"
                   style="width:100%;height:100%;object-fit:cover;transition:transform 0.3s ease;cursor:zoom-in;"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                   loading="lazy"
                   onmouseover="this.style.transform='scale(1.15)'"
                   onmouseout="this.style.transform='scale(1)'">
                 <div style="width:100%;height:220px;background:#f0f0f0;display:none;align-items:center;justify-content:center;border-radius:10px;">
                   <span style="color:#999;">📷 Billede ikke tilgængeligt</span>
                 </div>
               </div>`
            : `<div style="width:100%;height:220px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;border-radius:10px;">
                 <span style="color:#999;">📷 Intet billede</span>
               </div>`;

        // Add payment link button if available
        const paymentButton = product.paymentLink
            ? `<a href="${product.paymentLink}" target="_blank" rel="noopener noreferrer" 
                  style="display:inline-block;margin-top:10px;padding:10px 20px;background:linear-gradient(135deg, #df20af 0%, #e85d75 100%);color:white;text-decoration:none;border-radius:8px;font-weight:600;transition:transform 0.2s ease,box-shadow 0.2s ease;"
                  onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 15px rgba(223,32,175,0.3)'"
                  onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
                  💳 Køb nu
               </a>`
            : '';

        card.innerHTML = `
            ${imageHtml}
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            ${product.price ? `<p><b>${product.price} kr</b></p>` : ""}
            ${paymentButton}
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