

// // API Base URL with parameters
// const apiKey = 'sk-ojin6499fba9bbfc11234'
// const apiKey2 = 'sk-8uOL64d9325a586701870'
// const apiUrl = 'https://perenual.com/api/species-list?page=1&key=' + apiKey2 + '&indoor=1';
// import { DataAPI } from './dataApi.js'
// const dataApi = new DataAPI();

// // Initialize currentPage for pagination
// let currentPage = 1;

// Define a function to fetch and log data
async function fetchDataAndLog() {
  try {
      // Fetch data using the getData method of the DataAPI class
      const data = await dataApi.getData({
          // Define your filter options here
      });

      // Log the fetched data to the console
      console.log('Fetched data:', data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Function to get the total number of pages based on the validData
function getTotalPages() {
  const resultsPerPage = 5; // Set this according to your desired results per page
  const totalResults = validData.length;
  return Math.ceil(totalResults / resultsPerPage);
}

// Define validData as a global variable to store API response
let validData = [];

// // Function to capitalize the first letter of each word
// function capitalFirstLetter(string) {
//   if (typeof string !== 'string') {
//     return string;
//   }

//   return string
//     .split(' ')
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// }

// Function to simulate API call with a delay using Promises
function simulateAPIcall(api) {
  return new Promise((resolve, reject) => {
    // Simulate API call with a delay of 1 second
    setTimeout(() => {
      fetch(api)
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

// // Function to show loading overlay and disable buttons during API calls
// function showLoadingOverlay() {
//   const container = document.querySelector('.loading-overlay-container');

//   // Remove any existing loading overlay
//   const existingOverlay = document.querySelector('.loading-overlay');
//   if (existingOverlay) {
//     existingOverlay.remove();
//   }

//   // Create a new loading overlay
//   const overlay = document.createElement('div');
//   overlay.classList.add('loading-overlay');
//   overlay.textContent = 'Loading...';

//   // Disable the suggest and table result buttons during API calls
//   const suggestButton = document.getElementById('suggest-button');
//   const tableButton = document.getElementById('table-button');
//   suggestButton.classList.add('disabled');
//   tableButton.classList.add('disabled');

//   // Append the overlay to the container
//   container.appendChild(overlay);
// }

// // Function to hide loading overlay and enable buttons after API calls
// function hideLoadingOverlay() {
//   const overlay = document.querySelector('.loading-overlay');
//   if (overlay) {
//     overlay.remove();
//   }

//   // Enable the suggest and table result buttons after API calls
//   const suggestButton = document.getElementById('suggest-button');
//   const tableButton = document.getElementById('table-button');
//   suggestButton.classList.remove('disabled');
//   tableButton.classList.remove('disabled');
// }


// // Add event handler for DOMContentLoaded
// document.addEventListener('DOMContentLoaded', function () {

//   // Add event handler for Suggest Result buttonn
//   const suggestButton = document.getElementById('suggest-button');
//   if (suggestButton) {
//     suggestButton.addEventListener('click', function () {
//       createSuggestResult();
//       listSuggestData(detailsURL);
//     });
//   }

  // // Add event handler for Table Result button
  // const tableButton = document.getElementById('table-button');
  // if (tableButton) {
  //   tableButton.addEventListener('click', function () {
  //     const wateringOption = document.getElementById('watering-dropdown').value;
  //     const sunlightOption = document.getElementById('sunlight-dropdown').value;
  //     currentPage = 1; // Reset to the first page when switching to table results
  //     createTableResult(wateringOption, sunlightOption);
  //     createPageButtons(); // Create the buttons only for Table Result

  //     // Set initial button states for the first page
  //     const nextPageButton = document.getElementById('next-page-button');
  //     const prevPageButton = document.getElementById('prev-page-button');
  //     if (nextPageButton) {
  //       nextPageButton.disabled = currentPage >= getTotalPages();
  //     }
  //     if (prevPageButton) {
  //       prevPageButton.disabled = currentPage <= 1;
  //     }
  //   });
  // }

//   // Add event handlers for page buttons
//   const nextPageButton = document.getElementById('next-page-button');
//   const prevPageButton = document.getElementById('prev-page-button');

//   if (nextPageButton) {
//     nextPageButton.addEventListener('click', showNextPage);
//   }

//   if (prevPageButton) {
//     prevPageButton.addEventListener('click', showPreviousPage);
//   }
// })

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
        selectRandomID(data);
      }
    });

      // Create the randomItem.id
      function selectRandomID(data) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomItem = data[randomIndex];
        console.log("Plant ID:", randomItem.id);

        // Look to see if randomItem.id falls in line with free API & create URL
        if (randomItem.id > 0 && randomItem.id <= 3000) {
          detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;
          console.log("Details URL:", detailsURL);

          // Call listSuggestData after getting detailsURL
          listSuggestData(detailsURL, randomItem, resultsContainer);

          // Handle the case if randomItem.id is above 3000
        } else if (randomItem.id > 3000) {
          console.log("Plant ID is above 3000, API return failed. Looping");

          // Remove the failed randomItem.id from the data array
          data = data.filter(item => item.id !== randomItem.id);
          console.log("Updated Data Count:", data);

          // Rerun search
          if (data.length > 0) {
            selectRandomID(data);
          } else {
            console.log("No more valid items in the data array");
          }
        }
      }
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

      // Generate HTML for resultsContainer
      let 
      html = '<br>'
      html += '<h3>Results:</h3>';
      html += '<div>';
      html += '<p>Common Name: ' + capitalFirstLetter(detailsData.common_name) + '</p>';
      html += '<p>Scientific Name: ' + capitalFirstLetter(detailsData.scientific_name) + '</p>';
      html += '<p>Family: ' + capitalFirstLetter(detailsData.family) + '</p>';
      html += '<p>Propagation: ' + capitalFirstLetter(detailsData.propagation) + '</p>';
      html += '<p>Watering: ' + capitalFirstLetter(detailsData.watering) + '</p>';
      html += '<p>Sunlight: ' + capitalFirstLetter(detailsData.sunlight) + '</p>';
      html += '<p>Maintenance: ' + capitalFirstLetter(detailsData.maintenance) + '</p>';
      html += '<p>Growth Rate: ' + capitalFirstLetter(detailsData.growth_rate) + '</p>';
      html += '<p>Drought Tolerant: ' + capitalFirstLetter(detailsData.drought_tolerant) + '</p>';
      html += '<p>Indoor: ' + capitalFirstLetter(detailsData.indoor) + '</p>';
      html += '<p>Poisonous To Humans: ' + capitalFirstLetter(detailsData.poisonous_to_humans) + '</p>';
      html += '<p>Poisonous To Pets: ' + capitalFirstLetter(detailsData.poisonous_to_pets) + '</p>';
      html += '<p>Description: ' + detailsData.description + '</p>';
      html += '<p>Default Image: ' + capitalFirstLetter(detailsData.default_image) + '</p>';
      html += '<p>License Url: ' + capitalFirstLetter(detailsData.license_url) + '</p>';
      html += '<p>Original Url: ' + detailsData.default_image?.original_url + '</p>';
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

// function showPreviousPage() {
//   const wateringOption = document.getElementById('watering-dropdown').value;
//   const sunlightOption = document.getElementById('sunlight-dropdown').value;
//   const totalPages = getTotalPages();

//   if (currentPage > 1) {
//     currentPage -= 1;
//   }

//   // Update button states after changing the currentPage
//   updateButtonStates();

//   createTableResult(wateringOption, sunlightOption);
// }

// // Function to show the next page of results in the table
// function showNextPage() {
//   const wateringOption = document.getElementById('watering-dropdown').value;
//   const sunlightOption = document.getElementById('sunlight-dropdown').value;
//   const totalPages = getTotalPages();

//   if (currentPage < totalPages) {
//     currentPage += 1;
//   }

//   // Update button states after changing the currentPage
//   updateButtonStates();

//   createTableResult(wateringOption, sunlightOption);
// }

// // Function to create the pagination buttons dynamically and append them to the DOM
// function createPageButtons() {
//   const pageButtonsContainer = document.createElement('div');
//   pageButtonsContainer.classList.add('page-number-container');
//   pageButtonsContainer.id = 'page-buttons-container';

//   // Create the prev-page-button and next-page-button only for Table Result
//   const tableButton = document.getElementById('table-button');
//   if (tableButton) {
//     const prevPageButton = document.createElement('a');
//     prevPageButton.href = '#';
//     prevPageButton.classList.add('btn', 'btn-danger');
//     prevPageButton.id = 'prev-page-button';
//     prevPageButton.textContent = 'Previous Page';
//     prevPageButton.addEventListener('click', showPreviousPage);

//     const nextPageButton = document.createElement('a');
//     nextPageButton.href = '#';
//     nextPageButton.classList.add('btn', 'btn-danger');
//     nextPageButton.id = 'next-page-button';
//     nextPageButton.textContent = 'Next Page';
//     nextPageButton.addEventListener('click', showNextPage);

//     // Append the buttons to the buttons container
//     pageButtonsContainer.appendChild(prevPageButton);
//     pageButtonsContainer.appendChild(nextPageButton);
//   }

//   // Append the buttons container to the results container
//   const resultsContainer = document.getElementById('results-container');
//   const existingButtonsContainer = document.getElementById('page-buttons-container');
//   if (existingButtonsContainer) {
//     resultsContainer.removeChild(existingButtonsContainer);
//   }
//   resultsContainer.appendChild(pageButtonsContainer);
// }

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