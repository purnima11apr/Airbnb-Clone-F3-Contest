let fetchedData = [];

async function getData() {
  const searchParams = JSON.parse(localStorage.getItem("searchParams"));
  const location = searchParams.location;
  const checkin = searchParams.checkin;
  const checkout = searchParams.checkout;
  const guests = searchParams.guests;

  const dynamicUrl = `https://airbnb13.p.rapidapi.com/search-location?location=${location}&checkin=${checkin}&checkout=${checkout}&adults=${guests}&children=0&infants=0&pets=0&page=1&currency=USD`;

  const dynamicOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "698ec81273msh2fd150581c59fd3p1ca232jsn9a59712a1ab8",
      "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(dynamicUrl, dynamicOptions);
    const data = await response.json();

    fetchedData.push(data);

    const cardContainer = document.getElementById("cardContainer");
    fetchedData.forEach((result) => {
      result.results.forEach((listing) => {
        const card = document.createElement("div");
        card.classList.add("card2");
        card.onclick = function () {
          showBookingCostBreakdown(listing);
        };

        const cardImage = document.createElement("div");
        cardImage.classList.add("card2-image");
        const image = document.createElement("img");
        image.src = listing.images[0];
        image.alt = "Listing Image";
        cardImage.appendChild(image);
        card.appendChild(cardImage);

        const cardDescription = document.createElement("div");
        cardDescription.classList.add("card2-description");

        const cardAbout = document.createElement("div");
        cardAbout.classList.add("card2-about");
        const title = document.createElement("div");
        title.classList.add("title");
        const cityColor = document.createElement("p");
        cityColor.classList.add("color");
        cityColor.textContent = listing.city;
        const listingName = document.createElement("h3");
        listingName.textContent = listing.name;
        title.appendChild(cityColor);
        title.appendChild(listingName);
        cardAbout.appendChild(title);

        const innerBorder = document.createElement("div");
        innerBorder.classList.add("inner-border", "color");
        const guestsInfo = document.createElement("p");
        guestsInfo.textContent = `${listing.persons} guests · ${listing.type} · ${listing.beds} beds · ${listing.bathrooms} bath`;
        const amenitiesInfo = document.createElement("p");
        amenitiesInfo.textContent = listing.previewAmenities.join(" · ");
        innerBorder.appendChild(guestsInfo);
        innerBorder.appendChild(amenitiesInfo);
        cardAbout.appendChild(innerBorder);

        const review = document.createElement("div");
        review.classList.add("review");
        const reviewInfo = document.createElement("p");
        reviewInfo.innerHTML = `${listing.rating} <i class="fa-solid fa-star" style="color: rgba(245, 158, 11, 1);"></i> <span class="color">(${listing.reviewsCount} reviews)</span>`;
        review.appendChild(reviewInfo);
        cardAbout.appendChild(review);

        cardDescription.appendChild(cardAbout);
        card.appendChild(cardDescription);

        const priceDetails = document.createElement("div");
        priceDetails.classList.add("price-details");
        const likeButton = document.createElement("p");
        likeButton.classList.add("like");
        likeButton.onclick = function () {
          toggleLike(this);
        };
        const heartIcon = document.createElement("i");
        heartIcon.classList.add("fa-regular", "fa-heart");
        heartIcon.style.color = "#000000";
        likeButton.appendChild(heartIcon);
        priceDetails.appendChild(likeButton);
        const priceInfo = document.createElement("p");
        priceInfo.innerHTML = `$${listing.price.rate} <span class="color">/night</span>`;
        priceDetails.appendChild(priceInfo);
        card.appendChild(priceDetails);

        const directionsButton = document.createElement("button");
        directionsButton.innerText = "Get Directions";
        directionsButton.setAttribute("id", "directionsButton");
        directionsButton.addEventListener("click", function () {
          openDirections(listing);
        });
        card.appendChild(directionsButton);

        // Create a marker for this listing on the map
        new google.maps.Marker({
          position: { lat: listing.lat, lng: listing.lng },
          map,
          title: listing.title,
        });

        map.setZoom(4); // Set your desired zoom level here

        cardContainer.appendChild(card);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

getData();

function openDirections(listing) {
  const { lat, lng } = listing;
  const url = `https://www.google.com/maps/dir//${lat},${lng}`;
  window.open(url, "_blank");
}

//this function is redirecting us to the search.html page
function redirectToSearchPage() {
  let location = document.getElementById("locationInput").value;
  let checkin = document.getElementById("checkinInput").value;
  let checkout = document.getElementById("checkoutInput").value;
  let guests = document.getElementById("guestsInput").value;

  let searchParams = {
    location: location,
    checkin: checkin,
    checkout: checkout,
    guests: guests,
  };

  localStorage.setItem("searchParams", JSON.stringify(searchParams));

  const queryParams = `?location=${location}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`;
  window.location = `search.html${queryParams}`;
}

// Function to create and display the modal

let openModal;

function closeOpenModal() {
  if (!openModal) {
  } else {
    openModal.style.display = "none";
  }
}
function showBookingCostBreakdown(listing) {
  closeOpenModal();

  openModal = document.createElement("div");
  openModal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const closeButton = document.createElement("span");
  closeButton.classList.add("close");
  closeButton.innerHTML = "&times;";

  // Add event listener to the close button
  closeButton.addEventListener("click", function () {
    openModal.style.display = "none";
  });

  const bookingDetails = document.createElement("div");
  bookingDetails.classList.add("booking-details");
  bookingDetails.innerHTML = `
        <div class="card-price">
            <p><strong>${listing.price.rate}</strong>/night</p>
          </div>


          <div class="charges">
          ${
            listing.price.priceItems[0]
              ? `
          <div class="flex3">
              <div>${listing.price.priceItems[0].title}</div>
              <div>${listing.price.priceItems[0].amount}</div>
          </div>`
              : ""
          }
      ${
        listing.price.priceItems[1]
          ? `
          <div class="flex3">
              <div>Weekly discount</div>
              <div class="green">-${listing.price.priceItems[1].amount}</div>
          </div>`
          : ""
      }
      ${
        listing.price.priceItems[2]
          ? `
          <div class="flex3">
              <div>Cleaning fee</div>
              <div>${listing.price.priceItems[2].amount}</div>
          </div>`
          : ""
      }
      ${
        listing.price.priceItems[3]
          ? `
          <div class="flex3">
              <div>Service fee</div>
              <div>${listing.price.priceItems[3].amount}</div>
          </div>`
          : ""
      }

  
      <div class="total">
          <div>Total</div>
          <div>${listing.price.total}</div>
        </div>
    `;

  modalContent.appendChild(closeButton);
  modalContent.appendChild(bookingDetails);
  openModal.appendChild(modalContent);

  openModal.style.display = "block";
  document.body.appendChild(openModal);
}

//this initialize the value of date month and place in navbar of search.html according to search input in index.html

window.addEventListener("DOMContentLoaded", (event) => {
  const searchParams = JSON.parse(localStorage.getItem("searchParams"));

  if (searchParams) {
    document.getElementById("locationText").innerHTML = searchParams.location;
    document.getElementById("datesText").innerHTML =
      searchParams.checkin + "-" + searchParams.checkout;
    document.getElementById("guestsText").innerHTML =
      searchParams.guests + " guests";
  }
});

// this function is for like heart to like the hotel(card)
function toggleLike(element) {
  if (element.querySelector("i").classList.contains("fa-regular")) {
    element.querySelector("i").classList.remove("fa-regular");
    element.querySelector("i").classList.add("fa-solid");
    element.querySelector("i").style.color = "red";
  } else {
    element.querySelector("i").classList.remove("fa-solid");
    element.querySelector("i").classList.add("fa-regular");
    element.querySelector("i").style.color = "#000000";
  }
}

function goToListingPage(listingId) {
  // Redirect to the listing.html page with the specific listing ID
  window.location.href = `listing.html`;
}

//map

let userLocation;

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      initMap();
    });
  }
};

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocation, // Centered at some default location
    zoom: 4,
  });
}
