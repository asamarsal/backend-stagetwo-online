import express from "express";
import multer from "multer";
import authRoute from "./routes/auth";

const app = express();
// const upload = multer();

// app.use(upload.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} ✅`);
});