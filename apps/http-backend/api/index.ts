import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src";


export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    
    app(req, res); // Pass request to Express app
}

