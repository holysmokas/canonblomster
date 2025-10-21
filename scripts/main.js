// scripts/main.js
import { db, auth } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

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
// Show & Hide Modal
// ---------------------
addProductBtn.addEventListener("click", () => {
    productModal.classList.add("show");
});

cancelBtn.addEventListener("click", () => {
    productModal.classList.remove("show");
    productForm.reset();
});

// ---------------------
// Add New Product
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

        alert("Produkt tilføjet!");
        productModal.classList.remove("show");
        productForm.reset();
    } catch (error) {
        console.error("Fejl ved tilføjelse af produkt:", error);
        alert("Noget gik galt, prøv igen.");
    }
});

// ---------------------
// Display Products in Real-Time
// ---------------------
const productsContainer = document.createElement("div");
productsContainer.classList.add("products-container");
dashboardContainer.appendChild(productsContainer);

function renderProducts(snapshot) {
    productsContainer.innerHTML = ""; // Clear before rendering

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
          <button class="edit-btn" data-id="${productId}">Rediger</button>
          <button class="delete-btn" data-id="${productId}">Slet</button>
        </div>
      </div>
    `;
        productsContainer.appendChild(productCard);
    });

    attachEditDeleteListeners();
}

onSnapshot(collection(db, "products"), (snapshot) => {
    renderProducts(snapshot);
});

// ---------------------
// Edit & Delete Logic
// ---------------------
function attachEditDeleteListeners() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            try {
                await deleteDoc(doc(db, "products", id));
                alert("Produkt slettet!");
            } catch (err) {
                console.error("Fejl ved sletning:", err);
            }
        });
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            openEditModal(id);
        });
    });
}

// ---------------------
// Edit Product Modal (reuse same form)
// ---------------------
async function openEditModal(productId) {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDocs(collection(db, "products"));

    const product = docSnap.docs.find((d) => d.id === productId)?.data();
    if (!product) return alert("Produkt ikke fundet!");

    productModal.classList.add("show");
    document.getElementById("productName").value = product.name;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productImage").value = product.image;

    productForm.onsubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "products", productId), {
                name: document.getElementById("productName").value.trim(),
                description: document.getElementById("productDescription").value.trim(),
                image: document.getElementById("productImage").value.trim()
            });
            alert("Produkt opdateret!");
            productModal.classList.remove("show");
            productForm.reset();
            productForm.onsubmit = null; // reset listener
        } catch (error) {
            console.error("Fejl ved opdatering:", error);
        }
    };
}

// ---------------------
// Logout
// ---------------------
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "admin-login.html";
    } catch (error) {
        console.error("Fejl ved log ud:", error);
    }
});
