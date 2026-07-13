"use strict";

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

    const shopDropdownHover = document.getElementById("shopDropdownHover");
    
    const categoryColumns = chunkArray(categories, 6);
    shopDropdownHover.innerHTML = `
    <div class="grid px-4 py-5 text-sm grid-cols-${categoryColumns.length} gap-3 categories-navbar-link mx-15.5">
    </div>
    `;

    const categoriesNavlink = document.querySelector(".categories-navbar-link");
    if (!categoriesNavlink) return;
    const categoriesSidebar = document.querySelector(".categories-sidebar");
    if (!categoriesSidebar) return;
    const categoriesSection = document.querySelector(".categories");
    if (!categoriesSection) return;

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

    categoriesSection.innerHTML = categories.map(category => {
        return `
            <div class="category uppercase w-full py-8 px-1 text-base border border-[#C6C6CD] rounded-[4px] center
            hover:border-dark-bg hover:bg-dark-bg/5 transition-all duration-200 ease-in-out">
                <a href="products.html?category=${category}" class="text-inherit no-underline">
                    ${category}
                </a>
            </div>
        `;
    }).join("");
}

loadCategories();

/*==================================================*/

async function fetchProducts() {
    try {
        const response = await axios.get("https://dummyjson.com/products?limit=10");
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

async function loadProducts() {
    const data = await fetchProducts();
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

        return `
            <div class="product stack gap-4  group/product">
                <!--image-->
                <div class="overflow-hidden aspect-[4/5] group rounded-[4px] border border-[#C6C6CD] bg-image-bg">
                    <a href="/product=${product.id}">
                        <img src="${product.thumbnail}" alt="${product.title}"
                        class="w-full object-cover translate-y-6 transition-transform duration-500 ease-out group-hover/product:scale-110"/>
                    </a>
                </div>

                <!--product info-->
                <div class="stack gap-1 items-start w-full group">
                    <div class="stars text-primary text-xs xs:text-sm row gap-1">
                        ${stars}
                        <span>${product.rating}</span>
                    </div>
                    <h3 class="text-base font-regular text-primary-foreground group-hover/product:text-primary transition-all duration-200 ease-in-out">
                        <a href="/product=${product.id}">
                            ${product.title}
                        </a>
                    </h3>
                    <p class="text-base font-bold">
                        $${product.price.toFixed(2)}
                    </p>
                </div>
            </div>
        `;
    }).join("");
}

loadProducts();