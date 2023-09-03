'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-GB', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

('use strict');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const wrong = document.querySelector('.wrong');

function formatDate(date) {
  const calcDays = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDays(new Date(), date);
  console.log(daysPassed);
}

//formatter Function
function formate(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //creat dates
    const date = new Date(acc.movementsDates[i]);
    const displayDate = dt(date, acc.locale);

    //days passed
    formatDate(date, acc.locale);

    const formattedMov = formate(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}
//displayMovements(account1.movements);

//Balance Function
function calcBalance(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formattedMov = formate(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = `${formattedMov}`;
}
//calcBalance(account1.movements);

function calcSummary(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formate(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formate(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(mov => mov >= 1) // here we used map not like above because we need to calc a new calculation for each number in the array and put it in new arr
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formate(interest, acc.locale, acc.currency);
  //if bank need interest on number bigger than 1 so we will add filter after the map
}
//calcSummary(account1.movements);

//Computing UserNAmes
function computingUser(accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}
computingUser(accounts);
console.log(accounts);

//UI
function updateUI(acc) {
  //Display Movements
  displayMovements(acc);
  //Display Balance
  calcBalance(acc);
  //Display Summary
  calcSummary(acc);
}

//Timer Function
function startLogOut() {
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //print remaining time
    labelTimer.textContent = `${min}:${sec}`;

    //when 0 stop Timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    //Decrease Time by 1 sec
    time--;
  }
  //set time to 5 minutes
  let time = 300;

  //call timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

//Fake LoggedIn
/*currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;
let aa;*/

//function date
function dt(noww, locale, optionss) {
  const year = noww.getFullYear();
  const day = `${noww.getDate()}`.padStart(2, 0);
  const month = `${noww.getMonth() + 1}`.padStart(2, 0);
  const hours = `${noww.getHours()}`.padStart(2, 0);
  const minutes = `${noww.getMinutes()}`.padStart(2, 0);
  //return `${day}/${month}/${year}, ${hours}:${minutes}`;
  return new Intl.DateTimeFormat(locale).format(noww);
}

//Even Handlers For Login
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  //prevent page from reload
  e.preventDefault();

  //we need to know the acc who loged in like we want to take it so we used find
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  ); //inputLoginUsername.value it always return a string

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI AND Message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`; //we do this split(' ')[0] not this split(' ') alone because we need to take the first word only

    containerApp.style.opacity = 100;

    //Create Current Date
    //labelDate.textContent = dt(now);
    //Experimenting API
    const now = new Date();

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    const locale = navigator.language;
    console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    wrong.style.opacity = 0;

    //Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //lose the focus from pin input field
    inputLoginPin.blur();

    /*//Display Movements
    displayMovements(currentAccount.movements);
    //Display Balance
    calcBalance(currentAccount);
    //Display Summary
    calcSummary(currentAccount);*/

    //timer
    if (timer) clearInterval(timer);
    timer = startLogOut();

    updateUI(currentAccount);
  } else {
    containerApp.style.opacity = 0;
    wrong.style.opacity = 100;
    wrong.textContent = 'Wrong Informations, Try Again';
  }
});

//Event Handlers For Tranfering
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.userName !== currentAccount.userName
  ) {
    //Doing Transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    //Add Transfer Date
    currentAccount.movementsDates.push(new Date());
    recieverAcc.movementsDates.push(new Date());

    //UpdateUI
    updateUI(currentAccount);

    //Reset Timer
    clearInterval(timer);
    timer = startLogOut();
  }
});

//Event Handlers For Loan
//خلي بالك القرض مش هيتم الا بشرط معين وهو تشوف ايه اكبر رقم موجود عندك في الارراي وتضربه في عشرة لو اكبر رقم عندك 100 يبقي اخرك تاخد 1000
//او بمعني اصح لازم تتأكد ان علي الاقل اكبر رقم عندك في الارراي يبقي اكبر من او يساوي قيمة القرض مضروبة في 0.1

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(amount);

      //Add Loan Date
      currentAccount.movementsDates.push(new Date());

      //UpdateUI
      updateUI(currentAccount);
      //Reset Timer
      clearInterval(timer);
      timer = startLogOut();
    }, 2500);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//Event Handlers For sort

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//Event Handlers For closing acc

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    //Delete acc
    accounts.splice(index, 1);

    //Delete UI
    containerApp.style.opacity = 0;

    //Delete WElcome Message
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'silver';
  });
});

//create Date

//console.log(now);
//console.log(new Date(account1.movementsDates[0]));

const a = 236985;

console.log(
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    a
  )
);

/*setInterval(function () {
  const noww = new Date();
  const hours = noww.getHours();
  const minutes = noww.getMinutes();
  const seconds = noww.getSeconds();
  console.log(`${hours}:${minutes}:${seconds}`);
}, 1000);*/
