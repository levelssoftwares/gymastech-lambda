import * as dotenv from "dotenv";
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || "";
export const DB_NAME = process.env.DB_NAME || "";
export const AWS_REGION= process.env.AWS_REGION || ""
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ""
export const COLLECTION_NAME_USERS = process.env.COLLECTION_NAME || "";
export const COLLECTION_NAME_WORKOUTS = process.env.COLLECTION_NAME_WORKOUTS || "";
export const API_KEY = process.env.API_KEY || "";

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type",
  "x-api-key": API_KEY,
};