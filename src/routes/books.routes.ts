import { Router } from "express";
import { getBooks } from "../controllers/books.js";

const booksRouter = Router();

booksRouter.get('/getBooks', getBooks);

export default booksRouter;