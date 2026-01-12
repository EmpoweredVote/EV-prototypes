import { Receipt, Building2, Calendar, CreditCard } from 'lucide-react';
import type { LinkedTransactionSummary } from '../types/budget';
import './LinkedTransactionsPanel.css';

interface LinkedTransactionsPanelProps {
  linkedTransactions: LinkedTransactionSummary;
  categoryName: string;
  onViewAll?: () => void;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export default function LinkedTransactionsPanel({
  linkedTransactions,
  categoryName,
  onViewAll
}: LinkedTransactionsPanelProps) {
  const { totalAmount, transactionCount, vendorCount, topVendors, transactions } = linkedTransactions;

  // Show top 5 transactions
  const displayTransactions = transactions.slice(0, 5);
  const hasMore = transactions.length > 5;

  return (
    <div className="linked-transactions-panel">
      <div className="linked-transactions-header">
        <div className="linked-transactions-icon">
          <Receipt size={20} />
        </div>
        <div>
          <h3>Related Transactions</h3>
          <p className="linked-transactions-subtitle">
            {transactionCount.toLocaleString()} transaction{transactionCount !== 1 ? 's' : ''} linked to {categoryName}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="linked-transactions-stats">
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(totalAmount)}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{transactionCount.toLocaleString()}</div>
          <div className="stat-label">Transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{vendorCount}</div>
          <div className="stat-label">Vendors</div>
        </div>
      </div>

      {/* Top Vendors */}
      {topVendors && topVendors.length > 0 && (
        <div className="linked-transactions-vendors">
          <h4>Top Vendors</h4>
          <div className="vendor-list">
            {topVendors.map((vendor, index) => (
              <div key={index} className="vendor-item">
                <div className="vendor-icon">
                  <Building2 size={16} />
                </div>
                <div className="vendor-info">
                  <span className="vendor-name">{vendor.name}</span>
                  <span className="vendor-stats">
                    {formatCurrency(vendor.amount)} ({vendor.count} transaction{vendor.count !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="linked-transactions-list">
        <h4>Recent Transactions</h4>
        <div className="transaction-list">
          {displayTransactions.map((tx, index) => (
            <div key={index} className="transaction-item">
              <div className="transaction-main">
                <div className="transaction-description">{tx.description}</div>
                <div className="transaction-amount">{formatCurrency(tx.amount)}</div>
              </div>
              <div className="transaction-meta">
                <span className="transaction-vendor">
                  <Building2 size={12} />
                  {tx.vendor}
                </span>
                {tx.date && (
                  <span className="transaction-date">
                    <Calendar size={12} />
                    {formatDate(tx.date)}
                  </span>
                )}
                {tx.paymentMethod && (
                  <span className="transaction-payment">
                    <CreditCard size={12} />
                    {tx.paymentMethod}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {hasMore && onViewAll && (
          <button className="view-all-button" onClick={onViewAll}>
            View all {transactionCount.toLocaleString()} transactions
          </button>
        )}
      </div>
    </div>
  );
}
