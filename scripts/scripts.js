// Define API keys and the base URL
const apiKey2 = 'sk-e7y064f655871f6692077';
const apiKey5 = 'sk-BkuA64f6375362dbd2075';
const apiKey4 = 'sk-FYwN64f615f0529382072';
const apiKey3 = 'sk-ojin6499fba9bbfc11234';
const apiKey = 'sk-8uOL64d9325a586701870';
const apiUrl = 'https://perenual.com/api/species-list?page=1&key=' + apiKey2 + '&indoor=1';

// Initialize variables for pagination and data storage
let currentPage = 1;
let selectedWateringOption = null;
let selectedSunlightOption = null;
let randomItem;
let filteredData = [];
let timer;
let currentResult = 1;
let totalPages;

// Event Listeners
document.addEventListener('click', async function (event) {
    const wateringRadioButtons = document.querySelectorAll('[name="flexRadioStepWatering"]');
    wateringRadioButtons.forEach((radioButton) => {
        if (radioButton.checked) {
            selectedWateringOption = radioButton.id;
        }
    });

    const sunlightRadioButtons = document.querySelectorAll('[name="flexRadioStepSunlight"]');
    sunlightRadioButtons.forEach((radioButton) => {
        if (radioButton.checked) {
            selectedSunlightOption = radioButton.id;
        }
    });

    if (event.target.id === 'start-button') {
        event.preventDefault();
        hideSection('section-0');
        showSection('section-1');
        scrollToSection('section-1');
    }

    if (event.target.id === 'start-button-1') {
        event.preventDefault();
        hideSection('section-1');
        showSection('section-2')
        scrollToSection('section-2');
    }

    if (event.target.id === 'start-button-2') {
        event.preventDefault();
        hideSection('section-2')
        showSection('section-3')
        scrollToSection('section-3');
    }

    if (event.target.id === 'suggest-button') {
        event.preventDefault();
        console.log('Selected Watering Option:', selectedWateringOption);
        console.log('Selected Sunlight Option:', selectedSunlightOption);
        createSuggestResult();
        $('#suggestModal').modal('show');
    }

    if (event.target.id === 'next-button-watering') {
        event.preventDefault();
        console.log('Next Clicked');
        hideSection('section-1');
        showSection('section-2')
        scrollToSection('section-2');
    }

    if (event.target.id === 'back-button-sunlight') {
        event.preventDefault();
        console.log('Back Clicked');
        hideSection('section-2');
        showSection('section-1')
        scrollToSection('section-1');
    }

    if (event.target.id === 'next-button-sunlight') {
        event.preventDefault();
        console.log('Next Clicked');
        hideSection('section-2');
        showSection('section-3')
        scrollToSection('section-3');
    }

    if (event.target.id === 'back-button-poisonous') {
        event.preventDefault();
        console.log('Back Clicked');
        hideSection('section-3');
        showSection('section-2')
        scrollToSection('section-2');
    }

    if (event.target.id === 'prev-page-button') {
        event.preventDefault();
        console.log('Back Clicked');
        showPreviousPage(); 
    }

    if (event.target.id === 'next-page-button') {
        event.preventDefault();
        console.log('Next Clicked');
        showNextPage();
    }
})
//Show More - Table Results
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

// Home Page Functions
// Hide a section by setting its display property to "none"
function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
    }
}
// Show a section by setting its display property to "block"
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}
// Section Scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
// Navigate to the next section
function navigateToNextSection() {
    const currentSection = document.querySelector('.step-container.visible');
    if (!currentSection) return; // No visible section found

    const nextSection = currentSection.nextElementSibling;
    if (nextSection) {
        currentSection.classList.remove('visible');
        nextSection.classList.add('visible');
        scrollToSection(nextSection.id);
    }
}
// Navigate to the previous section
function navigateToPreviousSection() {
    const currentSection = document.querySelector('.step-container.visible');
    if (!currentSection) return; // No visible section found

    const previousSection = currentSection.previousElementSibling;
    if (previousSection) {
        currentSection.classList.remove('visible');
        previousSection.classList.add('visible');
        scrollToSection(previousSection.id);
    }
}

// Format Function
// Capitalize the first letter of each word
function capitalFirstLetter(string) {
    if (typeof string !== 'string') {
        return string;
    }

    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
// Format sunlight data
function formatResponse(sunlightArray) {
    if (!sunlightArray || !Array.isArray(sunlightArray)) {
        return '';
    }

    // Capitalize the first letter of each word in each sunlight value
    const formattedSunlight = sunlightArray.map(sunlight => {
        // Split the sunlight value by commas and trim spaces
        const values = sunlight.split(',').map(value => value.trim());

        // Capitalize the first letter of each word in each value, except for specific words like "and"
        const formattedValues = values.map(value => {
            // Replace '/' with ' and/or '
            const replacedValue = value.replace('/', ' and/or ');

            const words = replacedValue.split(' ');
            const capitalizedWords = words.map(word => {
                // Check if the word is "and" and always keep it lowercase
                if (word.toLowerCase() === 'and/or') {
                    return word; // Keep "and" in lowercase
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            });
            return capitalizedWords.join(' ');
        });

        // Join the formatted values with commas
        return formattedValues.join(', ');
    });

    return formattedSunlight.join(', ');
}

// API Functions
// Construct the API URL with watering and sunlight options
function constructApiUrl(selectedWateringOption, selectedSunlightOption) {
    const apiUrlWithWatering = apiUrl + '&watering=' + selectedWateringOption;
    return apiUrlWithWatering + '&sunlight=' + selectedSunlightOption;
}
// Simulate an API call with a delay using Promises
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
// Fetch & filter data
function fetchAndFilterData(selectedWateringOption, selectedSunlightOption) {
    if (filteredData.length > 0) {
        return Promise.resolve(filteredData);
    }
    const apiUrlWithFilters = constructApiUrl(selectedWateringOption, selectedSunlightOption);
    return simulateAPIcall(apiUrlWithFilters)
        .then((data) => {
            console.log("Data Received:", data);
            // Update filteredData with the filtered results
            filteredData = data.filter(item => item.id <= 3000);
            return filteredData; // Return the filtered data
        });
}

// Function to select a random item from filteredData
function selectRandomItem(filteredData) {
    return filteredData[Math.floor(Math.random() * filteredData.length)];
}

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

            const resultsContainer = document.getElementById('plant-details');
            const detailsHTML = generatePlantDetailsHTML(detailsData);
            resultsContainer.innerHTML = detailsHTML;

            createSuggestButtons();
        })
        .catch((error) => {
            console.error('Error fetching plant details:', error);
        });
}

function getTotalResults(filteredData) {
    return filteredData.length;
}

// Suggest Functions
// Function to fetch and display a suggested plant
function createSuggestResult() {
    if (!randomItem) {
        fetchAndFilterData(selectedWateringOption, selectedSunlightOption)
            .then((filteredData) => {
                console.log("Filtered Data:", filteredData);

                randomItem = selectRandomItem(filteredData);
                console.log("Plant ID:", randomItem.id);

                const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;
                console.log("Details URL:", detailsURL);

                getSuggestPlant();
            })
    } else {
        const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey2;
        console.log("Details URL:", detailsURL);
        getSuggestPlant();
    }
}
function getSuggestPlant() {
    if (!randomItem) {
        console.error('No random item selected.');
        return;
    }
    fetchPlantDetails(randomItem.id);
}
// Function to show the next suggestion
function showNextSuggest() {
    currentResult += 1;
    if (currentResult > getTotalResults(filteredData)) {
        currentResult = 1;
    }
    randomItem = filteredData[Math.floor(Math.random() * filteredData.length)];
    getSuggestPlant();
}
// Function to create suggestion buttons
function createSuggestButtons() {
    const suggestButtonsContainer = document.getElementById('modal-footer');
    suggestButtonsContainer.style.position = 'relative';

    const tableResultsButton = document.createElement('button');
    tableResultsButton.classList.add('btn', 'btn-danger');
    tableResultsButton.id = 'table-results-button';
    tableResultsButton.textContent = 'View All Results';
    tableResultsButton.style.position = 'absolute';
    tableResultsButton.style.left = '50px';

    tableResultsButton.addEventListener('click', () => {
        const page = 1;
        createTableResult(filteredData, page);
    })

    const resultCount = document.createElement('p');
    resultCount.classList.add('result-count');
    resultCount.textContent = `Results: ${currentResult} out of ${getTotalResults(filteredData)}`;
    resultCount.style.position = 'absolute';
    resultCount.style.left = '50%';
    resultCount.style.transform = 'translateX(-50%)';

    const nextSuggestButton = document.createElement('button');
    nextSuggestButton.classList.add('btn', 'btn-danger');
    nextSuggestButton.id = 'next-suggest-button';
    nextSuggestButton.textContent = 'Try Again';
    nextSuggestButton.style.position = 'absolute';
    nextSuggestButton.style.right = '50px';

    nextSuggestButton.addEventListener('click', () => {
        showNextSuggest(filteredData);
    });

    suggestButtonsContainer.innerHTML = '';
    suggestButtonsContainer.appendChild(tableResultsButton);
    suggestButtonsContainer.appendChild(resultCount);
    suggestButtonsContainer.appendChild(nextSuggestButton);

    updateSuggestButtons();
}
// Function to update suggestion buttons
function updateSuggestButtons() {
    const nextSuggestButton = document.getElementById('next-suggest-button');
    const totalResults = getTotalResults(filteredData);
    const resultCountElement = document.querySelector('.result-count');

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

function generatePlantDetailsHTML(detailsData) {
    // Create a container div for the grid
    let html = '<div class="container plant-details-grid">';
  
    // Common Name
    html += '<div class="grid-item common-name"><b>';
    html += capitalFirstLetter(detailsData.common_name);
    html += '</b></div>';
  
    // Plant Image
    html += '<div class="grid-item image">';
    if (detailsData.default_image?.original_url) {
      html += '<img src="' + detailsData.default_image?.regular_url + '" alt="Plant Image" max-width="50px">';
    } else {
      html += '<img src="images/imagenotfound.png" alt="Image Not Found">';
    }
    html += '</div>';
  
    // Details Container
    html += '<div class="container details-container">';
  
    // Scientific Name
    html += '<div class="grid-item scientific-name"><b>';
    html += 'Scientific Name (Fancy Name):</b> ' + capitalFirstLetter(detailsData.scientific_name);
    html += '</div>';
  
    // Family
    html += '<div class="grid-item family"><b>';
    html += 'Plant Family (Plant Clan):</b> ' + capitalFirstLetter(detailsData.family);
    html += '</div>';
  
    // Propagation
    html += '<div class="grid-item propagation">';
    html += '<b>Best Way to Make More Plant Buddies:</b> ' + formatResponse(detailsData.propagation);
    html += '</div>';
  
    // Watering
    html += '<div class="grid-item watering">';
    html += '<b>Thirst Quotient (Watering Needs):</b> ' + capitalFirstLetter(detailsData.watering);
    html += '</div>';
  
    // Sunlight
    html += '<div class="grid-item sunlight">';
    html += '<b>Sunshine Preferences:</b> ' + formatResponse(detailsData.sunlight);
    html += '</div>';
  
    // Maintenance
    html += '<div class="grid-item maintenance">';
    html += '<b>Maintenance Level (Plant TLC):</b> ' + capitalFirstLetter(detailsData.maintenance);
    html += '</div>';
  
    // Growth Rate
    html += '<div class="grid-item growth-rate">';
    html += '<b>Growth Speed (Zoom-Zoom Factor):</b> ' + capitalFirstLetter(detailsData.growth_rate);
    html += '</div>';
  
    // Drought Tolerance
    html += '<div class="grid-item drought-tolerant">';
    html += '<b>Survival in Desert Mode (Drought Tolerance):</b> ' + (detailsData.drought_tolerant ? 'Yes' : 'No');
    html += '</div>';
  
    // Indoor
    html += '<div class="grid-item indoor">';
    html += '<b>Suitable for Indoor Jungle (Indoor Friendly):</b> ' + (detailsData.indoor ? 'Yes' : 'No');
    html += '</div>';
  
    // Poisonous to Humans
    html += '<div class="grid-item poisonous-human">';
    html += '<b>Toxicity to Humans (Human Poisonousness):</b> ' + (detailsData.poisonous_to_humans === 0 ? 'Yes' : 'No');
    html += '</div>';
  
    // Poisonous to Pets
    html += '<div class="grid-item poisonous-pets">';
    html += '<b>Pet-Friendly Score (Pet Poison Factor):</b> ' + (detailsData.poisonous_to_pets === 0 ? 'Yes' : 'No');
    html += '</div>';
  
    // Description
    html += '<div class="grid-item description">';
    html += '<b>Plant Story (Plant Tale):</b> ' + detailsData.description;
    html += '</div>';
  
    // Close the details container
    html += '</div>'; // End of details-container
  
    // Close the container div
    html += '</div>'; // End of plant-details-grid
  
    return html;
  }
// // Function to calculate total pages based on filteredData
function getTotalPages(filteredData) {
    const resultsPerPage = 5; // Adjust this based on your desired results per page
    const totalResults = filteredData.length;
    return Math.ceil(totalResults / resultsPerPage);
}

// Function to get data for a specific page
function getPageData(data, page) {
    const resultsPerPage = 5;
    if (!Array.isArray(data)) {
        // Handle the case where data is not an array, e.g., show an error message or return an empty array.
        return [];
    }
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return data.slice(startIndex, endIndex);
}


// // Function to display the count of results
function displayResultCount(currentResult, totalResults) {
    const resultCountElement = document.querySelector('.result-count');
    if (resultCountElement) {
        resultCountElement.textContent = `Results: ${currentResult} out of ${totalResults}`;
    }
}

async function createTableResult(filteredData, page) {
    const resultsContainer = document.getElementById('plant-details');
    resultsContainer.innerHTML = '';
    console.log("Filtered Data:", filteredData);

    const totalPages = getTotalPages(filteredData);
    console.log("totalPages:", totalPages);

    const currentPageData = getPageData(filteredData, page);
    console.log("currentPageData:", currentPageData);

    const resultsHTML = await createTableResultsHTML(currentPageData, page, totalPages);
    resultsContainer.innerHTML = resultsHTML;
 
    createTableButtons(currentPage, totalPages);
    displayResultCount(currentPageData.length, getTotalResults(filteredData));

    updateTableButtons();
}

// Function to create table page navigation buttons
function createTableButtons(prevButtonId, nextButtonId, onClickPrev, onClickNext) {
    const pageButtonsContainer = document.getElementById('modal-footer');
    if (!pageButtonsContainer) {
        console.error('Page buttons container not found in the DOM.');
        return; // Exit the function if the container doesn't exist
    }

    pageButtonsContainer.innerHTML = '';

    const pageButtons = createPageButtons(prevButtonId, nextButtonId, onClickPrev, onClickNext);

    pageButtons.classList.add('modal-footer');
}



// // Function to create page navigation buttons
function createPageButtons() {
    const pageButtonsContainer = document.getElementById('modal-footer');
    pageButtonsContainer.classList.add('page-number-container');
    pageButtonsContainer.id = 'page-buttons-container';

    const prevPageButton = document.createElement('a');
    prevPageButton.href = '#';
    prevPageButton.classList.add('btn', 'btn-danger');
    prevPageButton.id = 'prev-page-button';
    prevPageButton.textContent = 'Previous Page';

    const nextPageButton = document.createElement('a');
    nextPageButton.href = '#';
    nextPageButton.classList.add('btn', 'btn-danger');
    nextPageButton.id = 'next-page-button';
    nextPageButton.textContent = 'Next Page';

    pageButtonsContainer.appendChild(prevPageButton);
    pageButtonsContainer.appendChild(nextPageButton);

    return pageButtonsContainer;
}

// Function to show the next page of table results
function showNextPage() {
    if (currentPage < getTotalPages(filteredData)) {
        currentPage += 1;
        createTableResult(filteredData, currentPage); // Update the UI
        updateTableButtons();
    }
}

// // Function to show the previous page of table results
function showPreviousPage() {
    if (currentPage > 1) {
        currentPage -= 1;
        createTableResult(filteredData, currentPage); // Update the UI
        updateTableButtons();
    }
}

// // Function to update table page navigation buttons
// Function to update table page navigation buttons
function updateTableButtons() {
    const prevPageButton = document.getElementById('prev-page-button');
    const nextPageButton = document.getElementById('next-page-button');
    const totalPages = getTotalPages(filteredData);

    if (prevPageButton && nextPageButton) {
        if (currentPage === 1) {
            prevPageButton.classList.add('disabled');
        } else {
            prevPageButton.classList.remove('disabled');
        }

        if (currentPage === totalPages) {
            nextPageButton.classList.add('disabled');
        } else {
            nextPageButton.classList.remove('disabled');
        }
    }
}

// Asynchronous function to create table results HTML
async function createTableResultsHTML(detailsData, currentPage, totalPages) {
    let 
        html = '<div class="table-header>';
        html = '<h3>Results:</h3>';
        html += '</div>';

    if (detailsData.length > 0) {
        html += '<table class="table" id="results-table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th scope="col"></th>';
        html += '<th scope="col">Common Name</th>';
        html += '<th scope="col" class="hidden">Sunlight</th>';
        html += '<th scope="col" class="hidden">Watering</th>';
        html += '<th scope="col"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';

        for (const item of detailsData) {
            try {
                let itemHtml = '<tr>';
                if (item.default_image?.thumbnail) {
                    itemHtml += '<td>' + '<img src="' + item.default_image?.thumbnail + '" alt="Plant Image" class="table-image">' + '</th>';
                } else {
                    itemHtml += '<td>' + '<img src="images/imagenotfound.png" alt="Plant Image" class="table-image">' + '</th>';
                }
                itemHtml += '<td>' + capitalFirstLetter(item.common_name) + '</td>';
                itemHtml += '<td class="hidden">' + formatResponse(item.sunlight) + '</td>';
                itemHtml += '<td class="hidden">' + capitalFirstLetter(item.watering) + '</td>';
                itemHtml += '<td>' + '<button class="btn btn-primary custom-button btn-learn-more" type="button" data-toggle="collapse" data-target="#collapse' + item.id + '" aria-expanded="true" aria-controls="collapse' + item.id + '">Learn More</button>' + '</td>';
                itemHtml += '</tr>';
                itemHtml += '<tr class="collapse-row">';
                itemHtml += '<td colspan="5">';
                itemHtml += '<div id="collapse' + item.id + '" class="collapse" aria-labelledby="heading' + item.id + '">';
                itemHtml += '<div class="card-body">';
                itemHtml += '</div>';
                itemHtml += '</div>';
                itemHtml += '</td>';
                itemHtml += '</tr>';
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