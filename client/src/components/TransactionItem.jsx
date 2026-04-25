import { Trash2, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from './Navbar';
import { useCurrency } from '../context/CurrencyContext';

const TransactionItem = ({ transaction, onDelete, isDeleting }) => {
  const { formatAmount } = useCurrency();
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-3.5 rounded-xl flex items-center justify-center transition-colors duration-300",
          isIncome ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100" : "bg-rose-50 text-rose-600 group-hover:bg-rose-100"
        )}>
          {isIncome ? <ArrowUpRight size={22} strokeWidth={2.5} /> : <ArrowDownRight size={22} strokeWidth={2.5} />}
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 capitalize text-base">{transaction.title}</h4>
          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
            <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md">
              <Tag size={12} />
              {transaction.category}
            </span>
            <span className="text-slate-300">•</span>
            <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className={cn(
            "font-bold text-lg tracking-tight",
            isIncome ? "text-emerald-600" : "text-slate-800"
          )}>
            {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
          </p>
        </div>
        <button
          onClick={() => onDelete(transaction._id)}
          disabled={isDeleting}
          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
          title="Delete transaction"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
