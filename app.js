const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");

const Review=require("./models/reviews.js");




const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


// Index Route
app.get("/listings",async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// New Route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// New Route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

// Create Route
app.post("/listings", async (req , res , next)=>{
  //  let {title,description,image,price,country,location}=req.body;
  try{
    const newListing=  new Listing(req.body.listing);
 await newListing.save();
 res.redirect("/listings")
  } catch(err){
    next(err);
  }
 
});

//Edit Route
app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update Route
app.put("/listings/:id",async(req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// Delete Route
app.delete("/listings/:id", async (req , res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

// Reviews
// Post Route
app.post("/listings/:id/reviews", async(req, res)=>{
  let listing=await  Listing.findById(req.params.id);
  let newReview =new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`);
    
});









app.get("/", (req, res)=>{
    res.send("Hi i am root");
});

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New villa",
//         description:"By th beach",
//         price:4000,
//         location:"Lucknow",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful testing");
// })
app.use((err, req , res ,next)=>{
    res.send("something Went wrong");
})

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080:  ");
})