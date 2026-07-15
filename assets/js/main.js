"use strict";

const fetchCategories = async () => {
    try {
        const response = await axios.get("https://dummyjson.com/products/category-list");
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return null;
    }
}

// Split array into groups of a specific size
const chunkArray = (array, size) => {
    const chunks = [];

    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }

    return chunks;
}

const loadCategories = async () => {
    const categories = await fetchCategories();
    const shopDropdownHover = document.querySelector("#shopDropdownHover");
    const categoriesSidebar = document.querySelector(".categories-sidebar");
    const categoriesSection = document.querySelector(".categories");

    if(categories === null){
        shopDropdownHover.innerHTML = `
        <div class="w-full center py-5">
            <span class="text-base text-danger">
                Error Retrieving Data!
            </span>
        </div>`;

        categoriesSidebar.innerHTML = `
        <div class="w-full center py-5">
            <span class="text-base text-danger">
                Error Retrieving Data!
            </span>
        </div>`;

        categoriesSection.innerHTML = `
        <div class="w-full center py-5 col-span-full">
            <span class="text-base text-danger">
                Error Retrieving Data!
            </span>
        </div>`;
    }
    
    const categoryColumns = chunkArray(categories, 6);
    shopDropdownHover.innerHTML = `
    <div class="grid px-4 py-5 text-sm grid-cols-${categoryColumns.length} gap-3 categories-navbar-link mx-15.5">
    </div>
    `;

    const categoriesNavlink = document.querySelector(".categories-navbar-link");

    if (!categoriesNavlink) return;
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

    if (!categoriesSidebar) return;
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

    if (!categoriesSection) return;
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

const fetchProducts = async () => {
    try {
        const response = await axios.get("https://dummyjson.com/products?limit=10");
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return null;
    }
}

const loadProducts = async () => {
    const data = await fetchProducts();
    const productsSection = document.querySelector(".products");

    if(data === null){
        productsSection.innerHTML = `
        <div class="w-full center col-span-full">
            <span class="text-base text-danger">
                Error Retrieving Data!
            </span>
        </div>`;
    }

    const products = data.products;

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