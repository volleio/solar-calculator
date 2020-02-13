import { NextApiRequest, NextApiResponse } from 'next';
import { PvWattsRequestParameters, PvWattsResponse } from '../../api/PvWattsRequest';
import dotenv from 'dotenv';

dotenv.config();

export default async (req: NextApiRequest, res: NextApiResponse<PvWattsResponse>) => {
    const requestParameters: PvWattsRequestParameters = req.body;
    
    // Set API key server-side
    if (!process.env.PVWATTS_API_KEY)
        throw "PVWATTS_API_KEY is undefined, please set one in a .env file";

    requestParameters.api_key = process.env.PVWATTS_API_KEY;
    
    res.status(200).json();
}