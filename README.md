# RewardMe - Customer Rewards Program Dashboard

A comprehensive React.js application for managing and displaying customer rewards based on purchase transactions. The application calculates reward points according to specific business rules and provides an intuitive dashboard with multiple data views.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Reward Calculation Rules](#reward-calculation-rules)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Components](#components)
- [Testing](#testing)
- [Technology Stack](#technology-stack)
- [Approach & Architecture](#approach--architecture)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## 🎯 Overview

RewardMe is a customer rewards program dashboard that helps retailers track and manage customer loyalty points. The application processes transaction data and calculates reward points based on purchase amounts, displaying the results in user-friendly tables with advanced filtering and sorting capabilities.

## ✨ Features

### Core Features
- **Real-time Reward Calculations** - Automatic point calculation based on purchase amounts
- **Multiple Data Views** - Monthly rewards, total rewards, and transaction details
- **Advanced Filtering** - Search and filter data across all tables
- **Dynamic Sorting** - Sort by any column with visual indicators
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling** - Graceful error handling with user-friendly messages
- **Loading States** - Visual feedback during data loading
- **Server Status Monitoring** - Real-time server connection status

### Technical Features
- **Pure Functions** - All calculation logic uses pure functions
- **Immutable Data** - No data mutations, functional programming approach
- **PropTypes Validation** - Complete props validation for all components
- **Comprehensive Testing** - Unit tests covering all scenarios
- **Performance Optimized** - Efficient data processing and rendering
- **Accessibility** - WCAG compliant design with keyboard navigation
- **Code Quality** - ESLint configuration and consistent formatting

## 🏆 Reward Calculation Rules

The reward system follows these business rules:

1. **No Points**: $0 - $50.00 = 0 points
2. **Single Points**: $50.01 - $100.00 = 1 point per dollar above $50
3. **Double Points**: Above $100.00 = 2 points per dollar above $100 + 1 point for each dollar between $50-$100

### Examples:
- **$45.00 purchase** = 0 points
- **$75.00 purchase** = 25 points (25 × 1)
- **$120.00 purchase** = 90 points (50 × 1 + 20 × 2)
- **$200.00 purchase** = 250 points (50 × 1 + 100 × 2)

## 📁 Project Structure

```
RewardMe/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.js
│   │   │   └── Header.css
│   │   ├── Footer/
│   │   │   ├── Footer.js
│   │   │   └── Footer.css
│   │   ├── Table/
│   │   │   ├── Table.js
│   │   │   ├── Table.css
│   │   │   └── __tests__/
│   │   │       └── Table.test.js
│   │   ├── MonthlyRewardsTable/
│   │   │   └── MonthlyRewardsTable.js
│   │   ├── TotalRewardsTable/
│   │   │   └── TotalRewardsTable.js
│   │   └── TransactionsTable/
│   │       └── TransactionsTable.js
│   ├── services/
│   │   └── apiService.js
│   ├── utils/
│   │   ├── rewardCalculations.js
│   │   ├── logger.js
│   │   ├── testUtils.js
│   │   └── __tests__/
│   │       └── rewardCalculations.test.js
│   ├── App.js
│   ├── App.css
│   ├── App.test.js
│   ├── index.js
│   └── index.css
├── db.json
├── package.json
├── .gitignore
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd RewardMe
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the JSON Server (Backend)
```bash
npm run start:server
```
This starts the JSON server on `http://localhost:3001`

### Step 4: Start the React Application
```bash
# In a new terminal window
npm start
```
This starts the React app on `http://localhost:3000`

### Alternative: Start Both Simultaneously
```bash
npm run start:all
```

## 📱 Usage

### Accessing the Application
1. Open your browser to `http://localhost:3000`
2. Ensure the JSON server is running on port 3001
3. The dashboard will automatically load and display data

### Using the Dashboard

#### Monthly Rewards Table
- View reward points earned by each customer per month
- Filter by customer name, month, or year
- Sort by any column (customer ID, name, month, year, points)

#### Total Rewards Table
- View total accumulated points for each customer
- Sorted by highest points first
- Filter by customer name

#### Transactions Table
- View all transaction details
- Filter by transaction ID, customer name, date, product, or price
- Sort by any column including date and amount

#### Filtering Data
- Use the search box in each table to filter data
- Search works across all visible columns
- Real-time filtering as you type

#### Sorting Data
- Click any column header to sort
- Click again to reverse sort order
- Visual indicators show current sort direction

## 🔌 API Endpoints

The JSON server provides the following endpoints:

### GET /transactions
Returns all transaction records
```json
[
  {
    "id": "TXN001",
    "customerId": "CUST001",
    "customerName": "John Smith",
    "purchaseDate": "2023-12-15",
    "productPurchased": "Electronics - Laptop",
    "price": 125.50,
    "rewardPoints": 51
  }
]
```

### GET /customers
Returns all customer records
```json
[
  {
    "id": "CUST001",
    "name": "John Smith",
    "email": "john.smith@email.com",
    "joinDate": "2023-01-15"
  }
]
```

### GET /transactions?customerId=CUST001
Returns transactions for a specific customer

## 🧩 Components

### Core Components

#### `<Table />` - Reusable Data Table
- **Props**: `data`, `columns`, `title`, `isLoading`, `error`, `enableFilter`, `enableSort`
- **Features**: Filtering, sorting, loading states, error handling
- **Responsive**: Mobile-friendly design

#### `<MonthlyRewardsTable />` - Monthly Rewards Display
- **Purpose**: Shows customer rewards by month and year
- **Columns**: Customer ID, Name, Month, Year, Reward Points
- **Features**: Grouped by customer and month

#### `<TotalRewardsTable />` - Total Rewards Display
- **Purpose**: Shows total accumulated rewards per customer
- **Columns**: Customer Name, Total Reward Points
- **Features**: Sorted by highest rewards

#### `<TransactionsTable />` - Transaction Details
- **Purpose**: Shows all transaction data
- **Columns**: Transaction ID, Customer Name, Date, Product, Price, Points
- **Features**: Comprehensive transaction view

#### `<Header />` - Application Header
- **Purpose**: App branding and server status
- **Features**: Real-time server status indicator

#### `<Footer />` - Application Footer
- **Purpose**: Information about rules and features
- **Features**: Reward rules explanation

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage
The application includes comprehensive tests covering:

- **Unit Tests**: All utility functions and calculations
- **Component Tests**: React component rendering and interaction
- **Integration Tests**: API service and data flow
- **Edge Cases**: Boundary conditions and error scenarios

### Test Files
- `src/utils/__tests__/rewardCalculations.test.js` - Calculation logic tests
- `src/components/Table/__tests__/Table.test.js` - Table component tests
- `src/App.test.js` - Main application tests

## 💻 Technology Stack

### Frontend
- **React.js** (v19.1.1) - UI library
- **CSS3** - Styling with responsive design
- **Axios** - HTTP client for API calls
- **PropTypes** - Runtime type checking

### Backend
- **JSON Server** - Mock REST API
- **Node.js** - Runtime environment

### Development Tools
- **Create React App** - Project bootstrapping
- **ESLint** - Code linting and formatting
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities

### Additional Libraries
- **Concurrently** - Run multiple npm scripts
- **Web Vitals** - Performance monitoring

## 🏗️ Approach & Architecture

### Design Principles

#### 1. Functional Programming
- **Pure Functions**: All calculation functions are pure with no side effects
- **Immutability**: No data mutations, all operations return new objects
- **Predictability**: Same input always produces same output

#### 2. Component Architecture
- **Reusable Components**: Table component used across all data views
- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Components composed together rather than inheritance

#### 3. State Management
- **Local State**: Using React hooks for component state
- **No Redux**: Simplified state management without external libraries
- **Centralized Data**: Main state managed in App component

#### 4. Performance Optimization
- **Memoization**: Using useMemo for expensive calculations
- **Efficient Sorting**: Sort during rendering, not in state
- **Minimal Re-renders**: Optimized useEffect dependencies

#### 5. Error Handling
- **Graceful Degradation**: App continues to work with partial failures
- **User-Friendly Messages**: Clear error messages for users
- **Logging**: Comprehensive logging for debugging

#### 6. Code Quality
- **Consistent Naming**: PascalCase for components, camelCase for functions
- **Comments**: Extensive JSDoc comments throughout
- **Type Safety**: PropTypes validation for all components

### Data Flow

1. **Data Fetching**: API service fetches raw transaction data
2. **Processing**: Utility functions calculate reward points
3. **Transformation**: Data transformed into table-specific formats
4. **Rendering**: Components render processed data with filtering/sorting
5. **User Interaction**: Real-time updates based on user input

### Calculation Logic

The reward calculation follows a tiered approach:

```javascript
// Simplified calculation logic
const calculateRewardPoints = (amount) => {
  let points = 0;
  
  if (amount > 100) {
    points += Math.floor((amount - 100) * 2); // 2x points above $100
  }
  
  const midTierAmount = Math.min(amount, 100) - Math.max(Math.min(amount, 50), 0);
  if (midTierAmount > 0) {
    points += Math.floor(midTierAmount); // 1x points $50-$100
  }
  
  return points;
};
```

## 📸 Screenshots

### Main Dashboard
![Dashboard Overview](screenshots/dashboard.png)
*Full dashboard showing all three data tables with filtering and sorting capabilities*

### Monthly Rewards Table
![Monthly Rewards](screenshots/monthly-rewards.png)
*Customer monthly rewards grouped by month and year with sorting indicators*

### Total Rewards Table
![Total Rewards](screenshots/total-rewards.png)
*Customer total rewards sorted by highest points with search functionality*

### Transactions Table
![Transactions](screenshots/transactions.png)
*Detailed transaction view with all purchase information and calculated points*

### Error Handling
![Error State](screenshots/error-state.png)
*User-friendly error message when server is unavailable with retry functionality*

### Mobile Responsive Design
![Mobile View](screenshots/mobile-view.png)
*Responsive design working seamlessly on mobile devices*

### Loading States
![Loading State](screenshots/loading-state.png)
*Loading indicators provide feedback during data fetching*

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint:fix`
6. Commit your changes: `git commit -m 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

### Code Standards
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Issues and Bugs
- Use GitHub Issues to report bugs
- Include detailed reproduction steps
- Provide browser and environment information

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React.js team for the excellent framework
- JSON Server for easy API mocking
- Testing Library for comprehensive testing utilities
- All contributors and feedback providers

---

**Built with ❤️ using React.js and modern web technologies**

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
