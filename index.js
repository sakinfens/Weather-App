let WEATHER_DATA = []; //
let weatherState = 'main-condition';
let city = 'Bronx';

const CONDITIONS = {
  main: {
    'Clear sky': 'http://openweathermap.org/img/w/01d.png',
    'Few clouds': 'http://openweathermap.org/img/w/02d.png',
    'Clouds': 'http://openweathermap.org/img/w/02d.png',
    'Scattered clouds': 'http://openweathermap.org/img/w/03d.png',
    'Broken clouds': 'http://openweathermap.org/img/w/04d.png',
    'Shower rain': 'http://openweathermap.org/img/w/09d.png',
    'Rain': 'http://openweathermap.org/img/w/10d.png',
    'Thunderstorm': 'http://openweathermap.org/img/w/11d.png',
    'Snow': 'http://openweathermap.org/img/w/13d.png',
    'Mist': 'http://openweathermap.org/img/w/50d.png'
  },
  wind: [ '<a href="http://tinypic.com?ref=2uhwvgk" target="_blank"><img src="http://i68.tinypic.com/2uhwvgk.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=28takuc" target="_blank"><img src="http://i68.tinypic.com/28takuc.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=280jfb5" target="_blank"><img src="http://i68.tinypic.com/280jfb5.png" border="0" alt="Image and video hosting by TinyPic"></a>'],
  temperature:['<a href="http://tinypic.com?ref=ivlikx" target="_blank"><img src="http://i67.tinypic.com/ivlikx.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=2qiz3as" target="_blank"><img src="http://i68.tinypic.com/2qiz3as.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=126fzna" target="_blank"><img src="http://i66.tinypic.com/126fzna.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=2qibn1z" target="_blank"><img src="http://i63.tinypic.com/2qibn1z.png" border="0" alt="Image and video hosting by TinyPic"></a>', '<a href="http://tinypic.com?ref=9sugw8" target="_blank"><img src="http://i66.tinypic.com/9sugw8.png" border="0" alt="Image and video hosting by TinyPic"></a>'
    ]
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
        $('.weather-image').html(`<img src=${CONDITIONS.main[condition]}>`);
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
    });
}

// their weather selection from input will be passed to the
// weather api
let mainCond = 'thunderstorm';

// these should all be moved to a CONDITIONS key
function renderWindCondition(){
  let windspeed = WEATHER_DATA.wind.speed;
  if(windspeed >= .1 && windspeed <= 5){
    $('.weather-image').html(`<img ${CONDITIONS.wind[2]}>`);
    $('.weather-text').html(`<p>Light Breeze ${windspeed}m/s</p>`);
  }else if(windspeed >= 5.01 && windspeed <= 16.99){
    $('.weather-image').html(`<img ${CONDITIONS.wind[1]}`);
    $('.weather-text').html(`<p>Moderate Breeze ${windspeed}m/s</p>`);
  }else if(windspeed >= 17 && windspeed <= 27){
    $('.weather-image').html(`<img ${CONDITIONS.wind[0]}>`);
    $('.weather-text').html(`<p>Strong Gale ${windspeed}m/s</p>`);
  }
}

function renderTemperatureCondition(){
  let temp = WEATHER_DATA.main.temp;
  if(temp <= 0){
    $('.weather-image').html(`<img ${CONDITIONS.temperature[0]}>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
  }
  else if(temp >= .5 && temp <=10){
    $('.weather-image').html(`<img ${CONDITIONS.temperature[1]}>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
  }
  else if(temp >= 10.55 && temp <=21){
    $('.weather-image').html(`<img ${CONDITIONS.temperature[2]}>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
  }
  else if(temp >= 21.1 && temp <=27){
    $('.weather-image').html(`<img ${CONDITIONS.temperature[3]}>`);
    $('.weather-text').html(`<p>${temp}°C</p>`);
  }
}

function start() {
    fetchWeatherData();
    handleCitySubmit();
    handleWeatherClick();
}

$(start());
