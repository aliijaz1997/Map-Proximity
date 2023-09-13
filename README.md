# Ride App
- ![React](https://img.shields.io/badge/-React-blue?style=flat-square&logo=react)
- ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)
- ![Redux Toolkit](https://img.shields.io/badge/-Redux_Toolkit-764ABC?style=flat-square&logo=redux)
- ![RTK Query](https://img.shields.io/badge/-RTK_Query-764ABC?style=flat-square&logo=redux)
- ![Express.js](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express)
- ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb)
- ![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?style=flat-square&logo=firebase)
- ![Pusher](https://img.shields.io/badge/-Pusher-FF5733?style=flat-square&logo=pusher)

The Ride App is a comprehensive ride-sharing platform that allows users to book rides, connect with drivers, and manage the service efficiently. It caters to three distinct roles: Customers, Drivers, and Admins, each with their unique set of features.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Installation](#installation)

## Features

- **User Roles:**
  - **Customer:** Book rides, manage bookings, and track rides.
  - **Driver:** Accept ride requests, update availability, and view ride details.
  - **Admin:** Manage users, rides, and system configurations.

- **Real-time Communication:** Utilizes Firebase and Pusher for seamless real-time updates.

- **Frontend:**
  - Built with React for a dynamic user interface.
  - Styled using Tailwind CSS for responsive design.
  - State management with Redux Toolkit.
  - Data fetching with RTK Query for efficient API interactions.

- **Backend:**
  - Developed with Express.js.
  - Database powered by MongoDB for scalability.
  - Firebase integration for authentication.
  
- **Convenient Start Scripts:**
  - Use a common `package.json` at the root.
  - Start both frontend and backend with a single command: `npm run watch`.
  - Easy dependency installation: `npm install`.


## Getting Started

To get started with the Ride App, follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies using `npm install`.
3. Set up Firebase and MongoDB configurations.
4. Run the app using `npm run watch`.

For detailed instructions, refer to the [Installation](#installation) and [Usage](#usage) sections.

## Installation

You can install the project's dependencies by running the following command at the root of the project:

```bash
npm install && npm run watch
