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