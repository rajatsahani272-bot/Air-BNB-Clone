const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Database Connection
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

// App Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);


// ==================== LISTINGS ====================

// Index Route
app.get("/listings", async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        next(err);
    }
});


// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


// Show Route
app.get("/listings/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        res.render("listings/show.ejs", { listing });
    } catch (err) {
        next(err);
    }
});


// Create Route
app.post("/listings", async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);

        await newListing.save();

        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});


// Edit Route
app.get("/listings/:id/edit", async (req, res, next) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        next(err);
    }
});


// Update Route
app.put("/listings/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            {
                runValidators: true,
                new: true
            }
        );

        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
});


// Delete Route
app.delete("/listings/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedListing = await Listing.findByIdAndDelete(id);

        console.log(deletedListing);

        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});



// ==================== REVIEWS ====================

// Create Review
app.post("/listings/:id/reviews", async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    res.send("new review saved");
});

// ==================== ROOT ====================

app.get("/", (req, res) => {
    res.redirect("/listings");
});


// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
    console.log(err);

    res.status(500).send("Something went wrong");
});


// ==================== SERVER ====================

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});