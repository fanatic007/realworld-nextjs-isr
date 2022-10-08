import { NextApiResponse } from "next";
import { ErrorResponse } from "../types";
export { errorHandler };

function errorHandler(err: Error, res:NextApiResponse<ErrorResponse>) {        
    if (err.message === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ errors:{body:[new Error('Invalid Token')]}});
    }
    if (err.message === 'Method Not Allowed') {
        return res.status(405).json({ errors:{body:[err]} });
    }
    console.error("Error:",err.message);    
    return res.status(422).json({ errors:{body:[err]}});
}