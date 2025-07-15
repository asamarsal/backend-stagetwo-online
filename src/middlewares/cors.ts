import cors from "cors";

const corsMiddleware = cors({
    origin: ["http://localhost:3000/"],
    credentials: true,
    // method:['GET', 'PUT', 'POST']
})