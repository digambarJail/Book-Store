import express, { Express } from 'express';
import path from 'path';
import connectDB from './db/dbConnection'; // Assuming your file is `dbConnection.ts`
import booksRouter from './routes/books.routes'; // Assuming your file is `books.routes.ts`
import transactionsRouter from './routes/transactions.routes';
import usersRouter from './routes/users.routes';
import { fileURLToPath } from 'url';
// Establish database connection
connectDB();

const app: Express = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use('/api', booksRouter);
app.use('/api', transactionsRouter);
app.use('/api', usersRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}!`);
});
