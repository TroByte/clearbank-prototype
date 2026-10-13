// =============================================================
// data.js — all the FAKE data for the ClearBank prototype.
// Edit names, amounts and dates here. Nothing talks to a real bank.
//
// Everything is built inside createStartData() so the app can call it
// again at any time to get a brand-new copy (that's how "Reset demo" works):
//
//     let state = createStartData();   // in app.js
// =============================================================

// Returns a Date that is `n` days before today (midday, so time zones don't
// push it onto the wrong day). Using relative dates means the History filters
// ("Last 7 days", "Last 30 days") keep working on whatever day the app is opened.
function daysAgo(n) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

// Same idea, but in the future (used for "next charge" dates).
function daysFromNow(n) {
  return daysAgo(-n);
}

// Fake Confirmation-of-Payee register: who each account number REALLY belongs to.
// The "Check" button on Add new payee looks the account up here.
// Any account number not listed here gives the amber warning ("registered to someone else").
const PAYEE_REGISTER = {
  "12-3456-7890123-00": "S Tipene",   // main scenario: name matches
  "12-9999-0000000-00": "K Morrison", // mismatch demo: triggers the scam warning
};

function createStartData() {
  return {
    accounts: [
      { id: "everyday", name: "Everyday", balance: 2480.15 },
      { id: "savings",  name: "Savings",  balance: 6120.00 },
    ],

    // Categories shown in dropdowns and filters. New ones can be added by the user.
    categories: ["Bills", "Food", "Transport", "Shopping", "Subscriptions", "Uncategorised"],

    // Spending this month for the Dashboard bar chart.
    // Subscriptions is NOT listed here on purpose: work it out from the
    // active subscriptions below so the chart always matches the Subscriptions screen.
    spendingThisMonth: [
      { category: "Bills",     amount: 420.00 },
      { category: "Food",      amount: 310.00 },
      { category: "Transport", amount: 95.00 },
      { category: "Shopping",  amount: 160.00 },
    ],

    // Saved payees. verified = their name was already checked against the account,
    // so the read-back shows "Name confirmed".
    payees: [
      { id: "mum",      nickname: "Mum",      name: "A Olsen",           account: "12-3100-0456789-00", verified: true },
      { id: "landlord", nickname: "Landlord", name: "Harcourts Rentals", account: "02-0500-0987654-00", verified: true },
    ],

    // Transactions. amount is money OUT of the Everyday account (positive number).
    // "Pita Pit Hamilton" appears twice as Uncategorised for the auto-assign demo.
    // The Spark bill is older than 30 days to show the date filter working.
    transactions: [
      { id: "t1",  merchant: "Countdown",            amount: 54.20,  category: "Food",          date: daysAgo(1) },
      { id: "t2",  merchant: "AT HOP top-up",        amount: 20.00,  category: "Transport",     date: daysAgo(2) },
      { id: "t3",  merchant: "Kmart",                amount: 37.50,  category: "Shopping",      date: daysAgo(3) },
      { id: "t4",  merchant: "Pita Pit Hamilton",    amount: 14.50,  category: "Uncategorised", date: daysAgo(4) },
      { id: "t5",  merchant: "Mercury Energy",       amount: 132.40, category: "Bills",         date: daysAgo(5) },
      { id: "t6",  merchant: "Spotify",              amount: 18.99,  category: "Subscriptions", date: daysAgo(7) },
      { id: "t7",  merchant: "Hillcrest Dairy",      amount: 6.80,   category: "Uncategorised", date: daysAgo(9) },
      { id: "t8",  merchant: "Z Energy",             amount: 65.00,  category: "Transport",     date: daysAgo(12) },
      { id: "t9",  merchant: "Netflix",              amount: 20.99,  category: "Subscriptions", date: daysAgo(14) },
      { id: "t10", merchant: "Pita Pit Hamilton",    amount: 13.90,  category: "Uncategorised", date: daysAgo(18) },
      { id: "t11", merchant: "Warehouse Stationery", amount: 23.90,  category: "Uncategorised", date: daysAgo(20) },
      { id: "t12", merchant: "Spark",                amount: 75.00,  category: "Bills",         date: daysAgo(35) },
    ],

    // Subscriptions. Only Spotify has previousPrice / priceChangedOn (it's the price-up example).
    // Any subscription given a previousPrice gets the notification and "Price up" tag automatically.
    // "Stop this subscription" adds stopped: true, which removes it from the totals.
    subscriptions: [
      { id: "spotify", name: "Spotify",  price: 18.99, previousPrice: 16.99, priceChangedOn: daysAgo(7), nextCharge: daysFromNow(23) },
      { id: "netflix", name: "Netflix",  price: 20.99, nextCharge: daysFromNow(16) },
      { id: "neon",    name: "Neon",     price: 15.99, nextCharge: daysFromNow(9) },
      { id: "gym",     name: "Gym",      price: 12.00, nextCharge: daysFromNow(4) },
      { id: "icloud",  name: "iCloud",   price: 4.99,  nextCharge: daysFromNow(12) },
      { id: "xbox",    name: "Xbox Game Pass", price: 1.99, nextCharge: daysFromNow(18) },
    ],

    // Is the Spotify notification still unread? (controls the red dot on the bell)
    notificationUnread: true,
  };
}
