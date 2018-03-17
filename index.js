let WEATHER_DATA = []; //
let weatherState = 'main-condition';
let city = 'Bronx';

const CONDITIONS = {
  main: {
    'Clear': 'https://media1.giphy.com/media/CPutABwbvXC92/giphy.gif',
    'Few clouds': 'https://media2.giphy.com/media/YA5oXxbyy8N5C/giphy.gif',
    'Clouds': 'https://media3.giphy.com/media/UST4N8TmgPQbu/giphy.gif',
    'Scattered clouds': 'https://media3.giphy.com/media/ahwtN1ulz1d16/giphy.gif',
    'Broken clouds': 'https://media0.giphy.com/media/lTtZlD73suHHW/giphy.gif',
    'Shower rain': 'https://media3.giphy.com/media/3oKIPstwMF15FghbYQ/giphy.gif',
    'Rain': 'https://media1.giphy.com/media/TVpeXDi8xTlyo/giphy.gif',
    'Thunderstorm': 'https://media3.giphy.com/media/ubt6NMYKZnEBi/200w.webp',
    'Snow': 'https://media1.giphy.com/media/l2JIaYp6P3WT5Ybu0/giphy.gif',
    'Mist': 'https://media3.giphy.com/media/xT5LMJW2TEgFi59bUY/giphy.gif'
  },
  wind: ['https://media2.giphy.com/media/DeAIC76F52wqk/giphy.gif', 'https://media.giphy.com/media/d1E1pZ1cdgWmY0hy/giphy.gif', 'https://media2.giphy.com/media/d2W6sksZ9o3qopUc/giphy.gif'],
  temperature:['https://media2.giphy.com/media/3o6Mbdaf8b2sJzemas/giphy.gif', 'https://media0.giphy.com/media/qIu1S3L1a8J7q/giphy.gif', 'https://media1.giphy.com/media/wpz49v8alq4da/giphy.gif', 'https://media0.giphy.com/media/26BREnyYXsPOxlUKk/giphy.gif']
};

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
      console.log('weatherdata from fetchWeatherData: ' + WEATHER_DATA);
      initMap();
      renderWeatherCondition();
    }
  });
}

function renderWeatherCondition() {
    switch (weatherState) {
      case 'main-condition':
        let condition = WEATHER_DATA.weather[0].main;
        $('.weather-image').html(`<img src=${CONDITIONS.main[condition]} class='gif-image'>`);
        $('body').css('background-image', 'url(${CONDITIONS.main[condition])');
        $('.weather-text').html(`<p>${condition}</p>`);
        break;
      case 'wind-speed':
        renderWindCondition();
        break;
      case 'temp-measure':
        renderTemperatureCondition();
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
    $('body').css('background-image', 'url(https://media0.giphy.com/media/12zFlnyyTRmIkU/giphy.gif)');
    console.log(CONDITIONS.main.condition[0])
  }else if(windspeed >= 5.01 && windspeed <= 16.99){
    $('.weather-image').html(`<img src=${CONDITIONS.wind[1]} class='gif-image'>`);
    $('.weather-text').html(`<p>Moderate Breeze ${windspeed}m/s</p>`);
    $('body').css('background-image', 'url(https://media0.giphy.com/media/12zFlnyyTRmIkU/giphy.gif)');
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
