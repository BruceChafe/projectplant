// Define API keys and the base URL
function getRandomApiKey() {
    const apiKeys = [
        'sk-e7y064f655871f6692077',
        'sk-BkuA64f6375362dbd2075',
        'sk-FYwN64f615f0529382072',
        'sk-ojin6499fba9bbfc11234',
        'sk-8uOL64d9325a586701870'
    ];

    const randomIndex = Math.floor(Math.random() * apiKeys.length);
    return apiKeys[randomIndex];
}

const apiKey = getRandomApiKey();
const apiUrl = 'https://perenual.com/api/species-list?page=1&key=' + apiKey + '&indoor=1';

// Initialize variables for pagination and data storage
let currentPage = 1;
let selectedWateringOption = null;
let selectedSunlightOption = null;
let selectedPoisonOption =null;
let randomItem;
let filteredData = [];
let timer;
let currentResult = 1;
let totalPages;
let loadingOverlayVisible = false;

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

    // const poisonRadioButtons = document.querySelectorAll('[name="flexRadioStepPoison"]');
    // poisonRadioButtons.forEach((radioButton) => {
    //     if (radioButton.checked) {
    //         selectedPoisonOption = radioButton.id;
    //     }
    // });

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

        if (selectedWateringOption && selectedSunlightOption) {
            console.log('Selected Watering Option:', selectedWateringOption);
            console.log('Selected Sunlight Option:', selectedSunlightOption);
            // console.log('Selected Poison Option:', selectedPoisonOption);
            createSuggestResult();
            $('#suggestModal').modal('show');
        } else {
            alert('Please select watering and sunlight options before suggesting.');
        }
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

    // if (event.target.id === 'back-button-poisonous') {
    //     event.preventDefault();
    //     console.log('Back Clicked');
    //     hideSection('section-3');
    //     showSection('section-2')
    //     scrollToSection('section-2');
    // }

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

    if (event.target.id === 'table-results-button') {
        event.preventDefault();
        console.log('Next Clicked');
        const page = 1;
        createTableResult(filteredData, page);
    }

    if (event.target.id === 'next-suggest-button') {
        event.preventDefault();
        console.log('Next Clicked');
        showNextSuggest();
    }
});

//Show More - Table Results
document.addEventListener('click', async function (event) {
    const target = event.target; // Get the clicked element
    if (target.classList.contains('btn-learn-more')) {
        const dataTarget = target.getAttribute('data-target'); 
        const itemIdMatch = dataTarget.match(/#collapse(\d+)/); 

        if (itemIdMatch) {
            const itemId = itemIdMatch[1]; 
            console.log('Learn More button clicked for item ID:', itemId);

            const collapsible = document.querySelector(dataTarget + ' .card-body');
            if (collapsible && !collapsible.classList.contains('show')) {
                if (!collapsible.innerHTML.trim()) {
                    const detailsURL = 'https://perenual.com/api/species/details/' + itemId + '?key=' + apiKey;

                    try {
                        const response = await fetch(detailsURL);

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        const detailsData = await response.json();
                        console.log("Details Data:", detailsData);

                        const plantDetailsHTML = generatePlantDetailsHTML(detailsData);

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

document.addEventListener("DOMContentLoaded", function () {
    const closeButton = document.getElementById("close-button");
    closeButton.addEventListener("click", function () {
        location.reload();
    });
});

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

            timer = setTimeout(() => {
                hideLoadingOverlay();
            }, 5000);
        }

    } else {
        clearTimeout(timer);
        hideLoadingOverlay();
    }
}

// 404 Message
function hideLoadingOverlay() {
    const resultsContainer = document.getElementById('plant-details');
    resultsContainer.innerHTML = '';
    
    let html = '<div class="grid-item image">';
    html += '<img src="/images/f5c63020-dd9d-4616-9c7f-1ff1cf3f1f64.jpeg" alt="Image Not Found">';
    html += '</div>';
    html += '<div class="container details-container">';
    html += '<p>Whoops!</p><br>'
    html += '<p>Looks like something went wrong!</p>';
    html += '</div>';

    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.remove();
        resultsContainer.innerHTML = html;
    }
}

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
    if (!currentSection) return;

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
    if (!currentSection) return;

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

    const formattedSunlight = sunlightArray.map(sunlight => {
        const values = sunlight.split(',').map(value => value.trim());

        const formattedValues = values.map(value => {
            const replacedValue = value.replace('/', ' and/or ');

            const words = replacedValue.split(' ');
            const capitalizedWords = words.map(word => {
                if (word.toLowerCase() === 'and/or') {
                    return word; 
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            });
            return capitalizedWords.join(' ');
        });

        return formattedValues.join(', ');
    });

    return formattedSunlight.join(', ');
}

// API Functions
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
                }); 
        });
    })
}

// Fetch & filter data
function fetchAndFilterData(selectedWateringOption, selectedSunlightOption, selectedPoisonOption) {
    if (filteredData.length > 0) {
        return Promise.resolve(filteredData);
    }
    const apiUrlWithFilters = apiUrl + '&watering=' + selectedWateringOption+ '&sunlight=' + selectedSunlightOption;
    return simulateAPIcall(apiUrlWithFilters)
        .then((data) => {
            console.log("Data Received:", data);
            console.log("apiUrl:", apiUrlWithFilters);

            filteredData = data.filter(item => item.id <= 3000);
            return filteredData;
        });
}

// Function to select a random item from filteredData
function selectRandomItem(filteredData) {
    return filteredData[Math.floor(Math.random() * filteredData.length)];
}

// Function to fetch plant details
function fetchPlantDetails(itemId) {
    const detailsURL = 'https://perenual.com/api/species/details/' + itemId + '?key=' + apiKey;

    fetch(detailsURL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((detailsData) => {
            toggleLoadingOverlay(false);
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
    toggleLoadingOverlay(true);
    if (!randomItem) {
        fetchAndFilterData(selectedWateringOption, selectedSunlightOption,selectedPoisonOption)
            .then((filteredData) => {
                console.log("Filtered Data:", filteredData);

                randomItem = selectRandomItem(filteredData);
                console.log("Plant ID:", randomItem.id);

                const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey;
                console.log("Details URL:", detailsURL);

                getSuggestPlant();
            })
    } else {
        const detailsURL = 'https://perenual.com/api/species/details/' + randomItem.id + '?key=' + apiKey;
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
    suggestButtonsContainer.innerHTML = "";
    let html = `
        <div id="table-button">
        <a href="#" class="btn btn-main" id="table-results-button">All Results</a>
          </div>
          <div class="results-count">
            <div><b>Results:</br> ${currentResult} out of ${getTotalResults(filteredData)}</b></div>
          </div>
          <div id="next-button">
            <a href="#" class="btn btn-main" id="next-suggest-button">Next Result</a>
          </div>
      `;
    
    suggestButtonsContainer.innerHTML = html;
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
        resultCountElement.textContent = `<b>Results: ${currentResult} out of ${totalResults}</b>`;
    }
}

function generatePlantDetailsHTML(detailsData) {
    let html = '<div class="container plant-details-grid">';

    // Common Name
    html += '<div class="grid-item common-name"><b>';
    html += capitalFirstLetter(detailsData.common_name);
    html += '</b></div>';

    // Plant Image
    html += '<div class="container details-container">';

    html += '<div class="grid-item image">';
    if (detailsData.default_image?.original_url) {
        html += '<img src="' + detailsData.default_image?.regular_url + '" alt="Plant Image" max-width="50px">';
    } else {
        html += '<img src="/images/imagenotfound.png" alt="Image Not Found">';
    }
    html += '</div>';

    // Description
    html += '<div class="grid-item description">';
    html += '<b>Plant Story (Plant Tale):</br></br></b> ' + detailsData.description;
    html += '</div>';
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

    html += '</div>';
    html += '</div>';

    return html;
}

// Function to calculate total pages based on filteredData
function getTotalPages(filteredData) {
    const resultsPerPage = 5; // Adjust this based on your desired results per page
    const totalResults = filteredData.length;
    return Math.ceil(totalResults / resultsPerPage);
}

// Function to get data for a specific page
function getPageData(data, page) {
    const resultsPerPage = 5;
    if (!Array.isArray(data)) {
        return [];
    }
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return data.slice(startIndex, endIndex);
}

// Function to display the count of results
function displayResultCount(currentResult, totalResults) {
    const resultCountElement = document.querySelector('.result-count');
    if (resultCountElement) {
        resultCountElement.textContent = `<b>Results: ${currentResult} out of ${totalResults}</b>`;
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
function createTableButtons(currentPage, totalPages) {
    const pageButtonsContainer = document.getElementById('modal-footer');
    pageButtonsContainer.innerHTML = "";
    let html = `        
    <div id="previous-page">
        <a href="#" class="btn btn-page" id="prev-page-button">Previous Page</a>
    </div>
    <div class="results-count">
        <div><b>Page:</br> ${currentPage} of ${totalPages}</b></div>
    </div>
    <div id="next-page">
        <a href="#" class="btn btn-page" id="next-page-button">Next Page</a>
    </div>
    `;

    pageButtonsContainer.innerHTML = html;
}

// Function to show the next page of table results
function showNextPage() {
    if (currentPage < getTotalPages(filteredData)) {
        currentPage += 1;
        createTableResult(filteredData, currentPage);
        updateTableButtons();
    }
}

// // Function to show the previous page of table results
function showPreviousPage() {
    if (currentPage > 1) {
        currentPage -= 1;
        createTableResult(filteredData, currentPage);
        updateTableButtons();
    }
}

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
    html = '';
    html += '</div>';

    if (detailsData.length > 0) {
        html += '<table class="table" id="results-table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th scope="col"></th>';
        html += '<th scope="col">Common Name</th>';
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
                    itemHtml += '<td>' + '<img src="/images/imagenotfound.png" alt="Plant Image" class="table-image">' + '</th>';
                }
                itemHtml += '<td>' + capitalFirstLetter(item.common_name) + '</td>';
                itemHtml += '<td>' + '<button class="btn btn-main custom-button btn-learn-more" type="button" data-toggle="collapse" data-target="#collapse' + item.id + '" aria-expanded="true" aria-controls="collapse' + item.id + '">Learn More</button>' + '</td>';
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
    } else {
        html += '<p>No results found for this page.</p>';
    }

    return html;
}