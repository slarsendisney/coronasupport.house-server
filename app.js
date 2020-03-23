if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: `.env`
  });
}
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

const client = require("twilio")(accountSid, authToken);
const express = require("express");
var bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/send", (req, res) => {
  const name = req.body.name;
  const message = `Hi Volunteer! We've recieved a new request from ${name}. Head to https://coronasupport.house/volunteers to claim it.`;
  client.messages
    .create({
      body: message,
      from: "+441173253685",
      to: "+447926147958"
    })
    .then(() => res.send("OK"));
  //res.send({ message });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));