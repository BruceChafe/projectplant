// Define API keys and the base URL
const apiKey2 = 'sk-e7y064f655871f6692077';
const apiKey5 = 'sk-BkuA64f6375362dbd2075';
const apiKey4 = 'sk-FYwN64f615f0529382072';
const apiKey3 = 'sk-ojin6499fba9bbfc11234';
const apiKey = 'sk-8uOL64d9325a586701870';
const apiUrl = 'https://perenual.com/api/species-list?page=1&key=' + apiKey2 + '&indoor=1';

// Initialize variables for pagination and data storage

let selectedWateringOption = null;
let selectedSunlightOption = null;
let randomItem;
let filteredData = [];

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
        scrollToSection('section-1');
    }

    if (event.target.id === 'start-button-1') {
        event.preventDefault();
        scrollToSection('section-2');
    }

    if (event.target.id === 'start-button-2') {
        event.preventDefault();
        scrollToSection('section-3');
    }

    if (event.target.id === 'start-button-3') {
        event.preventDefault();
        scrollToSection('section-3');
    }

    if (event.target.id === 'start-button-4') {
        event.preventDefault();
        console.log('Selected Watering Option:', selectedWateringOption);
        console.log('Selected Sunlight Option:', selectedSunlightOption);
        createSuggestResult();
        $('#exampleModal').modal('show');
    }
})

// Add an event listener to the modal when it is shown
$('#exampleModal').on('shown.bs.modal', function () {
    // Get the plant details HTML using your generatePlantDetailsHTML function
    const plantDetailsHTML = generatePlantDetailsHTML(/* pass your detailsData here */);
  
    // Update the content of the 'plant-details' element with the generated HTML
    document.getElementById('plant-details').innerHTML = plantDetailsHTML;
  });
  

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
function fortmatResponse(sunlightArray) {
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

// Function to construct the API URL with watering and sunlight options
function constructApiUrl(selectedWateringOption, selectedSunlightOption) {
    const apiUrlWithWatering = apiUrl + '&watering=' + selectedWateringOption;
    return apiUrlWithWatering + '&sunlight=' + selectedSunlightOption;
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

// Function to select a random item from filteredData
function selectRandomItem(filteredData) {
    return filteredData[Math.floor(Math.random() * filteredData.length)];
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
}

function fetchAndFilterData(selectedWateringOption, selectedSunlightOption) {
    if (filteredData.length > 0 ) {
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

            // const resultsContainer = document.getElementById('results-container');
            // const detailsHTML = generatePlantDetailsHTML(detailsData);
            // resultsContainer.innerHTML = detailsHTML;

            // toggleLoadingOverlay(false);
            // createSuggestButtons();
        })
        .catch((error) => {
            console.error('Error fetching plant details:', error);
        });
}

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
    html += '<p>Propagation: ' + fortmatResponse(detailsData.propagation) + '</p>';
    html += '<p>Watering: ' + capitalFirstLetter(detailsData.watering) + '</p>';
    html += '<p>Sunlight: ' + fortmatResponse(detailsData.sunlight) + '</p>';
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

function createSuggestResult() {
    // const resultsContainer = document.getElementById('results-container');
    // resultsContainer.innerHTML = '';

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
  