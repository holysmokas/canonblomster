// scripts/main.js
import {
    db,
    auth,
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    signOut
} from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// ---------------------
// DOM Elements
// ---------------------
const addProductBtn = document.getElementById("addProductBtn");
const productModal = document.getElementById("productModal");
const cancelBtn = document.getElementById("cancelBtn");
const productForm = document.getElementById("productForm");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardContainer = document.querySelector(".dashboard-container");

// ---------------------
// Auth guard
// ---------------------
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.warn("❌ Not logged in — redirecting to login...");
        window.location.href = "admin-login.html";
    } else {
        console.log("✅ Logged in as:", user.email);
    }
});

// ---------------------
// Show/Hide modal
// ---------------------
addProductBtn.addEventListener("click", () => {
    productModal.classList.add("show");
});

cancelBtn.addEventListener("click", () => {
    productModal.classList.remove("show");
    productForm.reset();
});

// ---------------------
// Add product
// ---------------------
productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const description = document.getElementById("productDescription").value.trim();
    const image = document.getElementById("productImage").value.trim();

    if (!name || !description || !image) {
        alert("Udfyld venligst alle felter.");
        return;
    }

    try {
        await addDoc(collection(db, "products"), {
            name,
            description,
            image,
            createdAt: new Date()
        });

        alert("✅ Produkt tilføjet!");
        productModal.classList.remove("show");
        productForm.reset();
    } catch (error) {
        console.error("❌ Fejl ved tilføjelse:", error);
        alert("Kun administratoren kan tilføje produkter.");
    }
});

// ---------------------
// Display products live
// ---------------------
const productsContainer = document.createElement("div");
productsContainer.classList.add("products-container");
dashboardContainer.appendChild(productsContainer);

function renderProducts(snapshot) {
    productsContainer.innerHTML = "";

    snapshot.forEach((docSnap) => {
        const product = docSnap.data();
        const productId = docSnap.id;

        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
      <div class="product">
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-actions">
          <button class="delete-btn" data-id="${productId}">Slet</button>
        </div>
      </div>
    `;
        productsContainer.appendChild(productCard);
    });

    attachDeleteListeners();
}

onSnapshot(collection(db, "products"), (snapshot) => {
    renderProducts(snapshot);
});

// ---------------------
// Delete logic
// ---------------------
function attachDeleteListeners() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            try {
                await deleteDoc(doc(db, "products", id));
                alert("Produkt slettet!");
            } catch (err) {
                console.error("Fejl ved sletning:", err);
                alert("Kun administratoren kan slette produkter.");
            }
        });
    });
}

// ---------------------
// Logout
// ---------------------
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "admin-login.html";
});
