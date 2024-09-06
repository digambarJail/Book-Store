import { Request, Response } from 'express';
import { Users } from '../models/users';

interface QueryParams {
    uid?: number;
    name?: string;
}

const getUsers = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {
        // Fetch all users from the database
        const users = await Users.find({});

        // Return the users in the response with status 200
        return res.status(200).json(users);
        
    } catch (error: any) {
        console.error("Error fetching users", error);
        // Handle the error by returning a 500 status with error message
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

export { getUsers }
