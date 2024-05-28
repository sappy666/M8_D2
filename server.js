import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.static('views'));

app.use("/", authRoutes);





app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
