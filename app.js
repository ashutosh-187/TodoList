const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');

var app=express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/secrets");
const trySchema=new mongoose.Schema({
    email:String,
    password:String


});
const item=mongoose.model("second",trySchema);
const todoSchema=new mongoose.Schema({
    name:String
});
const list=mongoose.model("task",todoSchema);

app.get("/",function(req,res){
    res.render("home");
});
app.post("/register", function(req,res){
    const newUser=new item({
        email: req.body.username,
        password:req.body.password
    });
    try {
        newUser.save();
        // User saved successfully, render the "secrets" view
        res.redirect("/list");
    } catch (err) {
        console.error(err);
        // Handle the error, e.g., send an error response to the client
        res.status(500).send("Error saving user");
    }

});
app.post("/login", async function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    try {
        const foundUser = await item.findOne({ email: username });
        if (foundUser) {
            if(foundUser.password === password) {
                res.redirect("/list");
            }
        } else {
            // Handle invalid username or password here
            res.send("Invalid username or password");
        }
    } catch (err) {
        console.error(err);
        // Handle any errors that occurred during the query
        res.status(500).send("Error querying the database");
    }
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/list", function (req, res) {
    list.find({})
        .then(foundItems => {
            res.render("list", { ejes: foundItems });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
});
app.post("/list",function(req,res){
    const itemName=req.body.ele1;
    const todo4=new list({
        name:itemName

    });
    todo4.save();
    res.redirect("/list");

});
app.post("/delete", async function (req, res) {
    const checked = req.body.checkbox1;
    try {
        await list.findByIdAndRemove(checked);
        console.log("deleted");
        res.redirect("/list");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
app.listen(5000,function(){
    console.log("Server started");
})