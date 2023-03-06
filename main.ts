import express, { Application, Request, Response } from "express";
import multer from "multer";
// import { AppRoutes } from "./src/RefactorApi/routes";
// import { SQLRoutes } from "./src/sql/routes";
// import { AccidentRoutes } from "./src/AccidentData";
// import { TodolistRoutes } from "./src/todolist/todolist.routes";
import { FoodOrderingRoutes } from "./src/FoodOrderingAPI";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.SUPABASE_ANONKEY;
console.log("supabaseurl", supabaseUrl);
console.log("supabaseAnonKey", supabaseAnonKey);

// const supabaseUrl = "https://gvjwhkblnllffvshebtc.supabase.co";
// const supabaseAnonKey =
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2andoa2JsbmxsZmZ2c2hlYnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc5OTg1OTUsImV4cCI6MTk5MzU3NDU5NX0.bEnVSTd1NFcv0UhId3SrS0XaYJZxMAkvjFCLO0ti_QU";
const supabase =
  supabaseUrl && supabaseAnonKey && createClient(supabaseUrl, supabaseAnonKey);
const app: Application = express();

// Set up multer middleware to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// UPLOAD IMAGE END POINT
app.post(
  "/uploadImg",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    console.log("req?.files", req.file.buffer);
    const file = req.file;
    const fileExt = file?.originalname.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    const fileBuffer = file.buffer;

    if (supabase) {
      const { data, error: uploadError } = await supabase.storage
        .from("food-images")
        .upload(filePath, fileBuffer);

      if (uploadError) {
        throw uploadError;
      }

      const url = await supabase.storage
        .from("food-images")
        .getPublicUrl(data.path);
      const imageUrl = url.data.publicUrl;
      res.send(imageUrl);
    }
  }
);

app.get("/hello", (req: Request, res: Response) => {
  res.send(__dirname + "");
});

// AppRoutes.map((route) => {
//   app[route.method as keyof Application](
//     route.path,
//     (req: Request, res: Response) => route.action(req, res)
//   );
// });

// SQLRoutes.map((route) => {
//   app[route.method as keyof Application](
//     route.path,
//     (req: Request, res: Response) => route.action(req, res)
//   );
// });

// AccidentRoutes.map((route) => {
//   app[route.method as keyof Application](
//     route.path,
//     (req: Request, res: Response) => route.action(req, res)
//   );
// });

// TodolistRoutes.map((route) => {
//   app[route.method as keyof Application](
//     route.path,
//     (req: Request, res: Response) => route.action(req, res)
//   );
// });

FoodOrderingRoutes.map((route) => {
  app[route.method as keyof Application](
    route.path,
    (req: Request, res: Response) => route.action(req, res)
  );
});

app.listen(5555, () => {
  console.log("Server started on port 5555");
});
