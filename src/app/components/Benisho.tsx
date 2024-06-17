//@ts-ignore
'use client';
import { useState } from 'react';

export default function Benisho() {
    const [urls, setUrls] = useState('');
    const [searchStrings, setSearchStrings] = useState('');
    const [result, setResult] = useState<string[] | null>(null);

    const handleCheck = async () => {
        const response = await fetch('/api/checkAppAdsTxt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                urls: urls.split('\n').map(url => url.trim()).filter(url => url),
                searchStrings: searchStrings.split('\n').map(str => str.trim()).filter(str => str),
            }),
        });

        const data = await response.json();
        setResult(data.result);
    };

    return (
        <div>
            <h1>Check app-ads.txt</h1>
            <div>
                <textarea
                    rows={10}
                    cols={50}
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    placeholder="Enter URLs, one per line"
                />
            </div>
            <div>
                <textarea
                    rows={10}
                    cols={50}
                    value={searchStrings}
                    onChange={(e) => setSearchStrings(e.target.value)}
                    placeholder="Enter search strings, one per line"
                />
            </div>
            <button onClick={handleCheck}>Check</button>
            {result && (
                <div>
                    <h2>Result</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
