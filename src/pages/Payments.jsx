
import React from 'react';
import TableScrollSlider from '../components/TableScrollSlider';
import { PaymentsIcon } from '../components/AppIcons';

function Payments({ payments }) {
  const totalAmount = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const paidAmount = payments
    .filter((payment) => payment.status === 'Paid')
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const pendingAmount = payments
    .filter((payment) => payment.status === 'Pending')
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const summaryCards = [
    {
      title: 'Total Recorded',
      value: `₹${totalAmount.toLocaleString('en-IN')}`,
      icon: <PaymentsIcon size={20} />,
    },
    {
      title: 'Paid Collections',
      value: `₹${paidAmount.toLocaleString('en-IN')}`,
      icon: <PaymentsIcon size={20} />,
    },
    {
      title: 'Pending Invoices',
      value: `₹${pendingAmount.toLocaleString('en-IN')}`,
      icon: <PaymentsIcon size={20} />,
    },
  ];

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'R';

  return (
    <div className="page-content">
      <div className="page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PaymentsIcon size={22} style={{ color: '#2563EB' }} />
          <h1>Payment Records</h1>
        </div>
      </div>

      <div className="overview-grid">
        {summaryCards.map((card) => (
          <div className="overview-card" key={card.title}>
            <div className="overview-card-top">
              <span className="overview-card-name">{card.title}</span>
              <div className="overview-icon" aria-hidden="true">
                {card.icon}
              </div>
            </div>
            <div className="overview-card-bottom">
              <h2 className="overview-card-count">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Payment History</h2>
          </div>
          <span className="record-count">
            {payments.length} records
          </span>
        </div>

        <TableScrollSlider>
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Resident</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <span className="request-id-badge">{payment.id}</span>
                  </td>
                  <td>
                    <div className="resident-avatar-cell">
                      <div className="resident-avatar-circle">
                        {getInitials(payment.resident)}
                      </div>
                      <strong>{payment.resident}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="spec-badge">{payment.service}</span>
                  </td>
                  <td>
                    <strong className="payment-amount-cell">
                      ₹{Number(payment.amount).toLocaleString('en-IN')}
                    </strong>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${payment.status === 'Paid'
                          ? 'status-completed'
                          : 'status-pending'
                        }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#3B82F6' }}>
                    No payment records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableScrollSlider>
      </section>
    </div>
  );
}

export default Payments;

