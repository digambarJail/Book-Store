import { Request, Response } from 'express'; // Importing Request and Response types from Express for typing
import { Transactions } from '../models/transactions'; // Importing the Transactions model for database queries
import { Books } from '../models/books'; // Importing the Books model for database queries
import { Users } from '../models/users'; // Importing the Users model for database queries

// Interface for defining query parameters expected in the requests
interface QueryParams {
    doi?: Date; // Date of issue
    dor?: Date; // Date of return
    uid?: number; // User ID
    bookName?: string; // Book name
    from?: Date; // Start date for filtering transactions by date
    to?: Date; // End date for filtering transactions by date
    payableRent: number; // Payable rent
}

// Controller for issuing a book
const issueBook = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { doi, uid, bookName } = req.query;

        // Check if the book is currently issued (i.e., it hasn't been returned yet)
        const existingTransaction = await Transactions.findOne({ bookName, returnDate: { $exists: false } });
        if (existingTransaction) {
            return res.status(400).json({ message: "This book is currently issued and has not been returned yet." });
        }

        // Parse the Date of Issue (DOI) and ensure it's a valid date
        const issueDate = new Date(doi as unknown as string);
        if (isNaN(issueDate.getTime())) {
            return res.status(400).json({ message: "Invalid issue date format" });
        }

        // Set the issueDate time to 00:00:00 for consistency
        issueDate.setHours(0, 0, 0, 0);

        // Create a new transaction for issuing the book
        const transaction = new Transactions({ issueDate, userId: uid, bookName });

        // Save the transaction in the database
        await transaction.save();

        return res.status(200).json(transaction); // Return the saved transaction details

    } catch (error: any) {
        console.error("Error issuing book", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// Controller for returning a book
const returnBook = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { dor, uid, bookName } = req.query;

        // Validate and parse the return date (DOR)
        const returnDate = new Date(dor as unknown as string);
        if (isNaN(returnDate.getTime())) {
            return res.status(400).json({ message: "Invalid return date format" });
        }
        returnDate.setHours(0, 0, 0, 0); // Normalize return date to 00:00:00

        // Find the corresponding transaction
        const transaction = await Transactions.findOne({ userId: Number(uid), bookName });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        transaction.returnDate = returnDate;

        // Find the book and ensure rentPerDay is available
        const book = await Books.findOne({ bookName });
        if (!book || !book.rentPerDay) {
            return res.status(404).json({ message: "Book or rentPerDay not found" });
        }

        // Calculate total rent based on the issue and return dates
        const issueDate = new Date(transaction.issueDate);
        issueDate.setHours(0, 0, 0, 0); // Normalize issue date to 00:00:00
        const diffTime = Math.abs(returnDate.getTime() - issueDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        const totalRent = diffDays * book.rentPerDay;
        transaction.totalRent = totalRent;
        await transaction.save();

        // Update the user's payableRent
        const user = await Users.findOneAndUpdate(
            { userId: Number(uid) },  // Find the user by userId
            { $inc: { payableRent: totalRent } },  // Increment payableRent by totalRent
            { new: true }  // Return the updated user document
        );

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: "User not found" });
        }

        console.log('Updated user:', user);

        // Return success response with the transaction and totalRent details
        return res.status(200).json({ message: "Book returned successfully", transaction, totalRent });

    } catch (error: any) {
        console.error("Error returning book", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// Controller for fetching past and current issuers of a book
const getIssuers = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { bookName } = req.query;

        // Fetch all transactions for the specified book
        const transactions = await Transactions.find({ bookName });

        // Separate past issuers (those who have returned the book) and the current issuer (if any)
        const pastIssuers = transactions.filter(transaction => transaction.returnDate);
        const pastUsers = pastIssuers.map(issuer => issuer.userId); // Extract past user IDs

        const currentIssuer = transactions.find(transaction => !transaction.returnDate); // Find current issuer (if book is not returned)

        // Calculate total rent from past issuers
        const totalRent = pastIssuers.reduce((sum, issuer) => sum + (issuer.totalRent || 0), 0);

        if (currentIssuer) {
            return res.status(200).json({ pastIssuers, currentIssuer, totalRent });
        }

        return res.status(200).json({ pastIssuers, message: "No current Issuer", totalRent });

    } catch (error: any) {
        console.error("Error fetching book transactions", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// Controller for fetching all books issued by a user
const getBooksByUser = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { uid } = req.query;

        // Fetch all transactions for the specified user
        const transactions = await Transactions.find({ userId: uid });

        // Extract book names from the transactions
        const booksIssued = transactions.map(transaction => transaction.bookName);

        return res.status(200).json(booksIssued); // Return list of books issued by the user

    } catch (error: any) {
        console.error("Error fetching book transactions", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// Controller for fetching all books issued within a date range
const getBooksByDate = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { from, to } = req.query;

        // Convert query parameters to Date objects
        const fromDate = new Date(from as unknown as string);
        const toDate = new Date(to as unknown as string);

        // Validate the date inputs
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        // Fetch all transactions within the date range
        const transactions = await Transactions.find({
            issueDate: { $gte: fromDate, $lte: toDate }
        });

        // Extract book names from the transactions
        const booksIssued = transactions.map(transaction => transaction.bookName);

        return res.status(200).json(booksIssued); // Return list of books issued in the date range

    } catch (error: any) {
        console.error("Error fetching book transactions", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

export { issueBook, returnBook, getIssuers, getBooksByUser, getBooksByDate };
