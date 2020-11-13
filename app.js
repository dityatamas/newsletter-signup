const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  console.log("Information received");

  const first_iname = req.body.fn;
  const last_name = req.body.ln;
  const mail = req.body.eml;

  const data = {
    members: [{
      email_address: mail,
      status: "subscribed",
      merge_fields: {
        FNAME: first_iname,
        LNAME: last_name
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/c128d0c39c";
  const options = {
    method: "POST",
    auth: "dityatamas:35f0edbe9e64f2ac29a150c567a426bb-us7"
  };
  const request = https.request(url, options, (resp) => {
    if(resp.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    resp.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
  // res.write("Your name is " + first_iname + " " + last_name + " and your email addresses is " + mail);
  // res.send();
});

app.post("/success", (req, res) => {
  res.redirect("/");
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on Port: 3000");
});

// API key : 35f0edbe9e64f2ac29a150c567a426bb-us7
// List id : c128d0c39c
