// API Base URL with parameters
const apiUrl = 'https://perenual.com/api/species-list?page=1&key=sk-ojin6499fba9bbfc11234&indoor=1';

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

// Function to show the next page of results in the table
function showNextPage() {
  const wateringOption = document.getElementById('watering-dropdown').value;
  const sunlightOption = document.getElementById('sunlight-dropdown').value;
  const totalPages = getTotalPages();

  if (currentPage < totalPages) {
    currentPage += 1;
  }

  // Disable the next button if we are on the last page
  const nextPageButton = document.getElementById('next-page-button');
  if (nextPageButton) {
    if (currentPage >= totalPages) {
      nextPageButton.classList.add('disabled');
    } else {
      nextPageButton.classList.remove('disabled');
    }
  }

  // Re-enable the previous button since we are moving to the next page
  const prevPageButton = document.getElementById('prev-page-button');
  if (prevPageButton) {
    if (currentPage === 1) {
      prevPageButton.classList.add('disabled');
    } else {
      prevPageButton.classList.remove('disabled');
    }
  }

  createTableResult(wateringOption, sunlightOption);
}

// Function to show the previous page of results in the table
function showPreviousPage() {
  const wateringOption = document.getElementById('watering-dropdown').value;
  const sunlightOption = document.getElementById('sunlight-dropdown').value;
  const totalPages = getTotalPages();

  if (currentPage > 1) {
    currentPage -= 1;
  }

  // Disable the previous button if we are on the first page
  const prevPageButton = document.getElementById('prev-page-button');
  if (prevPageButton) {
    if (currentPage === 1) {
      prevPageButton.classList.add('disabled');
    } else {
      prevPageButton.classList.remove('disabled');
    }
  }

  // Re-enable the next button since we are moving to the previous page
  const nextPageButton = document.getElementById('next-page-button');
  if (nextPageButton) {
    if (currentPage < totalPages) {
      nextPageButton.classList.add('disabled');
    } else {
      nextPageButton.classList.remove('disabled');
    }
  }

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

// Function to update the prevPageButton and nextPageButton status based on currentPage and total pages
function updateButtonStates() {
  const prevPageButton = document.getElementById('prev-page-button');
  const nextPageButton = document.getElementById('next-page-button');
  const totalPages = getTotalPages();

  if (prevPageButton) {
    // Disable the previous button if we are on the first page
    prevPageButton.disabled = currentPage <= 1;
  }

  if (nextPageButton) {
    // Disable the next button if we are on the last page
    nextPageButton.disabled = currentPage >= totalPages;
  }
}

// Add event handler for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  // Call the function to update the button states based on the current page
  updateButtonStates();

  // Add event handler for Suggest Result button
  const suggestButton = document.getElementById('suggest-button');
  if (suggestButton) {
    suggestButton.addEventListener('click', createSuggestResult);
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
      updateButtonStates(); // Update button states for Table Result
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
});

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

    // Set initial button states
    updateButtonStates();
  });
}

// Function to fetch and display Suggest Result
function createSuggestResult(event) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = ''; // Clear existing results

  showLoadingOverlay();

  const wateringOption = document.getElementById('watering-dropdown').value;
  const sunlightOption = document.getElementById('sunlight-dropdown').value;

  const apiUrlWithWatering = apiUrl + '&watering=' + wateringOption;
  const apiUrlWithWateringSunlight = apiUrlWithWatering + '&sunlight=' + sunlightOption;

  // Simulate API call with a delay and handle the result
  simulateAPIcall(apiUrlWithWateringSunlight).then((data) => {
    hideLoadingOverlay();
    const resultsHTML = createSuggestResultsHTML(data, wateringOption, sunlightOption);
    resultsContainer.innerHTML = resultsHTML;

    // Update button states (No need for buttons in the Suggest Result)
    updateButtonStates();
  });
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

  return apiValue;
}

// Function to create HTML for Suggest Result
function createSuggestResultsHTML(data, selectedWatering, selectedSunlight) {
  console.log("Data received:", data);
  let html = '<h3>Results:</h3>';

  validData = data.map(item => ({
    ...item,
    sunlight: getDisplayValue(selectedSunlight, item.sunlight),
    watering: getDisplayValue(selectedWatering, item.watering),
  }));

  if (validData.length > 0) {
    const randomIndex = Math.floor(Math.random() * validData.length);
    const randomItem = validData[randomIndex];

    html += '<div>';
    html += '<h4>Common Name: ' + capitalFirstLetter(randomItem.common_name) + '</h4>';
    html += '<p>Sunlight: ' + capitalFirstLetter(randomItem.sunlight) + '</p>';
    html += '<p>Watering: ' + capitalFirstLetter(randomItem.watering) + '</p>';
    html += '<p>Perennial Plant ID: ' + randomItem.id + '</p>';
    html += '</div>';
  }

  return html;
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
