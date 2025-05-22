# Trip Logger

A modern, cross-platform expense tracking and trip management application built with Expo and React Native.

## Features

- **Trip Management**
  - Create and manage multiple trips
  - Track trip dates, locations, and participants
  - Add cover images and descriptions
  - View trip statistics and summaries

- **Expense Tracking**
  - Log expenses with categories
  - Split expenses between trip participants
  - Support for multiple currencies
  - Visual expense breakdowns and statistics

- **Activity Planning**
  - Schedule and organize trip activities
  - Add locations, times, and descriptions
  - Track activity costs and participants
  - Photo attachments for memories

- **Profile Management**
  - User profiles with statistics
  - Google Authentication integration
  - Notification preferences
  - Dark mode support

## Tech Stack

- **Frontend**
  - React Native / Expo
  - Expo Router for navigation
  - TypeScript for type safety
  - Reanimated for smooth animations
  - Gesture Handler for interactions

- **Backend**
  - Supabase for database and authentication
  - Google Drive API for data backup
  - Expo Server for API routes

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trip-logger.git
cd trip-logger
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Project Structure

```
trip-logger/
├── app/                   # Application routes
│   ├── (tabs)/           # Tab-based navigation
│   ├── auth/             # Authentication routes
│   ├── trip/            # Trip-related routes
│   └── _layout.tsx      # Root layout
├── components/           # Reusable components
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
└── data/                # Mock data and constants
```

## Features Documentation

### Trip Management

The app allows users to:
- Create new trips with titles, dates, and locations
- Add participants and manage their permissions
- Track expenses and activities within each trip
- View trip statistics and summaries

### Expense Tracking

Users can:
- Log expenses with categories (food, transport, accommodation, etc.)
- Split expenses between trip participants
- View expense breakdowns and statistics
- Attach receipts using the device camera

### Activity Planning

The activity system enables:
- Creating scheduled activities
- Adding locations and descriptions
- Tracking activity costs
- Attaching photos to activities

### Profile Management

User profiles include:
- Personal information management
- Trip statistics
- Expense summaries
- Notification preferences
- Theme settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Supabase](https://supabase.com/) for backend services
- [Lucide Icons](https://lucide.dev/) for beautiful icons
