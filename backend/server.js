import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import stories from "./routes/stories.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';

import cloudinary from "cloudinary";

cloudinary.config({ 
    cloud_name: 'dbqbi5qhw', 
    api_key: '349314357642465', 
    api_secret: '2DZ9rdHWXZps-1SbGGG08tYgOzs',
    secure: true
  });

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.json());

global.__basedir = __dirname;
app.use(express.static(__dirname + '/assets'));

//middlewares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

app.get("/", function(req,res){
  res.sendFile(__dirname + "/views/index.html");
});

const storage = multer.diskStorage({})

const fileFilter = (req,file,cb) => {
    if(!file.mimetype.includes('image')){
        return cb('Invalid Image format!',false)
    }
    cb(null,true)
    // console.log(file)
}

const upload = multer({ storage, fileFilter });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const {secure_url:url} = await cloudinary.uploader.upload(file.path)
  res.status(201).json({image:url})
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", stories);

const PORT = process.env.PORT || 8800;
app.listen(PORT, _ => {
    console.log(`App deployed at Port ${PORT}`);
});