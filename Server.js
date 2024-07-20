import express from 'express';
import cors from "cors";
import transactionRoutes from "./Routes/transactionRoutes.js";
import reportRoutes from "./Routes/reportRoutes.js"
const Server = express();
const port = 5002;
Server.use(cors());

// Enable CORS middleware
Server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

Server.use(transactionRoutes);
Server.use(reportRoutes);

Server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
