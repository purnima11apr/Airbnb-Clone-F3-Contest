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

window.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    const checkin = new Date(urlParams.get('checkin'));
    const checkout = new Date(urlParams.get('checkout'));
    const guests = urlParams.get('guests');

    if (location) {
        document.getElementById('locationText').innerHTML = location;
    }
    if (checkin && checkout) {
        const formattedCheckin = checkin.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const formattedCheckout = checkout.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        document.getElementById('datesText').innerHTML = `${formattedCheckin}-${formattedCheckout}`;
    }
    if (guests) {
        document.getElementById('guestsText').innerHTML = guests + ' guests';
    }

    const searchParams = JSON.parse(localStorage.getItem('searchParams'));
    if (searchParams) {
        document.getElementById('locationText').innerHTML = searchParams.location;
        const storedCheckin = new Date(searchParams.checkin);
        const storedCheckout = new Date(searchParams.checkout);
        const formattedStoredCheckin = storedCheckin.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const formattedStoredCheckout = storedCheckout.toLocaleDateString('en-US', { day: 'numeric' });
        document.getElementById('datesText').innerHTML = `${formattedStoredCheckin}-${formattedStoredCheckout}`;
        document.getElementById('guestsText').innerHTML = `${searchParams.guests} guests`;
    }
});





