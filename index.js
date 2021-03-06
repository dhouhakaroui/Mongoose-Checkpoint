// server
"use strict"
const express = require('express');
const app = express();
const port=4000;
app.use(express.json())

// Install and setup mongoose:
const mongoose=require('mongoose')
const PersonModel=require('./models/person')
require("dotenv").config();

// process.env.MONGO_URI='mongodb://localhost:27017/mydatabase'
// database

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true },(err) => {
    if (err) console.log(err);
    else console.log("database connected");
})


// Create a person having this prototype:
// models/person.js

// Create and Save a Record of a Model:
let person=new PersonModel({
    name:'Dhouha',
    age:27,
    favoriteFoods:['Pizza','Tacos','Spaghetti','burrito']
})

person.save(function(err,doc){
    if (err) console.log(err)
    console.log(doc); 
}) 

// Create Many Records with model.create()

PersonModel.create(require("./arrayOfpeople"))

// create with express
app.post('/', (req, res) => { 
    PersonModel.create({
        name:req.body.name,
        age:req.body.age,
        favoriteFoods:req.body.favoriteFoods},(err,doc)=>{
        if (err) console.log(err)
        console.log(doc);
        
})
})

// Use model.find() to Search Your Database
// all persons
app.get('/allPersons', (req, res) => {
    PersonModel.find()
    .then(doc => res.send(doc))
    .catch(err => console.error(err))
})
//  find person by name
app.get('/person/:name', (req, res) => {
    PersonModel.find({name:req.params.name},(err,doc)=>{
        if(err){console.error(err);}
        console.log(doc);
    })
    .then(doc => res.send(doc))
    .catch(err => console.error(err.message))
})

// Use model.findOne() to Return a Single Matching Document from Your Database
app.get('/person/:favoriteFoods', (req, res) => {
    PersonModel.findOne({favoriteFoods:req.params.favoriteFoods},(err,doc)=>{
        if(err){console.error(err);}
        console.log(doc);
    })
    .then(doc => {
        res.send(doc)
    })
    .catch(err => {
        console.error(err)
        res.send('Server Error')
    })
})
// Use model.findById() to Search Your Database By _id
// let personId="5fafffdadf8e423674c8a6d4"
app.get('/person/:_id', (req, res) => {
PersonModel.findById(req.params._id,(err,doc)=>{
    if(err){console.error(err);}
    console.log(doc);
})
.then(doc => {
    res.send(doc)
})
.catch(err => {
    console.error(err)
    res.send('Server Error')
})
})

// Perform Classic Updates by Running Find, Edit, then Save
app.put("/updatePerson/:_id",(req,res)=>{
    PersonModel.findById(req.params._id,(err,data)=>{
        if(err){console.log(err)}
        else {data.favoriteFoods.push("hamburger")};
        data.save((err,data)=>{
            if(err){console.log(err)}
            else {console.log(data),res.send(data)}
        })   
    })
});

// Perform New Updates on a Document Using model.findOneAndUpdate()
app.put("/UpdatePersonAge/:name",(req,res)=>{
PersonModel.findOneAndUpdate({name:req.params.name},{age:20},{new:true},(err,doc)=>{
    if (err) console.log(err)
    console.log(doc); })
})

// Delete One Document Using model.findByIdAndRemove
app.delete("/deletePerson/:_id",(req,res)=>{
    PersonModel.findOneAndDelete(req.params._id,(err,doc)=>{
        if (err) console.log(err)
        console.log(doc); })
    .then( doc => res.send( doc ) )
    .catch(err=>console.log(err))
})

// MongoDB and Mongoose - Delete Many Documents with model.remove()
app.delete("/removeMary",(req,res)=>{
PersonModel.remove({name:'Mary'},(err,doc)=>{
    if (err) console.log(err)
    console.log(doc);
    res.send(doc) })

.exec((err,doc)=>{
    if (err) console.log(err)
    console.log(doc); 
    res.send(doc)
})
    
})

// Chain Search Query Helpers to Narrow Search Results
app.get('/2personlikeburrito', (req, res) => {
PersonModel.find({favoriteFoods:'burrito'})
.sort({name:1})
.limit(2)
.select("-age")
.exec((err,doc)=>{
    if (err) console.log(err)
    console.log(doc); })
.then(doc => {
        res.send(doc)
})
.catch(err => {
        console.error(err)
        res.send('Server Error')
})
})

app.listen(port,()=>{console.log('The server is running, ' +' please, open your browser at http://localhost:%s',port)});