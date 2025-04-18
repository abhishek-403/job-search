import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import admin from "firebase-admin";
import rootRouter from "./routes";
const app = express();
const port = process.env.SERVER_PORT || 8081;

app.use(cors());
app.use(bodyParser.json());
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), 
    }),
  });
}


app.get("/", (req, res) => {
  res.send("healty server");
});
app.use("/api/v1", rootRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
