let WEATHER_DATA = []; //
let condition;
let weatherState = 'wind-speed';
let city = 'Bronx';

const CONDITIONS = {
  wind: ['https://media2.giphy.com/media/DeAIC76F52wqk/giphy.gif', 'https://media.giphy.com/media/d1E1pZ1cdgWmY0hy/giphy.gif', 'https://media2.giphy.com/media/d2W6sksZ9o3qopUc/giphy.gif'],
  temperature:['https://media2.giphy.com/media/3o6Mbdaf8b2sJzemas/giphy.gif', 'https://media0.giphy.com/media/qIu1S3L1a8J7q/giphy.gif', 'https://media1.giphy.com/media/wpz49v8alq4da/giphy.gif', 'https://media0.giphy.com/media/26BREnyYXsPOxlUKk/giphy.gif'],
  humidity:['https://media3.giphy.com/media/l0HlAnuooBUpOE1bi/giphy.gif','https://media0.giphy.com/media/l41m39GpkjPpbOqqc/giphy.gif','https://media3.giphy.com/media/bbwJaAzogpjfq/giphy.gif','https://media1.giphy.com/media/8dl1ITvPmV99S/giphy.gif']

};
yotuuut = 'https://media1.giphy.com/media/z4Qquuhfjc3QI/giphy.gif'
const BACKGROUNDS = {
    'Clear': 'https://media1.giphy.com/media/z4Qquuhfjc3QI/giphy.gif',
    'Few clouds': 'https://media1.giphy.com/media/z4Qquuhfjc3QI/giphy.gif',
    'Clouds': 'https://media3.giphy.com/media/HoUgegTjteXCw/giphy.gif',
    'Scattered clouds': '',
    'Broken clouds': '',
    'Shower rain': '',
    'Rain': 'https://media2.giphy.com/media/KWuI55w6kpMFq/giphy.gif',
    'Thunderstorm': 'https://media2.giphy.com/media/bNtxdXNlREyhG/giphy.gif',
    'Snow': 'https://media2.giphy.com/media/aAZ5fQlKWMbpC/giphy.gif',
    'Mist': 'https://media1.giphy.com/media/zVZIQztV2FMs0/giphy.gif'
}

function handleCitySubmit(){
    $('.location-form').submit(event => {
      event.preventDefault();
      const area = $(event.currentTarget).find('#location');
      city = area.val();
      area.val(" ");
      weatherState = 'main-condition';
      fetchWeatherData();
    });
}

// google map api is going to render the map to .map
// the location will be provided from input
// we'll use that input to pass to map api to focus on the area

// weather api
function fetchWeatherData(){
  $.ajax({
    url : `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=3c2ae1668b32134ba5c910ca0375caaa`,
    type: "GET",
    dataType: "jsonp",
    success: function(data) {
      WEATHER_DATA = data;
      condition = WEATHER_DATA.weather[0].main;
      console.log('weatherdata from fetchWeatherData: ' + WEATHER_DATA);
      initMap();
      renderCityData();
      renderBackground();
      renderWeatherCondition()
      renderWindCondition();
    }
  });
}

function renderCityData() {
    $('.city-name').text(`City: ${city}`);
    $('.city-condition').text(`Weather Condition: ${condition}`);
}

function renderBackground() {
    $('body').css('background-image', `url(${BACKGROUNDS[condition]})`);
}

function renderWeatherCondition() {
    switch (weatherState) {
      case 'wind-speed':
        renderWindCondition();
        break;
      case 'temp-measure':
        renderTemperatureCondition();
        break;
      case 'humidity-level':
        renderHumidityCondition();
        break;
      default:
        break;
    }
}

function initMap() {
  let latNum = WEATHER_DATA.coord.lat || 40;
  let lngNum = WEATHER_DATA.coord.lon || 73;
  let coordinates = {
    lat: latNum,
    lng: lngNum
  };
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: coordinates
  });
  let marker = new google.maps.Marker({
    position: coordinates,
    map: map
  });
}

// Attach a delegated event handler
function handleWeatherClick() {
    $('.weather-options').on( "click", "button", function( event ) {
        event.preventDefault();
        weatherState = $(this).attr('class');
        renderWeatherCondition();
        //renderWeatherHistory();
    });
}

// their weather selection from input will be passed to the
// weather api
let mainCond = 'thunderstorm';

// these should all be moved to a CONDITIONS key
function renderWindCondition(){
  let windspeed = WEATHER_DATA.wind.speed;
  if(windspeed >= .1 && windspeed <= 5){
    $('.weather-image').html(`<img src=${CONDITIONS.wind[0]} class='gif-image'>`);
    $('.weather-text').html(`<p>Light Breeze ${windspeed}m/s</p>`);
    console.log(CONDITIONS.main.condition[0])
  }else if(windspeed >= 5.01 && windspeed <= 16.99){
    $('.weather-image').html(`<img src=${CONDITIONS.wind[1]} class='gif-image'>`);
    $('.weather-text').html(`<p>Moderate Breeze ${windspeed}m/s</p>`);
console.log(CONDITIONS.main[condition][0]);
  }else if(windspeed >= 17 && windspeed <= 27){
    $('.weather-image').html(`<img src=${CONDITIONS.wind[2]}>`);
    $('.weather-text').html(`<p>Strong Gale ${windspeed}m/s</p>`);
  }
}

function renderTemperatureCondition(){
  let temp = WEATHER_DATA.main.temp;
  if(temp <= 0){
    $('.weather-image').html(`<img src=${CONDITIONS.temperature[0]} class='gif-image'>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
  }
  else if(temp >= .1 && temp <=10){
    $('.weather-image').html(`<img src=${CONDITIONS.temperature[1]} class='gif-image'>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
  }
  else if(temp >= 10.55 && temp <=21){
    $('.weather-image').html(`<img src=${CONDITIONS.temperature[2]} class='gif-image'>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
  }
  else if(temp >= 21.1 && temp <=32){
    $('.weather-image').html(`<img src=${CONDITIONS.temperature[3]} class='gif-image'>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
  }
}

function renderHumidityCondition(){
  let humid = WEATHER_DATA.main.humidity;
  if(humid >= 0 && humid <=25){
    $('.weather-image').html(`<img src=${CONDITIONS.humidity[0]} class='gif-image'>`);
    $('.weather-text').html(`<p>${humid}%</p>`);
  }
  else if(humid >= 26 && humid <=50){
    $('.weather-image').html(`<img src=${CONDITIONS.humidity[1]} class='gif-image'>`);
    $('.weather-text').html(`<p>${humid}%</p>`);
  }
  else if(humid >= 51 && humid <=75){
    $('.weather-image').html(`<img src=${CONDITIONS.humidity[2]} class='gif-image'>`);
    $('.weather-text').html(`<p>${humid}%</p>`);
  }
  else if(humid >= 76 && humid <=100){
    $('.weather-image').html(`<img src=${CONDITIONS.humidity[3]} class='gif-image'>`);
    $('.weather-text').html(`<p>${humid}%</p>`);
  }
}



//function renderWeatherHistory(){
  //console.log(weatherState);
  //console.log('yesboy')
  //$('main').append(`
    //<div class= 'weather-history'>
   // <p>${city}<p/>
    //<p>${weatherState}</p>
    //</div>`)
//}

function start() {
    fetchWeatherData();
    handleCitySubmit();
    handleWeatherClick();
}

$(start());
