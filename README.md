# Simple Calendly Backend

Welcome to this express app!

## Getting Started

To use this app, follow the instructions below:

1. Clone this repository.
2. Create a `.env` file and add the following variables:
   - `PORT=3000`
   - `NODE_ENV=development`
   - `GOOGLE_CLIENT_ID=`
   - `GOOGLE_CLIENT_SECRET=`

   To get your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`:
   - Go to the Google Developer Console and create a new project.
   - Enable the Google Calendar API for your project.
   - Create OAuth2 credentials for a web app with the following redirect URI: `http://localhost:3000/oauth2callback`.
   - Download the JSON file and copy the `client_id` and `client_secret` values into your `.env` file.

3. Run `npm install` to install all the required modules.
4. Run `npm run dev` to start the app on `http://localhost:3000`.
5. Visit `http://localhost:3000/docs` to access the Swagger API documentation.

## Authorization Process

To authorize your host, follow these steps:

1. Call the `/initiate-auth` API.
2. The API will return an `authUrl`.
3. Open the `authUrl` in your browser and grant permission to your Google account.
4. Once permission is granted, the browser will redirect to `http://localhost:3000/oauth2callback` with an authorization code in the request body.
5. The above auth code is already taken into care to generate access token and refresh token, and set the credentials. You don't have to
do anything else.
6. You are now authorized to use the other APIs.

## Available Meeting Slots

I have randomly picked 10 available meeting slots between 9th April 2023 to 16th April 2023 in advance. You can add/update/remove slots in `utils.ts` file.

## Production URL

App deployed @Vercel
Production link : https://simple-calendly-backend.vercel.app/
Docs link : https://simple-calendly-backend.vercel.app/docs/

Thank you for using this app!
