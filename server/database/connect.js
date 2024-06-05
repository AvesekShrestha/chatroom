const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/connecthub").then(() => {
    console.log("Database connection successfull.")
}).catch((error) => {
    console.log("Database conection failed");
})

