// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("error", error.message);
    });
    app.listen(process.env.PORT || 5000, () => {
      console.log(`server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongo DB connection Failed !!!", error);
  });
// import express from "express";
// const app = express()(async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("error");
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`app is listening at port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("Error: ", error);
//     throw error;
//   }
// })();
