    const apiUrl = 'https://perenual.com/api/species-list?page=1&key=sk-ojin6499fba9bbfc11234&indoor=1';
  
    function handleDropdownChange(event) {
      const wateringOption = document.getElementById('watering-dropdown').value;
      const sunlightOption = document.getElementById('sunlight-dropdown').value;
      const posionousOption = document.getElementById('poisonous-dropdown').value;
  
      const apiUrlWithWatering = apiUrl + '&watering=' + wateringOption;
      const apiUrlWithWateringSunlight = apiUrlWithWatering + '&sunlight=' + sunlightOption;
      const apiUrlWithWateringSunlightPosionous = apiUrlWithWateringSunlight + '&posisonous=' + posionousOption;
  
      fetch(apiUrlWithWateringSunlightPosionous)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(responseData => {
            const data = responseData.data;
            const resultsHTML = createResultsHTML(data, wateringOption, sunlightOption, posionousOption);
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = resultsHTML;
            console.log(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

    function createResultsHTML (data, selectedWatering, selectedSunlight, selectedPosionous) {
        let html ='<h3>Results:</h3>';

        const validData = data.filter(item => {
            return (
                item.cycle !== "Upgrade Plan For Access" &&
                !item.sunlight.includes("Upgrade Plan For Access") &&
                !item.watering.includes("Upgrade Plan For Access") 
            );
          });
        
          if (validData.length > 0) {
         
            const randomIndex = Math.floor(Math.random() * validData.length);
            const randomItem = validData[randomIndex];

              html += '<div>';
              html += '<h4>Common Name: ' + randomItem.common_name + '</h4>';
              html += '<p>Sunlight: ' + (randomItem.sunlight.includes("Upgrade Plan for Access") ? selectedSunlight : randomItem.sunlight) + '</p>'
              html += '<p>Watering: ' + (randomItem.watering.includes("Upgrade Plan for Access") ? selectedWatering : randomItem.watering) + '</p>'
              html += '<p>Posionous: ' + (randomItem.posionous ? randomItem.posionous : selectedPosionous) + '</p>'
              html += '<p>Perenual Plant ID: ' + randomItem.id +'</p>'
              html += '</div>';
            ;
          } else {
            html += '<p>There are results found, but they are behind a paywall. Please upgrade plan for access.</p>';
          }
        
          return html;
        } 