import { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import { transactions as initialTransactions, categories, balanceHistory, defaultFilters } from '../data/mockData';

const FinanceContext = createContext();

const STORAGE_KEY = 'financeflow_state';

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        transactions: parsed.transactions || initialTransactions,
        role: parsed.role || 'admin',
        theme: parsed.theme || 'light',
      };
    }
  } catch {
    // corrupted data, use defaults
  }
  return {
    transactions: initialTransactions,
    role: 'admin',
    theme: 'light',
  };
}

const savedState = loadFromStorage();

const initialState = {
  transactions: savedState.transactions,
  filters: { ...defaultFilters },
  role: savedState.role,
  theme: savedState.theme,
  activeTab: 'dashboard',
  editingTransaction: null,
  showAddModal: false,
};

function financeReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: { ...defaultFilters } };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'ADD_TRANSACTION': {
      const newTx = {
        ...action.payload,
        id: Math.max(...state.transactions.map(t => t.id), 0) + 1,
      };
      return { ...state, transactions: [...state.transactions, newTx], showAddModal: false };
    }
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
        editingTransaction: null,
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'SET_EDITING_TRANSACTION':
      return { ...state, editingTransaction: action.payload };
    case 'SET_SHOW_ADD_MODAL':
      return { ...state, showAddModal: action.payload };
    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }));
    } catch {
      // storage full or unavailable
    }
  }, [state.transactions, state.role, state.theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const setRole = useCallback((role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  }, []);

  const setActiveTab = useCallback((tab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const addTransaction = useCallback((transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  }, []);

  const updateTransaction = useCallback((transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }, []);

  const setEditingTransaction = useCallback((transaction) => {
    dispatch({ type: 'SET_EDITING_TRANSACTION', payload: transaction });
  }, []);

  const setShowAddModal = useCallback((show) => {
    dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: show });
  }, []);

  const { search, category, type, dateFrom, dateTo, sortBy, sortOrder } = state.filters;

  const getFilteredTransactions = useCallback(() => {
    let filtered = [...state.transactions];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
      );
    }
    if (category !== 'all') {
      filtered = filtered.filter(t => t.category === category);
    }
    if (type !== 'all') {
      if (type === 'investment') {
        filtered = filtered.filter(t => t.category === 'Investments');
      } else {
        filtered = filtered.filter(t => t.type === type);
      }
    }
    if (dateFrom) {
      filtered = filtered.filter(t => t.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(t => t.date <= dateTo);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = a.date.localeCompare(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [state.transactions, state.filters]);

  const getSummary = useCallback(() => {
    const totalIncome = state.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = state.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0,
    };
  }, [state.transactions]);

  const getSpendingByCategory = useCallback(() => {
    const expenses = state.transactions.filter(t => t.type === 'expense');
    const categoryMap = {};
    expenses.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    return Object.entries(categoryMap).map(([name, value]) => {
      const cat = categories.find(c => c.name === name);
      return { name, value: parseFloat(value.toFixed(2)), color: cat?.color || '#888', categoryType: 'expense' };
    }).sort((a, b) => b.value - a.value);
  }, [state.transactions]);

  const getMonthlyComparison = useCallback(() => {
    const monthMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    state.transactions.forEach(t => {
      const monthKey = t.date.substring(0, 7);
      if (!monthMap[monthKey]) monthMap[monthKey] = { income: 0, expenses: 0 };
      if (t.type === 'income') monthMap[monthKey].income += t.amount;
      else monthMap[monthKey].expenses += t.amount;
    });
    return Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).map(([key, data]) => {
      const [year, m] = key.split('-');
      const month = `${monthNames[parseInt(m) - 1]} ${year}`;
      return {
        month,
        income: parseFloat(data.income.toFixed(2)),
        expenses: parseFloat(data.expenses.toFixed(2)),
        net: parseFloat((data.income - data.expenses).toFixed(2)),
      };
    });
  }, [state.transactions]);

  const getInsights = useCallback(() => {
    const spending = getSpendingByCategory();
    const monthly = getMonthlyComparison();
    const summary = getSummary();

    const highestCategory = spending[0] || null;
    const totalExpenses = summary.totalExpenses;

    let monthOverMonth = null;
    if (monthly.length >= 2) {
      const current = monthly[monthly.length - 1];
      const previous = monthly[monthly.length - 2];
      const change = current.expenses - previous.expenses;
      const percentChange = previous.expenses > 0 ? (change / previous.expenses * 100).toFixed(1) : 0;
      monthOverMonth = {
        change: parseFloat(change.toFixed(2)),
        percentChange: parseFloat(percentChange),
        direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
      };
    }

    const avgMonthlyExpense = monthly.length > 0
      ? parseFloat((monthly.reduce((s, m) => s + m.expenses, 0) / monthly.length).toFixed(2))
      : 0;

    const incomeCategories = state.transactions.filter(t => t.type === 'income');
    const incomeSource = incomeCategories.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const topIncomeSource = Object.entries(incomeSource).sort(([,a], [,b]) => b - a)[0];

    return {
      highestCategory,
      highestCategoryPercent: highestCategory ? (highestCategory.value / totalExpenses * 100).toFixed(1) : 0,
      monthOverMonth,
      avgMonthlyExpense,
      topIncomeSource: topIncomeSource ? { name: topIncomeSource[0], amount: topIncomeSource[1] } : null,
      totalTransactions: state.transactions.length,
    };
  }, [state.transactions, getSpendingByCategory, getMonthlyComparison, getSummary]);

  const value = {
    ...state,
    categories,
    balanceHistory,
    setFilters,
    resetFilters,
    setRole,
    setActiveTab,
    toggleTheme,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setEditingTransaction,
    setShowAddModal,
    getFilteredTransactions,
    getSummary,
    getSpendingByCategory,
    getMonthlyComparison,
    getInsights,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
