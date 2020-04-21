const weatherForm = document.querySelector('#location-form');
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const address = document.querySelector('#location-input').value;
  const forecastP = document.querySelector('#location-forecast');
  const locDeetsP = document.querySelector('#location-details');

  forecastP.textContent = 'Loading...';
  locDeetsP.textContent = '';
  fetch(`/weather?address=${address}`).then((res) => {
    res.json().then((data) => {
      if (data.error) {
        forecastP.textContent = data.error;
      } else {
        const locDeetsStr = `${data.location}: ${data.lat}, ${data.long}`;
        forecastP.textContent = data.forecast;
        locDeetsP.textContent = locDeetsStr;
      }
    });
  });
});