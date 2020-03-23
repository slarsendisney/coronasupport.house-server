if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: `.env`
  });
}

const firebase = require("firebase");

require("firebase/firestore");

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID
});

var db = firebase.firestore();
let phoneNumbers = [];
db.collection("volunteers").onSnapshot(subCollectionSnapshot => {
  let numbers = [];
  subCollectionSnapshot.forEach(subDoc => {
    if (subDoc.data().phone_number) {
      numbers.push(subDoc.data().phone_number);
    }
  });
  phoneNumbers = numbers;
});
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

const client = require("twilio")(accountSid, authToken);
const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

var whitelist = ["https://coronasupport.house", "http://localhost:8000"];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(cors(corsOptions));

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/send", (req, res) => {
  const name = req.body.name;
  const message = `Hi Volunteer! We've recieved a new request from ${name}. Head to https://coronasupport.house/volunteers to claim it.`;
  phoneNumbers.forEach(number => {
    client.messages.create({
      body: message,
      from: "+441173253685",
      to: number
    });
  });
  res.send("OK");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
