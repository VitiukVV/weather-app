# 🌤️ Weather SPA - Modern Weather Application

A feature-rich Single Page Application for viewing weather in different cities, built with Next.js 15, TypeScript, and Material UI. Features dynamic themes, temperature charts, and optimized performance.

## 🚀 Features

- **Real-time Weather Data**: Get current weather information for any city worldwide
- **City Management**: Add, remove, and manage your favorite cities
- **Weather Details**: View detailed weather information with hourly forecasts
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Offline Support**: Cities are persisted in localStorage
- **Auto-refresh**: Automatically refreshes stale weather data on page load
- **Manual Refresh**: Manual refresh button for each city
- **Search & Autocomplete**: Smart city search with debounced input
- **Weather Themes**: Dynamic themes based on weather conditions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Interactive Charts**: Temperature charts using Recharts
- **Performance Optimized**: Request cancellation and smart caching
- **Toast Notifications**: Better user feedback and error handling

## 🚀 Quick Start

### Requirements

- **Node.js** 18+
- **npm** or **yarn**
- **OpenWeatherMap API key** (free tier available)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file in the project root:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Technologies & Tools

### Core Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **React 19** - Latest React features
- **Material UI v7** - Comprehensive component library
- **SCSS/Sass** - Advanced styling with variables and mixins

## 🔧 Technical Details

### Weather Data Management

- **Stale Time**: Weather data is considered fresh for 5 minutes
- **Auto-refresh Threshold**: Data older than 10 minutes is automatically refreshed on page load
- **Smart Caching**: Uses TanStack Query for efficient caching and background updates
- **Persistent Storage**: Cities and their weather data are saved in localStorage via Redux Persist
- **Optimistic Updates**: UI updates immediately while background refresh happens

### Performance Optimizations

- **Debounced Search**: City search is debounced to reduce API calls
- **Selective Refetching**: Only stale data is refreshed, not all cities
- **Loading States**: Visual feedback during automatic and manual refreshes
- **Error Handling**: Graceful error handling with user-friendly messages

### State Management & Data

- **Redux Toolkit** - Predictable state management
- **Redux Persist** - State persistence across sessions
- **TanStack Query v5** - Server state management and caching
- **Axios** - HTTP client with interceptors

### UI & Visualization

- **Recharts** - Interactive charts and graphs
- **Material Icons** - Consistent iconography
- **React Hot Toast** - Elegant notifications
- **Emotion** - CSS-in-JS styling

### Development & Testing

- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting with Next.js config
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
weather-app/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page
│   │   ├── providers.tsx       # Redux & Query providers
│   │   └── weather/[cityId]/   # Dynamic weather details route
│   ├── components/             # Reusable React components
│   │   ├── cityCard/           # City weather card module
│   │   ├── cities/             # Cities list management
│   │   ├── weatherDetails/     # Detailed weather view
│   │   ├── CityAutocomplete/   # Smart city search
│   │   ├── TemperatureChart/   # Interactive charts
│   │   ├── BackButton/         # Navigation component
│   │   └── form/               # Form components
│   ├── api/                    # API layer
│   │   ├── weatherApi.ts       # Weather data endpoints
│   │   └── geocodeApi.ts       # City search endpoints
│   ├── hooks/                  # Custom React hooks
│   │   ├── useWeather.ts       # Weather data hooks
│   │   └── useCityAutocomplete.ts # City search hook
│   ├── store/                  # Redux store configuration
│   │   ├── store.ts            # Store setup with persistence
│   │   └── cities/             # Cities slice with actions
│   ├── constants/              # Application constants
│   │   ├── apiPaths.ts         # API endpoint definitions
│   │   └── weatherIcons.ts     # Weather icon mappings
│   ├── utils/                  # Utility functions
│   │   ├── weatherThemes.ts    # Dynamic theme system
│   │   └── axiosInstance.ts    # HTTP client configuration
│   ├── styles/                 # Global styles and themes
│   │   └── variables.scss      # SCSS variables and exports
│   ├── types/                  # TypeScript type definitions
│   │   ├── weather.ts          # Weather data types
│   │   ├── store.ts            # Redux state types
│   │   ├── api.ts              # API response types
│   │   └── scss.d.ts           # SCSS module declarations
│   └── tests/                  # Test files
│       └── components/         # Component tests
├── public/                     # Static assets
├── .vscode/                    # VS Code settings
├── jest.config.js              # Jest configuration
├── jest.setup.js               # Jest setup file
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.mjs           # ESLint configuration
├── .prettierrc.json            # Prettier configuration
├── README.md                   # Project documentation
├── SETUP.md                    # Detailed setup guide
└── LICENSE                     # MIT license
```

## 🧪 Testing

### Run Tests

```bash
npm test                    # Run all tests
npm run test:coverage       # Run tests with coverage report
```

### Test Coverage

The project includes comprehensive tests for:

- Component rendering and interactions
- Custom hooks functionality
- Redux store actions and reducers
- API integration logic

## 📦 Available Scripts

```bash
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint errors automatically
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting
npm test                   # Run Jest tests
npm run test:coverage      # Run tests with coverage
```

## 🌐 API Integration

The application integrates with [OpenWeatherMap API](https://openweathermap.org/api) for comprehensive weather data:

### Endpoints Used:

- **Current Weather API** - Real-time weather conditions
- **5 Day Forecast API** - Extended weather predictions
- **Geocoding API** - City search and coordinates

### Features:

- Automatic request debouncing and cancellation
- Error handling and retry logic
- Optimized caching with TanStack Query
- Type-safe API responses

## 🎨 UI/UX Features

### Design System

- **Material Design 3** principles
- **Responsive breakpoints** for all devices
- **Dynamic weather themes** with gradients and colors
- **Smooth animations** and micro-interactions

### Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

### Performance

- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Caching strategies

## 🔒 Security & Best Practices

### Security Measures

- Environment variables for sensitive data
- Input validation and sanitization
- XSS protection
- HTTPS enforcement in production

### Code Quality

- TypeScript strict mode
- ESLint and Prettier integration
- Consistent code style
- Comprehensive error boundaries

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables

Required for production:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key
```

### Deployment Platforms

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Material UI](https://mui.com/) for component library
- [Recharts](https://recharts.org/) for visualization components
- [Next.js](https://nextjs.org/) team for the amazing framework
