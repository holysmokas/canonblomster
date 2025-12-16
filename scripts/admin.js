// Firebase + App Script Integration

import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuIf2xc7cfpP4k185eiv-PVbIkYkETMGMio7q9bomS0vQwQSS8OMIJAQ8UF2bjR5Cl/exec";
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1YN-F-UFBNswqo_9DCqV_rhfQdZ22yMtEk1VveVv2jBs/export?format=csv&gid=0";
                       
const form = document.getElementById('addProductForm');
const addAnotherBtn = document.getElementById('addAnotherBtn');
const statusMessage = document.getElementById('statusMessage');
const logoutLink = document.getElementById('logoutLink');
const productsGrid = document.getElementById('productsGrid');

const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');

const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editProductForm');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editStatusMessage = document.getElementById('editStatusMessage');

let currentEditProduct = null;

// Create custom popup
function showPopup(message, type = 'info') {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' :
            type === 'error' ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' :
                'linear-gradient(135deg, #df20af 0%, #e85d75 100%)'};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

    popup.innerHTML = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

// Create confirm dialog
function showConfirm(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        max-width: 400px;
        text-align: center;
    `;

    dialog.innerHTML = `
        <p style="margin-bottom: 25px; font-size: 1.1em; color: #333;">${message}</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="confirmYes" style="padding: 12px 30px; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Ja, slet</button>
            <button id="confirmNo" style="padding: 12px 30px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Annuller</button>
        </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    document.getElementById('confirmYes').onclick = () => {
        overlay.remove();
        onConfirm();
    };

    document.getElementById('confirmNo').onclick = () => {
        overlay.remove();
    };

    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.warn("⚠️ Not logged in – redirecting...");
        window.location.href = "admin-login.html";
    } else {
        console.log("✅ Logged in as:", user.email);
        loadProducts();
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const category = document.getElementById('productCategory').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const paymentLink = document.getElementById('productPaymentLink').value.trim();
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

    const product = {
        name,
        price,
        category,
        description,
        paymentLink,
        imageBase64,
        imageName,
        imageType,
        available: "yes"
    };

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

        showPopup("✅ Produkt tilføjet!", "success");

        setTimeout(() => {
            loadProducts();
        }, 2000);

    } catch (err) {
        console.error("❌ Fejl:", err);
        statusMessage.textContent = "❌ Fejl: " + err.message;
        statusMessage.style.color = "red";
        showPopup("❌ Fejl: " + err.message, "error");
    }
});

addAnotherBtn.addEventListener("click", () => {
    form.style.display = "block";
    addAnotherBtn.style.display = "none";
    statusMessage.textContent = "";
});

async function loadProducts() {
    try {
        const res = await fetch(SHEET_CSV_URL);
        const text = await res.text();

        const lines = text.trim().split('\n');
        const products = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const cols = parseCSVLine(line);

            if (cols.length >= 3 && cols[0]) {
                products.push({
                    rowIndex: i + 1,
                    name: cols[0] || "Ukendt produkt",
                    price: cols[1] || "",
                    description: cols[2] || "",
                    imageUrl: fixDriveUrl(cols[3] || ""),
                    category: cols[4] || "normalt",
                    paymentLink: cols[5] || "",
                    available: cols[6] || "yes"
                });
            }
        }

        renderProducts(products);
    } catch (err) {
        console.error("Fejl ved indlæsning:", err);
        productsGrid.innerHTML = '<p class="no-products">Kunne ikke indlæse produkter</p>';
    }
}

function fixDriveUrl(url) {
    if (!url) return "";
    url = url.replace(/^"|"$/g, '').trim();

    let fileId = "";

    if (url.includes("drive.google.com/uc")) {
        const match = url.match(/[?&]id=([^&]+)/);
        if (match) fileId = match[1];
    } else if (url.includes("drive.google.com/thumbnail")) {
        const match = url.match(/[?&]id=([^&]+)/);
        if (match) fileId = match[1];
    } else if (url.includes("drive.google.com/file/d/")) {
        const match = url.match(/\/file\/d\/([^\/]+)/);
        if (match) fileId = match[1];
    }

    if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    }

    return url;
}

function renderProducts(products) {
    productsGrid.innerHTML = "";

    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">Ingen produkter endnu 🌸</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("admin-product-card");

        if (product.available === "no") {
            card.classList.add("unavailable");
        }

        const imageHtml = product.imageUrl
            ? `<img src="${product.imageUrl}" alt="${product.name}" loading="lazy" 
                class="product-thumbnail" data-full-url="${product.imageUrl}"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div style="width:100%;height:200px;background:#f0f0f0;display:none;align-items:center;justify-content:center;border-radius:10px;">
                 <span style="color:#999;">📷 Billede ikke tilgængeligt</span>
               </div>`
            : `<div style="width:100%;height:200px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;border-radius:10px;">
               <span style="color:#999;">📷 Intet billede</span>
             </div>`;

        const categoryDisplay = product.category === 'stort' ? 'Stort' : 'Normalt';
        const availabilityStatus = product.available === "no" ? "Ikke tilgængelig" : "Tilgængelig";
        const availabilityClass = product.available === "no" ? "unavailable-badge" : "available-badge";

        const paymentLinkHtml = product.paymentLink
            ? `<div class="payment-link-display">
                 💳 <a href="${product.paymentLink}" target="_blank" rel="noopener noreferrer">Betalingslink</a>
               </div>`
            : '';

        card.innerHTML = `
          ${imageHtml}
          <h3>${product.name}</h3>
          <span class="category-badge">${categoryDisplay}</span>
          <span class="availability-badge ${availabilityClass}">${availabilityStatus}</span>
          <p>${product.description}</p>
          <p class="price">${product.price} kr</p>
          ${paymentLinkHtml}
          <div class="admin-actions">
            <button class="edit-btn" data-row="${product.rowIndex}" data-product='${JSON.stringify(product)}'>
              ✏️ Rediger
            </button>
            <button class="toggle-availability-btn" data-row="${product.rowIndex}" data-available="${product.available}">
              ${product.available === "no" ? "✅ Aktivér" : "🚫 Deaktivér"}
            </button>
            <button class="delete-btn" data-row="${product.rowIndex}" data-name="${product.name}">
              🗑️ Slet
            </button>
          </div>
        `;

        productsGrid.appendChild(card);
    });

    attachImageClickListeners();
    attachEditListeners();
    attachToggleAvailabilityListeners();
    attachDeleteListeners();
}

function attachImageClickListeners() {
    document.querySelectorAll('.product-thumbnail').forEach(img => {
        img.addEventListener('click', () => {
            modalImage.src = img.getAttribute('data-full-url');
            imageModal.style.display = "flex";
        });
    });
}

closeModal.addEventListener('click', () => {
    imageModal.style.display = "none";
});

imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        imageModal.style.display = "none";
    }
});

function attachEditListeners() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEdit);
    });
}

function handleEdit(e) {
    const btn = e.currentTarget;
    const productData = JSON.parse(btn.getAttribute('data-product'));

    currentEditProduct = productData;

    document.getElementById('editProductName').value = productData.name;
    document.getElementById('editProductPrice').value = productData.price;
    document.getElementById('editProductCategory').value = productData.category;
    document.getElementById('editProductDescription').value = productData.description;
    document.getElementById('editProductPaymentLink').value = productData.paymentLink || "";

    editModal.style.display = "flex";
}

cancelEditBtn.addEventListener('click', () => {
    editModal.style.display = "none";
    editForm.reset();
    editStatusMessage.textContent = "";
    currentEditProduct = null;
});

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentEditProduct) return;

    const name = document.getElementById('editProductName').value.trim();
    const price = document.getElementById('editProductPrice').value.trim();
    const category = document.getElementById('editProductCategory').value.trim();
    const description = document.getElementById('editProductDescription').value.trim();
    const paymentLink = document.getElementById('editProductPaymentLink').value.trim();
    const imageInput = document.getElementById('editProductImage');

    editStatusMessage.textContent = "⏳ Opdaterer produkt...";
    editStatusMessage.style.color = "#555";

    try {
        const updateData = {
            action: "update",
            row: currentEditProduct.rowIndex,
            name,
            price,
            category,
            description,
            paymentLink,
            available: currentEditProduct.available
        };

        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const reader = new FileReader();

            const imageBase64 = await new Promise((resolve) => {
                reader.onload = () => {
                    resolve(reader.result.split(",")[1]);
                };
                reader.readAsDataURL(file);
            });

            updateData.imageBase64 = imageBase64;
            updateData.imageName = file.name;
            updateData.imageType = file.type;
        }

        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });

        editStatusMessage.textContent = "✅ Produkt opdateret!";
        editStatusMessage.style.color = "green";

        showPopup("✅ Produkt opdateret!", "success");

        setTimeout(() => {
            editModal.style.display = "none";
            editForm.reset();
            editStatusMessage.textContent = "";
            currentEditProduct = null;
            loadProducts();
        }, 1500);

    } catch (err) {
        console.error("Fejl ved opdatering:", err);
        editStatusMessage.textContent = "❌ Fejl: " + err.message;
        editStatusMessage.style.color = "red";
        showPopup("❌ Fejl: " + err.message, "error");
    }
});

function attachToggleAvailabilityListeners() {
    document.querySelectorAll('.toggle-availability-btn').forEach(btn => {
        btn.addEventListener('click', handleToggleAvailability);
    });
}

async function handleToggleAvailability(e) {
    const btn = e.currentTarget;
    const rowIndex = btn.getAttribute('data-row');
    const currentAvailability = btn.getAttribute('data-available');
    const newAvailability = currentAvailability === "yes" ? "no" : "yes";

    btn.disabled = true;
    btn.textContent = "⏳ Opdaterer...";

    try {
        const toggleUrl = `${SCRIPT_URL}?action=toggleAvailability&row=${rowIndex}&available=${newAvailability}`;

        await fetch(toggleUrl, {
            method: "GET",
            mode: "no-cors"
        });

        showPopup("✅ Tilgængelighed opdateret!", "success");

        setTimeout(() => {
            loadProducts();
        }, 1000);

    } catch (err) {
        console.error("Fejl ved skift af tilgængelighed:", err);
        showPopup("❌ Kunne ikke ændre tilgængelighed", "error");
        btn.disabled = false;
    }
}

function attachDeleteListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

async function handleDelete(e) {
    const btn = e.currentTarget;
    const rowIndex = btn.getAttribute('data-row');
    const productName = btn.getAttribute('data-name');

    showConfirm(`Er du sikker på at du vil slette "${productName}"?`, async () => {
        btn.disabled = true;
        btn.textContent = "Sletter...";

        try {
            const deleteUrl = `${SCRIPT_URL}?action=delete&row=${rowIndex}`;

            await fetch(deleteUrl, {
                method: "GET",
                mode: "no-cors"
            });

            showPopup("✅ Produkt slettet!", "success");

            setTimeout(() => {
                loadProducts();
            }, 1000);

        } catch (err) {
            console.error("Fejl ved sletning:", err);
            showPopup("❌ Kunne ikke slette produktet", "error");
        } finally {
            btn.disabled = false;
            btn.textContent = "🗑️ Slet produkt";
        }
    });
}

logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "admin-login.html";
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);