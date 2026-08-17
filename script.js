const rates = {
  THB: 1,
  USD: 35.50,
  EUR: 38.40,
  GBP: 45.20,
  JPY: 0.24,
  CNY: 4.90,
  KRW: 0.026,
};

const amountOne = document.getElementById('amount-one');
const amountTwo = document.getElementById('amount-two');
const currencyOne = document.getElementById('currency-one');
const currencyTwo = document.getElementById('currency-two');
const rateText = document.getElementById('rate-text');
const updatedText = document.getElementById('updated-text');
const btnConvert = document.getElementById('btn-convert');
const btnClear = document.getElementById('btn-clear');
const btnHistoryClear = document.getElementById('btn-history-clear');
const btnSwap = document.getElementById('btn-swap');
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');

const history = [];

function convert(amount, from, to) {
  const a = parseFloat(amount);
  if (amount === '' || isNaN(a)) return NaN;
  return (a * rates[from]) / rates[to];
}

function formatInput(n) {
  if (!isFinite(n)) return '';
  if (n !== 0 && Math.abs(n) < 0.01) return n.toFixed(6);
  return (Math.round(n * 100) / 100).toFixed(2);
}

function formatDisplay(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatRate(n) {
  if (!isFinite(n)) return '-';
  if (n >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return n.toLocaleString('en-US', { maximumFractionDigits: 5 });
}

function updateRateText() {
  const one = currencyOne.value;
  const two = currencyTwo.value;
  const rate = convert(1, one, two);
  rateText.innerHTML = `1 ${one} = <span class="badge rounded-pill text-bg-success ms-1">${formatRate(rate)} ${two}</span>`;
}

function recalculate(source) {
  if (source === 'one') {
    amountTwo.value = formatInput(convert(amountOne.value, currencyOne.value, currencyTwo.value));
  } else {
    amountOne.value = formatInput(convert(amountTwo.value, currencyTwo.value, currencyOne.value));
  }
}

amountOne.addEventListener('input', () => {
  updateRateText();
  recalculate('one');
});

amountTwo.addEventListener('input', () => {
  updateRateText();
  recalculate('two');
});

currencyOne.addEventListener('change', () => {
  updateRateText();
  recalculate('one');
});

currencyTwo.addEventListener('change', () => {
  updateRateText();
  recalculate('two');
});

btnSwap.addEventListener('click', () => {
  const tmpCur = currencyOne.value;
  currencyOne.value = currencyTwo.value;
  currencyTwo.value = tmpCur;

  const tmpAmt = amountOne.value;
  amountOne.value = amountTwo.value;
  amountTwo.value = tmpAmt;

  updateRateText();
  recalculate('one');
});

amountOne.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnConvert.click();
});

amountTwo.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnConvert.click();
});

function addHistory(fromAmount, fromCur, toAmount, toCur) {
  history.unshift({
    from: formatDisplay(fromAmount),
    fromCur: fromCur,
    to: formatDisplay(toAmount),
    toCur: toCur,
  });
  if (history.length > 10) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyEmpty.style.display = 'block';
    return;
  }
  historyEmpty.style.display = 'none';
  history.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'list-group-item history-item d-flex justify-content-between align-items-center py-3 px-3';
    li.innerHTML = `<span>${item.from} ${item.fromCur}</span>` +
                   `<span class="text-primary fw-bold">→</span>` +
                   `<span class="fw-semibold">${item.to} ${item.toCur}</span>`;
    historyList.appendChild(li);
  });
}

btnConvert.addEventListener('click', () => {
  const fromAmount = parseFloat(amountOne.value);
  if (isNaN(fromAmount) || fromAmount <= 0) {
    alert('กรุณากรอกจำนวนเงินที่ช่องต้นทาง (amount-one)');
    return;
  }
  const fromCur = currencyOne.value;
  const toCur = currencyTwo.value;
  const result = convert(fromAmount, fromCur, toCur);
  amountTwo.value = formatInput(result);
  addHistory(fromAmount, fromCur, result, toCur);
  updateUpdatedTime();
});

btnClear.addEventListener('click', () => {
  amountOne.value = '';
  amountTwo.value = '';
  currencyOne.value = 'THB';
  currencyTwo.value = 'USD';
  rateText.innerHTML = '1 THB = <span class="badge rounded-pill text-bg-success ms-1">0.02817 USD</span>';
  updateUpdatedTime();
});

btnHistoryClear.addEventListener('click', () => {
  history.length = 0;
  renderHistory();
});

function updateUpdatedTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  updatedText.textContent = `อัปเดตล่าสุด: ${dateStr} ${timeStr} น.`;
}

updateRateText();
updateUpdatedTime();
renderHistory();
