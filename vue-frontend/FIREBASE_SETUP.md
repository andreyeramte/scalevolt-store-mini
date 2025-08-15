# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or use an existing project
3. Follow the setup wizard

## Step 2: Add Web App

1. In your Firebase project, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "ScaleVolt Store")
3. Copy the configuration object

## Step 3: Create Environment File

Create a file called `.env` in the `vue-frontend` directory with this content:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Configuration
VITE_API_URL=http://localhost:3002/api
```

## Step 4: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable the sign-in methods you want:
   - Email/Password
   - Google
   - Facebook
   - etc.

## Step 5: Restart Development Server

After creating the `.env` file, restart your development server:

```bash
cd vue-frontend
npm run dev
```

## Example Configuration

Your `.env` file should look something like this:

```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=scalevolt-store.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=scalevolt-store
VITE_FIREBASE_STORAGE_BUCKET=scalevolt-store.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_API_URL=http://localhost:3002/api
``` 