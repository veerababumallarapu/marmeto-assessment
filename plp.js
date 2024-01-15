
    const searchBar = document.getElementById('search-bar');
    const gridViewButton = document.getElementById('grid-view');
    const listViewButton = document.getElementById('list-view');
    const productList = document.getElementById('product-list');

    let productsData = []; // To store fetched data

    // Fetch data from the API
    const fetchProducts = async() => {
            const response = await fetch('https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093');
            const responseData = await response.json();
            if (Array.isArray(responseData.data)) {
                productsData = responseData.data; // Store the fetched data
                renderProducts(); // Display products
            } else {
                console.error('API response data is not an array:', responseData);
            }
    };

    // Function to render products in the current view (grid or list)
    const renderProducts = () => {
        productList.innerHTML = ''; // Clear existing products

        productsData.forEach((product) => {
            const productCard = createProductCard(product);
            productList.appendChild(productCard);
        });
    };

    // Function to create a product card element
    const createProductCard = (product) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const productImage = document.createElement('img');
        productImage.src = product.product_image;
        productImage.alt = product.product_title;

        const productTitle = document.createElement('h3');
        productTitle.textContent = product.product_title.toUpperCase();

        const productBadge = document.createElement('span');
        productBadge.className = 'badge';
        productBadge.textContent = product.product_badge;

        const productVariants = document.createElement('div');
        productVariants.className = 'product-variants';
        product.product_variants.forEach((variant) => {
            const variantItem = document.createElement('h6');
            for (const key in variant) {
                if (variant.hasOwnProperty(key)) {
                    variantItem.textContent = ` ${variant[key]} \n \n`.toUpperCase();
                }
            }
            productVariants.appendChild(variantItem);
        });

        productCard.appendChild(productImage);
        productCard.appendChild(productTitle);
        productCard.appendChild(productBadge);
        productCard.appendChild(productVariants);

        return productCard;
    };

    // Function to handle search
    const handleSearch = () => {
        const searchValue = searchBar.value.toLowerCase();
        productList.innerHTML = ''; // Clear existing products

        productsData.forEach((product) => {
            if (isMatch(product, searchValue)) {
                const productCard = createProductCard(product);
                highlightSearchResult(productCard, searchValue);
                productList.appendChild(productCard);
            }
        });
    };

    // Function to check if a product matches the search criteria
    const isMatch = (product, searchValue) => {
        const propertiesToSearch = [
            product.product_title.toLowerCase(),
            ...product.product_variants.map((variant) =>
                Object.values(variant).join(' ').toLowerCase()
            )
        ];
        return propertiesToSearch.some((property) => property.includes(searchValue));
    };

    // Function to apply highlighting to matching text in a product card
    const highlightSearchResult = (productCard, searchValue) => {
        const elementsToHighlight = productCard.querySelectorAll('h3, .product-variants h6');
        elementsToHighlight.forEach((element) => {
            const text = element.innerText;

            if (searchValue.trim() !== '') {
                const highlightedText = text.replace(
                    new RegExp(searchValue, 'gi'),
                    (match) => `<span class="highlight">${match}</span>`
                );
                element.innerHTML = highlightedText;
            } else {
                // If search value is empty, reset the innerHTML
                element.innerHTML = text;
            }
        });
    };


    // Function to switch to grid view
    const switchToGridView = () => {
        productList.classList.remove('list-view');
    };

    // Function to switch to list view
    const switchToListView = () => {
        productList.classList.add('list-view');
    };

    // Add event listeners for search and layout switch
    searchBar.addEventListener('input', handleSearch);
    gridViewButton.addEventListener('click', switchToGridView);
    listViewButton.addEventListener('click', switchToListView);

    // Initial fetch of products
    fetchProducts();
