// Define API keys and the base URL
const apiKey2 = 'sk-e7y064f655871f6692077';
const apiKey5 = 'sk-BkuA64f6375362dbd2075';
const apiKey4 = 'sk-FYwN64f615f0529382072';
const apiKey3 = 'sk-ojin6499fba9bbfc11234';
const apiKey = 'sk-8uOL64d9325a586701870';
const apiUrl = 'https://perenual.com/api/species-list?page=1&key=' + apiKey2 + '&indoor=1';

// Initialize variables for pagination and data storage
let currentPage = 1;
let currentPageIndex = 0;
let currentResult = 1;
let validData = [];
let filteredData = [];
let currentResultIndex = 0;
let randomItem;
let loadingOverlayVisible = false;

// Function to construct the API URL with watering and sunlight options
function constructApiUrl(wateringOption, sunlightOption) {
    const apiUrlWithWatering = apiUrl + '&watering=' + wateringOption;
    return apiUrlWithWatering + '&sunlight=' + sunlightOption;
}

// Function to select a random item from filteredData
function selectRandomItem(filteredData) {
    return filteredData[Math.floor(Math.random() * filteredData.length)];
}

// Function to create page navigation buttons
function createPageButtons(currentPage, totalPages, prevButtonId, nextButtonId, onClickPrev, onClickNext) {
    const pageButtonsContainer = document.createElement('div');
    pageButtonsContainer.classList.add('page-number-container');
    pageButtonsContainer.id = 'page-buttons-container';

    const prevPageButton = document.createElement('a');
    prevPageButton.href = '#';
    prevPageButton.classList.add('btn', 'btn-danger');
    prevPageButton.id = prevButtonId;
    prevPageButton.textContent = 'Previous Page';
    prevPageButton.addEventListener('click', onClickPrev);

    const nextPageButton = document.createElement('a');
    nextPageButton.href = '#';
    nextPageButton.classList.add('btn', 'btn-danger');
    nextPageButton.id = nextButtonId;
    nextPageButton.textContent = 'Next Page';
    nextPageButton.addEventListener('click', onClickNext);

    pageButtonsContainer.appendChild(prevPageButton);
    pageButtonsContainer.appendChild(nextPageButton);

    return pageButtonsContainer;
}

// Function to get data for a specific page
function getPageData(data, page) {
    const resultsPerPage = 5; // Adjust this based on your desired results per page
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return data.slice(startIndex, endIndex);
}

// Function to display the count of results
function displayResultCount(currentResult, totalResults) {
    const resultCountElement = document.querySelector('.result-count');
    if (resultCountElement) {
        resultCountElement.textContent = `Results: ${currentResult} out of ${totalResults}`;
    }
}

// Event Listeners
// Add a click event listener to the document
document.addEventListener('click', async function (event) {
    const target = event.target; // Get the clicked element

    // Check if the clicked element has the class 'btn-learn-more'
    if (target.classList.contains('btn-learn-more')) {
        const dataTarget = target.getAttribute('data-target'); // Get the value of the 'data-target' attribute
        const itemIdMatch = dataTarget.match(/#collapse(\d+)/); // Use a regular expression to extract an item ID from the 'data-target'

        // Check if an item ID was found in the 'data-target'
        if (itemIdMatch) {
            const itemId = itemIdMatch[1]; // Extract the item ID
            console.log('Learn More button clicked for item ID:', itemId);

            // Check if the collapsible section is currently closed (not open)
            const collapsible = document.querySelector(dataTarget + ' .card-body');
            if (collapsible && !collapsible.classList.contains('show')) {
                // Check if the collapsible section is already populated with data
                if (!collapsible.innerHTML.trim()) {
                    // Construct the URL for fetching plant details using the item ID and API key
                    const detailsURL = 'https://perenual.com/api/species/details/' + itemId + '?key=' + apiKey2;

                    try {
                        // Fetch plant details data from the API
                        const response = await fetch(detailsURL);

                        // Check if the network response is okay; if not, throw an error
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        // Parse the response as JSON to get the plant details data
                        const detailsData = await response.json();
                        console.log("Details Data:", detailsData);

                        // Generate plant details HTML with the fetched data
                        const plantDetailsHTML = generatePlantDetailsHTML(detailsData);

                        // Insert the generated plant details HTML into the collapsible section
                        if (collapsible) {
                            collapsible.innerHTML = plantDetailsHTML;
                        }
                    } catch (error) {
                        console.error('Error fetching plant details:', error);
                    }
                }
            }
        }
    }
});

document.addEventListener('click', function (event) {
    if (event.target.id === 'suggest-button') {
        event.preventDefault();
        console.log('Suggest a Plant button clicked');
        createSuggestResult();
    }

    if (event.target.id === 'table-button') {
        event.preventDefault();
        console.log('Show Results button clicked');
        filteredData = [];
        createTableResult(currentPage);
    }

    if (event.target.id === 'next-suggest-button') {
        event.preventDefault();
        console.log('Try Again button clicked');
        showNextSuggest();
    }
});

// Function to calculate total pages based on filteredData
function getTotalPages(filteredData) {
    const resultsPerPage = 5; // Adjust this based on your desired results per page
    const totalResults = filteredData.length;
    return Math.ceil(totalResults / resultsPerPage);
}

// Function to calculate total results based on filteredData
function getTotalResults(filteredData) {
    return filteredData.length;
}

// Function to toggle the visibility of item details
function showItemDetails(itemId) {
    const collapsibleContainer = document.querySelector(`[data-item-id="${itemId}"] .collapsible-container`);
    if (collapsibleContainer) {
        const collapsible = collapsibleContainer.querySelector('.collapse');
        if (collapsible) {
            collapsible.classList.toggle('show');
        }
    }
}

// Function to fetch and filter data based on user-selected options
function fetchAndFilterData(wateringOption, sunlightOption) {
    if (filteredData.length > 0 ) {
        return Promise.resolve(filteredData);
    }
    const apiUrlWithFilters = constructApiUrl(wateringOption, sunlightOption);
    return simulateAPIcall(apiUrlWithFilters)
        .then((data) => {
            console.log("Data Received:", data);
            // Update filteredData with the filtered results
            filteredData = data.filter(item => item.id <= 3000);
            return filteredData; // Return the filtered data
        });
}

// Function to fetch a random plant
function fetchRandomPlant() {
    toggleLoadingOverlay(true);

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    if (filteredData.length === 0) {
        // Fetch and filter the data first
        fetchAndFilterData(wateringOption, sunlightOption)
            .then((data) => {
                // Update filteredData with the filtered results
                filteredData = data;

                // Now you can select a random item
                const randomItem = selectRandomItem(filteredData);
                console.log("Plant ID:", randomItem.id);

                // Construct the details URL for the selected random item
                const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;
                console.log("Details URL:", detailsURL);
            });
    } else {
        // If filteredData is not empty, select a random item
        const randomItem = selectRandomItem(filteredData);
        console.log("Plant ID:", randomItem.id);

        // Construct the details URL for the selected random item
        const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;
        console.log("Details URL:", detailsURL);

        // Call the getSuggestPlant function to fetch and display details
        getSuggestPlant();
    }
}

// Function to fetch and display a suggested plant
function getSuggestPlant() {
    if (!randomItem) {
        console.error('No random item selected.');
        return;
    }
    fetchPlantDetails(randomItem.id);}

// Function to fetch plant details
function fetchPlantDetails(itemId) {
    const detailsURL = 'https://perenual.com/api/species/details/' + itemId + '?key=' + apiKey2;

    fetch(detailsURL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((detailsData) => {
            console.log("Details Data:", detailsData);

            const resultsContainer = document.getElementById('results-container');
            const detailsHTML = generatePlantDetailsHTML(detailsData);
            resultsContainer.innerHTML = detailsHTML;

            toggleLoadingOverlay(false);
            createSuggestButtons();
        })
        .catch((error) => {
            console.error('Error fetching plant details:', error);
        });
}

// Function to generate HTML for plant details
function generatePlantDetailsHTML(detailsData) {
    let html = '<br>';
    html += '<h3>Results:</h3>';
    html += '<div>';
    html += capitalFirstLetter(detailsData.common_name);
    html += '<br>';
    if (detailsData.default_image?.original_url) {
        html += '<img src="' + detailsData.default_image?.regular_url + '" alt="Plant Image" width="500">';
    } else {
        html += '<img src="images/imagenotfound.png">';
    }
    html += '<br>';
    html += '<p>Scientific Name: ' + capitalFirstLetter(detailsData.scientific_name) + '</p>';
    html += '<p>Family: ' + capitalFirstLetter(detailsData.family) + '</p>';
    html += '<p>Propagation: ' + capitalFirstLetter(detailsData.propagation) + '</p>';
    html += '<p>Watering: ' + capitalFirstLetter(detailsData.watering) + '</p>';
    html += '<p>Sunlight: ' + capitalFirstLetter(detailsData.sunlight) + '</p>';
    html += '<p>Maintenance: ' + capitalFirstLetter(detailsData.maintenance) + '</p>';
    html += '<p>Growth Rate: ' + capitalFirstLetter(detailsData.growth_rate) + '</p>';

    if (detailsData.drought_tolerant === true) {
        html += '<p>Drought Tolerant: Yes</p>';
    } else {
        html += '<p>Drought Tolerant: No</p>';
    }

    if (detailsData.indoor === true) {
        html += '<p>Indoor: Yes</p>';
    } else {
        html += '<p>Indoor: No</p>';
    }

    if (detailsData.poisonous_to_humans === 0) {
        html += '<p>Poisonous To Humans: Yes</p>';
    } else {
        html += '<p>Poisonous To Humans: No</p>';
    }

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

// Function to format sunlight data
function formatSunlight(sunlightArray) {
    if (!sunlightArray || !Array.isArray(sunlightArray)) {
        return '';
    }

    // Capitalize the first letter of each word in each sunlight value
    const formattedSunlight = sunlightArray.map(sunlight => {
        const words = sunlight.split(' ');
        const capitalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return capitalizedWords.join(' ');
    });

    // Join the formatted values with a comma and space
    return formattedSunlight.join(', ');
}

// Function to simulate an API call with a delay using Promises
function simulateAPIcall(apiUrl) {
    return new Promise((resolve, reject) => {
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
                }); // Simulate a 1-second delay
        });
    })
}

// Function to toggle the loading overlay
function toggleLoadingOverlay(showOverlay) {
    const container = document.querySelector('.loading-overlay-container');
    if (showOverlay) {
        if (!loadingOverlayVisible) {
            const overlay = document.createElement('div');
            overlay.classList.add('loading-overlay');
            overlay.textContent = 'Loading...';
            container.appendChild(overlay);
            loadingOverlayVisible = true;
        }
    } else {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
            loadingOverlayVisible = false;
        }
    }
}

// Function to show the next page of table results
function showNextPage() {
    if (currentPage < getTotalPages(filteredData)) {
        currentPage += 1;
        createTableResult(currentPage);
    }
}

// Function to show the previous page of table results
function showPreviousPage() {
    if (currentPage > 1) {
        currentPage -= 1;
        createTableResult(currentPage);
    }
}

// Function to create table page navigation buttons
function createTableButtons(currentPage, totalPages, prevButtonId, nextButtonId, onClickPrev, onClickNext) {

    const pageButtonsContainer = createPageButtons(currentPage, totalPages, 'prev-page-button', 'next-page-button', showPreviousPage, showNextPage);
    pageButtonsContainer.classList.add('page-number-container');
    pageButtonsContainer.id = 'page-buttons-container';

    const resultsContainer = document.getElementById('results-container');
    const existingButtonsContainer = document.getElementById('page-buttons-container');
    if (existingButtonsContainer) {
        resultsContainer.removeChild(existingButtonsContainer);
    }
    resultsContainer.appendChild(pageButtonsContainer);
    updateTableButtons();
}

// Function to update table page navigation buttons
function updateTableButtons() {
    const prevPageButton = document.getElementById('prev-page-button');
    const nextPageButton = document.getElementById('next-page-button');
    const totalPages = getTotalPages(filteredData);

    if (prevPageButton) {
        if (currentPage === 1) {
            prevPageButton.classList.add('disabled');
        } else {
            prevPageButton.classList.remove('disabled');
        }
    }

    if (nextPageButton) {
        if (currentPage === totalPages) {
            nextPageButton.classList.add('disabled');
        } else {
            nextPageButton.classList.remove('disabled');
        }
    }
}

// Function to show the next suggestion
function showNextSuggest(filterData) {
    currentResult += 1;
    if (currentResult > getTotalResults(filteredData)) {
        currentResult = 1;
    }
    randomItem = filteredData[Math.floor(Math.random() * filteredData.length)];
    getSuggestPlant();
}

// Function to create suggestion buttons
function createSuggestButtons() {
    const suggestButton = document.getElementById('suggest-button');

    const pageButtonsContainer = document.createElement('div');
    pageButtonsContainer.classList.add('page-number-container');
    pageButtonsContainer.id = 'page-buttons-container';

    if (suggestButton) {
        const resultCount = document.createElement('p');
        resultCount.classList.add('result-count');
        resultCount.textContent = `Results: ${currentResult} out of ${getTotalResults(filteredData)}`;

        const nextSuggestButton = document.createElement('a');
        nextSuggestButton.href = '#';
        nextSuggestButton.classList.add('btn', 'btn-danger');
        nextSuggestButton.id = 'next-suggest-button';
        nextSuggestButton.textContent = 'Try Again';

        pageButtonsContainer.appendChild(resultCount);
        pageButtonsContainer.appendChild(nextSuggestButton);
    }

    const resultsContainer = document.getElementById('results-container');
    const existingButtonsContainer = document.getElementById('page-buttons-container');
    if (existingButtonsContainer) {
        resultsContainer.removeChild(existingButtonsContainer);
    }
    resultsContainer.appendChild(pageButtonsContainer);
    updateSuggestButtons();
}

// Function to update suggestion buttons
function updateSuggestButtons() {
    const prevSuggestButton = document.getElementById('prev-suggest-button');
    const nextSuggestButton = document.getElementById('next-suggest-button');
    const totalResults = getTotalResults(filteredData);
    const resultCountElement = document.querySelector('.result-count');

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

    if (resultCountElement) {
        resultCountElement.textContent = `Results: ${currentResult} out of ${totalResults}`;
    }
}

// Function to create table results
async function createTableResult(page) {
    isLoading = true;
    toggleLoadingOverlay(true);

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    const wateringOption = document.getElementById('watering-dropdown').value;
    const sunlightOption = document.getElementById('sunlight-dropdown').value;

    try {
        const filteredData = await fetchAndFilterData(wateringOption, sunlightOption);
        console.log("Filtered Data:", filteredData);

        const totalPages = getTotalPages(filteredData);
        console.log("totalPages:", totalPages);

        const currentPageData = getPageData(filteredData, page);
        console.log("currentPageData:", currentPageData);

        const resultsHTML = await createTableResultsHTML(currentPageData, page, totalPages);
        resultsContainer.innerHTML = resultsHTML;

        createTableButtons(page, totalPages, 'prev-page-button', 'next-page-button', showPreviousPage, showNextPage);
        displayResultCount(currentPageData.length, getTotalResults(filteredData));
    } catch (error) {
        console.error('Error fetching and displaying data:', error);
    } finally {
        isLoading = false;
        toggleLoadingOverlay(false);
    }
}


// Asynchronous function to create table results HTML
async function createTableResultsHTML(data, currentPage, totalPages) {
    let html = '<h3>Results:</h3>';

    if (data.length > 0) {
        html += '<table class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th scope="col"></th>';
        html += '<th scope="col">Common Name</th>';
        html += '<th scope="col">Sunlight</th>';
        html += '<th scope="col">Watering</th>';
        html += '<th scope="col"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>'; 

        for (const item of data) {
            const detailsURL = 'https://perenual.com/api/species/details/' + item.id + '?key=' + apiKey2;
            try {
                const response = await fetch(detailsURL);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const detailsData = await response.json();

                let itemHtml = '<tr>';
                if (detailsData.default_image?.original_url) {
                    itemHtml += '<td>' + '<img src="' + detailsData.default_image?.thumbnail + '" alt="Plant Image" width="75">' + '</th>';
                } else {
                    itemHtml += '<td>' + '<img src="images/imagenotfound.png" alt="Plant Image" width="75">' + '</th>';
                }        
                itemHtml += '<td>' + capitalFirstLetter(item.common_name) + '</td>';
                itemHtml += '<td>' + formatSunlight(item.sunlight) + '</td>';
                itemHtml += '<td>' + capitalFirstLetter(item.watering) + '</td>';
                itemHtml += '<td>' + '<button class="btn btn-primary btn-learn-more" type="button" data-toggle="collapse" data-target="#collapse' + item.id + '" aria-expanded="true" aria-controls="collapse' + item.id + '">Learn More</button>' + '</td>';
                itemHtml += '</tr>';

                if (detailsData) {
                    itemHtml += '<tr class="collapse-row">';
                    itemHtml += '<td colspan="5">';
                    itemHtml += '<div id="collapse' + item.id + '" class="collapse" aria-labelledby="heading' + item.id + '">';
                    itemHtml += '<div class="card-body">';
                    itemHtml += '</div>';
                    itemHtml += '</div>';
                    itemHtml += '</td>';
                    itemHtml += '</tr>';
                } else {
                    console.error('Details data is undefined for item ID:', item.id);
                }

                html += itemHtml;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        html += '</tbody>';
        html += '<p>Page ' + currentPage + ' of ' + totalPages + '</p>';
    } else {
        html += '<p>No results found for this page.</p>';
    }

    return html;
}

// Function to create a suggestion result
function createSuggestResult() {
    isLoading = true;
    toggleLoadingOverlay(true);

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    const wateringOption = document.getElementById('watering-dropdown').value;
    const sunlightOption = document.getElementById('sunlight-dropdown').value;

    if (!randomItem) {
        fetchAndFilterData(wateringOption, sunlightOption)
            .then((filteredData) => {
                console.log("Filtered Data:", filteredData);

                randomItem = selectRandomItem(filteredData);
                console.log("Plant ID:", randomItem.id);

                const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;
                console.log("Details URL:", detailsURL);

                getSuggestPlant();
            })
            .finally(() => {
                isLoading = false;
            });
    } else {
        const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;
        console.log("Details URL:", detailsURL);
    }
}
