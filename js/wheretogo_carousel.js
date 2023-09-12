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
  
        const iconClass = categoryToIcon[card.category];
  
        cardElement.innerHTML = `
          <div class="icon card-icon ${iconClass}"></div>
          <h2>${card.title}</h2>
          <span>${card.description}</span>
        `;
  
        cardElement.dataset.redirectUrl = `explore_cardcontent.php?id=${card.id}`;
  
        cardElement.addEventListener("click", () => {
          const redirectUrl = cardElement.dataset.redirectUrl;
          if (redirectUrl) {
            window.location.href = redirectUrl;
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
  
  async function fetchAndGenerateAllCards() {
    await fetchAndGenerateCards('http://localhost:3000/festival', true);
    await fetchAndGenerateCards('http://localhost:3000/places');
  }
  
  fetchAndGenerateAllCards();
  