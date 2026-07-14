"use strict";

const params = new URLSearchParams(location.search);
const productID = params.get('product');

/*----------------get categories for header (navbar)----------------*/

const fetchCategories = async () => {
    try {
        const response = await axios.get("https://dummyjson.com/products/category-list");
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
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

/*----------------get product----------------*/

// Fetch product from API
const fetchProduct = async () => {
    try {
        const response = await axios.get(
            `https://dummyjson.com/products/${productID}`
        );
        return response.data;

    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

const loadProduct = async () => {
    const product = await fetchProduct();
    console.log(product);

    const productNameLink = document.querySelector(".product-name");
    productNameLink.textContent = product.title;

    const productCategoryLink = document.querySelector(".product-category");
    productCategoryLink.textContent = product.category;
    productCategoryLink.href = `products.html?category=${product.category}`;
}

loadProduct();