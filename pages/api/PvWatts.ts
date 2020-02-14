import { NextApiRequest, NextApiResponse } from 'next';
import * as PvWatts from '../../api/PvWatts';
import dotenv from 'dotenv';
import fetch from 'request-promise-native';

dotenv.config();

export default async (req: NextApiRequest, res: NextApiResponse<PvWatts.Response>) => {
    const requestParameters: PvWatts.RequestParameters = req.body;

    // Set API key server-side
    if (!process.env.PVWATTS_API_KEY)
        throw "PVWATTS_API_KEY is undefined, please set one in a .env file";

    // Set API key found in .env file
    requestParameters.api_key = process.env.PVWATTS_API_KEY;

    // filter out any uneccesary request parameters that are null/undefined or set to the default
    const parametersToRemove: { [key: string]: string | number } = {
        "format": "json",
        "radius": 100,
        "timeframe": "monthly",
        "dc_ac_ratio": 1.2,
        "gcr": 0.4,
        "inv_eff": 96,
    };
    const queryParametersArray = Object.entries(requestParameters).filter((entry) => {
        const key = entry[0];
        const value = entry[1];
        if (parametersToRemove.hasOwnProperty(key))
            return value != null && value != parametersToRemove[key];

        return true;
    });

    // Convert array of query parameters into URI encoded string
    const queryParameters = queryParametersArray.map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
    console.debug(`Executing PVWatts request with query parameters: ${queryParameters}`);

    // Fetch info from API, with API key
    const baseApiUrl = process.env.PVWATTS_BASE_URL || 'https://developer.nrel.gov/api/pvwatts/v6.json?';
    const pvWattsResponse: PvWatts.Response = JSON.parse(await fetch(baseApiUrl + queryParameters));

    // TODO: do we need to parse & stringify same JSON?
    res.status(200).json(pvWattsResponse);
}