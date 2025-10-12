
import dotenv from "dotenv";

dotenv.config();

export const EARTH_MED_URL =  process.env.NODE_ENV === "production" ? "https://earthmed.vercel.app" : "http://localhost:517";