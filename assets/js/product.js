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

    /*For product name in breadcrumb*/
    document.querySelectorAll(".product-name").forEach(productName => {
        productName.textContent = product.title;
    });

    /*For category name in breadcrumb*/
    const productCategoryLink = document.querySelector(".product-category");
    productCategoryLink.textContent = product.category;
    productCategoryLink.href = `products.html?category=${product.category}`;

    /*For product main image*/
    const productImageTag = document.querySelector(".product-img");
    productImageTag.src = product.images[0];
    productImageTag.alt = product.title;


    /*for other product images */
    const otherImagesTag = document.querySelector(".other-images");
    const numberOfImages = product.images.length;
    const visibleImagesNumber = 4;

    let remainingImages = numberOfImages - 5;
    if(remainingImages < 0){
        remainingImages = 0;
    }

    /*For if pictures are more than 5, it will grayish the last one and say how many more pics there is*/
    const overlay = `
        <!-- Gray overlay -->
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center group">
            <span class="text-white text-xl font-medium group-hover:text-3xl transition-all duration-100 ease-in-out">
                +${remainingImages+1}
            </span>
        </div>
    `;

    /*other pictures html*/
    otherImagesTag.innerHTML = product.images.slice(1, 5).map( (image, index) => {
        return `
        <div class="aspect-square rounded-[1px] border border-border-color hover:border-secondary center
        transition-all duration-200 ease-out relative bg-white">
            <img src="${image}" alt="${product.title}"
            class="product-img w-full object-cover aspect-square"/>

            ${remainingImages > 0 && index === (visibleImagesNumber-1)?
                overlay: ""
            }
        </div>
        `;
    }).join("");

    /*Product Info!*/
    const productBrandTag = document.querySelector(".product-brand");
    productBrandTag.textContent = product.brand;

    /*stars review*/
    let stars = "";
    const filledStars = Math.round(product.rating);

    for (let i = 0; i < 5; i++) {
        if (i < filledStars) {
            stars += `<i class="fa-solid fa-star"></i>`;
        } else {
            stars += `<i class="fa-regular fa-star"></i>`;
        }
    }

    const productRatingInfoTag = document.querySelector(".stars-info");
    console.log();
    productRatingInfoTag.innerHTML = `
        <div class="text-primary text-[12px] sm:text-sm row gap-1">
            ${stars}
            <span ">${product.rating}</span>
        </div>
        <span class="text-body-foreground text-sm underline underline-offset-2 font-medium">${product.reviews.length} Reviews</span>
    `
    /*Price*/
    const productpriceTag = document.querySelector(".product-price");
    productpriceTag.textContent = `\$${product.price}`

    /*Stock*/
    const productStockTag = document.querySelector(".stock-availability");
    productStockTag.textContent = product.availabilityStatus;

    /*Product Description*/
    const productDescriptionTag = document.querySelector(".product-description");
    productDescriptionTag.textContent = product.description;
}

loadProduct();