const express = require('express');
const app = express();
const request = require("request");
const https = require("https");
app.listen(process.env.PORT || 3000, () => console.log("Server up and running on port 3000"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"))
app.get("/", (req, res) => res.sendFile(__dirname + "/signup.html"))
app.post("/", function (req, res) {
    var fN = req.body.FName;
    var sN = req.body.SName;
    var s = req.body.email;
    var newMember = {
        members: [{
            email_address: s,
            status: "subscribed",
            merge_fields: {
                FNAME: fN,
                LNAME: sN
            }
        }]
    };
    var JsonData = JSON.stringify(newMember);
    var urlNew = "https://us1.api.mailchimp.com/3.0/lists/d66455c9fe";
    var options = {
        method: "POST",
        auth: "vaibhav:3da74ec2cdbd7ab97e81aaa576a2e430-us1"
    }

    const requests = https.request(urlNew, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/sucess.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });

    requests.write(JsonData);
    requests.end();
})

app.post('/failure', function (req, res) {
    res.redirect("/");
})