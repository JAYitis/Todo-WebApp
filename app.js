const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js") //importing from date.js
const mongoose = require("mongoose")
const _ = require("lodash");

// console.log(date());

const app = express();

// let items = [];
// let workItems = [];

// 
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose
mongoose.connect("mongodb+srv://Jay-admin:jaypatel01@cluster0.1enpr.mongodb.net/todolistDB", {useNewUrlParser: true}); //mongodb://localhost:27017/todolistDB

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

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

// using from date.js
//let day = date.dayTime(); // displays day date month year time  
let day = date.dayDate(); // displays day date month year  

app.get("/", function (req, res) {     
     
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

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                // Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName)
            } else {
                //Show an existing list
                res.render("List", {listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    });

    
});

app.post("/", function(req,res){
    
    const itemName = req.body.newItem;  //it gets the item entered on frontend 
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === day){
        item.save();
        res.redirect('/');
    } else {
        List.findOne({name : listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        });
    }


    // if (req.body.list === "Work"){
    //     workItems.push(item)
    //     res.redirect("/work")
    // } else {
    //     items.push(item);  // it pushes the newly added item to the array we created
    
    //     // it redirects to the app.get method of home route 
    //     res.redirect('/');  
    // }

});

// app.get("/work", function(req,res){
//     res.render("list", ({listTitle: "Work Things", newListItems: workItems}))
// })

app.get("/about", function(req,res){
    res.render("about");
})

app.post('/delete', function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    // console.log(listName);
    if( listName === day){
        Item.findByIdAndRemove( checkedItemId, function(err){
        if(!err){
            // console.log("deleted successfully");
            res.redirect('/')
        }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }
})    

app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("Server running on 3000");
});


