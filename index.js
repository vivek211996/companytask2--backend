const express = require("express")
const mongodb = require("mongodb")
const app = express();
const bodyparser = require("body-parser")
const cors = require("cors");
const dotEnv = require("dotenv").config();
const bcrypt = require("bcrypt")

const url = process.env.DB;
app.use(bodyparser.json())
app.use(cors());



app.post("/", async (req, res) => {

    console.log(req.body)
  
    if(req.body.SubmitType === "Login"){
  
      try {
        let salt = await bcrypt.genSalt(10)
        let hashpwd = await bcrypt.hash(req.body.password,salt)
          console.log("server entered")
  
        //Creating a client from MongoDB URL & connecting it to it's Collection
        let client = await mongodb.connect(url);
        let db = client.db("CRM");
       
        //getting user Data by finding it in the collection
        let dataUser = await db.collection("Login").find({Username: req.body.name }).toArray();
        await client.close();
bcrypt.compare(req.body.password, dataUser[0].pwd, function(err, result) {
            console.log("Result",result)          
            //Sending User Data
            res.send({result,dataUser}); 
          });
  
        //Console Log for Test Purpose
        console.log("User Data :",dataUser);
        console.log(req.body);
    
        //Error Handling
      } catch (err) {
        console.log(err)
      }
  
    }
    else{
      console.log("User Registering")
      try {
  
        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(req.body.password,salt)
  
        req.body.password=hash
  
        let client = await mongodb.connect(url);
        let db = client.db("CRM");
        let data = await db.collection("Login").insertOne({Username : req.body.name, pwd: req.body.password});
        await client.close();
  
        res.json({
          message: "Registered As User",
        })
  
        console.log(req.body)
  
      } catch (error) {
  
        console.log(err)
  
      }
  
    }
  
  });

  app.post("/interested",async function(req,res){
    console.log(req.body)
    
    
try {
  
    let client = await mongodb.connect(url)
   let db = client.db("CRM")
    let data = await db.collection("interested").insertOne(req.body)
    await client.close();
    res.json({
        message:"saved"
    })
   
} catch (error) {
console.log(error)
}
     
    })
    app.get("/showinterested",async function(req,res){
    
      try {
          
          let client = await mongodb.connect(url)
          console.log(url)
         let db = client.db("CRM")
          let data = await db.collection("interested").find().toArray();
          await client.close(data);
          res.json(data)
          console.log(data)
         
      } catch (error) {
          console.log("server catch")
      console.log(error)
      }
  })
         
     

app.listen(process.env.PORT || 4040,function(){
    console.log("server listening")
}) 




