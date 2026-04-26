import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { ArrowDownRight, Wallet, Plus, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, currentBalance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatAmount, currency } = useCurrency();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const fetchData = async () => {
    try {
      const [summaryRes, historyRes] = await Promise.all([
        api.get('/expenses/dashboard'),
        api.get('/expenses/history')
      ]);
      setSummary(summaryRes.data);
      setTransactions(historyRes.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/expenses', formData);
      toast.success('Transaction added successfully');
      setFormData({
        title: '',
        amount: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Process data for Pie Chart
  const expenseDataMap = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

  const pieChartData = Object.keys(expenseDataMap).map(category => ({
    name: category,
    value: expenseDataMap[category]
  })).sort((a, b) => b.value - a.value);

  const [activeSlice, setActiveSlice] = useState(null);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-2">Here's your financial summary at a glance.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none relative overflow-hidden shadow-[0_8px_30px_rgba(5,150,105,0.3)]">
          <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4">
            <Wallet size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <h3 className="text-primary-100 font-medium text-sm tracking-wide uppercase">Current Balance</h3>
            <p className="text-4xl font-bold mt-3 tracking-tight">{formatAmount(summary.currentBalance || 0)}</p>
          </div>
        </div>
        
        <div className="card hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-500 font-medium text-sm tracking-wide uppercase">Total Income</h3>
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <TrendingUp className="text-emerald-500" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">{formatAmount(summary.totalIncome || 0)}</p>
        </div>

        <div className="card hover:border-rose-200 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-500 font-medium text-sm tracking-wide uppercase">Total Expenses</h3>
            <div className="p-3 bg-rose-50 rounded-2xl">
              <ArrowDownRight className="text-rose-500" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">{formatAmount(summary.totalExpense || 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Transaction Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="bg-primary-50 p-2 rounded-xl text-primary-600">
                <Plus size={20} strokeWidth={3} />
              </div>
              Quick Add
            </h2>
            <form onSubmit={handleAddTransaction} className="space-y-5">
              <div>
                <label className="form-label">Type</label>
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100/80 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.type === 'expense' 
                        ? 'bg-white shadow-sm text-slate-800' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.type === 'income' 
                        ? 'bg-white shadow-sm text-slate-800' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Groceries"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Amount ({currency.symbol})</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{currency.symbol}</span>
                    <input
                      type="number"
                      name="amount"
                      required
                      min="0.01"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="form-input pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Category</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="" disabled>Select category</option>
                  {formData.type === 'expense' ? (
                    <>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Health">Health</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Gift">Gift</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={formData.type === 'expense' ? 'btn-danger' : 'btn-primary'}
              >
                {isSubmitting ? 'Adding...' : 'Add Transaction'}
              </button>
            </form>
          </div>
        </div>

        {/* Expense Breakdown Chart */}
        <div className="lg:col-span-2">
          <div className="card h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-primary-50 p-2 rounded-xl text-primary-600">
                <PieChartIcon size={20} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Expense Breakdown</h2>
            </div>
            
            <div className="flex-1 flex items-center justify-center min-h-[300px] relative">
              {activeSlice && (
                <div 
                  className="absolute top-0 right-0 z-10 px-5 py-4 rounded-2xl bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden border border-slate-700/50 pointer-events-none animate-fade-in w-56"
                  style={{
                    boxShadow: `0 10px 40px -10px ${activeSlice.color}40`
                  }}
                >
                  <div 
                    className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20"
                    style={{ backgroundColor: activeSlice.color }}
                  ></div>
                  
                  <div className="relative z-10 flex items-center gap-3 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: activeSlice.color }}
                    ></div>
                    <p className="font-semibold text-slate-200 tracking-wide truncate">{activeSlice.name}</p>
                  </div>
                  
                  <div className="relative z-10 pl-6">
                    <p className="text-white font-bold text-2xl tracking-tight mb-1">
                      {formatAmount(activeSlice.value)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2 py-0.5 rounded-md text-xs font-medium"
                        style={{ backgroundColor: `${activeSlice.color}20`, color: activeSlice.color }}
                      >
                        {((activeSlice.value / summary.totalExpense) * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-slate-400">of expenses</span>
                    </div>
                  </div>
                </div>
              )}

              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      onMouseEnter={(_, index) => setActiveSlice({ ...pieChartData[index], color: COLORS[index % COLORS.length] })}
                      onMouseLeave={() => setActiveSlice(null)}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          className="hover:opacity-80 transition-opacity duration-200 outline-none"
                        />
                      ))}
                    </Pie>
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-slate-600 font-medium ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-slate-500">
                  <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <PieChartIcon size={32} className="text-slate-300" />
                  </div>
                  <p className="text-lg font-semibold text-slate-700">No expense data</p>
                  <p className="text-sm mt-1">Add some expenses to see your breakdown.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
