//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
// let posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-manpreet:Tinu1994@cluster0.qz3xl6i.mongodb.net/blogPostdB');
// mongoose.connect('mongodb://127.0.0.1:27017/blogPostdB');

/************************************** blogPost Schema *************************************/
// Creating a schema
const postSchema = new mongoose.Schema({
  title: String,
  body: String
});
// Creating a model of Schema
const Post = mongoose.model('Post',postSchema);
const Post1 = new Post({
  title: "Blog 1",
  body: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});
const Post2 = new Post({
  title: "Blog 2",
  body: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

const defaultItems = [Post1,Post2];

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

app.listen(port,function(){
    console.log("The server is running on port: 3000");
});

// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });