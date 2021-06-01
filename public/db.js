let db;
// create a new db request for a "BudgetDB" database.
const request = indexedDB.open("budgetDatabase", 1);

request.onupgradeneeded = function (event) {
  // create object store called "BudgetStore" and set autoIncrement to true
  db = event.target.result;
  const objectStore = db.createObjectStore("BudgetStore", { autoIncrement: true });
  // objectStore.createIndex("budgetIndex", "budget");
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    console.log("Connection back online, connecting to DB...");
    checkDatabase();
  }
};

request.onerror = function (event) {
  // log error here
  console.log("Error", event.target);
};

function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  // access your pending object store
  // add record to your store with add method.
  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const budgetStore = transaction.objectStore("BudgetStore");

  budgetStore.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const budgetStore = transaction.objectStore("BudgetStore");
  // const budgetIndex = budgetStore.index("budgetIndex");
  // open a transaction on your pending db
  // access your pending object store
  // get all records from store and set to a variable
  const getAll = budgetStore.getAll()

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          // access your pending object store
          // clear all items in your store
          const transaction = db.transaction(["BudgetStore"], "readwrite");
          const budgetStore = transaction.objectStore("BudgetStore");
          budgetStore.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);
