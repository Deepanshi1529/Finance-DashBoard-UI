import { useFinance } from '../context/FinanceContext';
import { Search, X, ChevronDown } from 'lucide-react';

const typeFilters = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expenses' },
];

const sortOptions = [
  { value: 'date-desc', label: 'Date: Newest first' },
  { value: 'date-asc', label: 'Date: Oldest first' },
  { value: 'amount-desc', label: 'Amount: High to low' },
  { value: 'amount-asc', label: 'Amount: Low to high' },
];

export default function TransactionFilters() {
  const { filters, setFilters } = useFinance();

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    setFilters({ sortBy, sortOrder });
  };

  const currentSortValue = `${filters.sortBy}-${filters.sortOrder}`;

  return (
    <div className="filter-row">
      <div className="search-input-wrapper">
        <Search size={16} className="search-input-icon" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="filter-search-input"
        />
        {filters.search && (
          <button className="filter-clear-btn" onClick={() => setFilters({ search: '' })}>
            <X size={14} />
          </button>
        )}
      </div>

      <div className="filter-chips">
        {typeFilters.map(f => (
          <button
            key={f.value}
            className={`filter-chip ${filters.type === f.value ? 'active' : ''}`}
            onClick={() => setFilters({ type: f.value })}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="sort-dropdown-wrapper">
        <select 
          className="sort-dropdown" 
          value={currentSortValue}
          onChange={handleSortChange}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="sort-dropdown-icon" />
      </div>
    </div>
  );
}