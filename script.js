// ========== อัตราแลกเปลี่ยนเงินตรา (ฐานมูลค่า THB = 1) ==========
const rates = {
  THB: 1,
  USD: 35.50,
  EUR: 38.40,
  GBP: 45.20,
  JPY: 0.24,
  CNY: 4.90,
  KRW: 0.026,
};

// ========== ดึงสมาชิก DOM เพื่อใช้งาน ==========
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

// ========== อาร์เรย์เก็บประวัติการแลกเปลี่ยน ==========
const history = [];

// ========== ฟังก์ชันแปลงสกุลเงิน ==========
function convert(amount, from, to) {
  const a = parseFloat(amount);
  if (amount === '' || isNaN(a)) return NaN;
  return (a * rates[from]) / rates[to];
}

// ========== ฟังก์ชันจัดรูปแบบตัวเลขสำหรับช่องกรอก ==========
function formatInput(n) {
  if (!isFinite(n)) return '';
  if (n !== 0 && Math.abs(n) < 0.01) return n.toFixed(6);
  return (Math.round(n * 100) / 100).toFixed(2);
}

// ========== ฟังก์ชันจัดรูปแบบตัวเลขสำหรับการแสดงผล ==========
function formatDisplay(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// ========== ฟังก์ชันจัดรูปแบบอัตราแลกเปลี่ยน ==========
function formatRate(n) {
  if (!isFinite(n)) return '-';
  if (n >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return n.toLocaleString('en-US', { maximumFractionDigits: 5 });
}

// ========== ฟังก์ชันอัปเดตข้อความแสดงอัตราแลกเปลี่ยน ==========
function updateRateText() {
  const one = currencyOne.value;
  const two = currencyTwo.value;
  const rate = convert(1, one, two);
  rateText.innerHTML = `1 ${one} = <span class="badge rounded-pill text-bg-success ms-1">${formatRate(rate)} ${two}</span>`;
}

// ========== ฟังก์ชันคำนวณและอัปเดตจำนวนเงิน ==========
function recalculate(source) {
  if (source === 'one') {
    amountTwo.value = formatInput(convert(amountOne.value, currencyOne.value, currencyTwo.value));
  } else {
    amountOne.value = formatInput(convert(amountTwo.value, currencyTwo.value, currencyOne.value));
  }
}

// ========== Event Listeners สำหรับช่องกรอกจำนวนเงิน ==========
amountOne.addEventListener('input', () => {
  updateRateText();
  recalculate('one');
});

amountTwo.addEventListener('input', () => {
  updateRateText();
  recalculate('two');
});

// ========== Event Listeners สำหรับเปลี่ยนสกุลเงิน ==========
currencyOne.addEventListener('change', () => {
  updateRateText();
  recalculate('one');
});

currencyTwo.addEventListener('change', () => {
  updateRateText();
  recalculate('two');
});

// ========== ฟังก์ชันสลับสกุลเงินและจำนวนเงิน ==========
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

// ========== Event Listeners สำหรับกด Enter ในช่องกรอก ==========
amountOne.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnConvert.click();
});

amountTwo.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnConvert.click();
});

// ========== ฟังก์ชันเพิ่มประวัติการแลกเปลี่ยน ==========
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

// ========== ฟังก์ชันแสดงผลประวัติการแลกเปลี่ยน ==========
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

// ========== Event Listener สำหรับปุ่มแลกเปลี่ยน ==========
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

// ========== Event Listener สำหรับปุ่มล้างข้อมูล ==========
btnClear.addEventListener('click', () => {
  amountOne.value = '';
  amountTwo.value = '';
  currencyOne.value = 'THB';
  currencyTwo.value = 'USD';
  rateText.innerHTML = '1 THB = <span class="badge rounded-pill text-bg-success ms-1">0.02817 USD</span>';
  updateUpdatedTime();
});

// ========== Event Listener สำหรับปุ่มล้างประวัติ ==========
btnHistoryClear.addEventListener('click', () => {
  history.length = 0;
  renderHistory();
});

// ========== ฟังก์ชันอัปเดตเวลาล่าสุด ==========
function updateUpdatedTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  updatedText.textContent = `อัปเดตล่าสุด: ${dateStr} ${timeStr} น.`;
}

// ========== เรียกใช้ฟังก์ชันเริ่มต้น ==========
updateRateText();
updateUpdatedTime();
renderHistory();
