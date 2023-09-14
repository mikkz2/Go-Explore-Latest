const categoryToIcon = {
  'swim': 'fas fa-water',
  'nature': 'fas fa-leaf',
  'tourist': 'fas fa-location-dot',
  'hotels': 'fas fa-hotel',
  'churches': 'fas fa-church',
  'events': 'fas fa-calendar-days',
  // Add more category mappings as needed
};

const carousel = document.querySelector(".carousel");

async function fetchAndGenerateCards(url, isFestival = false) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${isFestival ? 'festival' : 'card'} data`);
    }

    const cardData = await response.json();

    cardData.forEach(card => {
      const cardElement = document.createElement("li");
      cardElement.className = "card";
      cardElement.style.backgroundImage = `url('${card.image}')`;
      cardElement.style.backgroundColor = "rgba(0, 0, 0, 0.9)";

      const words = card.description.split(" ");
      console.log("working");
      const truncatedDescription = words.length > 10 ? 
                                   words.slice(0, 10).join(" ") + "..." : 
                                   card.description;

      const iconClass = isFestival ? 'fas fa-calendar-days' : categoryToIcon[card.category];

      cardElement.innerHTML = `
        <div class="icon card-icon ${iconClass}"></div>
        <h2>${card.title}</h2>
        <span>${truncatedDescription}</span>
      `;

      cardElement.dataset.redirectUrl = `explore_cardcontent.php?id=${card.id}`;

      cardElement.addEventListener("click", () => {
        const redirectUrl = cardElement.dataset.redirectUrl;
        console.log("Attempting to redirect to:", redirectUrl); // Debugging line
        if (redirectUrl) {
          window.top.location.href = redirectUrl;
        }
      });

      carousel.appendChild(cardElement);
    });

    // Calculate firstCardWidth after the cards have been generated
    const firstCardWidth = carousel.querySelector(".card").offsetWidth;

    const wrapper = document.querySelector(".wrapper");
    let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    carousel.addEventListener("scroll", infiniteScroll);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    wrapper.addEventListener("mouseleave", autoPlay);

    const arrowBtns = document.querySelectorAll(".wrapper i");
    arrowBtns.forEach(btn => {
      btn.addEventListener("click", () => handleArrowButtonClick(btn));
    });

    function handleArrowButtonClick(btn) {
      carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
    }

    function dragStart(e) {
      isDragging = true;
      carousel.classList.add("dragging");
      startX = e.pageX;
      startScrollLeft = carousel.scrollLeft;
    }

    function dragging(e) {
      if (!isDragging) return;
      carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    }

    function dragStop() {
      isDragging = false;
      carousel.classList.remove("dragging");
    }

    function infiniteScroll() {
      if (carousel.scrollLeft === 0) {
        // Scroll to the end
      } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        // Scroll to the beginning
      }
      clearTimeout(timeoutId);
      if (!wrapper.matches(":hover")) autoPlay();
    }

    function autoPlay() {
      if (window.innerWidth < 800 || !isAutoPlay) return;
      timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
    }

    autoPlay();

  } catch (error) {
    console.error(`Error fetching ${isFestival ? 'festival' : 'card'} data:`, error);
  }
}

// Function to fetch and generate cards dynamically for a specific city
async function fetchAndGenerateCardsForCity(city) {
  try {
    const festivalUrl = `http://localhost:3000/festival?city=${city}`;
    const placesUrl = `http://localhost:3000/places?city=${city}`;

    await Promise.all([
      fetchAndGenerateCards(festivalUrl, true),
      fetchAndGenerateCards(placesUrl)
    ]);
  } catch (error) {
    console.error('Error fetching city data or cards data:', error);
  }
}


function refreshContent() {
  // Read the selected city from local storage
  const selectedCity = localStorage.getItem('selectedCity') || 'DefaultCity';
  console.log("Selected city from local storage:", selectedCity);  // Debugging line
  fetchAndGenerateCardsForCity(selectedCity);
}

// Add an event listener to call refreshContent() when the page loads
window.addEventListener('load', refreshContent);

// Optionally, listen for changes in local storage
window.addEventListener('storage', (event) => {
  if (event.key === 'selectedCity') {
    refreshContent();
  }
});

// Capture user interaction to select a city (You should implement this part)

// For example, assuming you have a button with the class "city-option" that the user clicks
const cityOptions = document.querySelectorAll('.city-option');

    cityOptions.forEach(option => {
      option.addEventListener('click', () => {
        // ... existing code
    // Read the selected city from local storage
        const selectedCity = localStorage.getItem('selectedCity') || 'DefaultCity';
        fetchAndGenerateCardsForCity(selectedCity);

        // Optionally, listen for changes in local storage (if both scripts run on the same page)
        window.addEventListener('storage', (event) => {
          if (event.key === 'selectedCity') {
            fetchAndGenerateCardsForCity(event.newValue);
          }
        });
        refreshContent();
      });
    });
