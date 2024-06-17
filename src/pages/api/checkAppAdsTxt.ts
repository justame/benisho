import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

interface CheckRequestBody {
    urls: string[];
    searchStrings: string[];
}

async function checkAppAdsTxt(urls: string[], searchStrings: string[]): Promise<string[]> {
    const urlsWithStrings: string[] = [];

    async function fetchAndCheckUrl(url: string): Promise<boolean> {
        try {
            const response = await axios.get(`${url}/app-ads.txt`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
                validateStatus: (status) => status < 500, // Resolve only if the status code is less than 500
            });

            if (response.status === 200) {
                const lines = response.data.split('\n');
                for (const line of lines) {
                    console.log('line', line)
                    const trimmedLine = line.trim();
                    for (const searchString of searchStrings) {
                        const trimmedSearchString = searchString.trim();
                        if (trimmedLine.includes(trimmedSearchString)) {
                            return true;
                        }
                    }
                }
            } else {
                console.error(`Failed to fetch ${url}/app-ads.txt: ${response.statusText}`);
            }
        } catch (error: any) {
            console.error(`Failed to fetch ${url}/app-ads.txt: ${error.message}`);
        }
        return false;
    }

    for (const url of urls) {
        const found = await fetchAndCheckUrl(url);
        if (found) {
            urlsWithStrings.push(url);
        }
    }

    return urlsWithStrings;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { urls, searchStrings }: CheckRequestBody = req.body;

        const result = await checkAppAdsTxt(urls, searchStrings);
        res.status(200).json({ result });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}


export const config = {
    maxDuration: 55,
};