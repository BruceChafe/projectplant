// Constants that I might still need
const apiKey = 'sk-ojin6499fba9bbfc11234';
const apiKey2 = 'sk-8uOL64d9325a586701870';

// Definiations
let currentPage = 1;
let validData = [];
let resultsPerPage = 5;
let data;
let filteredData;
let wateringOption;
let sunlightOption;

// Initialize pageButtonsContainer outside of the function
let pageButtonsContainer = document.createElement('div');
pageButtonsContainer.classList.add('page-number-container');
pageButtonsContainer.id = 'page-buttons-container';

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

// Function to calculate total number of pages
function getTotalPages(dataLength, resultsPerPage) {
  return Math.ceil(dataLength / resultsPerPage);
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

// Add event handler for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  const resultsContainer = document.getElementById('results-container'); 

  // Add event handler for Suggest Result button
  const tableButton = document.getElementById('table-button');
  if (tableButton) {
    console.log('Script loaded.');
    tableButton.addEventListener('click', async function () {
      console.log('Button clicked.');
      // Handle the click event for the tableButton here
    });
  
    // Add event handlers for page buttons
    const nextPageButton = document.getElementById('next-page-button');
    const prevPageButton = document.getElementById('prev-page-button');
  
    if (nextPageButton) {
      nextPageButton.addEventListener('click', showNextPage);
    }
  
    if (prevPageButton) {
      prevPageButton.addEventListener('click', showPreviousPage);
    }
  }

  // Add event handler for Table Result button
  if (tableButton) {
    tableButton.addEventListener('click', async function () {
      // Get the selected options
      wateringOption = document.getElementById('watering-dropdown').value;
      sunlightOption = document.getElementById('sunlight-dropdown').value;

      // Log the selected options
      console.log('Watering Option:', wateringOption);
      console.log('Sunlight Option:', sunlightOption);

      try {
        // Fetch data using the dataAPI
        const dataAPI = new DataAPI();
        const responseData = await dataAPI.getData();
        console.log('Starting Data:', responseData);

        data = responseData.data;
filteredData = data.filter(item => {
  return item.sunlight.includes(sunlightOption) && item.watering === wateringOption;
});

        filteredData = data.filter(item => {
          return item.sunlight.includes(sunlightOption) && item.watering === wateringOption;
        });

        console.log('Filtered Data:', filteredData);

        // Clear existing results before adding new ones
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';

        // Create the page buttons and set initial button states
        currentPage = 1; 
        console.log("huh");
        updateButtonStates();

        // Create the initial table result
        createTableResult(wateringOption, sunlightOption);
      } catch (error) {
        console.error('Error fetching or filtering data:', error);
      }
    });
  }
});

function showPreviousPage() {
  const wateringOption = document.getElementById('watering-dropdown').value;
  const sunlightOption = document.getElementById('sunlight-dropdown').value;
  const totalPages = getTotalPages(filteredData.length, resultsPerPage);

  if (currentPage > 1) {
    currentPage -= 1;
  }

  createTableResult(wateringOption, sunlightOption);
}

// Function to show the next page of results in the table
function showNextPage() {
  const wateringOption = document.getElementById('watering-dropdown').value;
  const sunlightOption = document.getElementById('sunlight-dropdown').value;
  const totalPages = getTotalPages(filteredData.length, resultsPerPage);

  if (currentPage < totalPages) {
    currentPage += 1;
  }

  createTableResult(wateringOption, sunlightOption);
}

// Function to create the pagination buttons dynamically and append them to the DOM
// Function to create the pagination buttons dynamically and append them to the DOM
function createPageButtons() {
  console.log("createPageButtons() called");
  const newPageButtonsContainer = document.createElement('div'); // Make a new box for buttons
  newPageButtonsContainer.classList.add('page-number-container');
  newPageButtonsContainer.id = 'page-buttons-container';

  const existingButtonsContainer = document.getElementById('page-buttons-container');
  console.log("Existing container:", existingButtonsContainer);
  
  if (existingButtonsContainer) {
    console.log("Removing existing container");
    existingButtonsContainer.remove();
  }

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

    // Append the buttons to the new buttons container
    newPageButtonsContainer.appendChild(prevPageButton);
    newPageButtonsContainer.appendChild(nextPageButton);
    
    // Append the new buttons container to the results container
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.appendChild(newPageButtonsContainer);
  }
}



// Function to create the table results based on the current page and options
function createTableResult(wateringOption, sunlightOption) {
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;

  let html = '<h3>Results:</h3>';

  const validDataForPage = filteredData.slice(startIndex, endIndex);

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

  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = html;
  createPageButtons(); // Create the pagination buttons after updating the results
}

// Function to update button states based on the current page
function updateButtonStates() {
  const nextPageButton = document.getElementById('next-page-button');
  const prevPageButton = document.getElementById('prev-page-button');
  const totalPages = getTotalPages(filteredData.length, resultsPerPage);

  if (nextPageButton && prevPageButton) {
    nextPageButton.disabled = currentPage >= totalPages;
    prevPageButton.disabled = currentPage <= 1;
  }
}