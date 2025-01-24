import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import 'dotenv/config'

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://smit-2025.vercel.app", "https://smit.afaq.dev"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => { console.log('DB is connected!') })
    .catch((e) => { console.log(e) })

app.use('/auth', authRoutes);
app.use('/users', userRoutes);


app.get('/', (req, res) => {
    res.json('Server is working!')
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running properly on ${process.env.PORT}`)
})