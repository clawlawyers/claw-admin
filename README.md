# Claw Admin Panel

A comprehensive administration dashboard for the Claw legal services platform. This application provides administrators with tools to manage users, analyze platform usage, and control system features.

## Overview

The Claw Admin Panel is a React-based web application that serves as the central management interface for the Claw legal services ecosystem. It provides administrators with tools to monitor user activity, manage subscriptions, analyze platform usage, and control various system features.

## Features

### User Management

- **User Directory**: View and manage all registered users
- **Subscription Management**: Track and modify user subscription plans
- **User Details**: Detailed user profiles with usage statistics
- **User Feedback**: Review and respond to user feedback

### Analytics & Reporting

- **Dashboard**: Overview of key metrics and platform performance
- **Visitor Statistics**: Track visitor patterns with daily, weekly, and monthly views
- **Page Analytics**: Monitor page views and user engagement
- **Visit Heatmap**: Visualize user activity across the platform
- **User Visit Tracking**: Analyze individual user journeys

### Administrative Controls

- **Courtroom Management**: Configure and monitor virtual courtrooms
- **Custom Courtroom**: Create specialized courtroom environments
- **Allowed Booking**: Control who can book courtroom sessions
- **Allowed Login**: Manage authentication permissions

### Marketing & Promotion

- **Referral Codes**: Generate and track referral programs
- **Coupon Management**: Create and distribute promotional codes
- **Trial Coupons**: Manage free trial access
- **Ambassador Program**: Administer the platform ambassador program

### Sales & Support

- **Salesperson Management**: Track sales team performance
- **Admin User Control**: Manage administrator accounts and permissions

## Technical Architecture

### Frontend

- **Framework**: React 18 with Create React App
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Components**: Material UI, Headless UI
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with React-Chartjs-2
- **Forms**: React Hook Form

### Backend Integration

- **API Communication**: Axios
- **Authentication**: JWT with Firebase integration
- **Real-time Updates**: Redux async actions

### Environment Configuration

The application connects to different backend services:

- **Node.js API**: User management, analytics, and administrative functions

  - Development: `http://localhost:8000/api/v1`
  - Production: `https://claw-app-dev.onrender.com/api/v1`

- **Flask API**: Advanced analytics and processing

  - Development: `http://20.193.128.165:80/api/v1`
  - Production: `https://gpt.clawlaw.in/api/v1`

- **OTP Service**: Authentication
  - Development & Production: `https://claw-app.onrender.com`

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

1. Clone the repository

   ```
   git clone https://github.com/your-org/claw-admin.git
   cd claw-admin
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Start the development server

   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`

Launches the test runner in interactive watch mode

### `npm run build`

Builds the app for production to the `build` folder

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**
Ejects the build configuration for full control

## Deployment

### Build for Production

```
npm run build
```

The optimized production build will be created in the `build` directory.

### Deployment Platforms

The application is configured for deployment on:

- Render
- Netlify
- Vercel
- AWS Amplify

### Routing Configuration

The application includes a `_redirects` file for Netlify and similar platforms to handle client-side routing.

## Project Structure

```
src/
├── admin/              # Admin-specific components and features
│   ├── actions/        # Redux action creators
│   ├── components/     # Reusable admin components
│   ├── features/       # Redux slices and reducers
│   └── ...             # Admin page components
├── utils/              # Utility functions and constants
│   ├── firebase.js     # Firebase configuration
│   └── utils.js        # Common utilities and endpoints
├── App.js              # Main application component
├── App.css             # Global styles
├── index.js            # Application entry point
└── store.js            # Redux store configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Support

For support, please contact the development team at support@clawlaw.in
