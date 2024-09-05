import { Router } from "express";
import { getBooksByDate, getBooksByUser, getIssuers, issueBook, returnBook } from "../controllers/transactions.js";

const transactionsRouter = Router();

transactionsRouter.route('/issueBook').get(issueBook)
transactionsRouter.route('/returnBook').get(returnBook)
transactionsRouter.route('/getIssuers').get(getIssuers)
transactionsRouter.route('/getBooksByUser').get(getBooksByUser)
transactionsRouter.route('/getBooksByDate').get(getBooksByDate)





export default transactionsRouter;