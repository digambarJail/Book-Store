import { Request, Response } from 'express';
import { Books } from '../models/books';

interface QueryParams {
    search?: string;
    range?: string;
    category?: string;
}

const getBooks = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { search, range, category } = req.query;

        let query: Record<string, any> = {};

        if (search) {
            query.bookName = { $regex: search, $options: 'i' };
        }

        if (range) {
            const amounts = range.split('-');
            const minAmount = parseFloat(amounts[0]);
            const maxAmount = parseFloat(amounts[1]);

            query.rentPerDay = { $gte: minAmount, $lte: maxAmount };
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const books = await Books.find(query);

        return res.status(200).json(books);
        
    } catch (error:any) {
        console.error("Error fetching books", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

export { getBooks };
