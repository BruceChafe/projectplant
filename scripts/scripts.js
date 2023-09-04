// API Base URL with parameters
const apiKey2 = 'sk-ojin6499fba9bbfc11234'
const apiKey = 'sk-8uOL64d9325a586701870'
const apiUrl = 'https://perenual.com/api/species-list?page=1&key=' + apiKey2 + '&indoor=1';

// Initialize currentPage for pagination
let currentPage = 1;
let currentResult = 1;
let validData = [];
let filteredData = [];
let currentResultIndex = 0;
let randomItem

const suggestButton = document.getElementById('suggest-button');
if (suggestButton) {
    suggestButton.addEventListener('click', function () {
        createSuggestResult(filteredData);
    });
}

// Function to get the total number of pages based on the validData
function getTotalPages(filteredData) {
    const resultsPerPage = 5; // Set this according to your desired results per pƒageç
    const totalResults = filteredData.length;
    return Math.ceil(totalResults / resultsPerPage);
}

// Function to get the total number of results based on the validData
function getTotalResults(filteredData) {
    const resultsPerPage = 1; // Set this according to your desired results per pƒageç
    const totalResults = filteredData.length;
    return Math.ceil(totalResults / resultsPerPage);
}

// Add event handler for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Add event handler for Suggest Result buttonn
    const suggestButton = document.getElementById('suggest-button');
    if (suggestButton) {
        suggestButton.addEventListener('click', function () {
            createSuggestResult(filteredData);
        });
    }

    // Add event handler for Table Result button
    const tableButton = document.getElementById('table-button');
    if (tableButton) {
        tableButton.addEventListener('click', function () {
            currentPage = 1; // Reset to the first page when switching to table results
            createTableResult();
        });
    }
})

// Add event listener for Learn More button
document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('btn-learn-more')) {
        const itemId = target.getAttribute('data-item-id');
        console.log('triggered');
        showItemDetails(itemId);

    }
});

function showItemDetails(itemId) {
    // Find the collapsible container for the clicked item
    const collapsibleContainer = document.querySelector(`[data-item-id="${itemId}"] .collapsible-container`);
    
    if (collapsibleContainer) {
        // Toggle the visibility of the collapsible division
        const collapsible = collapsibleContainer.querySelector('.collapse');
        if (collapsible) {
            collapsible.classList.toggle('show');
        }
    }
}

function generatePlantDetailsHTML(detailsData) {
    let html = '<br>';
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
        html += '<p>Indoor: Yes</p>';
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
    return html;
}

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

// function expandTableReslts();

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

let loadingOverlayVisible = false;

function toggleLoadingOverlay(showOverlay) {
    const container = document.querySelector('.loading-overlay-container');
    
    if (showOverlay) {
        // Show loading overlay
        if (!loadingOverlayVisible) {
            // Create a new loading overlay
            const overlay = document.createElement('div');
            overlay.classList.add('loading-overlay');
            overlay.textContent = 'Loading...';

            // Append the overlay to the container
            container.appendChild(overlay);
            loadingOverlayVisible = true;
        }
    } else {
        // Hide loading overlay
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
            loadingOverlayVisible = false;
        }
    }
}


// Show Results Functions
function showNextPage() {
    const wateringOption = document.getElementById('watering-dropdown').value;
    const sunlightOption = document.getElementById('sunlight-dropdown').value;
    const totalPages = getTotalPages(filteredData);
    console.log('totalPages', totalPages);

    if (currentPage < totalPages) {
        currentPage += 1;
    }

    createTableResult(wateringOption, sunlightOption);
}

function showPreviousPage() {
    const wateringOption = document.getElementById('watering-dropdown').value;
    const sunlightOption = document.getElementById('sunlight-dropdown').value;
    const totalPages = getTotalPages(filteredData);

    if (currentPage > 1) {
        currentPage -= 1;
        createTableResult(wateringOption, sunlightOption);
    }
}

function createTableButtons() {
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

    // Set initial button states
    updateTableButtons();
}

function updateTableButtons() {
    const prevPageButton = document.getElementById('prev-page-button');
    const nextPageButton = document.getElementById('next-page-button');
    const totalPages = getTotalPages(filteredData);

    if (prevPageButton) {
        if (currentPage === 1) {
            prevPageButton.classList.add('disabled');
        }
    }

    if (nextPageButton) {
        if (currentPage === totalPages) {
            nextPageButton.classList.add('disabled');
        }
    }
}

// Show Suggest Functions
function showNextSuggest() {
    currentResult += 1;
    if (currentResult > getTotalResults(filteredData)) {
        currentResult = 1;
    }
    createUpdatedSuggestResult(filteredData);
    
}

function showPreviousSuggest() {
    currentResult -= 1;
    if (currentResult < 1) {
        currentResult = getTotalResults(filteredData);
    }
    createSuggestResult(filteredData);
    
}

function createSuggestButtons() {
    const pageButtonsContainer = document.createElement('div');
    pageButtonsContainer.classList.add('page-number-container');
    pageButtonsContainer.id = 'page-buttons-container';

    // Create the prev-suggest-button and next-suggest-button only for Suggest Result
    const suggestButton = document.getElementById('suggest-button');
    if (suggestButton) {

        const nextSuggestButton = document.createElement('a');
        nextSuggestButton.href = '#';
        nextSuggestButton.classList.add('btn', 'btn-danger');
        nextSuggestButton.id = 'next-suggest-button';
        nextSuggestButton.textContent = 'Try Again';
        nextSuggestButton.addEventListener('click', showNextSuggest);

        // Append the buttons to the buttons container
        pageButtonsContainer.appendChild(nextSuggestButton);
    }

    // Append the buttons container to the results container
    const resultsContainer = document.getElementById('results-container');
    const existingButtonsContainer = document.getElementById('page-buttons-container');
    if (existingButtonsContainer) {
        resultsContainer.removeChild(existingButtonsContainer);
    }
    resultsContainer.appendChild(pageButtonsContainer);

    // Set initial button states
    updateSuggestButtons();
}

function updateSuggestButtons() {
    const prevSuggestButton = document.getElementById('prev-suggest-button');
    const nextSuggestButton = document.getElementById('next-suggest-button');
    const totalResults = getTotalResults(filteredData);

    if (prevSuggestButton) {
        if (currentResult === 1) {
            prevSuggestButton.classList.add('disabled');
        } else {
            prevSuggestButton.classList.remove('disabled');
        }
    }

    if (nextSuggestButton) {
        if (currentResult === totalResults) {
            nextSuggestButton.classList.add('disabled');
        } else {
            nextSuggestButton.classList.remove('disabled');
        }
    }
}

// Table Results
function createTableResult() {
    toggleLoadingOverlay(true);

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    const wateringOption = document.getElementById('watering-dropdown').value;
    const sunlightOption = document.getElementById('sunlight-dropdown').value;

    const apiUrlWithWatering = apiUrl + '&watering=' + wateringOption;
    const apiUrlWithWateringSunlight = apiUrlWithWatering + '&sunlight=' + sunlightOption;

    // Simulate API call with a delay and handle the result
    simulateAPIcall(apiUrlWithWateringSunlight)
        .then((data) => {
            console.log("Data Received:", data);

            filteredData = data.filter(item => item.id <= 3000); // Assign to filteredData
            console.log("Filtered Data:", filteredData);

            // Collect promises for fetching details
            const fetchPromises = filteredData.map(item => {
                const detailsURL = 'https://perenual.com/api/species/details/' + item.id + '?key=' + apiKey2;

                return fetch(detailsURL)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then((detailsData) => {
                        return { item, detailsData }; // Combine item and detailsData
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            });

            // Wait for all API calls to complete before rendering the HTML
            Promise.all(fetchPromises)
                .then((results) => {
                    const detailsByItemId = {};
                    results.forEach((result) => {
                        detailsByItemId[result.item.id] = result.detailsData;
                    });

                    // Generate HTML after all details are fetched
                    createTableResultsHTML(filteredData, currentPage, detailsByItemId)
                        .then((resultsHTML) => {
                            resultsContainer.innerHTML = resultsHTML;
                            createTableButtons();
                            toggleLoadingOverlay(false);
                        })
                        .catch((error) => {
                            console.error('Error generating HTML:', error);
                        });
                });
        });
}


// Asynchronous function to create table results HTML
async function createTableResultsHTML(data, currentPage, detailsByItemId) {
    return new Promise((resolve, reject) => {
        // Calculate the starting and ending indices for the current page
        const resultsPerPage = 5; // Set this according to your desired results per page
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const totalPages = getTotalPages(filteredData);

        let html = '<h3>Results:</h3>';

        // Get the data for the current page
        const validDataForPage = data.slice(startIndex, endIndex);

        if (validDataForPage.length > 0) {
            html += '<table class="table">';
            html += '<thead>';
            html += '<tr>';
            html += '<th scope="col">Common Name</th>';
            html += '<th scope="col">Sunlight</th>';
            html += '<th scope="col">Watering</th>';
            html += '<th scope="col"></th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>'; // Start table body

            // Create an object to store responses by item.id
            const responsesByItemId = {};

            const fetchPromises = validDataForPage.map(item => {
                const detailsURL = 'https://perenual.com/api/species/details/' + item.id + '?key=' + apiKey2;

                return fetch(detailsURL)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then((detailsData) => {
                        // Store the response using item.id as the key
                        responsesByItemId[item.id] = detailsData;

                        return detailsData;
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            });

            // Wait for all API calls to complete before rendering the HTML
            Promise.all(fetchPromises)
                .then(() => {
                    // Generate the HTML in the original order
                    validDataForPage.forEach(item => {
                        const detailsData = detailsByItemId[item.id]; // Retrieve detailsData from the passed object

                        // Generate HTML for each item using detailsData
                        let itemHtml = '<tr>';
                        itemHtml += '<td>' + capitalFirstLetter(item.common_name) + '</td>';
                        itemHtml += '<td>' + capitalFirstLetter(item.sunlight) + '</td>';
                        itemHtml += '<td>' + capitalFirstLetter(item.watering) + '</td>';
                        itemHtml += '<td>';
                        // Add Bootstrap collapse elements
                        itemHtml += '<div class="accordion" id="accordion' + item.id + '">';
                        itemHtml += '<div class="card">';
                        itemHtml += '<div class="card-header" id="heading' + item.id + '">';
                        itemHtml += '<button class="btn btn-primary btn-learn-more" type="button" data-toggle="collapse" data-target="#collapse' + item.id + '" aria-expanded="true" aria-controls="collapse' + item.id + '">Learn More</button>';
                        itemHtml += '</div>';
                        itemHtml += '</div>';
                        itemHtml += '</div>';
                        itemHtml += '</td>';
                        itemHtml += '</tr>';

                        // Pass the item data to generatePlantDetailsHTML to build the URL
                        itemHtml += '<tr class="collapse-row">';
                        itemHtml += '<td colspan="4">';
                        itemHtml += '<div id="collapse' + item.id + '" class="collapse" aria-labelledby="heading' + item.id + '">';
                        itemHtml += '<div class="card-body">';
                        itemHtml += generatePlantDetailsHTML(detailsData); // Use detailsData
                        itemHtml += '</div>';
                        itemHtml += '</div>';
                        itemHtml += '</td>';
                        itemHtml += '</tr>';

                        // Append the generated HTML to the table
                        html += itemHtml;

                        // Check if this is the last item and update the HTML once all API calls are complete
                        if (item === validDataForPage[validDataForPage.length - 1]) {
                            html += '</tbody>'; // End table body
                            html += '</table>';
                            html += '<p>Page ' + currentPage + ' of ' + totalPages + '</p>';

                            // Resolve the Promise with the generated HTML
                            resolve(html);
                        }
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        } else {
            // No valid data for this page
            html += '<p>No results found for this page.</p>';
            html += '</tbody>'; // End table body
            html += '</table>';
            html += '<p>Page ' + currentPage + ' of ' + totalPages + '</p>';

            // Resolve the Promise with the generated HTML
            resolve(html);
        }
    });
}


// Show Suggest Results
function createSuggestResult() {
    toggleLoadingOverlay(true);

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

            filteredData = data.filter(item => item.id <= 3000);
            console.log("Filtered Data:", filteredData);

            randomItem = filteredData[Math.floor(Math.random() * filteredData.length)]; 
            console.log("Plant ID:", randomItem.id);

            const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;
            console.log("Details URL:", detailsURL);

            createSuggestResultsHTML(detailsURL, randomItem, resultsContainer);
        });
}

function createSuggestResultsHTML(detailsURL, randomItem, resultsContainer) {

    const totalPages = getTotalResults(filteredData);
    const resultsLeft = (totalPages - 1);

    fetch(detailsURL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((detailsData) => {
            console.log("Details Data:", detailsData);

            const detailsHTML = generatePlantDetailsHTML(detailsData);
            resultsContainer.innerHTML = detailsHTML;

            toggleLoadingOverlay(false);
            createSuggestButtons();
       });
}

function createUpdatedSuggestResult() {
    toggleLoadingOverlay(true);
    const resultsContainer = document.getElementById('results-container');

    filteredData = filteredData.filter(item => item.id !== randomItem.id);
    console.log("Updated filterData:", filteredData);

    const totalPages = getTotalResults(filteredData);
    const resultsLeft = (totalPages - 1);

    resultsContainer.innerHTML = '';

    randomItem = filteredData[Math.floor(Math.random() * filteredData.length)];  // Corrected variable name

    const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;  // Corrected variable name

    fetch(detailsURL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((detailsData) => {
            console.log("Details Data:", detailsData);

            const detailsHTML = generatePlantDetailsHTML(detailsData); // Use the shared function
            resultsContainer.innerHTML = detailsHTML;

            toggleLoadingOverlay(false);
            createSuggestButtons();
        });
}