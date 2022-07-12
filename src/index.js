import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";

// User Interface Logic
$(document).ready(function () {
  // Search by City Name
  $("#weatherByCity").click(function () {
    const additions = checkedBoxes();
    const city = $("#city").val();
    $("#city").val("");

    const address = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;
    callApi(additions, address);
  });
  // Search by Zip Code
  $("#weatherByZip").click(function () {
    const additions = checkedBoxes();
    const zipCode = $("#zipCode").val();
    $("#zipCode").val("");

    let countryCode = "us";
    const address = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${process.env.API_KEY}`;
    callApi(additions, address);
  });
  // Search by Coordinates
  $("#weatherbyCoord").click(function () {
    const additions = checkedBoxes();
    const coordLat = $("#coordLat").val();
    $("#coordLat").val("");
    const coordLong = $("#coordLong").val();
    $("#coordLong").val("");

    const address = `https://api.openweathermap.org/data/2.5/weather?lat=${coordLat}&lon=${coordLong}&appid=${process.env.API_KEY}`;
    callApi(additions, address);
  });

  function callApi(additions, apiAddress) {
    let promise = new Promise(function (resolve, reject) {
      let request = new XMLHttpRequest();
      const url = apiAddress;

      request.onload = function () {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(request.response);
        }
      };

      request.open("GET", url, true);
      request.send();
    });
    promise.then(
      function (response) {
        const body = JSON.parse(response);
        getElements(body);
        additionalElements(additions, body);
        $(".showErrors").text("");
      },
      function (error) {
        $(".showConditions").text("");
        $(".showErrors").text(
          `There was an error processing your request: ${error}`
        );
        $(".showFeelsLikeTemp").text("");
        $(".showsHighTemp").text("");
        $(".showHumidity").text("");
        $(".showLowTemp").text("");
        $(".showPressure").text("");
        $(".showTemp").text("");
        $(".showVisibility").text("");
      }
    );
  }

  function getElements(response) {
    $(".showTemp").text(
      `Temperature (in F): ${kToF(response.main.temp)} degrees.`
    );
    $(".showFeelsLikeTemp").text(
      `Feels like: ${kToF(response.main.feels_like)} degrees.`
    );
    $(".showLowTemp").text(`Low: ${kToF(response.main.temp_min)} degrees.`);
    $(".showHighTemp").text(`High: ${kToF(response.main.temp_max)} degrees.`);
    $(".showHumidity").text(`Humidity: ${response.main.humidity}%`);
    $(".showPressure").text(`Pressure: ${response.main.pressure} hPa.`);
  }

  function additionalElements(additions, response) {
    if (additions[0] === 1) {
      $(".showConditions").text(
        `Current conditions: ${response.weather[0].main}.`
      );
    }
    if (additions[1] === 1) {
      $(".showVisibility").text(`Visibility: ${response.visibility}.`);
    }
  }

  function kToF(kelvin) {
    let fahrenheit;
    fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
    return fahrenheit.toFixed(2);
  }

  function checkedBoxes() {
    const boxesChecked = [];
    const conditionValue = $("#condition:checked").val();
    const visibilityValue = $("#visibility:checked").val();

    if (conditionValue === "on") {
      boxesChecked.push(1);
    } else {
      boxesChecked.push(0);
    }
    if (visibilityValue === "on") {
      boxesChecked.push(1);
    } else {
      boxesChecked.push(0);
    }
    return boxesChecked;
  }
});
