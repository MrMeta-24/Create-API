const express = require("express");

const app = express();

app.get("/",(req,res)=>{
   res.status(200).send("oi")
});

app.get("/user",(req,res) =>{
    res.status(200).json({"user":"ok"});
});

app.listen(5000,()=>{
    console.log("kid bengala com vitiligo")
});