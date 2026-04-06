# FinanceFlow - Finance Dashboard

A clean, interactive finance dashboard built with React.js for tracking and understanding financial activity.

## Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Approach

Built with **React + Vite** using **Context API** for state management and **Recharts** for data visualization. The UI uses **Lucide React** icons and custom CSS with a modern, responsive design.

### Architecture

- **State Management**: `useReducer` + `Context API` in `src/context/FinanceContext.jsx` - manages transactions, filters, role, and UI state
- **Data Layer**: `src/data/mockData.js` - 34 mock transactions across 3 months with 10 categories
- **Components**: Modular components in `src/components/` following single-responsibility principle

### Features

#### 1. Dashboard Overview
- 4 summary cards: Total Balance, Income, Expenses, Savings Rate
- Line chart: Balance trend over time (Income, Expenses, Net)
- Pie chart: Spending breakdown by category (donut style)
- Bar chart: Monthly income vs expenses comparison

#### 2. Transactions Section
- Sortable, filterable transaction list
- Search by description or category
- Filter by category, type (income/expense), date range
- Sort by date, amount, or category (asc/desc)
- Expandable rows showing full details
- Empty state handling

#### 3. Role-Based UI (RBAC)
- Admin: Can add, edit, and delete transactions
- Viewer: Read-only access to all data
- Toggle via sidebar switcher

#### 4. Insights Section
- Top spending category with percentage
- Month-over-month expense change
- Average monthly spending
- Primary income source identification

### Tech Stack

- React 19 + Vite 8
- Recharts (charts)
- Lucide React (icons)
- Custom CSS (responsive, mobile-first)
- Context API + useReducer (state management)
