import express from "express";
import path from "path";
import "dotenv/config";
import { errorHandler } from "./utils/errorHandler";

import { api } from "./api";

export const app = express();

const projectRoot = process.cwd();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", api);

app.use(express.static(path.resolve(projectRoot, "dist/client")));

app.get("/admin/*", (req, res) => {
  res.sendFile(path.resolve(projectRoot, "dist/client/admin/admin.html"));
});

app.use(express.static(path.resolve(projectRoot, "src/shop")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(projectRoot, "dist/client/shop/shop.html"));
});

app.use(errorHandler);
