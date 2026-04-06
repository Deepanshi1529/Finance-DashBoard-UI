import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';

export default function TransactionModal() {
  const { categories, addTransaction, updateTransaction, editingTransaction, setEditingTransaction, setShowAddModal } = useFinance();

  const isEditing = !!editingTransaction;

  const getInitialForm = () => {
    if (editingTransaction) {
      return {
        date: editingTransaction.date,
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        type: editingTransaction.type,
      };
    }
    return {
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      category: categories[0].name,
      type: 'expense',
    };
  };

  const [form, setForm] = useState(getInitialForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tx = {
      ...form,
      amount: parseFloat(form.amount),
    };
    if (isEditing) {
      updateTransaction({ ...editingTransaction, ...tx });
    } else {
      addTransaction(tx);
    }
    handleClose();
  };

  const handleClose = () => {
    setEditingTransaction(null);
    setShowAddModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={form.type} onChange={handleChange} className="form-input">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" name="date" value={form.date} onChange={handleChange} className="form-input" required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input id="description" type="text" name="description" value={form.description} onChange={handleChange} className="form-input" placeholder="Enter description" required />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input id="amount" type="number" name="amount" value={form.amount} onChange={handleChange} className="form-input" placeholder="0.00" min="0.01" step="0.01" required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange} className="form-input">
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Add'} Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
}
