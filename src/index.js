import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";

// User Interface Logic
$(document).ready(function () {
  // Search by City Name
  $("#weatherByCity").click(function () {
    const city = $("#city").val();
    $("#city").val("");

    let request = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        getElements(response);
      }
    };

    request.open("GET", url, true);
    request.send();
  });
  // Search by Zip Code
  $("#weatherByZip").click(function () {
    const zipCode = $("#zipCode").val();
    $("#zipCode").val("");

    let countryCode = "us";
    let request = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${process.env.API_KEY}`;

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        getElements(response);
      }
    };

    request.open("GET", url, true);
    request.send();
  });

  function getElements(response) {
    $(".showTemp").text(
      `Temperature in Fahrenheit is ${kToF(response.main.temp)} degrees.`
    );
    $(".showFeelsLikeTemp").text(
      `Feels like: ${kToF(response.main.feels_like)} degrees.`
    );
    $(".showLowTemp").text(
      `Today's Low: ${kToF(response.main.temp_min)} degrees.`
    );
    $(".showHighTemp").text(
      `Today's High: ${kToF(response.main.temp_max)} degrees.`
    );
    $(".showHumidity").text(`The humidity is ${response.main.humidity}%`);
    $(".showPressure").text(`Pressure: ${response.main.pressure} hPa.`);
  }

  function kToF(kelvin) {
    let fahrenheit;
    fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
    return fahrenheit.toFixed(2);
  }
});
