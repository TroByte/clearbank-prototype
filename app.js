// =============================================================
// app.js — all the behaviour for ClearBank.
// data.js is loaded first, so createStartData(), daysAgo() and
// PAYEE_REGISTER are already available here.
// =============================================================

// All the app's changing data lives in `state`.
// Reset demo = state = createStartData(); then re-render.
let state = createStartData();

/**
 * The app's current screen is stored here.
 */
let currentScreen = "screen-dashboard";
let history = [];

/**
 * timer for popup screens
 */
setTimeout(function() {
  openPopup("popup-notification");
}, 1000);


// ----- Helpers (ready to use) -----

// formatMoney(2480.15) -> "$2,480.15"
function formatMoney(amount) {
  return amount.toLocaleString("en-NZ", { style: "currency", currency: "NZD" });
}

// formatDate(someDate) -> "21 Sep"
function formatDate(date) {
  return date.toLocaleDateString("en-NZ", { day: "numeric", month: "short" });
}


// ----- Your code goes below. Work through the build order in the brief. -----

// =========================== Step 1: screen switching =========================
// TODO: showScreen(id)  - unhide one .screen, hide the rest, highlight the matching nav tab
  /**
   * Search for document.querySelectorAll(",screen").length in browser console to see how many screens you have to switch between.
   * Need to create a foreach loop for each node.js screen.
   * let screen using console to test pages are hidden. Correctly shows the right screens hidden.
   * let navBtn using console to test nav-btns are active. Correctly shows the right nav-btns active.
   * let btn shows the highlighted button after clicked.
   * add event listener for settings, no loop needed as only one button.
   * fix the bug where settings btn element is not highlighted when clicked. Added if statement to check if activeTab exists before adding the active class.
   * isBack parameter added to showScreen function to handle back button functionality.
   * currentScreen variable updated to the new screen id after showScreen is called.
   * @param {*} id 
   */
  function showScreen(id, isBack = false) {

    if (!isBack) {
      history.push(currentScreen);
    }   

    for (let screen of document.querySelectorAll(".screen")) { // let instead of var avoids hoisting issues.
      // hide all screens
      screen.hidden = true;
    }
    // unhide the one with the matching id
    document.getElementById(id).hidden = false; 
    
    for (let navBtn of document.querySelectorAll(".nav-btn")) {
      // remove the .active class from all nav buttons
      navBtn.classList.remove("active");
    }

    // add the .active class to the nav button that matches the id
    let activeTab = document.querySelector(`.nav-btn[data-screen="${id}"]`);
    if (activeTab) {
      activeTab.classList.add("active");
    } 

    currentScreen = id; // update the currentScreen variable to the new screen id
  }

  // TODO: click handlers for the .nav-btn buttons
 for (let btn of document.querySelectorAll(".nav-btn")) {
      // add a click event listener to each nav button
      btn.addEventListener("click", function() {
        showScreen(btn.dataset.screen); // call showScreen() with the data-screen value of the clicked button
      });
    }


// TODO: goBack()        - use a history array to return to the previous screen
/**
 * check IF history array is empty, if not, use .pop() to remove the last screen from the history array and return to it.
 * @returns previous Screen end of the array
 */
function goBack() {
  if (history.length === 0) {
    return; // no previous screen to go back to
  }

  let previousScreen = history.pop(); // get the last screen from history
  showScreen(previousScreen, true); // show the previous screen and indicate it's a back navigation
}
  


// Step 2: dashboard
// TODO: renderDashboard() - balances, spending chart, 5 newest transactions
/**
 * renders the dashboard by mapping over the accounts 
 * in the state and creating HTML for each account's name and balance. 
 * The resulting HTML is then inserted into the "balances-card" element in the DOM.
 */
function renderDashboard() {
  let html = state.accounts.map(function (acc) {
    return `<p>${acc.name}: ${formatMoney(acc.balance)}</p>`;
  }).join("");
  document.getElementById("balances-card").innerHTML = html;
}
renderDashboard();
/**
 * renders the spending chart by mapping over the accounts
 * in the state and creating HTML for each account's name and balance.
 * The resulting HTML is then inserted into the "balances-card" element in the DOM.
 * The spending chart is based on the spendingThisMonth array in the state.
 */
function renderSpendingChart() {
  let amounts = state.spendingThisMonth.map(function (item) {
    return item.amount;              // (1) what value from each item do we want?
  });
  let maxAmount = Math.max(...amounts);   // (2) how do we "unpack" the amounts array here?

  let html = state.spendingThisMonth.map(function (item) {
    let percent = ( item.amount / maxAmount ) * 100;   // (3) which two values divide to get the percent? 
    return `<div class="bar-row">
      <span>${item.category}</span>                 
      <div class="bar-track"><div class="bar-fill" style="width: ${percent}%"></div></div>
      <span>${formatMoney(item.amount)}</span>    
    </div>`;
  }).join("");

  document.getElementById("spending-chart").innerHTML = html;   // (6) which element id?
}
renderSpendingChart();
/**
 * renders the 5 most recent transactions by sorting 
 * the transactions in the state by date, slicing the first 5, 
 * and mapping over them to create HTML for each transaction's merchant, date, category, and amount.
 * @returns 5 most recent transactions
 */
function renderRecentTransactions() {
  let sorted = state.transactions.sort(function (a, b) {
    return b.date - a.date;         // (1) which field, in which order, for "newest first"?
  });
  let recent = sorted.slice(0, 5);  // (2) which method keeps just the first 5?

  let html = recent.map(function (tx) {
    return `<div class="tx-row">
      <span>${tx.merchant}</span>
      <span>${formatDate(tx.date)}</span>
      <span>${tx.category}</span>
      <span>${formatMoney(tx.amount)}</span>
    </div>`;
  }).join("");

  document.getElementById("transactions-list").innerHTML = html;  // (3) which element id?
}
renderRecentTransactions();

document.getElementById("see-all-btn").addEventListener("click", function() {
  showScreen("screen-history");
});

document.getElementById("bell-btn").addEventListener("click", function() {
  openPopup("popup-notification");
});

// ========================================= Step 3: Notifications =========================================
/**
 * renders the popup by setting the hidden property of the "popup" element to false, making it visible.
 * 
 */
function openPopup(id) {
  let popup = document.getElementById(id);
  popup.hidden = false;

  // keyboard accessibility: move focus to the popup's first button
  let firstButton = popup.querySelector("button");
  if (firstButton) {
    firstButton.focus();
  }
}
/**
 * closes the popup by setting the hidden property of the "popup" element to true, making it invisible.
 * 
 */
function closePopup(id) {
  document.getElementById(id).hidden = true;
}

// add event listeners to the notification popup buttons
let okBtn = document.getElementById("notification-ok-btn");
okBtn.addEventListener("click", function() {
  closePopup("popup-notification");
  document.getElementById("bell-dot").hidden = true;
});

// add event listener to the "View subscription" button in the notification popup
let viewSubBtn = document.getElementById("notification-view-sub-btn");
viewSubBtn.addEventListener("click", function() {
  closePopup("popup-notification");
  showScreen("screen-subscriptions");
  document.getElementById("bell-dot").hidden = true;
});

/**
 * pop up toast message for 2 seconds
 * Displays a temporary message to the user.
 * @param {*} message 
 */
function showToast(message) {
  let toast = document.getElementById("toast"); // (1) grab the toast element

  toast.textContent = message;   // (2) put `message` into the element's text
  toast.hidden = false;        // (3) un-hide it — true or false?
  // hide it after 2 seconds
  setTimeout(function() {
    toast.hidden = true;      // (4) hide it again — true or false?
  }, 2000);
}

// ========================== Step 4: Transfers ==================================

/**
 * Renders the options for the "From" account dropdown.
 * Maps over the accounts in the state and creates an option element for each account.
 * @returns options for the "From" account dropdown
 */
function renderAccountOptions() {
  let html = state.accounts.map(function (acc) {
    return `<option value="${acc.id}">${acc.name} (${formatMoney(acc.balance)})</option>`;
  }).join("");

  document.getElementById("from-account").innerHTML = html;
}
renderAccountOptions();
/**
 * Renders the options for the "To" payee dropdown.
 * Maps over the payees in the state and creates an option element for each payee.
 * @returns options for the "To" payee dropdown
 */
function renderPayeeOptions() {
  let html = state.payees.map(function (payee) {
    return `<option value="${payee.id}">${payee.nickname} (${payee.name})</option>`;
  }).join("");

  document.getElementById("to-payee").innerHTML = html;
}
renderPayeeOptions();

// pendingTransfer holds the details of a transfer between Continue and
// Confirm and pay, so the Confirm screen and the "actually move the money"
// step both know what to act on.
let pendingTransfer = null;

let continueBtn = document.getElementById("transfer-continue-btn");
/**
 * Validates the transfer form, then — if it's valid — builds the read-back
 * sentence on the Confirm screen and navigates there.
 */
continueBtn.addEventListener("click", function() {
  let selectedAccountId = document.getElementById("from-account").value;
  let selectedPayeeId = document.getElementById("to-payee").value;
  let amount = Number(document.getElementById("transfer-amount").value);

  let selectedAccount = state.accounts.find(function(acc) {
    return acc.id === selectedAccountId;
  });
  let selectedPayee = state.payees.find(function(payee) {
    return payee.id === selectedPayeeId;
  });

  let errorText = document.getElementById("amount-error");

  if (!selectedPayee) {
    errorText.textContent = "Choose a payee, or add a new one, before continuing.";
    errorText.hidden = false;
    return;
  }

  if (!amount || amount <= 0 || amount > selectedAccount.balance) {
    errorText.textContent = "Please enter a valid amount.";
    errorText.hidden = false;
    return;
  }

  errorText.hidden = true;

  pendingTransfer = {
    accountId: selectedAccount.id,
    payeeId: selectedPayee.id,
    amount: amount,
  };

  let balanceAfter = selectedAccount.balance - amount;
  document.getElementById("confirm-text").textContent =
    `You are paying ${formatMoney(amount)} to ${selectedPayee.nickname} from ${selectedAccount.name}.`;
  document.getElementById("confirm-balance-after").textContent =
    `Your balance after this payment: ${formatMoney(balanceAfter)}.`;

  // show the read-back state, hide the other two states, ready for next time
  document.getElementById("confirm-readback").hidden = false;
  document.getElementById("confirm-processing").hidden = true;
  document.getElementById("confirm-completed").hidden = true;

  showScreen("screen-confirm");
});

// ========================== Step 5: add payee + inline check ==================================

let addPayeeBtn = document.getElementById("add-payee-btn");
addPayeeBtn.addEventListener("click", function() {
  document.getElementById("new-payee-form").hidden = false;
});

/**
 * Auto-formats the account number as digits-only groups (2-4-7-2), e.g.
 * "123456789012300" -> "12-3456-7890123-00", however the user types it.
 */
let accountInput = document.getElementById("new-payee-account");
accountInput.addEventListener("input", function() {
  let digits = accountInput.value.replace(/\D/g, "").slice(0, 15); // \D = "not a digit"

  let groups = [
    digits.slice(0, 2),
    digits.slice(2, 6),
    digits.slice(6, 13),
    digits.slice(13, 15),
  ];

  // only keep groups that actually have digits in them, so it doesn't show
  // trailing dashes ("12-" ) before the user has typed that far
  accountInput.value = groups.filter(function(group) {
    return group.length > 0;
  }).join("-");
});

let checkPayeeBtn = document.getElementById("check-payee-btn");
let checkResult = document.getElementById("check-result");

/**
 * Runs the fake Confirmation-of-Payee check against PAYEE_REGISTER (data.js).
 * - registered account + name matches (surname, case-insensitive) -> green match,
 *   the payee is added to state.payees and selected in the To dropdown.
 * - anything else -> amber warning, with a "Pause and check" button that
 *   clears the form and shows a toast, per the brief.
 */
checkPayeeBtn.addEventListener("click", function() {
  let name = document.getElementById("new-payee-name").value.trim();
  let account = document.getElementById("new-payee-account").value.trim();
  let registeredName = PAYEE_REGISTER[account];

  let enteredSurname = name.toLowerCase().split(" ").pop();
  let isMatch = registeredName && registeredName.toLowerCase().includes(enteredSurname) && enteredSurname.length > 0;

  if (isMatch) {
    checkResult.className = "check-result check-result-match";
    checkResult.innerHTML = `<p>Name matches: ${registeredName} ✓</p>`;
    checkResult.hidden = false;

    let newPayee = {
      id: "payee-" + Date.now(),
      nickname: name,
      name: registeredName,
      account: account,
    };
    state.payees.push(newPayee);
    renderPayeeOptions();
    document.getElementById("to-payee").value = newPayee.id;

    document.getElementById("new-payee-form").hidden = true;
    document.getElementById("new-payee-name").value = "";
    document.getElementById("new-payee-account").value = "";
  } else {
    let warningName = registeredName || "someone else";
    checkResult.className = "check-result check-result-warning";
    checkResult.innerHTML = `
      <p>This account is registered to <strong>${warningName}</strong>, not the name you entered.</p>
      <p>Paying a new payee whose name doesn't match is a common sign of a scam. Scammers often pose as friends, family or businesses.</p>
      <button class="btn" id="pause-check-btn" type="button">Pause and check</button>
    `;
    checkResult.hidden = false;

    document.getElementById("pause-check-btn").addEventListener("click", function() {
      document.getElementById("new-payee-name").value = "";
      document.getElementById("new-payee-account").value = "";
      document.getElementById("new-payee-form").hidden = true;
      checkResult.hidden = true;
      showToast("Payment paused");
    });
  }
});

// ========================== Step 6: Confirm -> Processing -> Completed ==================================

document.getElementById("confirm-edit-btn").addEventListener("click", function() {
  goBack(); // returns to Transfer, since that's where Continue was clicked from
});

document.getElementById("confirm-pay-btn").addEventListener("click", function() {
  document.getElementById("confirm-readback").hidden = true;
  document.getElementById("confirm-processing").hidden = false;

  setTimeout(function() {
    let account = state.accounts.find(function(acc) {
      return acc.id === pendingTransfer.accountId;
    });
    let payee = state.payees.find(function(p) {
      return p.id === pendingTransfer.payeeId;
    });

    account.balance -= pendingTransfer.amount;

    state.transactions.push({
      id: "t" + Date.now(),
      merchant: payee.nickname,
      amount: pendingTransfer.amount,
      category: "Uncategorised",
      date: new Date(),
    });

    // re-render everything that shows balances/transactions, same functions from Step 2
    renderDashboard();
    renderSpendingChart();
    renderRecentTransactions();
    renderAccountOptions();

    document.getElementById("completed-text").textContent =
      `Payment sent. ${payee.nickname} should receive it within a few minutes.`;

    document.getElementById("confirm-processing").hidden = true;
    document.getElementById("confirm-completed").hidden = false;

    pendingTransfer = null;
  }, 1200);
});

document.getElementById("completed-ok-btn").addEventListener("click", function() {
  document.getElementById("transfer-amount").value = "";
  showScreen("screen-dashboard");
});

// ========================== Step 7: Subscriptions ==================================

/**
 * Renders the subscriptions summary card and the list of subscriptions.
 * Spotify is always shown first (it's the one with a price change to show off).
 * Tapping a row toggles its detail section open/closed.
 */
function renderSubscriptions() {
  let monthlyTotal = state.subscriptions.reduce(function(sum, sub) {
    return sum + sub.price;
  }, 0);
  let yearlyTotal = monthlyTotal * 12;

  document.getElementById("sub-summary").textContent =
    `${formatMoney(monthlyTotal)} / month · ${formatMoney(yearlyTotal)} / year`;

  let sorted = state.subscriptions.slice().sort(function(a, b) {
    if (a.id === "spotify") return -1;
    if (b.id === "spotify") return 1;
    return 0;
  });

  let html = sorted.map(function(sub) {
    let priceUpTag = sub.previousPrice ? `<span class="tag tag-warning">Price up</span>` : "";

    let detail = `<p>Next charge: ${formatDate(sub.nextCharge)}</p><p>Yearly cost: ${formatMoney(sub.price * 12)}</p>`;
    if (sub.previousPrice) {
      detail = `<p>Previous price: ${formatMoney(sub.previousPrice)} (changed ${formatDate(sub.priceChangedOn)})</p>` + detail;
    }

    return `<div class="card sub-row" data-sub-id="${sub.id}">
      <div class="sub-row-header">
        <span class="sub-logo">${sub.name.charAt(0)}</span>
        <span>${sub.name}</span>
        ${priceUpTag}
        <span>${formatMoney(sub.price)}</span>
      </div>
      <div class="sub-detail" hidden>${detail}</div>
    </div>`;
  }).join("");

  document.getElementById("sub-list").innerHTML = html;

  for (let row of document.querySelectorAll(".sub-row")) {
    row.addEventListener("click", function() {
      let detailDiv = row.querySelector(".sub-detail");
      detailDiv.hidden = !detailDiv.hidden;
    });
  }
}
renderSubscriptions();

// ========================== Step 8: History ==================================

// ids of the currently ticked transactions — shared by the list, the buttons
// and the Assign category / Export popups
let selectedTransactionIds = [];

function renderCategoryFilterOptions() {
  let html = `<option value="all">All categories</option>` +
    state.categories.map(function(cat) {
      return `<option value="${cat}">${cat}</option>`;
    }).join("");
  document.getElementById("history-category-filter").innerHTML = html;
}
renderCategoryFilterOptions();

/**
 * Renders the History list, filtered live by the search box and category
 * dropdown, newest first. Each row's checkbox reflects selectedTransactionIds.
 */
function renderHistoryList() {
  let searchTerm = document.getElementById("history-search").value.toLowerCase();
  let categoryFilter = document.getElementById("history-category-filter").value;

  let filtered = state.transactions.filter(function(tx) {
    let matchesSearch = tx.merchant.toLowerCase().includes(searchTerm);
    let matchesCategory = categoryFilter === "all" || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  let sorted = filtered.slice().sort(function(a, b) {
    return b.date - a.date;
  });

  let html = sorted.map(function(tx) {
    let checked = selectedTransactionIds.includes(tx.id) ? "checked" : "";
    return `<div class="tx-row">
      <input type="checkbox" class="tx-checkbox" data-tx-id="${tx.id}" ${checked}>
      <span>${tx.merchant}</span>
      <span>${formatDate(tx.date)}</span>
      <span class="tag">${tx.category}</span>
      <span>${formatMoney(tx.amount)}</span>
    </div>`;
  }).join("");

  document.getElementById("history-list").innerHTML = html;

  for (let checkbox of document.querySelectorAll(".tx-checkbox")) {
    checkbox.addEventListener("change", function() {
      let txId = checkbox.dataset.txId;
      if (checkbox.checked) {
        selectedTransactionIds.push(txId);
      } else {
        selectedTransactionIds = selectedTransactionIds.filter(function(id) {
          return id !== txId;
        });
      }
      updateHistoryButtons();
    });
  }
}
renderHistoryList();

/**
 * Enables/disables the Assign category and Export buttons based on whether
 * any rows are ticked, and shows/hides the hint text under them.
 */
function updateHistoryButtons() {
  let hasSelection = selectedTransactionIds.length > 0;
  document.getElementById("assign-category-btn").disabled = !hasSelection;
  document.getElementById("export-btn").disabled = !hasSelection;
  document.getElementById("history-hint").hidden = hasSelection;
}
updateHistoryButtons();

document.getElementById("history-search").addEventListener("input", renderHistoryList);
document.getElementById("history-category-filter").addEventListener("change", renderHistoryList);

// ========================== Step 9: Assign category + Export ==================================

document.getElementById("assign-category-btn").addEventListener("click", function() {
  let html = state.categories.map(function(cat) {
    return `<option value="${cat}">${cat}</option>`;
  }).join("");
  document.getElementById("assign-category-select").innerHTML = html;
  document.getElementById("assign-new-category").value = "";
  document.getElementById("assign-auto-apply").checked = false;
  openPopup("popup-assign");
});

document.getElementById("assign-cancel-btn").addEventListener("click", function() {
  closePopup("popup-assign");
});

/**
 * Saves the chosen category onto every ticked transaction. If "Also apply to
 * all transactions from this merchant" is checked, it also updates every
 * other transaction sharing the same merchant name as a ticked one.
 * If a new category name was typed, it's added to state.categories too.
 */
document.getElementById("assign-save-btn").addEventListener("click", function() {
  let newCategoryName = document.getElementById("assign-new-category").value.trim();
  let category = newCategoryName || document.getElementById("assign-category-select").value;

  if (newCategoryName && !state.categories.includes(newCategoryName)) {
    state.categories.push(newCategoryName);
    renderCategoryFilterOptions();
  }

  let autoApply = document.getElementById("assign-auto-apply").checked;

  let selectedMerchants = state.transactions
    .filter(function(tx) { return selectedTransactionIds.includes(tx.id); })
    .map(function(tx) { return tx.merchant; });

  for (let tx of state.transactions) {
    let isTicked = selectedTransactionIds.includes(tx.id);
    let isSameMerchant = autoApply && selectedMerchants.includes(tx.merchant);
    if (isTicked || isSameMerchant) {
      tx.category = category;
    }
  }

  selectedTransactionIds = [];
  renderHistoryList();
  updateHistoryButtons();
  closePopup("popup-assign");
  showToast("Category saved");
});

/**
 * Builds a CSV of the ticked transactions and downloads it via a temporary
 * <a download> link, then shows the "Export completed" popup with the real count.
 */
document.getElementById("export-btn").addEventListener("click", function() {
  let selectedTransactions = state.transactions.filter(function(tx) {
    return selectedTransactionIds.includes(tx.id);
  });

  let csvRows = ["Merchant,Date,Category,Amount"];
  for (let tx of selectedTransactions) {
    csvRows.push(`${tx.merchant},${formatDate(tx.date)},${tx.category},${tx.amount}`);
  }
  let csvContent = csvRows.join("\n");

  let blob = new Blob([csvContent], { type: "text/csv" });
  let url = URL.createObjectURL(blob);
  let link = document.createElement("a");
  link.href = url;
  link.download = "transactions.csv";
  link.click();
  URL.revokeObjectURL(url);

  document.getElementById("export-text").textContent =
    `${selectedTransactions.length} transactions saved as a CSV file`;

  openPopup("popup-export");
});

document.getElementById("export-ok-btn").addEventListener("click", function() {
  closePopup("popup-export");
  selectedTransactionIds = [];
  renderHistoryList();
  updateHistoryButtons();
});
