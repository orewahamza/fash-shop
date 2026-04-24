# Firebase Setup for Google Login

To enable Google Login, you need to configure Firebase Admin SDK.

1.  **Create a Firebase Project:**
    *   Go to [Firebase Console](https://console.firebase.google.com/).
    *   Click "Add project" and follow the steps.

2.  **Enable Authentication:**
    *   In your project, go to **Build** -> **Authentication**.
    *   Click "Get started".
    *   Go to **Sign-in method** tab.
    *   Enable **Google**.

3.  **Generate Private Key:**
    *   Go to **Project settings** (gear icon) -> **Service accounts**.
    *   Click "Generate new private key".
    *   This will download a JSON file.

4.  **Update `.env`:**
    *   Open the downloaded JSON file.
    *   Copy the values to your `backend/.env` file:
        ```env
        FIREBASE_PROJECT_ID=your-project-id
        FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
        FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
        ```
    *   **Note:** Ensure the private key is enclosed in quotes if it contains newlines, or copy it exactly as in the JSON (dotenv usually handles newlines if quoted).

5.  **Restart Backend:**
    *   After updating `.env`, restart the backend server.
