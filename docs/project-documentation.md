# Cardify - A Modern Flashcard Application

## Project Overview
Cardify is a mobile flashcard application built with React Native and Expo. It helps users learn and memorize information through spaced repetition learning techniques. The app implements a simplified version of the SuperMemo 2 algorithm for optimal learning intervals.

## Tech Stack
- **Framework**: React Native + Expo
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **Navigation**: Expo Router
- **Notifications**: Expo Notifications
- **TypeScript**: For type safety and better development experience

## Current Features ✅

### Core Features
- [x] Create flashcards with questions and answers
- [x] Organize cards by categories
- [x] Review system with spaced repetition
- [x] Basic SuperMemo 2 algorithm implementation
- [x] Persistent storage of cards and settings
- [x] Daily review reminders via notifications

### Card Management
- [x] Add new cards with question/answer pairs
- [x] Optional category assignment for cards
- [x] View cards by category
- [x] Track review history and intervals
- [x] Delete all cards functionality
- [x] Edit existing cards
- [x] Individual card deletion with confirmation

### Review System
- [x] Smart review scheduling based on performance
- [x] Three difficulty levels for reviews:
  - Hard (resets interval to 1 hour)
  - Good (doubles current interval)
  - Easy (multiplies interval by 2.5)
- [x] Due cards identification system

### Notification System
- [x] Configurable daily review reminders
- [x] Custom notification time setting
- [x] Permission handling for notifications
- [x] Automatic next-day scheduling if time has passed

## Planned Features 🚀

### Enhanced Learning Features
- [ ] Rich text support for cards (markdown/formatting)
- [ ] Image support in cards
- [ ] Audio recording/playback for cards
- [ ] Card flipping animations
- [ ] Progress tracking and statistics

### User Experience Improvements
- [x] Dark mode support with system theme detection
- [ ] Custom themes
- [ ] Backup/restore functionality
- [ ] Import/export cards
- [ ] Multiple decks support
- [ ] Search functionality
- [ ] Card sorting options
- [ ] Batch card creation

### Advanced Features
- [ ] Study reminders based on due cards
- [ ] Learning streaks and achievements
- [ ] Card sharing between users
- [ ] Cloud sync support
- [ ] Offline mode
- [ ] Practice modes (quiz, matching, etc.)
- [ ] Performance analytics dashboard
- [ ] Custom review intervals

### Technical Improvements
- [ ] Unit tests implementation
- [ ] E2E testing setup
- [ ] Performance optimizations
- [ ] Better error handling
- [ ] Accessibility improvements
- [ ] Localization support

## Technical Details

### State Management
The app uses Zustand for state management with the following key features:
- Persistent storage using AsyncStorage
- Card store with CRUD operations
- Notification settings management
- Category management

### Spaced Repetition Algorithm
The app implements a simplified version of SuperMemo 2:
- New cards start with a 1-hour interval
- Review quality affects interval:
  - Quality ≤ 2: Reset to 1 hour
  - Quality = 4: Double interval
  - Quality = 5: Multiply interval by 2.5

### Notification System
Features a robust notification system that:
- Handles permission requests
- Manages daily notifications
- Supports custom notification times
- Automatically schedules for next day if time has passed

## Getting Started

### Prerequisites
- Node.js
- Expo CLI
- iOS Simulator or Android Emulator (for development)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Contributing
To contribute to Cardify:
1. Create a feature branch
2. Implement your changes
3. Submit a pull request
4. Follow the project's coding standards
5. Write tests for new features

## Project Structure
```
cardify/
├── app/                 # Main application screens
├── assets/             # Static assets
├── components/         # Reusable components
├── stores/            # State management
└── utils/             # Helper utilities