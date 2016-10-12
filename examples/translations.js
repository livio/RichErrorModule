var i18next = require('i18next'),
  Remie = require('../libs/index.js');

// Configure i18next to handle translations of a few common errors.  See http://i18next.com/
i18next.init({
  lng: "en-US",
  nsSeparator: false,
  resources: {
    en: {
      translation: {
        "server" : {
          "400" : {
            "notFound": "The page {{- page}} could not be found",   //There is a '-' before page because the value is unescaped.  See http://i18next.com/translate/interpolation/
            "forbidden": "The page is forbidden",
            "unauthorized": "You are not authorized to access this page"
          }
        }
      }
    }
  }
});

// Create and configure an instance of Remie with the i18next library.
let remie = new Remie({
  i18next: i18next
});

// Create a new error using a locale for "404 Not Found".
// Specify the i18next page parameter as "free tacos".
let error = remie.create("server.400.notFound", {
  messageData: {
    page: "http://livio.io/free/tacos"
  }
});

console.log(error);