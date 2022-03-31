const {response, request} = require("express");
const bodyParser = require('body-parser');

const fs = require("fs");

const express = require("express");
const axios = require("axios");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3000;

app.use(express.static("./public"));



app.set("view engine", "ejs");

app.get('/', function(req, res) {
    res.render("front");
});



app.get('/random_game', function (req, res) {
    //kaikki id:t väliltä 1-26 pitäisi toimia
    const random = Math.floor(Math.random() * 26+1);
    const url = "https://www.freetogame.com/api/game?id="+random;
    axios.get(url)
.then(response => {
const data = response.data;
//console.log(data);
res.render("random", data);
});

});


app.get('/test2', function (req, res) {
    axios.get("http://dog-api.kinduff.com/api/facts?number=10")
.then(response => {
const data = response.data;
//console.log(data);
res.render("test2", data);
});
});


app.get('/list_of_fantasy', function (req, res) {
    axios.get("https://www.freetogame.com/api/games?category=fantasy&sort-by=release-date")
.then(response => {
const data = JSON.stringify(response.data);
var parsed_data = JSON.parse(data);
//console.log(parsed_data);
res.render("list", {list: parsed_data});
});
});

app.post('/gamelist', function (req, res) {
    var category = req.body.category;
    var platform = req.body.platform;
    console.log(platform+category);

//console.log(data);

    axios.get("https://www.freetogame.com/api/games?platform="+platform+"&category="+category+"+&sort-by=release-date")
.then(response => {
const data = JSON.stringify(response.data);
var parsed_data = JSON.parse(data);
//console.log(parsed_data);
res.render("list2", {list: parsed_data});
});
});





app.get('*', function(req, res) {
    res.send("Nothing here.", 404);
});


app.listen(PORT);