const express = require('express');
const path = require('path');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config(); // Load environment variables from .env file

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('dist'));

// Dummy in-memory database
let inputData = [];

// Endpoint to receive user input and store it
app.post('/input', async (req, res) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_CREDENTIALS_PATH, // Use environment variable for credentials file path
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        const client = await auth.getClient();
        const googleSheets = google.sheets({ version: "v4", auth: client });
        const spreadsheetId = process.env.SPREADSHEET_ID; // Use environment variable for spreadsheet ID

        const data = req.body;
        console.log('Received input data:', data);
        let d = data.distance;
        let m = data.uv;

        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "mes!A:B",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [d, m]
                ]
            }
        });

        res.status(200).json({ message: 'Input data received successfully.', status: 200 }); // Return JSON response
    } catch (error) {
        console.error('Error processing input data:', error);
        res.status(500).json({ error: 'An error occurred while processing the input data.' }); // Return JSON error
    }
});

// Endpoint to retrieve stored data
app.get("/data", async (req, res) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_CREDENTIALS_PATH, // Use environment variable for credentials file path
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        const client = await auth.getClient();
        const googleSheets = google.sheets({ version: "v4", auth: client });
        const spreadsheetId = process.env.SPREADSHEET_ID; // Use environment variable for spreadsheet ID

        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "mes!D3:E",
        });

        console.log(getRows.data);
        res.json(getRows.data);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the data.' }); // Return JSON error
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});