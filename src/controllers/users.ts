import { Request, Response } from 'express';
import { Users } from '../models/users';

interface QueryParams {
    uid?: number;
    name?: string;
}

const getUsers = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<Response> => {
    try {

        const users = await Users.find({});

        return res.status(200).json(users);
        
    } catch (error:any) {
        console.error("Error fetching users", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};