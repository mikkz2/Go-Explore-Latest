const servicesData = []; // Initialize as an empty array
let totalVisits = 0;
const MAX_VISITS = 100;

const iconMappings = {
  'swim': 'fas fa-water',
  'nature': 'fas fa-leaf',
  'tourist': 'fas fa-location-dot',
  'hotels': 'fas fa-hotel',
  'churches': 'fas fa-church',
  'events': 'fas fa-calendar-days',
};

function generateServiceCard(service) {
  const iconClass = iconMappings[service.category] || 'fas fa-question';

  return `
    <div class="column">
      <a href="explore_cardcontent.php?id=${service.id}" class="card-link">
        <div class="card">
          <div class="background-image" style="background-image: url('${service.backgroundImage}');"></div>
          <div class="icon-wrapper">
            <i class="${iconClass}"></i>
          </div>
          <div class="card-content" onclick="handleCardClick(${service.id})">
            <h3>${service.title}</h3>
            <p>${service.description}</p>
          </div>
        </div>
      </a>
    </div>
  `;
}
// Inside your handleCardClick function
function handleCardClick(serviceId) {
  const clickedService = servicesData.find(service => service.id === serviceId);
  if (clickedService) {
    // Check if the service has a visit count stored in local storage
    const storedVisits = localStorage.getItem(`service_${serviceId}_visits`);
    const visits = storedVisits ? parseInt(storedVisits) : 0;

    const newVisits = visits + 1;

    localStorage.setItem(`service_${serviceId}_visits`, newVisits.toString());

    // Update the progress value based on your logic
    clickedService.progress = newVisits; // Set progress to the number of visits

    // Update the total visits count and progress bar
    totalVisits++;
    updateProgressBar();
  }
}


function updateProgressBar() {
  const progress = (totalVisits / MAX_VISITS) * 100;
  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.width = `${progress}%`;
  
  const visitsNumber = document.querySelector('.chart-progress-indicator__number');
  visitsNumber.textContent = totalVisits;
}

function fetchServicesData() {
  fetch('http://localhost:3000/places')
    .then(response => response.json())
    .then(data => {
      const mappedData = data.map(user => {
        return {
          id: user.id,
          category: user.category,
          title: user.title,
          description: user.description,
          backgroundImage: user.image,
        };
      });

      servicesData.push(...mappedData); 
      displayServiceCards(servicesData.slice(0, initialItems));
    })
    .catch(error => console.error('Error fetching data:', error));
}

const initialItems = 9;
const itemsPerPage = 3;
let currentPage = 0;

function updateButtons() {
const loadMoreBtn = document.getElementById('load-more-btn');
if (currentPage * itemsPerPage + initialItems >= servicesData.length) {
  loadMoreBtn.textContent = 'Load Less';
  loadMoreBtn.style.display = 'block'; // Display the button when at the end
} else if (currentPage * itemsPerPage + initialItems < servicesData.length) {
  loadMoreBtn.textContent = 'Load More';
  loadMoreBtn.style.display = 'block'; // Display the button when there's more to load
} else {
  loadMoreBtn.style.display = 'none'; // Hide the button when there's nothing more to load
}
}


function displayServiceCards(data) {
const servicesContent = document.querySelector('.services-content .row');
servicesContent.innerHTML = '';

const endIndex = Math.min(currentPage * itemsPerPage + initialItems, data.length);
for (let i = 0; i < endIndex; i++) {
  const cardMarkup = generateServiceCard(data[i]);
  servicesContent.insertAdjacentHTML('beforeend', cardMarkup);
}

updateButtons();
const contentContainer = document.getElementById('load-more-btn');
contentContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}



function toggleLoadMore() {
const activeCategory = document.querySelector('.category-link.active');
const selectedCategory = activeCategory ? activeCategory.getAttribute('data-category') : null;

const filteredServices = selectedCategory
  ? servicesData.filter(service => service.category === selectedCategory)
  : servicesData;

if (currentPage * itemsPerPage + initialItems >= filteredServices.length) {
  currentPage = 0; // Reset to the first page if we're at the end
} else {
  currentPage++;
}

displayServiceCards(filteredServices);
}


const contentContainer = document.getElementById('load-more-btn');
contentContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });


function resetContent() {
  
  console.log('hello');
currentPage = 1;
const activeCategory = document.querySelector('.category-link.active');
if (activeCategory) {
  activeCategory.classList.remove('active');
}
const initialServices = servicesData.slice(0, initialItems);
if (initialServices.length < initialItems) {
  const loadMoreBtn = document.getElementById('load-more-btn');
  loadMoreBtn.style.display = 'none';
}
displayServiceCards(initialServices);
}

const categoryLinks = document.querySelectorAll('.category-link');
categoryLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Clicked a category link');
    // Rest of your code
  });
});

$(document).ready(function() {
  console.log('jQuery is working.');

fetchServicesData();

  
  $('.category-link').click(function(e) {
    e.preventDefault();
    console.log('Clicked a category link');
    $('.category-link').removeClass('active');
    $(this).addClass('active');
    const selectedCategory = $(this).data('category');
  
    if ($(this).hasClass('see-all')) { // Handle "See All" click
      resetContent();
    } else {
      const filteredServices = servicesData.filter(service => service.category === selectedCategory);
      displayServiceCards(filteredServices);
    }
  });
  

const loadMoreBtn = document.getElementById('load-more-btn');
loadMoreBtn.addEventListener('click', toggleLoadMore);

displayServiceCards(servicesData.slice(0, initialItems));
});
