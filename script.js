
let fetchedData = [];

async function getData() {
    const searchParams = JSON.parse(localStorage.getItem('searchParams'));
    const location = searchParams.location;
    const checkin = searchParams.checkin;
    const checkout = searchParams.checkout;
    const guests = searchParams.guests;


    const dynamicUrl = `https://airbnb13.p.rapidapi.com/search-location?location=${location}&checkin=${checkin}&checkout=${checkout}&adults=${guests}&children=0&infants=0&pets=0&page=1&currency=USD`;

    const dynamicOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '97145d29ddmsh64884c09eaba7b8p1e1586jsnfa9b32d0f2d9',
            'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(dynamicUrl, dynamicOptions);
        const data = await response.json();

        fetchedData.push(data);


        const cardContainer = document.getElementById('cardContainer');
        fetchedData.forEach(result => {
            result.results.forEach(listing => {
            cardContainer.insertAdjacentHTML('beforeend', `
                <div class="card2">
                    <div class="card2-image"><img src="${listing.images[0]}" alt="Listing Image"/></div>
                    <div class="card2-discription">
                        <div class="card2-about">
                            <div class="title"><p class="color">${listing.city}</p><h3>${listing.name}</h3></div>
                            <div class="inner-border color">
                                <p>${listing.persons} guests · ${listing.type} · ${listing.beds} beds · ${listing.bathrooms} bath</p>
                                <p>${listing.previewAmenities.join(' · ')}</p>
                            </div>
                            <div class="review">
                                <p>${listing.rating} <i class="fa-solid fa-star" style="color: rgba(245, 158, 11, 1);"></i> <span class="color">(${listing.reviewsCount} reviews)</span></p>
                            </div>
                        </div>
                        <div class="price-details">
                            <p class="like" onclick="toggleLike(this)"><i class="fa-regular fa-heart" style="color: #000000;"></i></p>
                            <p>$${listing.price.rate} <span class="color">/night</span></p>
                        </div>
                        `);
                    });
                });
        
            } catch (error) {
                console.error(error);
            }
        }
        
        getData();

//this function is redirecting us to the search.html page
function redirectToSearchPage() {
    const location = document.getElementById('locationInput').value;
    const checkin = document.getElementById('checkinInput').value;
    const checkout = document.getElementById('checkoutInput').value;
    const guests = document.getElementById('guestsInput').value;

    const searchParams = {
        location: location,
        checkin: checkin,
        checkout: checkout,
        guests: guests
    };

    localStorage.setItem('searchParams', JSON.stringify(searchParams));

    const queryParams = `?location=${location}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`;
    window.location = `search.html${queryParams}`;
}




//this initialize the value of date month and place in navbar of search.html according to search input in index.html

window.addEventListener('DOMContentLoaded', (event) => {
    const searchParams = JSON.parse(localStorage.getItem('searchParams'));

    if (searchParams) {
        document.getElementById('locationText').innerHTML = searchParams.location;
        document.getElementById('datesText').innerHTML = searchParams.checkin + '-' + searchParams.checkout;
        document.getElementById('guestsText').innerHTML = searchParams.guests + ' guests';
    }
});




// this function is for like heart to like the hotel(card)
function toggleLike(element) {
    if (element.querySelector('i').classList.contains('fa-regular')) {
        element.querySelector('i').classList.remove('fa-regular');
        element.querySelector('i').classList.add('fa-solid');
        element.querySelector('i').style.color = 'red';
    } else {
        element.querySelector('i').classList.remove('fa-solid');
        element.querySelector('i').classList.add('fa-regular');
        element.querySelector('i').style.color = '#000000';
    }
}
