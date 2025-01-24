import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js"
import 'dotenv/config'
import authValid from "./middleware/authValid.js"

const app = express();

app.use(express.json());
app.use(cors("*"))

mongoose.connect(process.env.MONGODB_URI)
    .then(() => { console.log('DB is connected!') })
    .catch((e) => { console.log(e) })

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.json('Server is working!')
})

app.listen(3002, () => {
    console.log('Server is running properly on 3002')
})