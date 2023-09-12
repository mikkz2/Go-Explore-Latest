// Function to fetch dynamic data from the server
function fetchDynamicData() {
    return fetch('http://localhost:3000/places_cities')
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(function(error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array in case of an error
      });
  }
  
  // Function to update dynamic elements with selected data
  function updateDynamicElements(selectedData) {
    const backgroundElement = document.querySelector(".background-image");
    const titleElement = document.querySelector("h3");
    const paragraphElement = document.querySelector(".dynamic-paragraph");
  
    backgroundElement.style.backgroundImage = `url('${selectedData.image}')`;
    titleElement.textContent = selectedData.title;
    paragraphElement.textContent = selectedData.description;
  }
  
  // Get the id from the query string
  const queryParams = new URLSearchParams(window.location.search);
  const id = parseInt(queryParams.get('id'));
  
  // Fetch dynamic data and update elements with the selected data
  fetchDynamicData().then(function(dynamicData) {
    const selectedData = dynamicData.find(item => item.id === id);
    updateDynamicElements(selectedData);
  });
  