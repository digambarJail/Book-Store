import { Request, Response } from 'express';
import { Transactions } from '../models/transactions';
import { Books } from '../models/books';
import { Users } from '../models/users';

interface QueryParams {
    doi?: Date;
    dor?: Date;
    uid?: number;
    bookName?: string;
    from?:Date;
    to?:Date;
    payableRent:number;
}

const issueBook = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { doi, uid, bookName } = req.query;

        // Check if the book is currently issued and not yet returned
        const existingTransaction = await Transactions.findOne({ bookName, returnDate: { $exists: false } });
        if (existingTransaction) {
            return res.status(400).json({ message: "This book is currently issued and has not been returned yet." });
        }

        // Parse DOI and create a date object with time set to 00:00:00
        const issueDate = new Date(doi as unknown as string);
        if (isNaN(issueDate.getTime())) {
            return res.status(400).json({ message: "Invalid issue date format" });
        }

        // Set time to 00:00:00 to ensure only date is considered
        issueDate.setHours(0, 0, 0, 0);

        // Create a new transaction for issuing the book
        const transaction = new Transactions({ issueDate, userId: uid, bookName });

        // Save the transaction in the database
        await transaction.save();

        return res.status(200).json(transaction);

    } catch (error: any) {
        console.error("Error issuing book", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};


const returnBook = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { dor, uid, bookName } = req.query;

        // Validate and parse the return date
        const returnDate = new Date(dor as unknown as string);
        if (isNaN(returnDate.getTime())) {
            return res.status(400).json({ message: "Invalid return date format" });
        }
        returnDate.setHours(0, 0, 0, 0);

        // Find the transaction
        const transaction = await Transactions.findOne({ userId: Number(uid), bookName });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        transaction.returnDate = returnDate;

        // Find the book
        const book = await Books.findOne({ bookName });
        if (!book || !book.rentPerDay) {
            return res.status(404).json({ message: "Book or rentPerDay not found" });
        }

        // Calculate total rent
        const issueDate = new Date(transaction.issueDate);
        issueDate.setHours(0, 0, 0, 0); // Normalize time
        const diffTime = Math.abs(returnDate.getTime() - issueDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        const totalRent = diffDays * book.rentPerDay;
        transaction.totalRent = totalRent;
        await transaction.save();

        // Update the user
        const user = await Users.findOneAndUpdate(
            { userId: Number(uid) },  // Query based on userId
            { $inc: { payableRent: totalRent } },  // Increment payableRent
            { new: true }  // Return the updated document
        );

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: "User not found" });
        }

        console.log('Updated user:', user);

        console.log('before final returning',transaction,totalRent)
        // Return success response
        return res.status(200).json({ message: "Book returned successfully", transaction, totalRent });

    } catch (error: any) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const getIssuers = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { bookName } = req.query;
        // Fetch all transactions related to the book
        const transactions = await Transactions.find({ bookName });

        // Separate past issuers (those who have returned the book) from the current issuer
        const pastIssuers = transactions.filter(transaction => transaction.returnDate);
        const pastUsers = pastIssuers.map(issuer => issuer.userId)

        const currentIssuer = transactions.find(transaction => !transaction.returnDate);


        const totalRent = pastIssuers.reduce((sum, issuer) => sum + (issuer.totalRent || 0), 0);

        if(currentIssuer){
            return res.status(200).json({ pastIssuers, currentIssuer, totalRent });
        }

        return res.status(200).json({ pastIssuers, message:"No current Issuer", totalRent });

    } catch (error: any) {
        console.error("Error fetching book transactions", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const getBooksByUser = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { uid } = req.query;
        // Fetch all transactions related to the book
        const transactions = await Transactions.find({ userId:uid });
        
        const booksIssued = transactions.map(transaction => transaction.bookName);

        return res.status(200).json(booksIssued);

    } catch (error: any) {
        console.error("Error fetching book transactions", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

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

        // Fetch all transactions with issueDate within the date range
        const transactions = await Transactions.find({
            issueDate: { $gte: fromDate, $lte: toDate }
        });

        // Extract book names from the transactions
        const booksIssued = transactions.map(transaction => transaction.bookName);

        return res.status(200).json(booksIssued);

    } catch (error: any) {
        console.error("Error fetching book transactions", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};



export { issueBook, returnBook,getIssuers,getBooksByUser, getBooksByDate };
