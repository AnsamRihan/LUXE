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

const MAX_VISIBLE_IMAGES = 4;

/* ---------- Helpers ---------- */

const renderStars = (rating) => {
    let stars = "";
    const filledStars = Math.round(rating);

    for (let i = 0; i < 5; i++) {
        stars += i < filledStars
            ? `<i class="fa-solid fa-star"></i>`
            : `<i class="fa-regular fa-star"></i>`;
    }
    return stars;
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

const getInitials = (name) => {
    return name
        .trim()
        .split(/\s+/)
        .map(word => word[0])
        .join("")
        .toUpperCase();
}

/* ---------- Load Product ---------- */

const loadProduct = async () => {
    const product = await fetchProduct();
    if (!product) return;

    const elements = {
        productNames: document.querySelectorAll(".product-name"),
        category: document.querySelector(".product-category"),
        mainImage: document.querySelector(".product-img"),
        otherImages: document.querySelector(".other-images"),

        brand: document.querySelector(".product-brand"),
        ratingInfo: document.querySelector(".stars-info"),
        price: document.querySelector(".product-price"),
        stock: document.querySelector(".stock-availability"),
        description: document.querySelector(".product-description"),

        rating: document.querySelector(".product-rating"),
        starsReview: document.querySelector(".stars-review"),

        reviews: document.querySelector(".product-reviews")
    };

    /* ---------- Breadcrumb ---------- */

    elements.productNames.forEach(name => {
        name.textContent = product.title;
    });


    if (elements.category) {
        elements.category.textContent = product.category;
        elements.category.href = `products.html?category=${product.category}`;
    }

    /* ---------- Images ---------- */

    if (elements.mainImage) {
        elements.mainImage.src = product.images[0];
        elements.mainImage.alt = product.title;
    }

    if (elements.otherImages) {

        const images = product.images.slice(1, MAX_VISIBLE_IMAGES + 1);
        const remainingImages = Math.max(
            product.images.length - (MAX_VISIBLE_IMAGES + 1),
            0
        );

        elements.otherImages.innerHTML = images.map((image, index) => {
            const overlay =
                index === images.length - 1 && remainingImages > 0
                ?
                `
                <div class="absolute inset-0 bg-black/50 flex items-center justify-center group">
                    <span class="text-white text-xl font-medium group-hover:text-3xl transition-all duration-100 ease-in-out">
                        +${remainingImages}
                    </span>
                </div>
                `
                :
                "";

            return `
                <div class="aspect-square rounded-[1px] border border-border-color 
                    hover:border-secondary center transition-all duration-200 ease-out 
                    relative bg-white overflow-hidden">
                    <img 
                        src="${image}" 
                        alt="${product.title}"
                        class="product-img w-full object-cover aspect-square"
                    />
                    ${overlay}
                </div>
            `;
        }).join("");
    }

    /* ---------- Product Info ---------- */

    if (elements.brand) {
        elements.brand.textContent = product.brand;
    }

    const stars = renderStars(product.rating);

    if (elements.ratingInfo) {
        elements.ratingInfo.innerHTML = `
            <div class="text-primary text-[12px] sm:text-sm row gap-1">
                ${stars}
                <span>${product.rating}</span>
            </div>
            <span class="text-body-foreground text-sm underline underline-offset-2 font-medium">
                ${product.reviews.length} Reviews
            </span>
        `;
    }

    if (elements.price) {
        elements.price.textContent = `$${product.price.toFixed(2)}`;
    }

    if (elements.stock) {
        elements.stock.textContent = product.availabilityStatus;
    }

    if (elements.description) {
        elements.description.textContent = product.description;
    }

    /* ---------- Rating Summary ---------- */

    if (elements.rating) {
        elements.rating.textContent = product.rating;
    }

    if (elements.starsReview) {
        elements.starsReview.innerHTML = `
            <div class="text-primary text-base row gap-0">
                ${stars}
            </div>

            <span class="text-body-foreground text-xs">
                Based on ${product.reviews.length} reviews
            </span>
        `;
    }

    /* ---------- Reviews ---------- */

    if (elements.reviews) {
        elements.reviews.innerHTML = product.reviews
            .slice(0, 3)
            .map(review => {
                const reviewStars = renderStars(review.rating);
                const initials = getInitials(review.reviewerName);
                const date = formatDate(review.date);

                return `
                <div class="stack gap-4 items-start w-full border-b border-border-color pb-12">
                    <div class="flex gap-2.5 justify-between w-full text-xs">
                        <div class="text-primary row gap-0">
                            ${reviewStars}
                        </div>

                        <span class="text-body-foreground">
                            ${date}
                        </span>
                    </div>

                    <div class="row gap-3 justify-start pt-2">
                        <div class="bg-image-bg rounded-[12px] center py-2 px-[9.5px] 
                            text-base font-bold text-primary-foreground">
                            ${initials}
                        </div>

                        <div class="stack items-start gap-0">
                            <p class="text-sm font-bold tracking-[0.7px] text-heading-foreground">
                                ${review.reviewerName}
                            </p>

                            <div class="row justify-start gap-1">
                                <img 
                                    src="./assets/images/review_section/verified.svg" 
                                    alt="Verified Buyer"
                                >
                                <span class="text-primary text-xs">
                                    Verified Buyer
                                </span>
                            </div>
                        </div>
                    </div>

                    <p class="text-base text-body-foreground">
                        ${review.comment}
                    </p>
                </div>
                `;
            }).join("");
    }

}

loadProduct();