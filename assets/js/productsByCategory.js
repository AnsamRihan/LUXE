"use strict";

const params = new URLSearchParams(location.search);
const category = params.get('category');

/*----------------get categories for header (navbar)----------------*/

async function fetchCategories() {
    try {
        const response = await axios.get("https://dummyjson.com/products/category-list");
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

// Split array into groups of a specific size
function chunkArray(array, size) {
    const chunks = [];

    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }

    return chunks;
}


async function loadCategories() {
    const categories = await fetchCategories();

    const shopDropdownHover = document.querySelector("#shopDropdownHover");
    
    const categoryColumns = chunkArray(categories, 6);
    shopDropdownHover.innerHTML = `
    <div class="grid px-4 py-5 text-sm grid-cols-${categoryColumns.length} gap-3 categories-navbar-link mx-15.5">
    </div>
    `;

    const categoriesNavlink = document.querySelector(".categories-navbar-link");
    if (!categoriesNavlink) return;
    const categoriesSidebar = document.querySelector(".categories-sidebar");
    if (!categoriesSidebar) return;

    categoriesNavlink.innerHTML = categoryColumns.map(column => {
        return `
            <ul class="stack gap-3 items-start">
                ${column.map(category => {
                    return `
                        <li>
                            <a href="products.html?category=${category}" 
                               class="nav-link gap-1.5">
                                ${category}
                            </a>
                        </li>
                    `;
                }).join("")}
            </ul>
        `;
    }).join("");

    categoriesSidebar.innerHTML = categories.map(category => {
        return `
            <li>
                <a href="products.html?category=${category}"
                    class="nav-link w-full flex items-center px-4 py-2 border-b border-[#d2d2d2]">
                    ${category}
                </a>
            </li>
        `;
    }).join("");
}

loadCategories();

const loadeBreadcrumbCategoryName = () => {
    const formattedCategory = category.replaceAll("-", " ");
    document.querySelectorAll(".category-name").forEach(categoryTitle => {
        categoryTitle.textContent = formattedCategory;
    });
}

loadeBreadcrumbCategoryName();

/*----------------get products depending on a category----------------*/

const pagination = document.querySelector(".pagination");

const productsPerPage = 10;
let currentPage = 1;
let totalProducts = 0;
let sortBy = localStorage.getItem("sortBy") || "title";
let order = localStorage.getItem("order") || "asc";

//filter by select
const sortBy_select = document.querySelector("#sortBy");

function loadSelectedSort() {
    if (sortBy === "title" && order === "asc") {
        sortBy_select.value = "az";
    } 
    else if (sortBy === "title" && order === "desc") {
        sortBy_select.value = "za";
    } 
    else if (sortBy === "price" && order === "asc") {
        sortBy_select.value = "lowToHigh";
    } 
    else if (sortBy === "price" && order === "desc") {
        sortBy_select.value = "highToLow";
    }
}

loadSelectedSort();

sortBy_select.addEventListener("change", () => {
    switch (sortBy_select.value) {
        case "az":
            sortBy = "title";
            order = "asc";
            break;
        case "za":
            sortBy = "title";
            order = "desc";
            break;

        case "lowToHigh":
            sortBy = "price";
            order = "asc";
            break;

        case "highToLow":
            sortBy = "price";
            order = "desc";
            break;
    }

    // Save selection
    localStorage.setItem("sortBy", sortBy);
    localStorage.setItem("order", order);
    loadProducts();
});

// Fetch products by Category from API
async function fetchProducts(page = 1) {
    try {
        const skip = (page - 1) * productsPerPage;

        const response = await axios.get(
            `https://dummyjson.com/products/category/${category}?limit=${productsPerPage}&skip=${skip}&sortBy=${sortBy}&order=${order}`
        );

        return response.data;

    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            products: [],
            total: 0
        };
    }
}

async function loadProducts() {
    const data = await fetchProducts(currentPage);
    totalProducts = data.total;
    const products = data.products;

    const productsSection = document.querySelector(".products");
    if (!productsSection) return;

    productsSection.innerHTML = products.map(product => {
        let stars = "";
        const filledStars = Math.round(product.rating);

        for (let i = 0; i < 5; i++) {
            if (i < filledStars) {
                stars += `<i class="fa-solid fa-star"></i>`;
            } else {
                stars += `<i class="fa-regular fa-star"></i>`;
            }
        }

        updatePaginationButtons();

        return `
            <div class="product stack gap-4  group/product">
                <!--image-->
                <div class="overflow-hidden aspect-[4/5] group rounded-[4px] border border-[#C6C6CD] bg-image-bg w-full">
                    <a href="product.html?product=${product.id}">
                        <img src="${product.thumbnail}" alt="${product.title}"
                        class="w-full object-cover translate-y-6 transition-transform duration-500 ease-out group-hover/product:scale-110"/>
                    </a>
                </div>

                <!--product info-->
                <div class="stack gap-1 items-start w-full group">
                    <div class="stars text-primary text-[12px] sm:text-sm row gap-1">
                        ${stars}
                        <span>${product.rating}</span>
                    </div>
                    <h3 class="text-[14px] lg:text-[15.5px] font-regular text-primary-foreground group-hover/product:text-primary transition-all duration-200 ease-in-out">
                        <a href="product.html?product=${product.id}">
                            ${product.title}
                        </a>
                    </h3>
                    <p class="text-[14px] lg:text-[15px] font-bold">
                        $${product.price.toFixed(2)}
                    </p>
                </div>
            </div>
        `;
    }).join("");
}

loadProducts();

/*----------------Pagination----------------*/

const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

function updatePaginationButtons() {
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    prevBtn.classList.toggle("text-[#c5c3c6]", currentPage === 1);
    nextBtn.classList.toggle("text-[#c5c3c6]", currentPage === totalPages);
}

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadProducts(currentPage);
    }
});


nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        loadProducts(currentPage);
    }
});