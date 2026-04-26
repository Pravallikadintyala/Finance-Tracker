import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, AlertCircle, History as HistoryIcon } from 'lucide-react';
import TransactionItem from '../components/TransactionItem';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  
  // Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchHistory = async () => {
    try {
      const response = await api.get('/expenses/history');
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to fetch transaction history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setDeletingId(id);
      try {
        await api.delete(`/expenses/${id}`);
        toast.success('Transaction deleted');
        fetchHistory(); // Refresh data
      } catch {
        toast.error('Failed to delete transaction');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Derive unique categories for filter
  const categories = ['all', ...new Set(transactions.map(t => t.category))];

  // Filter and sort logic
  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort latest first

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm border border-primary-100/50">
          <HistoryIcon size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Transaction History</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage all your past financial activities.</p>
        </div>
      </div>

      <div className="card mb-8 p-6">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="form-input pl-12"
              placeholder="Search by title or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1.5 border border-slate-200">
              <div className="pl-3">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
              <select
                className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 py-2 pr-8 pl-2 outline-none cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1.5 border border-slate-200">
              <select
                className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 py-2 pr-8 pl-4 outline-none cursor-pointer capitalize"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-slate-50/50">
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <TransactionItem 
                key={tx._id} 
                transaction={tx} 
                onDelete={handleDelete}
                isDeleting={deletingId === tx._id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <AlertCircle size={32} className="text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-700">No transactions found</p>
            <p className="text-sm mt-2 text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
