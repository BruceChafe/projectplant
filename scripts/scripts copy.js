// API Base URL with parameters
const apiKey2 = 'sk-ojin6499fba9bbfc11234'
const apiKey = 'sk-8uOL64d9325a586701870'
const apiUrl = 'https://perenual.com/api/species-list?page=1&key=' + apiKey2 + '&indoor=1';

// Initialize currentPage for pagination
let currentPage = 1;

// Function to get the total number of pages based on the validData
function getTotalPages(filteredData) {
    const resultsPerPage = 5; // Set this according to your desired results per page
    const totalResults = filteredData.length;
    return Math.ceil(totalResults / resultsPerPage);
}

// Define validData and filteredData as global variables to store API responses
let validData = [];
let filteredData = [];

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

// Function to show the next page of results in the table
function showNextPage() {
    const wateringOption = document.getElementById('watering-dropdown').value;
    const sunlightOption = document.getElementById('sunlight-dropdown').value;
    const totalPages = getTotalPages(filteredData);
    console.log('totalPages', totalPages);

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

function showPreviousPage() {
    const wateringOption = document.getElementById('watering-dropdown').value;
    const sunlightOption = document.getElementById('sunlight-dropdown').value;
    const totalPages = getTotalPages(filteredData);

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
    const totalPages = getTotalPages(filteredData);

    if (nextPageButton) {
        nextPageButton.disabled = currentPage >= totalPages;
    }
    if (prevPageButton) {
        prevPageButton.disabled = currentPage <= 1;
    }
}

// Add event handler for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Add event handler for Suggest Result buttonn
    const suggestButton = document.getElementById('suggest-button');
    if (suggestButton) {
        suggestButton.addEventListener('click', function () {
            createSuggestResult();
        });
    }

    // Add event handler for Table Result button
    const tableButton = document.getElementById('table-button');
    if (tableButton) {
        tableButton.addEventListener('click', function () {
            currentPage = 1; // Reset to the first page when switching to table results
            createTableResult();
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

function createTableResult() {
    const resultsContainer = document.getElementById('results-container');

    showLoadingOverlay();
    resultsContainer.innerHTML = '';

    const wateringOption = document.getElementById('watering-dropdown').value;
    const sunlightOption = document.getElementById('sunlight-dropdown').value;

    const apiUrlWithWatering = apiUrl + '&watering=' + wateringOption;
    const apiUrlWithWateringSunlight = apiUrlWithWatering + '&sunlight=' + sunlightOption;

    // Simulate API call with a delay and handle the result
    simulateAPIcall(apiUrlWithWateringSunlight)
        .then((data) => {
            console.log("Data Received:", data);
            hideLoadingOverlay();

            // Filter out data with ID 3001 and above
            filteredData = data.filter(item => item.id <= 3000); // Assign to filteredData
            console.log("Filtered Data:", filteredData);

            const resultsHTML = createTableResultsHTML(filteredData, currentPage);
            resultsContainer.innerHTML = resultsHTML;

            // Call the function to create the pagination buttons
            createPageButtons();

            // Set initial button states for the first page
            const nextPageButton = document.getElementById('next-page-button');
            const prevPageButton = document.getElementById('prev-page-button');
            if (nextPageButton) {
                nextPageButton.disabled = currentPage >= getTotalPages(filteredData);
            }
            if (prevPageButton) {
                prevPageButton.disabled = currentPage <= 1;
            }
        });
}

// Function to fetch suggested Plant ID URL
function createSuggestResult(event, data, selectedWatering, selectedSunlight) {
    const resultsContainer = document.getElementById('results-container');

    resultsContainer.innerHTML = '';

    const wateringOption = document.getElementById('watering-dropdown').value;
    const sunlightOption = document.getElementById('sunlight-dropdown').value;

    const apiUrlWithWatering = apiUrl + '&watering=' + wateringOption;
    const apiUrlWithWateringSunlight = apiUrlWithWatering + '&sunlight=' + sunlightOption;

    // Simulate API call with a delay
    simulateAPIcall(apiUrlWithWateringSunlight)
        .then((data) => {
            console.log("Data Received:", data);

            const filteredData = data.filter(item => item.id <= 3000);
            console.log("Filtered Data:", filteredData);

            const randomIndex = Math.floor(Math.random() * filteredData.length);
            const randomItem = data[randomIndex];
            console.log("Plant ID:", randomItem.id);

            const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;
            console.log("Details URL:", detailsURL);

            listSuggestData(detailsURL, randomItem, resultsContainer);

            const nextRandomData = filteredData.filter(item => item.id !== randomItem.id);
            console.log("Next Random Data:", nextRandomData);
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
            console.log("Details Data:", detailsData);

            // Generate HTML for resultsContainer
            let
                html = '<br>'
            html += '<h3>Results:</h3>';
            html += '<div>';
            html += capitalFirstLetter(detailsData.common_name)
            html += '<br>'
            if (detailsData.default_image?.original_url) {
                html += '<img src="' + detailsData.default_image?.original_url + '" alt="Plant Image" width="500">';
            } else {
                html += '<img src="images/imagenotfound.png">';
            }
            html += '<br>'
            html += '<p>Scientific Name: ' + capitalFirstLetter(detailsData.scientific_name) + '</p>';
            html += '<p>Family: ' + capitalFirstLetter(detailsData.family) + '</p>';
            html += '<p>Propagation: ' + capitalFirstLetter(detailsData.propagation) + '</p>';
            html += '<p>Watering: ' + capitalFirstLetter(detailsData.watering) + '</p>';
            html += '<p>Sunlight: ' + capitalFirstLetter(detailsData.sunlight) + '</p>';
            html += '<p>Maintenance: ' + capitalFirstLetter(detailsData.maintenance) + '</p>';
            html += '<p>Growth Rate: ' + capitalFirstLetter(detailsData.growth_rate) + '</p>';
            // Check the value of detailsData.drought_tolerant and change text accordingly
            if (detailsData.drought_tolerant === true) {
                html += '<p>Drought Tolerant: Yes</p>';
            } else {
                html += '<p>Drought Tolerant: No</p>';
            }
            // Check the value of detailsData.indoor and change text accordingly
            if (detailsData.indoor === true) {
                html += '<p>Inddor: Yes</p>';
            } else {
                html += '<p>Indoor: No</p>';
            }
            // Check the value of detailsData.poisonous_to_humans and change text accordingly
            if (detailsData.poisonous_to_humans === 0) {
                html += '<p>Poisonous To Humans: Yes</p>';
            } else {
                html += '<p>Poisonous To Humans: No</p>';
            }
            // Check the value of detailsData.poisonous_to_pets and change text accordingly
            if (detailsData.poisonous_to_pets === 0) {
                html += '<p>Poisonous To Pets: Yes</p>';
            } else {
                html += '<p>Poisonous To Pets: No</p>';
            }
            html += '<p>Description: ' + detailsData.description + '</p>';

            html += '</div>';

            resultsContainer.innerHTML = html;

            hideLoadingOverlay();
        });
}


// Function to create HTML for Table Result
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
