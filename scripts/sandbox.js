fetch('https://perenual.com/api/species-list?page=1&key=sk-ojin6499fba9bbfc11234').then((response) => {
    console.log('resolved', response);
    return response.json();
}).then(data => {
    console.log(data);
}).catch((err) => {
    console.log('rejected',err);
})