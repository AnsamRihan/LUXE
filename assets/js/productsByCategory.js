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

/*----------------get products and pagination depending on a category----------------*/

const productsSection = document.querySelector(".products-section");
const pagination = document.querySelector(".pagination");

const productsPerPage = 10;
let currentPage = 1;
let totalProducts = 0;
const sortBy = "title";
const order = "asc";

//filter by select
const sortBy = document.querySelector("#sortBy");

sortBy.addEventListener("change", () => {
    switch (sortBy.value) {
        case "az":
            sortBy = "title";
            order = "asc";
            break;

        case "za":
            sortBy = "title";
            order = "desc";
            break;

        case "priceLow":
            sortBy = "price";
            order = "asc";
            break;

        case "priceHigh":
            sortBy = "price";
            order = "desc";
            break;
    }
});

// Fetch products by Category from API
async function fetchProducts(page = 1) {
    try {
        const skip = (page - 1) * productsPerPage;

        const response = await axios.get(
            `https://dummyjson.com/products/category/${category}?limit=${productsPerPage}&skip=${skip}&sortBy=${sortBy}&order=${order}`
        );

        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            products: [],
            total: 0
        };
    }
}

