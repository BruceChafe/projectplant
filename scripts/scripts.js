// Load Internal API when site loads
document.addEventListener('DOMContentLoaded', async () => {
  const dataAPI = new DataAPI();

  try {
      const data = await dataAPI.getData({
          // Provide any desired parameters here
      });

      // Display the fetched data in the console
      console.log('Fetched data:', data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
});

// Constants that I might still need
const apiKey = 'sk-ojin6499fba9bbfc11234'
const apiKey2 = 'sk-8uOL64d9325a586701870'

// Initialize currentPage for pagination
let currentPage = 1;

// Define validData as an empty array
let validData = [];

// Define the number of results to show per page
const resultsPerPage = 5;

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
  tableButton.addEventListener('click', async function () {
    const wateringOption = document.getElementById('watering-dropdown').value;
    const sunlightOption = document.getElementById('sunlight-dropdown').value;

    // Log the selected options
    console.log('Watering Option:', wateringOption);
    console.log('Sunlight Option:', sunlightOption);

    try {
      // Fetch data using the dataAPI
      const dataAPI = new DataAPI();
      const response = await dataAPI.getData({
        // Provide any desired parameters here
      });

      const fetchedData = response.data;

      // Filter data based on selected options
      const filteredData = fetchedData.filter(item => {
        return item.sunlight.includes(sunlightOption) && item.watering.includes(wateringOption);
      });

      // Log the filtered data
      console.log('Filtered data:', filteredData);

      currentPage = 1; // Reset to the first page when switching to table results
      createTableResult(wateringOption, sunlightOption);
      createPageButtons(); // Create the buttons only for Table Result

      // Set initial button states for the first page
      const nextPageButton = document.getElementById('next-page-button');
      const prevPageButton = document.getElementById('prev-page-button');
      if (nextPageButton && prevPageButton) {
        nextPageButton.disabled = currentPage >= getTotalPages(validData.length, resultsPerPage);
        prevPageButton.disabled = currentPage <= 1;
      }
    } catch (error) {
      console.error('Error fetching or filtering data:', error);
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

  async function createTableResult(wateringOption, sunlightOption) {
    const resultsContainer = document.getElementById('results-container');
  
    showLoadingOverlay();
  
    try {
      const response = await fetchTableResultData(wateringOption, sunlightOption);
      console.log('Fetched data:', response.data);
      hideLoadingOverlay();
  
      const data = response.data; // Extract the data array from the response
  
      if (Array.isArray(data)) {
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
          nextPageButton.disabled = currentPage >= Math.ceil(validData.length / resultsPerPage);
        }
        if (prevPageButton) {
          prevPageButton.disabled = currentPage <= 1;
        }
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      hideLoadingOverlay();
      console.error('Error fetching table result data:', error);
    }
  }
  
  
  // Function to fetch data for Table Result using the new API
  async function fetchTableResultData(wateringOption, sunlightOption) {
    const dataAPI = new DataAPI();
  
    try {
      const data = await dataAPI.getData({
        watering: wateringOption,
        sunlight: sunlightOption
      });
  
      return data;
    } catch (error) {
      throw new Error('Error fetching table result data:', error);
    }
  }
  
  // Function to create the HTML for table results
function createTableResultsHTML(data, currentPage) {
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