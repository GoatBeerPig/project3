const bodyParser = require('body-parser');
const express = require('express');
const fs = require("fs");

const app = express();

app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: false }));

var today = new Date();




app.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});


app.get('/newmessage', function (req, res) {
    res.sendFile(__dirname+"/form.html");
});

app.post('/addmessage', function (req, res) {
    var data = require("./json_data.json");



    //Lisättävä data
    var uusi_data = ({
        "username": req.body.Name,
        "country": req.body.Country,
        "date": today.toGMTString()+" "+today.getTimezoneOffset(),
        "message": req.body.Message
    })

    data.push(uusi_data);

    //luetaan vanha json file ja lisätään uusi data
    fs.readFile('json_data.json', function (err, data) {

        var json = JSON.parse(data);
        json.push(uusi_data);
        fs.writeFile("json_data.json", JSON.stringify(json, null, 2), function(err) {
            if (err) throw err;
        });
    });


    res.writeHead(301, {
        Location: "/guestbook"
      }).end();
});

app.get('/guestbook', function (req, res) {
    var data = require("./json_data.json");
    var results =  '<table border="1">';

    for (var i=0; i<data.length; i++) {
        results +=
        '<tr>' +
        '<td>' +data[i].username+'</td>'+
        '<td>' +data[i].country+'</td>'+
        '<td>' +data[i].message+'</td>'+
        '<td>' +data[i].date+'</td>'+
        '</tr>';
    }
    res.send(results);
});

app.get('/ajaxmessage', function (req, res) {
    res.sendFile(__dirname+"/form2.html");
});


app.post('/postajax', function (req, res) {

    var Name = req.body.Name;
    var Country = req.body.Country;ub
    var Message = req.body.Message;


    res.send("Form was submitted successfully!<br> Your name is: "+Name+"<br>And your country is: "+Country+"<br>And your message is: "+Message);

});

app.get('/bookaroom', function(req, res) {
    res.send("Oops! There is no rooms available!");
});

app.get('*', function(req, res) {
    res.send("Try /newmessage, /ajaxmessage or /guestbook", 404);
});



app.listen(8081, function() {
    console.log("App listening on port 8081!");
});