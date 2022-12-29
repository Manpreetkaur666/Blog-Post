//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');

const path = require('path')
require("dotenv").config();
require('dotenv').config({path: '.env'})

const MONGO_URI = process.env.MONGO_URI;

const homeStartingContent = "Everyday is a new begiining and Everyday is a new challenge.";
const aboutContent = "I am Web developer. I have done all my studdies in computers related field.I did Bachelors degree in computers science technology and learned many coding languages.For ex: C,C++ ,JAVA ,Python.Then I worked as a freelancer with startups in India.I came in Canada in 2019 and did two PG Diploma Courses.Mobile Application Development and Big data Analytics.So I have also knowlwdge of SWift and did my live project in college in Python django for medical startup.I am currently love coding websites on front-end and back-end using HTML,CSS,Bootstap,Javascript,JQuery,Node Js,MySQL and MongoDB.";
const contactContent = "You can Contact me on Email: mk27982@gmail.com or +1(705)970-7666.";
// let posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


/************************************** blogPost Schema *************************************/
// Creating a schema
const postSchema = new mongoose.Schema({
  title: String,
  body: String
});
// Creating a model of Schema
const Post = mongoose.model('Post',postSchema);
const Post1 = new Post({
  title: "Hardwork ✍🏼",
  body: "The hardwork you do never goes in vain.Today you might feel your hardwork is not pay off but one day it will!"
});
// const Post2 = new Post({
//   title: "Blog 2",
//   body: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
// });

const defaultItems = [Post1];

/************************************** GET for home route *************************************/
app.get('/',function(req,res){

  Post.find({},function(error,foundlist){
    if (!error) {
      if (foundlist.length === 0) {
        Post.insertMany(defaultItems,function(err,docs){
          if(!err){
            console.log("Successfully Added default blogs.");
          }
          else{
            console.log("failed to insert in the list");
          }
          res.redirect('/');
        });
      } else {
        res.render('home',{content: homeStartingContent, myposts: foundlist});
      }
      
    } else {
      console.log("Error finding the post list");
    }
    
  })
  
  
  
  
})

/************************************** GET for About route *************************************/
app.get('/about',function(req,res){
  res.render('about',{content: aboutContent}); 
})

/************************************** GET for Contact route *************************************/
app.get('/contact',function(req,res){
  res.render('contact',{content: contactContent}); 
})

/************************************** GET for Compose route *************************************/
app.get('/compose',function(req,res){
  res.render('compose');  
})

/************************************** GET for /:postName route *************************************/
app.get('/posts/:mypostId',function(req,res){

  const requestedId = req.params.mypostId;
  console.log("I am here");
  Post.findOne({_id: requestedId}, function(err,foundlist){
    if(!err){
      console.log("hey" + foundlist);
      res.render('post',{
         blogTitle: foundlist.title,
         blogBody: foundlist.body});
    }else{
       console.log("some error");
    }
    
  });
});

/************************************** POST for compose route *************************************/
app.post('/compose',function(req,res){
  const post = new Post({
    title : req.body.postTitle,
    body : req.body.postBody,
  });
  post.save();
  // posts.push(post);
  res.redirect('/');
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

connectDB().then(() => {
  app.listen(port, () => {
      console.log("listening for requests");
  })
});

// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });
