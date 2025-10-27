// Firebase + App Script Integration-- >

import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// ⚠️ UPDATE THESE URLs
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxmBK4pcfTpQB9QT3pSrPlRKpMpNJ6gyWaKAEM7F1ayZnL4GKt0y7wqXZAvDld3Yekn/exec";
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1YN-F-UFBNswqo_9DCqV_rhfQdZ22yMtEk1VveVv2jBs/export?format=csv&gid=0";

const form = document.getElementById('addProductForm');
const addAnotherBtn = document.getElementById('addAnotherBtn');
const statusMessage = document.getElementById('statusMessage');
const logoutLink = document.getElementById('logoutLink');
const productsGrid = document.getElementById('productsGrid');

// Auth Guard
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.warn("⚠️ Not logged in – redirecting...");
        window.location.href = "admin-login.html";
    } else {
        console.log("✅ Logged in as:", user.email);
        loadProducts();
    }
});

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const category = document.getElementById('productCategory').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const imageInput = document.getElementById('productImage');

    if (!imageInput.files.length) {
        statusMessage.textContent = "⚠️ Vælg venligst et billede";
        statusMessage.style.color = "orange";
        return;
    }

    if (!category) {
        statusMessage.textContent = "⚠️ Vælg venligst en kategori";
        statusMessage.style.color = "orange";
        return;
    }

    let imageBase64 = "";
    let imageName = "";
    let imageType = "";

    const file = imageInput.files[0];
    imageName = file.name;
    imageType = file.type;

    const reader = new FileReader();
    await new Promise((resolve) => {
        reader.onload = () => {
            imageBase64 = reader.result.split(",")[1];
            resolve();
        };
        reader.readAsDataURL(file);
    });

    const product = { name, price, category, description, imageBase64, imageName, imageType };

    statusMessage.textContent = "⏳ Uploader produkt...";
    statusMessage.style.color = "#555";

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });

        statusMessage.textContent = "✅ Produkt tilføjet!";
        statusMessage.style.color = "green";
        form.reset();
        form.style.display = "none";
        addAnotherBtn.style.display = "inline-block";

        // Reload products after 2 seconds
        setTimeout(() => {
            loadProducts();
        }, 2000);

    } catch (err) {
        console.error("❌ Fejl:", err);
        statusMessage.textContent = "❌ Fejl: " + err.message;
        statusMessage.style.color = "red";
    }
});

// Reopen form
addAnotherBtn.addEventListener("click", () => {
    form.style.display = "block";
    addAnotherBtn.style.display = "none";
    statusMessage.textContent = "";
});

// Load products from sheet
async function loadProducts() {
    try {
        const res = await fetch(SHEET_CSV_URL);
        const text = await res.text();

        const lines = text.trim().split('\n');
        const products = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const cols = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));

            if (cols.length >= 3 && cols[0]) {
                products.push({
                    rowIndex: i + 1,
                    name: cols[0] || "Ukendt produkt",
                    price: cols[1] || "",
                    description: cols[2] || "",
                    imageUrl: fixDriveUrl(cols[3] || ""),
                    category: cols[4] || "normalt"
                });
            }
        }

        renderProducts(products);
    } catch (err) {
        console.error("Fejl ved indlæsning:", err);
        productsGrid.innerHTML = '<p class="no-products">Kunne ikke indlæse produkter</p>';
    }
}

// Fix Drive URLs
function fixDriveUrl(url) {
    if (!url) return "";

    let fileId = "";

    if (url.includes("drive.google.com/uc")) {
        const match = url.match(/[?&]id=([^&]+)/);
        if (match) fileId = match[1];
    } else if (url.includes("drive.google.com/thumbnail")) {
        return url;
    }

    if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    }

    return url;
}

// Render products
function renderProducts(products) {
    productsGrid.innerHTML = "";

    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">Ingen produkter endnu 🌸</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("admin-product-card");

        const imageHtml = product.imageUrl
            ? `<img src="${product.imageUrl}" alt="${product.name}" loading="lazy">`
            : `<div style="width:100%;height:200px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;border-radius:10px;">
               <span style="color:#999;">📷 Intet billede</span>
             </div>`;

        const categoryDisplay = product.category === 'stort' ? 'Stort' : 'Normalt';

        card.innerHTML = `
          ${imageHtml}
          <h3>${product.name}</h3>
          <span class="category-badge">${categoryDisplay}</span>
          <p>${product.description}</p>
          <p class="price">${product.price} kr</p>
          <button class="delete-btn" data-row="${product.rowIndex}" data-name="${product.name}">
            🗑️ Slet produkt
          </button>
        `;

        productsGrid.appendChild(card);
    });

    // Attach delete listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

// Handle delete
async function handleDelete(e) {
    const btn = e.currentTarget;
    const rowIndex = btn.getAttribute('data-row');
    const productName = btn.getAttribute('data-name');

    if (!confirm(`Er du sikker på at du vil slette "${productName}"?`)) {
        return;
    }

    btn.disabled = true;
    btn.textContent = "Sletter...";

    try {
        const deleteUrl = `${SCRIPT_URL}?action=delete&row=${rowIndex}`;

        await fetch(deleteUrl, {
            method: "GET",
            mode: "no-cors"
        });

        alert("✅ Produkt slettet!");

        setTimeout(() => {
            loadProducts();
        }, 1000);

    } catch (err) {
        console.error("Fejl ved sletning:", err);
        alert("❌ Kunne ikke slette produktet: " + err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = "🗑️ Slet produkt";
    }
}

// Logout
logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "admin-login.html";
});
