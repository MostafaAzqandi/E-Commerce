import express from 'express';
import cors from 'cors'

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running successfully!' });
});

export default app;