function Product(title, price, description, image, category){

    this.title = title;
    this.price = price;
    this.description = description;
    this.image = image;
    this.category = category;
}

let allProducts = [];

let cart =
JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 1;
const productsPerPage = 6;

async function getData(){

    try{

        let response =
        await fetch('https://fakestoreapi.com/products?limit=20');

        let data = await response.json();
        // بنحول الرد لنوع JSON عشان نفهمه برمجياً

        allProducts = data.map(item =>

            new Product(
                item.title,
                item.price,
                item.description,
                item.image,
                item.category
            )
        );

        render();

        document.getElementById('loading')
        .style.display = "none";
    }

    catch(error){

        console.error(error);
    }
}

function showToast(message){

    const toast =
    document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    },2000);
}

function updateCartCount(){

    document.getElementById('cart-count')
    .textContent = cart.length;
}

function render(products = allProducts){

    const container = document.getElementById('products-container');
    container.innerHTML = "";

    let start =
(currentPage - 1) * productsPerPage;
let end =
start + productsPerPage;

let paginatedProducts =
products.slice(start, end);


paginatedProducts.map(product => {

        let card = document.createElement('div');
        card.classList.add('card');
        let img = document.createElement('img');
        img.src = product.image;
        let title = document.createElement('h3');
        title.textContent = product.title;
        let price = document.createElement('p');
        price.textContent = `$${product.price}`;
        let desc = document.createElement('p');

        desc.textContent =
        product.description.substring(0,80) + "...";
        let btn = document.createElement('button');
        btn.textContent = "Add To Cart";
        btn.classList.add('cart-btn');
        btn.addEventListener('click', (e) => {

            e.stopPropagation();
            // لما اضغط على زر ادد تو كارت بس يفتح هو بدون الزر الاكبر تاع التفاصيل يلي فيه اكثر من خيار

            cart.push(product);

            localStorage.setItem(
                'cart',
                JSON.stringify(cart)
            );

            updateCartCount();
            showToast("Product Added To Cart");
        });

        let favBtn = document.createElement('button');
        favBtn.innerHTML = "❤️";
        favBtn.classList.add('fav-btn');
        favBtn.addEventListener('click', (e) => {

            e.stopPropagation();
            // منعنا الكرت من إنه يفتح المودال لما نضغط عالزر

            showToast("Added To Favorites");
        });

        card.append(img, title, price,desc,btn,favBtn);
        container.appendChild(card);
        // بنجمع كل العناصر جوا الكرت وبعدين بنحط الكرت بالكونتينر الرئيسي

        card.addEventListener('click', () => {
            document.getElementById('product-modal')
            .style.display = "flex";
            document.getElementById('modal-img')
            .src = product.image;
            document.getElementById('modal-title')
            .textContent = product.title; 
            document.getElementById('modal-price')
            .textContent = `$${product.price}`;
            document.getElementById('modal-desc')
            .textContent = product.description;
        });
    });
  
    renderPagination(products);
}

function renderPagination(products){

    // استخدمت pagination بال javascript مش بال html لأنه Dynamic. لو بكره ضفنا 100 منتج جديد من الـ API، كودي رح يحسب عدد الصفحات ويعمل الأزرار لحاله بدون ما أعدل حرف واحد في الـ HTML. هاد بخلي الكود Scalable

    const pagination =
    document.getElementById('pagination');

    pagination.innerHTML = "";

    let pageCount =
    Math.ceil(products.length / productsPerPage);

    for(let i = 1; i <= pageCount; i++){

        let btn =
        document.createElement('button');
        btn.textContent = i;

        if(i === currentPage){
            btn.classList.add('active-page');
        }

        btn.addEventListener('click', () => {
            currentPage = i;
            render(products);
        });

        pagination.appendChild(btn);
    }
}

function checkAuth(){

    const user =
    localStorage.getItem('user');

    if(user){

        document.getElementById('login-btn')
        .style.display = "none";

        document.getElementById('logout-btn')
        .style.display = "inline-block";
    }

    else{
        document.getElementById('login-btn')
        .style.display = "inline-block";

        document.getElementById('logout-btn')
        .style.display = "none";
    }
}

document.getElementById('login-btn')
.addEventListener('click', () => {

    localStorage.setItem('user', 'true');
    showToast("Login Successful");
    checkAuth();
});

document.getElementById('logout-btn')
.addEventListener('click', () => {

    localStorage.removeItem('user');
    showToast("Logged Out");
    checkAuth();
});

document.getElementById('close-modal')
.addEventListener('click', () => {

    document.getElementById('product-modal')
    .style.display = "none";
});

document.getElementById('search-input')
.addEventListener('input', function(e){

    const searchValue =
    e.target.value.toLowerCase();

    const filteredProducts =
    allProducts.filter(product =>

        product.title
        .toLowerCase()
        .includes(searchValue)
    );

    render(filteredProducts);
});

const filterButtons =
document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {

    button.addEventListener('click', () => {

        const category =
        button.dataset.category;

        if(category === "all"){
            render(allProducts);
        }

        else{

            const filtered =
            allProducts.filter(product =>
                product.category === category
            );
            render(filtered);
        }
    });
});

const darkBtn =
document.getElementById('dark-mode-btn');
darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

const menuToggle =
document.getElementById('menu-toggle');

const navLinks =
document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

updateCartCount();
checkAuth();
getData();