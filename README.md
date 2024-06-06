# Project Name: UVGraph
UVGraph is a web application that plots data using Plotly and interacts with Google Sheets to store and retrieve data.


## Prerequisites

Install Nodejs

- [Node.js](https://nodejs.org/)

## Usage

	•	Enter values for distance and UV measurement.
	•	Click the “Daten hinzufügen” button to add the data.
	.	Verify that the data is added to the Google Sheets document.
	.	Retrieve Data:
	•	Click the button to load average values.
	•	Verify that the data is retrieved from Google Sheets
	.	Remove Data:
	•	Click the button to remove the last data point.


## Set Up Google Sheets

[Guide by Google](https://developers.google.com/sheets/api/quickstart/js)
To fully use this application, you need to set up Google Sheets API:

	1.	Create a New Spreadsheet:
	•	Go to Google Sheets and create a new spreadsheet.
	•	Note the spreadsheet ID from the URL
	2.	Enable Google Sheets API:
	•	Go to the Google Cloud Console.
	•	Create a new project or select an existing project.
	•	Navigate to the API Library and enable the “Google Sheets API”.
	3.	Create Credentials:
	•	In the Google Cloud Console, go to the “Credentials” section.
	•	Click on “Create Credentials” and select “Service Account”.
	•	Follow the prompts to create a new service account and download the JSON key file. Save this file to your project directory and update the GOOGLE_CREDENTIALS_PATH in your .env file to point to this file.
	4.	Share the Spreadsheet with the Service Account:
	•	Open your Google Sheets spreadsheet.
	•	Click on “Share” in the top right corner.
	•	Add the email address of the service account (found in the JSON key file under client_email) with “Editor” permissions.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Tedorg/UVGraph/tree/main
cd your-repo-name
npm install
node app.js
Open your web browser and go to http://localhost:8080.


```

