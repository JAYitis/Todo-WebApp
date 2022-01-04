const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js") //importing from date.js
const mongoose = require("mongoose")

// console.log(date());

const app = express();

let items = [];
let workItems = [];

// 
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose
mongoose.connect('mongodb://localhost:27017/todolistDB') // , {usedNewUrlParser:true}

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item ({
    name: "Welcome"
})
const item2 = new Item ({
    name: "Hit the + sign to add a task"
})
const item3 = new Item ({
    name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];





app.get("/", function (req, res) {     
    // using from date.js
    //let day = date.dayTime(); // displays day date month year time  
    let day = date.dayDate(); // displays day date month year   

    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems ,function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("successfully added items")
                }
            });
            res.redirect("/")
        } else {
            res.render("list", {listTitle: day, newListItems: foundItems});    
        }

    })

    // it assigns the item from the frontend ejs letiable to letiables in this files so thst we can use here. and it is necessary to add all the render methods here because it can't read from below POST method we have to redirect it and pass it here
    
});

app.post("/", function(req,res){
    
    const itemName = req.body.newItem;  //it gets the item entered on frontend 

    const item = new Item({
        name: itemName
    })

    item.save();
    res.redirect('/');


    // if (req.body.list === "Work"){
    //     workItems.push(item)
    //     res.redirect("/work")
    // } else {
    //     items.push(item);  // it pushes the newly added item to the array we created
    
    //     // it redirects to the app.get method of home route 
    //     res.redirect('/');  
    // }

});

app.get("/work", function(req,res){
    res.render("list", ({listTitle: "Work Things", newListItems: workItems}))
})

app.get("/about", function(req,res){
    res.render("about");
})

app.post('/delete', function(req, res){
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove( checkedItemId, function(err){
        if(!err){
            console.log("deleted successfully");
            res.redirect('/')
        }
    })

})

app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("Server running on 3000");
});
// 