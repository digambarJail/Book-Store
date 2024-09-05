import express, { Express } from 'express';
import connectDB from './db/dbConnection'; // Assuming your file is `dbConnection.ts`
import booksRouter from './routes/books.routes'; // Assuming your file is `books.routes.ts`
import transactionsRouter from './routes/transactions.routes';

// Establish database connection
connectDB();

const app: Express = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use('/api', booksRouter);
app.use('/api', transactionsRouter)

// Start server
const PORT = process.env.PORT || 3000; // Default to port 3000 if not set
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}!`);
});
