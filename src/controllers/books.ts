import { Request, Response } from 'express'; // Importing Request and Response types from Express for typing
import { Books } from '../models/books'; // Importing the Books model for database queries

// Defining an interface to type the expected query parameters
interface QueryParams {
    search?: string;    // Optional search term for book name
    range?: string;     // Optional range for rent per day, formatted as "min-max"
    category?: string;  // Optional category for filtering books
}

// Controller function to handle fetching books based on query parameters
const getBooks = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        const { search, range, category } = req.query; // Destructuring query parameters from the request

        // Initialize an empty query object to dynamically build the query
        let query: Record<string, any> = {};

        // If a search term is provided, add a case-insensitive regex search on the bookName field
        if (search) {
            query.bookName = { $regex: search, $options: 'i' };
        }

        // If a range is provided, split it into min and max values and query based on rentPerDay
        if (range) {
            const amounts = range.split('-'); // Splitting the range string into two values
            const minAmount = parseFloat(amounts[0]); // Parsing the minimum rent value
            const maxAmount = parseFloat(amounts[1]); // Parsing the maximum rent value

            // Add a range condition for rentPerDay
            query.rentPerDay = { $gte: minAmount, $lte: maxAmount };
        }

        // If a category is provided, add a case-insensitive regex search on the category field
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        // Query the Books collection in the database with the built query object
        const books = await Books.find(query);

        // Respond with the found books and a status code of 200
        return res.status(200).json(books);
        
    } catch (error: any) {
        // Handle errors by logging the error and responding with a 500 status code
        console.error("Error fetching books", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

export { getBooks }; // Export the getBooks controller function for use in routes
