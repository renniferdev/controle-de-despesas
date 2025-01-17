const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const LocalStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? LocalStorageTransactions : [];

const removeTransaction = (ID) => {
  transactions = transactions.filter((transaction) => transaction.id !== ID);
  updateLocalStorage();
  init();
};

const addTransactionIntoDOM = (transaction) => {
  const operator = transaction.amount < 0 ? "-" : "+"; //- vdd + false
  const CSSClass = transaction.amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `
    ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
    x
    </button>
  `;

  transactionsUl.append(li);
};
const getExpense = (transactionsAmounts) =>
  Math.abs(
    transactionsAmounts
      .filter((value) => value < 0)
      .reduce((accumulator, transaction) => accumulator + transaction, 0)
  ).toFixed(2);

const getIncome = (transactionsAmounts) =>
  transactionsAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

const getTotal = (transactionsAmounts) =>
  transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

const convertNumberToReal = (number) => {
  console.log(
    number
      .toFixed(0)
      .split(".")[0]
      .split(/(?=(?:...)*$)/)
      .join(".")
  );
  let newNumber = `${number
    .toFixed(0)
    .split(".")[0]
    .split(/(?=(?:...)*$)/)
    .join(".")},${number.toFixed(2).split(".")[1]}`;
  console.log(newNumber);
  return newNumber;
};

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount);

  const total = convertNumberToReal(Number(getTotal(transactionsAmounts)));
  const income = convertNumberToReal(Number(getIncome(transactionsAmounts)));
  const expense = convertNumberToReal(Number(getExpense(transactionsAmounts)));

  incomeDisplay.innerText = `R$ ${income}`;
  expenseDisplay.innerText = `- R$ ${expense}`;
  balanceDisplay.innerText = `R$ ${total}`;
};
const init = () => {
  transactionsUl.innerHTML = "";
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};
init();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
};

const handleFormSubmit = (event) => {
  event.preventDefault(); //impede o form seja enviado e pag seja recarregada

  //valores inseridos no input
  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === "" || transactionAmount === "";

  if (isSomeInputEmpty) {
    alert("Por favor, preencha tanto o nome quanto o valor da transação");
    return;
  }

  addToTransactionsArray(transactionName, transactionAmount);
  init();
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
  updateLocalStorage();
  cleanInputs;
};

form.addEventListener("submit", handleFormSubmit);
