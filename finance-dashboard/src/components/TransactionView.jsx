import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionFilters from './TransactionFilters';
import { ChevronLeft, ChevronRight, Trash2, Edit3, ChevronDown, ChevronUp, Briefcase, Laptop, TrendingUp as Invest, Utensils, Car, ShoppingBag, Zap, Film, HeartPulse, Home, DollarSign } from 'lucide-react';

const categoryIcons = {
  'Salary': Briefcase,
  'Freelance': Laptop,
  'Investments': Invest,
  'Food & Dining': Utensils,
  'Transportation': Car,
  'Shopping': ShoppingBag,
  'Utilities': Zap,
  'Entertainment': Film,
  'Healthcare': HeartPulse,
  'Rent': Home,
};

function getCategoryIcon(category) {
  return categoryIcons[category] || DollarSign;
}

function getContextLabel(tx) {
  const categoryNotes = {
    'Salary': 'Regular income',
    'Freelance': 'Side work',
    'Investments': 'Passive income',
    'Food & Dining': 'Groceries / Dining out',
    'Transportation': 'Travel / Commute',
    'Shopping': 'Retail purchase',
    'Utilities': 'Bills',
    'Entertainment': 'Leisure',
    'Healthcare': 'Medical',
    'Rent': 'Housing',
  };
  return categoryNotes[tx.category] || tx.category;
}

function HighlightText({ text, highlight }) {
  if (!highlight || !highlight.trim()) return text;
  
  const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  
  return parts.map((part, i) => 
    part.toLowerCase() === highlight.toLowerCase() 
      ? <mark key={i} className="search-highlight">{part}</mark> 
      : part
  );
}

export default function TransactionView() {
  const { getFilteredTransactions, filters } = useFinance();
  const allTransactions = getFilteredTransactions();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters.type, filters.search]);

  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
  
  const filteredIncome = allTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const filteredExpenses = allTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="transactions-view">
      <TransactionFilters />
      
      {allTransactions.length > 0 ? (
        <TransactionListWithPagination 
          allTransactions={allTransactions}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={allTransactions.length}
        />
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No transactions found</h3>
          <p>Try adjusting your filters or add a new transaction.</p>
        </div>
      )}
    </div>
  );
}

function TransactionListWithPagination({ allTransactions, currentPage, totalPages, setCurrentPage, itemsPerPage, totalItems }) {
  const { deleteTransaction, setEditingTransaction, role, categories, filters } = useFinance();
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const paginatedTransactions = allTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDelete = (id) => {
    if (deleteId === id) {
      deleteTransaction(id);
      setDeleteId(null);
    } else {
      setDeleteId(id);
      setTimeout(() => setDeleteId(null), 3000);
    }
  };

  return (
    <>
      <div className="transaction-list">
        <div className="transaction-list-header">
          <span className="th-date">Date</span>
          <span className="th-desc">Description</span>
          <span className="th-category">Category</span>
          <span className="th-amount">Amount</span>
          <span className="th-actions">Actions</span>
        </div>
        <div className="transaction-list-body">
          {paginatedTransactions.map((tx) => {
            const cat = categories.find(c => c.name === tx.category);
            const isExpanded = expandedId === tx.id;
            const IconComponent = getCategoryIcon(tx.category);
            
            return (
              <div
                key={tx.id}
                className={`transaction-row ${tx.type} ${isExpanded ? 'expanded' : ''}`}
                onClick={() => setExpandedId(isExpanded ? null : tx.id)}
              >
                <div className="transaction-row-main">
                  <span className="td-date">
                    <span className="date-day">{new Date(tx.date + 'T00:00:00').getDate()}</span>
                    <span className="date-month">{new Date(tx.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                  </span>
                  <span className="td-desc">
                    <span className="desc-main">
                      <HighlightText text={tx.description} highlight={filters.search} />
                    </span>
                    <span className="desc-note">{getContextLabel(tx)}</span>
                  </span>
                  <span className="td-category">
                    <span className="category-badge" style={{ backgroundColor: `${cat?.color}20`, color: cat?.color }}>
                      <span className="badge-dot" style={{ backgroundColor: cat?.color }} />
                      <HighlightText text={tx.category} highlight={filters.search} />
                    </span>
                  </span>
                  <span className={`td-amount ${tx.type}`}>
                    <span className="amount-value">
                      <span className="amount-sign">{tx.type === 'income' ? '+' : '-'}</span>
                      {formatCurrency(tx.amount)}
                    </span>
                  </span>
                  <span className="td-actions" onClick={(e) => e.stopPropagation()}>
                    {role === 'admin' && (
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => setEditingTransaction(tx)} title="Edit">
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className={`action-btn delete ${deleteId === tx.id ? 'confirm' : ''}`} 
                          onClick={() => handleDelete(tx.id)}
                          title={deleteId === tx.id ? 'Click again to confirm' : 'Delete'}
                        >
                          <Trash2 size={14} />
                          {deleteId === tx.id && <span className="confirm-text">?</span>}
                        </button>
                      </div>
                    )}
                  </span>
                </div>
                {isExpanded && (
                  <div className="transaction-row-details">
                    <div><span className="detail-label">Type</span> <span className={`type-badge ${tx.type}`}>{tx.type}</span></div>
                    <div><span className="detail-label">Category</span> {tx.category}</div>
                    <div><span className="detail-label">Date</span> {formatDate(tx.date)}</div>
                    <div><span className="detail-label">Amount</span> <span className="detail-amount">{formatCurrency(tx.amount)}</span></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="pagination-footer">
          <span className="pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </span>
          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-page">{currentPage} / {totalPages}</span>
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}