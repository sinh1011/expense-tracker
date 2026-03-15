// Expense Tracker - script.js

const form = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN');
}

function saveToStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateSummary() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  totalIncomeEl.textContent = formatCurrency(income);
  totalExpenseEl.textContent = formatCurrency(expense);
  balanceEl.textContent = formatCurrency(balance);

  balanceEl.style.color = balance >= 0 ? '#2ecc71' : '#e74c3c';
}

function renderTransactions() {
  if (transactions.length === 0) {
    transactionList.innerHTML = '<li class="empty-state">Chưa có giao dịch nào.</li>';
    return;
  }

  transactionList.innerHTML = transactions
    .slice()
    .reverse()
    .map(t => `
      <li class="transaction-item ${t.type}">
        <div>
          <div class="desc">${t.desc}</div>
          <div class="date">${formatDate(t.date)}</div>
        </div>
        <div style="display:flex;align-items:center;">
          <span class="amount">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</span>
          <button class="btn-delete" onclick="deleteTransaction('${t.id}')" title="Xóa">&times;</button>
        </div>
      </li>
    `)
    .join('');
}

function addTransaction(e) {
  e.preventDefault();

  const desc = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];

  if (!desc || isNaN(amount) || amount <= 0) {
    alert('Vui lòng nhập đầy đủ thông tin hợp lệ!');
    return;
  }

  const transaction = {
    id: Date.now().toString(),
    desc,
    amount,
    type,
    date
  };

  transactions.push(transaction);
  saveToStorage();
  renderTransactions();
  updateSummary();
  form.reset();
}

function deleteTransaction(id) {
  if (confirm('Bạn có chắc muốn xóa giao dịch này?')) {
    transactions = transactions.filter(t => t.id !== id);
    saveToStorage();
    renderTransactions();
    updateSummary();
  }
}

function clearAllTransactions() {
  if (confirm('Xóa tất cả giao dịch?')) {
    transactions = [];
    saveToStorage();
    renderTransactions();
    updateSummary();
  }
}

form.addEventListener('submit', addTransaction);

// Init
renderTransactions();
updateSummary();
