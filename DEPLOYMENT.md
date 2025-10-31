# Deployment Guide

This guide provides instructions for building and deploying the application to the Apple App Store and Google Play Store using Expo Application Services (EAS).

## 1. Prerequisites

-   Ensure you have an Expo account and are logged into the Expo CLI: `npx expo login`
-   Install the EAS CLI globally: `npm install -g eas-cli`
-   Ensure you have paid developer accounts for both [Apple](https://developer.apple.com/) and [Google](https://play.google.com/console/).

## 2. Configuration

### `eas.json`

Create a file named `eas.json` in the root of your project. This file configures your build profiles.

```json
{
  "cli": {
    "version": ">= 7.6.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### `app.json`

Ensure your `app.json` is correctly configured with the necessary identifiers and version numbers.

-   **`ios.bundleIdentifier`**: A unique identifier for your app on the App Store (e.g., `com.yourcompany.yourapp`).
-   **`android.package`**: A unique identifier for your app on the Play Store (e.g., `com.yourcompany.yourapp`).
-   **`version`**: The version of your app (e.g., `1.0.0`).
-   **`expo.ios.buildNumber`** & **`expo.android.versionCode`**: These should be incremented for each new build you submit.

## 3. Building the App

### For iOS

Run the following command to start the build process for iOS:

```bash
eas build --platform ios
```

EAS will guide you through the process, which includes:
1.  Creating provisioning profiles and certificates (EAS can manage this for you).
2.  Uploading your app to the EAS build servers.
3.  Building the `.ipa` file.

Once complete, the build will be available in your Expo account dashboard.

### For Android

Run the following command to start the build process for Android:

```bash
eas build --platform android
```

EAS will:
1.  Create a Keystore for signing your app (EAS can manage this).
2.  Build the `.aab` (Android App Bundle) file.

## 4. Submitting to Stores

### To Apple App Store

First, create an app listing in [App Store Connect](https://appstoreconnect.apple.com/).

Then, run the following command to submit your latest iOS build:

```bash
eas submit --platform ios
```

EAS CLI will ask you which build you want to submit and handle the upload to App Store Connect. You will then need to go to the App Store Connect web interface to complete the submission process (e.g., add release notes, select the build, and submit for review).

### To Google Play Store

First, create an app listing in the [Google Play Console](https://play.google.com/console/).

Then, configure a service account for EAS to upload builds on your behalf:

```bash
eas credentials # Follow the prompts for Android
```

Finally, run the submit command:

```bash
eas submit --platform android
```

This will upload your `.aab` file to the Play Console, where you can manage the release tracks (e.g., internal, alpha, production) and roll it out to users.
      