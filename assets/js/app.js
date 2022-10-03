const loadAllCategories = async() => {
    const response = await fetch('https://openapi.programming-hero.com/api/news/categories');
    const data = await response.json();
    if (data.status) {
        displayAllCategories(data.data);
    } else {
        // Error data not found...
        dataNotFoundMessageSection(true);
        websitePreloader(false);
    }
}

const displayAllCategories = categoriesData => {
    const newsCategories = categoriesData.news_category;
    const mainMenuUl = document.getElementById("mainMenuUl");
    newsCategories.forEach(newsCategory => {
        const newNavItem = document.createElement('li');
        newNavItem.classList.add('nav-item');
        newNavItem.innerHTML = `<a class="nav-link" onclick="getAllNewsByCategoryId('${newsCategory.category_id}', '${newsCategory.category_name}')">${newsCategory.category_name}</a>`;
        mainMenuUl.appendChild(newNavItem);
    })
}

loadAllCategories();


const getAllNewsByCategoryId = async(categoryId, categoryName = '') => {
    websitePreloader(true);

    const response = await fetch(`https://openapi.programming-hero.com/api/news/category/${categoryId}`);
    const data = await response.json();
    if (data.status) {
        displayAllNews(data.data, categoryName);
    } else {
        // Error data not found...
        newsDataFoundMessage(false);
        dataNotFoundMessageSection(true);
        websitePreloader(false);
    }

}

// Change active nav item...
document.getElementById("mainMenuUl").addEventListener('click', (event) => {
    const activeCategory = document.querySelector('#mainMenuUl .active');
    const newActiveCategory = event.target;
    if (newActiveCategory.classList.contains('nav-link') && activeCategory !== event.target) {
        activeCategory.classList.remove('active');
        newActiveCategory.classList.add('active');
    }
});


const displayAllNews = (allNewsData, categoryName) => {
    const newsCards = document.getElementById("newsCards");
    allNewsData.forEach(newsData => {
        // console.log(newsData);

        const newsThumbnailURL = newsData.thumbnail_url;
        const newsTitle = newsData.title;
        const newsId = newsData._id;

        // News short description...
        const newsShortDescription = getNewsShortDescription(newsData.details);

        // News author information...
        const newsAuthorThumbnailURL = newsData.author.img;
        const newsAuthorName = newsData.author.name;

        // News publication date...
        const newsPublicationDate = getPublicationDate(newsData.author.published_date);

        

        const newsTotalViews = newsData.total_view;

        // News rating...
        const newsRatingBadge = newsData.rating.badge;

        const newNewsCard = document.createElement('div');
        newNewsCard.classList.add('col');
        newNewsCard.innerHTML = 
            `<div class="card h-100 shadow-sm p-3">
                <div class="row align-items-center">
                    <div class="col-md-3 text-center">
                        <a href="#"><img src="${newsThumbnailURL}" id="newsThumbnail" class="img-fluid" alt="${newsTitle} Image"></a>
                    </div>
                    <div class="col-md-9 text-center text-md-start">
                        <div class="card-body">
                            <a href="#"><h5 class="card-title" id="newsTitle">${newsTitle}</h5></a>
                            <p class="card-text text-muted" id="newsShortDescription">${newsShortDescription}</p>
                            <div class="row justify-content-between align-items-center">
                                <div class="col-md-3 col-6">
                                    <div class="row align-items-center">
                                        <div class="col-4">
                                            <img class="img-fluid rounded-circle" id="authorImage" src="${newsAuthorThumbnailURL}" alt="Author ${newsAuthorName} Image">
                                        </div>
                                        <div class="col-8">
                                            <h6 class="fw-normal mb-0 text-capitalize" id="authorName">${newsAuthorName}</h6>
                                            <p class="text-muted mb-0" id="publishedDate"><small>${newsPublicationDate}</small></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 col-6">
                                    <div class="d-flex justify-content-center align-items-center">
                                        <i class="fa-solid fa-eye text-muted"></i>
                                        <p class="mb-0 ms-2 text-muted" id="newsTotalViews">343 Views</p>
                                    </div>
                                </div>
                                <div class="col-md-3 col-6">
                                    <div class="d-flex justify-content-center align-items-center" title="News Rating">
                                        <i class="fa-solid fa-star text-muted"></i>
                                        <i class="fa-solid fa-star text-muted"></i>
                                        <i class="fa-solid fa-star text-muted"></i>
                                        <i class="fa-solid fa-star text-muted"></i>
                                        <i class="fa-solid fa-star-half-stroke text-muted"></i>
                                    </div>
                                </div>
                                <div class="col-md-3 col-6 text-center">
                                    <div class="d-flex justify-content-center align-items-center">
                                        <a class="learn-more-anchor">
                                            <span class="text-muted me-2">Learn More</span>
                                            <i class="fa-solid fa-arrow-right fs-5 text-primary"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        newsCards.appendChild(newNewsCard);
    });

    dataNotFoundMessageSection(false);
    const newsFoundMessage = `${allNewsData.length} News found by the category of ${categoryName}.`;
    newsDataFoundMessage(true, newsFoundMessage);
    websitePreloader(false);
}

const getPublicationDate = (providedDate) => {
    const newsPublicationDate = new Date(providedDate);
    const yyyy = newsPublicationDate.getFullYear();
    let mm = newsPublicationDate.getMonth() + 1; // Months start at 0!
    let dd = newsPublicationDate.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedPublicationDate = dd + '/' + mm + '/' + yyyy;
    return formattedPublicationDate;
}

const getNewsShortDescription = description => {
    let shortDescriptionLineBreak = 150;
    for (i = 150; i <= 165; i++ ) {
        if (description.slice(i, i+1) === ' ') {
            shortDescriptionLineBreak = i;
            break;
        }
    }
    const newsShortDescription = `${description.slice(0, shortDescriptionLineBreak)}<br><br>${description.slice(shortDescriptionLineBreak, 400)}...`;
    return newsShortDescription;
}

const websitePreloader = isActive => {
    const preloaderSection = document.getElementById("preloaderSection");
    if (isActive) {
        preloaderSection.style.display = "block";
    } else {
        preloaderSection.style.display = "none";
    }
}

const dataNotFoundMessageSection = noDataFound => {
    const noDataFoundSection = document.getElementById("noDataFoundSection");
    if (noDataFound) {
        noDataFoundSection.style.display = "block";
    } else {
        noDataFoundSection.style.display = "none";
    }
}
const newsDataFoundMessage = (displaySection, message = '') => {
    const newsFoundMessageSection = document.getElementById("newsFoundMessageSection");
    if (displaySection) {
        newsFoundMessageSection.style.display = "block";
        document.getElementById("newsFoundMessage").innerText = message;
    } else {
        newsFoundMessageSection.style.display = "none";
    }
}