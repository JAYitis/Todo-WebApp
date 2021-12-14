const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js") //importing from date.js

// console.log(date());

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

// 
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function (req, res) {
    // using from date.js
    //let day = date.dayTime(); // displays day date month year time  
    let day = date.dayDate(); // displays day date month year   

    // it assigns the item from the frontend ejs letiable to letiables in this files so thst we can use here. and it is necessary to add all the render methods here because it can't read from below POST method we have to redirect it and pass it here
    res.render("list", {listTitle: day, newListItems: items});
});

app.post("/", function(req,res){
    
    let item = req.body.newItem;  //it gets the item entered on frontend 
    if (req.body.list === "Work"){
        workItems.push(item)
        res.redirect("/work")
    } else {
        items.push(item);  // it pushes the newly added item to the array we created
    
        // it redirects to the app.get method of home route 
        res.redirect('/');  
    }

});

app.get("/work", function(req,res){
    res.render("list", ({listTitle: "Work Things", newListItems: workItems}))
})

app.get("/about", function(req,res){
    res.render("about");
})

app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("Server running on 3000");
});
