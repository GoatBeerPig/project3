var express = require("express");
var app = express();


var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));


var mongoose = require("mongoose");



require("dotenv").config();
var user = process.env.MONGO_USERID
var pw = process.env.MONGO_PW


const uri = "mongodb+srv://"+user+ ":"+pw+"@cluster0.zpvex.mongodb.net/sample_mflix?retryWrites=true&w=majority";


mongoose.connect(uri, {useNewUrlParser:true, 
    useUnifiedTopology:true});



    const Users = mongoose.model(
        "users",
        {
        name: String,
        email: String,
        password: String,
        },
        "users"
        // REMARK! These operations are pointed to this collection
        )

  app.get("/api/getall", function (req, res) {
    //finds all documents without using parameters
    Users.find({}, function (err, results) {
    // if there happens an error on database
    // an error code is returned
    if (err){
        res.status(500).json("Fault in data search");
    }
    // send database results to browser
    else {
        res.status(200).json(results);
    }
    });
});



app.get("/api/:id", function (req, res) {

    //testi id: 59b99db4cfa9a34dcd7885b6
    const id = req.params.id;

    Users.findById(id, function(err, results) {
        if (err) {
            console.log(err);
            res.status(500)("Database failure");
        }
        else if (results == null) {
            res.status(200).json("ID not found")
        }
        else {
            res.status(200).json(results);
        }
        });
    });




    app.post("/api/add", function(req, res) {

        // new object for saving
    var newUser = new Users({
        //set name and email values from postman
        name: req.body.name,
        email: req.body.email,
        password: "****************"
    });
    // insert object to database
    newUser.save(function(err, new_data) {
    if (err) return console.log(err);
    console.log(new_data);
    });
        res.send("Added a new user: " + req.body.name+ 
         " with the email "+ req.body.email);
        });



app.put("/api/update/:id", function(req, res) {

    //testi id= 59b99db4cfa9a34dcd7885b6
    const id = req.params.id;

    const update = { name: 'Stark'};


    Users.findByIdAndUpdate(id, update, function(err, results) {
        if (err) {
            console.log(err);
            res.status(500)("Database failure");
        }
        else if (results == null) {
            res.status(200).json("ID not found")
        }
        else {
            res.send("User updated");
        }
        });
    });


    app.delete("/api/delete/:id", function (req, res) {

        //testi id sama kun hellon id
        const id = req.params.id;
    
        Users.findByIdAndDelete(id, function(err, results) {
            if (err) {
                console.log(err);
                res.status(500)("Database failure");
            }
            else if (results == null) {
                res.status(200).json("ID not found")
            }
            else {
                res.status(200).json("Deleted the document with the id of "+id);
            }
            });
        });



const PORT = process.env.PORT;
app.listen(PORT, function() {
    console.log("Example app is listening on port %d", PORT);
});