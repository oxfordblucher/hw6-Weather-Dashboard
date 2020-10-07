$(document).ready(function () {

    var userInput = $('#search');
    var searchButton = $('button');

    searchButton.on('click', function () {
        var city = userInput.val();
        window.localStorage.setItem("city", city);
        populateWeatherdata(city);

        var nuLi = $("<li class='list-group-item'>");
        nuLi.text(city);
        nuLi.on('click', function () {
            populateWeatherdata(nuLi.val);
        })
        $("#cityList").append(nuLi);
    })

    function populateWeatherdata(city) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather";
        var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

        $.ajax({
            url: queryUrl,
            data: {
                q: city,
                units: "imperial",
                APPID: "dc8154684c519c00cf1c67748fcc8af5"
            },
            method: 'GET'
        }).then(function (result) {
            $("#displaytemp").text(result.main.temp);
            $("#displayhumidity").text(result.main.humidity);
            $("#displaywindspeed").text(result.wind.speed);
            getUVIndex(result.coord.lat, result.coord.lon);
            $("#currentcity").text(result.name);
            $('#currentdate').text(moment.unix(result.dt).format('dddd MMM Do h:mm a'));

        });

        $.ajax({
            url: forecastUrl,
            data: {
                q: city,
                units: "imperial",
                APPID: "dc8154684c519c00cf1c67748fcc8af5"

            },
            method: 'GET'
        }).then(function (result) {
            $('#displayforecast').empty();
            for (var i = 0; i < result.list.length; i += 8) {
                var cardEl = $("<div class='card col-sm'>");
                var containerEl = $("<div class='container'>");
                var dateEl = $('<h5>');
                dateEl.text(moment.unix(result.list[i].dt).format('dddd MMM Do'))
                var temperatureEl = $("<p>");
                var humidityEl = $("<p>");
                temperatureEl.text("Temperature " + result.list[i].main.temp);
                humidityEl.text("Humidity " + result.list[i].main.humidity);
                containerEl.append([dateEl, humidityEl, temperatureEl]);
                cardEl.append(containerEl);
                $('#displayforecast').append(cardEl);
            }
        });

    }
    function getUVIndex(lat,lon) {
        uviUrl = "http://api.openweathermap.org/data/2.5/uvi"

        $.ajax({
            url: uviUrl,
            data: {
                lat: lat,
                lon: lon,
                APPID: "dc8154684c519c00cf1c67748fcc8af5"
            },
            method: 'GET'
        }).then(function (response) {
            $("#displayuvindex").text(response.value);
        });



    }

});