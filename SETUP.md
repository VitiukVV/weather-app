# 🚀 Weather SPA - Detailed Setup Guide

This guide provides comprehensive setup instructions for the Weather SPA application, including development environment configuration, troubleshooting, and optimization tips.

## 📋 Prerequisites

### System Requirements

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or **yarn** 1.22.0+)
- **Git** for version control
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Recommended Development Tools

- **VS Code** with recommended extensions
- **React Developer Tools** browser extension
- **Redux DevTools** browser extension

## 🔑 1. API Key Setup

### Getting OpenWeatherMap API Key

1. **Register Account**
   - Visit [OpenWeatherMap](https://openweathermap.org/)
   - Click "Sign Up" and create a free account
   - Verify your email address

2. **Generate API Key**
   - Navigate to [API Keys section](https://home.openweathermap.org/api_keys)
   - Click "Generate" or use the default key
   - Copy your API key (it may take up to 2 hours to activate)

3. **API Key Limits**
   - **Free tier**: 1,000 calls/day, 60 calls/minute
   - **Paid tiers**: Higher limits available
   - Monitor usage in your dashboard

## ⚙️ 2. Environment Configuration

### Create Environment File

Create `.env.local` in the project root:

```env
# OpenWeatherMap API Configuration
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here

# Optional: Development Configuration
NODE_ENV=development

# Optional: API Base URL Override
NEXT_PUBLIC_API_BASE_URL=https://api.openweathermap.org
```

### Environment File Security

- ✅ **Never commit** `.env.local` to version control
- ✅ **Use** `NEXT_PUBLIC_` prefix for client-side variables
- ✅ **Store** sensitive data server-side when possible
- ⚠️ **Note**: `NEXT_PUBLIC_` variables are exposed to the browser

## 🛠️ 3. Installation & Development

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd weather-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Scripts

```bash
# Development
npm run dev                 # Start dev server with hot reload
npm run build              # Build for production
npm run start              # Start production server

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Auto-fix ESLint errors
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting

# Testing
npm test                   # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

### Development Server Options

```bash
# Start on custom port
npm run dev -- -p 3001

# Start with custom hostname
npm run dev -- -H 0.0.0.0

# Start with debugging
NODE_OPTIONS='--inspect' npm run dev
```

## 🧪 4. Testing & Verification

### Basic Functionality Test

1. **Application Launch**

   ```bash
   npm run dev
   ```

   - Open [http://localhost:3000](http://localhost:3000)
   - Verify the page loads without errors

2. **City Search Test**
   - Type "London" in the search field
   - Verify autocomplete suggestions appear
   - Select a city from suggestions
   - Verify city card appears with weather data

3. **Weather Details Test**
   - Click on a city card
   - Verify navigation to weather details page
   - Check temperature chart displays correctly
   - Verify all weather metrics are shown

4. **Local Storage Test**
   - Add multiple cities
   - Refresh the page
   - Verify cities persist after reload

### Running Automated Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- CityCard.test.tsx
```

### Browser Console Verification

Check browser console for:

- ✅ No error messages
- ✅ Successful API calls
- ✅ Redux state updates
- ⚠️ Warning messages (expected in development)

## 🏗️ 5. Production Build

### Build Process

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

### Build Verification

```bash
# Analyze bundle size
npm run build -- --analyze

# Check build output
ls -la .next/static/
```

### Performance Optimization

1. **Bundle Analysis**
   - Use `@next/bundle-analyzer` for detailed analysis
   - Check for unnecessary dependencies
   - Optimize imports to reduce bundle size

2. **Caching Strategy**
   - Browser caching for static assets
   - API response caching with TanStack Query
   - Redis caching for production (optional)

## 🔧 6. Troubleshooting

### Common Issues & Solutions

#### ❌ "City not found" Error

**Symptoms**: Search returns no results or shows error
**Solutions**:

- Check spelling of city name
- Use English city names
- Try alternative name formats (e.g., "New York City" vs "New York")
- Verify internet connection
- Check browser network tab for failed requests

#### ❌ API Key Errors

**Symptoms**: 401 Unauthorized or API limit exceeded
**Solutions**:

```bash
# Check API key format
echo $NEXT_PUBLIC_OPENWEATHER_API_KEY

# Verify key is active (may take up to 2 hours)
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY"

# Check API usage limits in OpenWeatherMap dashboard
```

#### ❌ LocalStorage Issues

**Symptoms**: Cities don't persist between sessions
**Solutions**:

- Check browser privacy settings
- Disable "Block third-party cookies"
- Clear browser cache and try again
- Check browser console for storage errors
- Verify browser supports localStorage

#### ❌ Build Failures

**Symptoms**: npm run build fails
**Solutions**:

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+

# Run type checking
npx tsc --noEmit
```

#### ❌ Performance Issues

**Symptoms**: Slow loading, high memory usage
**Solutions**:

- Check browser network throttling settings
- Disable browser extensions
- Check API response times
- Monitor memory usage in DevTools
- Consider implementing request debouncing

### Debug Mode

Enable detailed logging:

```bash
# Enable Next.js debug mode
DEBUG=* npm run dev

# Enable React DevTools
# Install React Developer Tools browser extension

# Enable Redux DevTools
# Install Redux DevTools browser extension
```

### Network Debugging

Check API requests:

```bash
# Test API directly
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric"

# Check geocoding API
curl "https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=YOUR_API_KEY"
```

## 🚀 7. Advanced Configuration

### VS Code Setup

Install recommended extensions:

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

### Custom Configuration Files

#### `.vscode/settings.json`

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### Custom ESLint Rules

Modify `eslint.config.mjs` for project-specific rules:

```javascript
export default [
  // ... existing config
  {
    rules: {
      // Add custom rules here
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
```

### Performance Monitoring

#### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze production bundle
npm run build
npm run analyze
```

#### Lighthouse Audits

- Use Chrome DevTools Lighthouse
- Focus on Performance, Accessibility, Best Practices
- Target scores: 90+ for all categories

## 🆘 8. Getting Help

### Support Channels

1. **Check Documentation**
   - Review this SETUP.md file
   - Check the main README.md
   - Browse inline code comments

2. **Debug Steps**
   - Check browser console for errors
   - Review Network tab in DevTools
   - Verify environment variables
   - Test API endpoints manually

3. **Community Support**
   - Create issue in project repository
   - Include error messages and steps to reproduce
   - Provide system information (OS, Node.js version, browser)

### Useful Debug Commands

```bash
# System information
node --version
npm --version
npx next --version

# Project health check
npm audit
npm outdated

# Clear all caches
npm run build -- --no-cache
rm -rf .next node_modules package-lock.json
npm install
```

## ✅ 9. Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] API key active and tested
- [ ] Build process successful
- [ ] All tests passing
- [ ] Performance audit completed
- [ ] Security headers configured
- [ ] Error monitoring setup
- [ ] Backup strategy in place

### Production Environment Variables

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_production_api_key
NODE_ENV=production
```

---

**Need more help?** Create an issue in the repository with:

- Error messages
- Steps to reproduce
- System information
- Screenshots (if applicable)
