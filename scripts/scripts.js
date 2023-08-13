// API Base URL with parameters
const apiKey = 'sk-ojin6499fba9bbfc11234'
const apiKey2 = 'sk-8uOL64d9325a586701870'
const apiUrl = 'https://perenual.com/api/species-list?page=1&key=' + apiKey2 + '&indoor=1';

// Initialize currentPage for pagination
let currentPage = 1;

// Function to get the total number of pages based on the validData
function getTotalPages() {
  const resultsPerPage = 5; // Set this according to your desired results per page
  const totalResults = validData.length;
  return Math.ceil(totalResults / resultsPerPage);
}

// Define validData as a global variable to store API response
let validData = [];

// Function to capitalize the first letter of each word
function capitalFirstLetter(string) {
  if (typeof string !== 'string') {
    return string;
  }

  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to simulate API call with a delay using Promises
function simulateAPIcall(apiUrl) {
  return new Promise((resolve, reject) => {
    // Simulate API call with a delay of 1 second
    setTimeout(() => {
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((responseData) => {
          console.log("API Response Data:", responseData);
          resolve(responseData.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          reject(error);
        });
    }, 1000);
  });
}

// Function to show loading overlay and disable buttons during API calls
function showLoadingOverlay() {
  const container = document.querySelector('.loading-overlay-container');

  // Remove any existing loading overlay
  const existingOverlay = document.querySelector('.loading-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Create a new loading overlay
  const overlay = document.createElement('div');
  overlay.classList.add('loading-overlay');
  overlay.textContent = 'Loading...';

  // Disable the suggest and table result buttons during API calls
  const suggestButton = document.getElementById('suggest-button');
  const tableButton = document.getElementById('table-button');
  suggestButton.classList.add('disabled');
  tableButton.classList.add('disabled');

  // Append the overlay to the container
  container.appendChild(overlay);
}

// Function to hide loading overlay and enable buttons after API calls
function hideLoadingOverlay() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.remove();
  }

  // Enable the suggest and table result buttons after API calls
  const suggestButton = document.getElementById('suggest-button');
  const tableButton = document.getElementById('table-button');
  suggestButton.classList.remove('disabled');
  tableButton.classList.remove('disabled');
}

// Function to display the correct value for select dropdown options
function getDisplayValue(selectedOption, apiValue) {
  const upgradeRequest = "Upgrade Plans To";
  if (typeof apiValue === "string" && apiValue.includes(upgradeRequest)) {
    if (apiValue === "Upgrade Plans To Premium/Supreme - https://perenual.com/subscription-api-pricing. I'm sorry") {
      return selectedOption;
    }
    const paywallInfo = apiValue.split("-");
    if (paywallInfo.length === 2 && paywallInfo[0].trim() === "Upgrade Plans To Premium/Supreme") {
      const selectedValue = paywallInfo[1].trim();
      return selectedValue === "null" ? selectedOption : selectedValue;
    }
  }
}

// Add event handler for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  // Add event handler for Suggest Result buttonn
  const suggestButton = document.getElementById('suggest-button');
  if (suggestButton) {
    suggestButton.addEventListener('click', function () {
      createSuggestResult();
      listSuggestData(detailsURL);
    });
  }

  // Add event handler for Table Result button
  const tableButton = document.getElementById('table-button');
  if (tableButton) {
    tableButton.addEventListener('click', function () {
      const wateringOption = document.getElementById('watering-dropdown').value;
      const sunlightOption = document.getElementById('sunlight-dropdown').value;
      currentPage = 1; // Reset to the first page when switching to table results
      createTableResult(wateringOption, sunlightOption);
      createPageButtons(); // Create the buttons only for Table Result

      // Set initial button states for the first page
      const nextPageButton = document.getElementById('next-page-button');
      const prevPageButton = document.getElementById('prev-page-button');
      if (nextPageButton) {
        nextPageButton.disabled = currentPage >= getTotalPages();
      }
      if (prevPageButton) {
        prevPageButton.disabled = currentPage <= 1;
      }
    });
  }

  // Add event handlers for page buttons
  const nextPageButton = document.getElementById('next-page-button');
  const prevPageButton = document.getElementById('prev-page-button');

  if (nextPageButton) {
    nextPageButton.addEventListener('click', showNextPage);
  }

  if (prevPageButton) {
    prevPageButton.addEventListener('click', showPreviousPage);
  }
})

// Function to fetch suggested Plant ID URL
let detailsURL = '';

function createSuggestResult(event, data, selectedWatering, selectedSunlight) {
  const resultsContainer = document.getElementById('results-container');

  const wateringOption = document.getElementById('watering-dropdown').value;
  const sunlightOption = document.getElementById('sunlight-dropdown').value;

  const apiUrlWithWatering = apiUrl + '&watering=' + wateringOption;
  const apiUrlWithWateringSunlight = apiUrlWithWatering + '&sunlight=' + sunlightOption;

  // Simulate API call with a delay
  simulateAPIcall(apiUrlWithWateringSunlight)
    .then((data) => {
      console.log("Data Received:", data);

      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomItem = data[randomIndex];
        console.log("Plant ID:", randomItem.id);

        // Fetch Suggest Result Data based on Random Plant ID
        detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;

        console.log("Details URL:", detailsURL);

        // Call listSuggestData after getting detailsURL
        listSuggestData(detailsURL, randomItem, resultsContainer);
      }
    });
}

function listSuggestData(detailsURL, randomItem, resultsContainer) {
  showLoadingOverlay();

  fetch(detailsURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((detailsData) => {
      hideLoadingOverlay();

      console.log("Details Data:", detailsData);

      // detailsData = data.map(item => ({
      //   common_name: getDisplayValue(common_nameOption, item.common_name),
      //   scientific_name: getDisplayValue(scientific_nameOption, item.scientific_name),
      //   other_name: getDisplayValue(other_nameOption, item.other_name),
      //   family: getDisplayValue(familyOption, item.family),
      //   type: getDisplayValue(typeOption, item.type),
      //   dimension: getDisplayValue(dimensionOption, item.dimension),
      //   cycle: getDisplayValue(cycleOption, item.cycle),
      //   propagation: getDisplayValue(propagationOption, item.propagation),
      //   watering: getDisplayValue(wateringOption, item.watering),
      //   sunlight: getDisplayValue(sunlightOption, item.sunlight),
      //   maintenance: getDisplayValue(maintenanceOption, item.maintenance),
      //   care_guides: getDisplayValue(care_guidesOption, item.care_guides),
      //   soil: getDisplayValue(soilOption, item.soil),
      //   growth_rate: getDisplayValue(growth_rateOption, item.growth_rate),
      //   drought_tolerant: getDisplayValue(drought_tolerantOption, item.drought_tolerant),
      //   salt_tolerant: getDisplayValue(salt_tolerantOption, item.salt_tolerant),
      //   thorny: getDisplayValue(thornyOption, item.thorny),
      //   invasive: getDisplayValue(invasiveOption, item.invasive),
      //   tropical: getDisplayValue(tropicalOption, item.tropical),
      //   indoor: getDisplayValue(indoorOption, item.indoor),
      //   pest_susceptibility: getDisplayValue(pest_susceptibilityOption, item.pest_susceptibility),
      //   poisonous_to_humans: getDisplayValue(poisonous_to_humansOption, item.poisonous_to_humans),
      //   poisonous_to_pets: getDisplayValue(poisonous_to_petsOption, item.poisonous_to_pets),
      //   description: getDisplayValue(descriptionOption, item.description),
      //   default_image: getDisplayValue(default_imageOption, item.default_image),
      //   license_name: getDisplayValue(license_nameOption, item.license_name),
      //   license_url: getDisplayValue(license_urlOption, item.license_url),
      //   original_url: getDisplayValue(original_urlOption, item.original_url),
      //   regular_url: getDisplayValue(regular_urlOption, item.regular_url),
      //   medium_url: getDisplayValue(medium_urlOption, item.medium_url),
      //   small_url: getDisplayValue(small_urlOption, item.small_url),
      //   thumbnail: getDisplayValue(thumbnailOption, item.thumbnail),
      //   other_images: getDisplayValue(other_imagesOption, item.other_images),
      // }));

      // console.log("Mapped Details Data", detailsData);

      // Generate HTML for resultsContainer
      let 
      html = '<br>'
      html += '<h3>Results:</h3>';
      html += '<div>';
      html += '<p>common_name: ' + capitalFirstLetter(detailsData.common_name) + '</p>';
      html += '<p>scientific_name: ' + capitalFirstLetter(detailsData.scientific_name) + '</p>';
      html += '<p>other_name: ' + capitalFirstLetter(detailsData.other_name) + '</p>';
      html += '<p>family: ' + capitalFirstLetter(detailsData.family) + '</p>';
      html += '<p>type: ' + capitalFirstLetter(detailsData.type) + '</p>';
      html += '<p>dimension: ' + capitalFirstLetter(detailsData.dimension) + '</p>';
      html += '<p>cycle: ' + capitalFirstLetter(detailsData.cycle) + '</p>';
      html += '<p>propagation: ' + capitalFirstLetter(detailsData.propagation) + '</p>';
      html += '<p>watering: ' + capitalFirstLetter(detailsData.watering) + '</p>';
      html += '<p>sunlight: ' + capitalFirstLetter(detailsData.sunlight) + '</p>';
      html += '<p>maintenance: ' + capitalFirstLetter(detailsData.maintenance) + '</p>';
      html += '<p>care_guides: ' + capitalFirstLetter(detailsData.care_guides) + '</p>';
      html += '<p>soil: ' + capitalFirstLetter(detailsData.soil) + '</p>';
      html += '<p>growth_rate: ' + capitalFirstLetter(detailsData.growth_rate) + '</p>';
      html += '<p>drought_tolerant: ' + capitalFirstLetter(detailsData.drought_tolerant) + '</p>';
      html += '<p>salt_tolerant: ' + capitalFirstLetter(detailsData.salt_tolerant) + '</p>';
      html += '<p>thorny: ' + capitalFirstLetter(detailsData.thorny) + '</p>';
      html += '<p>invasive: ' + capitalFirstLetter(detailsData.invasive) + '</p>';
      html += '<p>tropical: ' + capitalFirstLetter(detailsData.tropical) + '</p>';
      html += '<p>indoor: ' + capitalFirstLetter(detailsData.indoor) + '</p>';
      html += '<p>pest_susceptibility: ' + capitalFirstLetter(detailsData.pest_susceptibility) + '</p>';
      html += '<p>poisonous_to_humans: ' + capitalFirstLetter(detailsData.poisonous_to_humans) + '</p>';
      html += '<p>poisonous_to_pets: ' + capitalFirstLetter(detailsData.poisonous_to_pets) + '</p>';
      html += '<p>description: ' + capitalFirstLetter(detailsData.description) + '</p>';
      html += '<p>default_image: ' + capitalFirstLetter(detailsData.default_image) + '</p>';
      html += '<p>license_name: ' + capitalFirstLetter(detailsData.license_name) + '</p>';
      html += '<p>license_url: ' + capitalFirstLetter(detailsData.license_url) + '</p>';
      html += '<p>original_url: ' + capitalFirstLetter(detailsData.original_url) + '</p>';
      html += '<p>regular_url: ' + capitalFirstLetter(detailsData.regular_url) + '</p>';
      html += '<p>medium_url: ' + capitalFirstLetter(detailsData.medium_url) + '</p>';
      html += '<p>small_url: ' + capitalFirstLetter(detailsData.small_url) + '</p>';
      html += '<p>thumbnail: ' + capitalFirstLetter(detailsData.thumbnail) + '</p>';
      html += '<p>other_images: ' + capitalFirstLetter(detailsData.other_images) + '</p>';
      html += '</div>';

      resultsContainer.innerHTML = html;
    })
    .catch((error) => {
      hideLoadingOverlay();
      console.error("Error fetching details:", error);

      // // Handle error and update UI accordingly
      // resultsContainer.innerHTML = html;
    });
}

function showPreviousPage() {
  const wateringOption = document.getElementById('watering-dropdown').value;
  const sunlightOption = document.getElementById('sunlight-dropdown').value;
  const totalPages = getTotalPages();

  if (currentPage > 1) {
    currentPage -= 1;
  }

  // Update button states after changing the currentPage
  updateButtonStates();

  createTableResult(wateringOption, sunlightOption);
}

// Function to show the next page of results in the table
function showNextPage() {
  const wateringOption = document.getElementById('watering-dropdown').value;
  const sunlightOption = document.getElementById('sunlight-dropdown').value;
  const totalPages = getTotalPages();

  if (currentPage < totalPages) {
    currentPage += 1;
  }

  // Update button states after changing the currentPage
  updateButtonStates();

  createTableResult(wateringOption, sunlightOption);
}

// Function to create the pagination buttons dynamically and append them to the DOM
function createPageButtons() {
  const pageButtonsContainer = document.createElement('div');
  pageButtonsContainer.classList.add('page-number-container');
  pageButtonsContainer.id = 'page-buttons-container';

  // Create the prev-page-button and next-page-button only for Table Result
  const tableButton = document.getElementById('table-button');
  if (tableButton) {
    const prevPageButton = document.createElement('a');
    prevPageButton.href = '#';
    prevPageButton.classList.add('btn', 'btn-danger');
    prevPageButton.id = 'prev-page-button';
    prevPageButton.textContent = 'Previous Page';
    prevPageButton.addEventListener('click', showPreviousPage);

    const nextPageButton = document.createElement('a');
    nextPageButton.href = '#';
    nextPageButton.classList.add('btn', 'btn-danger');
    nextPageButton.id = 'next-page-button';
    nextPageButton.textContent = 'Next Page';
    nextPageButton.addEventListener('click', showNextPage);

    // Append the buttons to the buttons container
    pageButtonsContainer.appendChild(prevPageButton);
    pageButtonsContainer.appendChild(nextPageButton);
  }

  // Append the buttons container to the results container
  const resultsContainer = document.getElementById('results-container');
  const existingButtonsContainer = document.getElementById('page-buttons-container');
  if (existingButtonsContainer) {
    resultsContainer.removeChild(existingButtonsContainer);
  }
  resultsContainer.appendChild(pageButtonsContainer);
}

// Function to fetch and display Table Result
function createTableResult(wateringOption, sunlightOption) {
  const resultsContainer = document.getElementById('results-container');

  showLoadingOverlay();

  const apiUrlWithWatering = apiUrl + '&watering=' + wateringOption;
  const apiUrlWithWateringSunlight = apiUrlWithWatering + '&sunlight=' + sunlightOption;

  // Simulate API call with a delay and handle the result
  simulateAPIcall(apiUrlWithWateringSunlight).then((data) => {
    hideLoadingOverlay();

    // Update validData with the new data fetched from the API
    validData = data.map(item => ({
      ...item,
      sunlight: getDisplayValue(sunlightOption, item.sunlight),
      watering: getDisplayValue(wateringOption, item.watering),
    }));

    const resultsHTML = createTableResultsHTML(validData, currentPage);
    resultsContainer.innerHTML = resultsHTML;

    // Call the function to create the pagination buttons
    createPageButtons();

    // Set initial button states for the first page
    const nextPageButton = document.getElementById('next-page-button');
    const prevPageButton = document.getElementById('prev-page-button');
    if (nextPageButton) {
      nextPageButton.disabled = currentPage >= getTotalPages();
    }
    if (prevPageButton) {
      prevPageButton.disabled = currentPage <= 1;
    }
  });
}

// Function to create HTML for Table Result
function createTableResultsHTML(data, currentPage) {
  console.log("Data recieved:", data);
  // Calculate the starting and ending indices for the current page
  const resultsPerPage = 5; // Set this according to your desired results per page
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;

  let html = '<h3>Results:</h3>';

  // Get the data for the current page
  const validDataForPage = data.slice(startIndex, endIndex);

  if (validDataForPage.length > 0) {
    html += '<table>';
    html += '<tr>';
    html += '<th>Common Name</th>';
    html += '<th>Sunlight</th>';
    html += '<th>Watering</th>';
    html += '</tr>';

    validDataForPage.forEach(item => {
      html += '<tr>';
      html += '<td>' + capitalFirstLetter(item.common_name) + '</td>';
      html += '<td>' + capitalFirstLetter(item.sunlight) + '</td>';
      html += '<td>' + capitalFirstLetter(item.watering) + '</td>';
      html += '</tr>';
    });

    html += '</table>';
  } else {
    html += '<p>No results found.</p>';
  }

  return html;
}