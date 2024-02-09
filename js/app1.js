// Function to validate an email address
function validateEmail() {
  // Get the email input element
  const emailInput = document.getElementById("email");
  const email = emailInput.value;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const errorMessage = document.getElementById("emailErrorMessage");

  // Check if the email matches the email pattern
  if (!emailPattern.test(email)) {
    errorMessage.textContent = "Error: Please enter a valid email address.";
    emailInput.focus();
    return false;
  }
  errorMessage.textContent = "";
  return true;
}

// Function to validate the credit card's expiry month
function validateExpiryMonth() {
  const expiryInput = document.getElementById("expiryMonth");
  const errorMessage = document.getElementById("expiryMonthErrorMessage");
  const value = expiryInput.value.trim().toUpperCase(); // Convert to uppercase for case-insensitive check
  const validMonths = ["JAN", "FEB", "MAR", "APR", 
                      "MAY", "JUN", "JUL", "AUG",
                      "SEP", "OCT", "NOV", "DEC"];

  // Check if the entered value is in the array of valid months
  if (!validMonths.includes(value)) {
    errorMessage.textContent = "Error: Please enter a valid expiry month (JAN to DEC).";
    expiryInput.focus();
    return false;
  }

  errorMessage.textContent = "";
  return true;
}

// Function to validate the credit card's expiry year
function validateCardExpiryYear() {
  const expiryInput = document.getElementById("expiryYear");
  const errorMessage = document.getElementById("expiryYearErrorMessage");
  const value = expiryInput.value.trim();
  const currentYear = new Date().getFullYear();
  const minYear = currentYear;
  const maxYear = currentYear + 10;

  // Check if the value is too long or not a number
  if (value.length > 4 || isNaN(value)) {
    errorMessage.textContent = "Error: Please enter a valid expiry year.";
    expiryInput.focus();
    return false;
  }
  // Check if the year is within the valid range
  if (value < minYear || value > maxYear) {
    errorMessage.textContent = `Error: Please enter a valid year between ${minYear} and ${maxYear}.`;
    expiryInput.focus();
    return false;
  }

  errorMessage.textContent = "";
  return true;
}

// Function to validate the credit card number
function validateCardNumber() {
  const cardNumberInput = document.getElementById("creditNumber");
  const cardNumber = cardNumberInput.value.replace(/[-\s]/g, "");
  const cardConstant = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/;
  const errorMessage = document.getElementById("creditNumberErrorMessage");

  // Check if the card number matches the cardConstant pattern
  if (!cardNumber.match(cardConstant) || isNaN(cardNumber)) {
    errorMessage.textContent = "Error: Please enter a valid (Visa or MasterCard) number.";
    cardNumberInput.focus();
    return false;
  }

  if (cardNumber.length > 16) {
    errorMessage.textContent = "Error: Please enter a 16 digit card number.";
    cardNumberInput.focus();
    return false;
  }

  // Check if there are dashes after every 4 digits
  if (!/^(\d{4}-)*\d{4}$/.test(cardNumberInput.value)) {
    errorMessage.textContent = "Error: Please add a dash after every 4 digits.";
    cardNumberInput.focus();
    return false;
  }
  errorMessage.textContent = "";
  return true;
}

// Function to validate the grocery quantities
function validateGroceryQuantity() {
  const waterQuantity = document.getElementById("water").value;
  const capQuantity = document.getElementById("caps").value;
  const penQuantity = document.getElementById("pens").value;
  const candyQuantity = document.getElementById("candy").value;
  const cupcakeQuantity = document.getElementById("cupcake").value;
  const errorMessage = document.getElementById("groceryErrorMessage");

  // Check if all quantities are empty or not
  if (
    waterQuantity === "" &&
    capQuantity === "" &&
    penQuantity === "" &&
    candyQuantity === "" &&
    cupcakeQuantity === ""
  ) {
    errorMessage.textContent = "Error: Please enter at least one quantity.";
    document.getElementById("water").focus();
    return false;
  }

  // Individual checks for each quantity
  if (isNaN(waterQuantity)) {
    errorMessage.textContent = "Error: Please enter a numerical water quantity.";
    document.getElementById("water").focus();
    return false;
  }
  if (isNaN(capQuantity)) {
    errorMessage.textContent = "Error: Please enter a numerical cap quantity.";
    document.getElementById("caps").focus();
    return false;
  }
  if (isNaN(penQuantity)) {
    errorMessage.textContent = "Error: Please enter a numerical pen quantity.";
    document.getElementById("pens").focus();
    return false;
  }
  if (isNaN(candyQuantity)) {
    errorMessage.textContent = "Error: Please enter a numerical candy quantity.";
    document.getElementById("candy").focus();
    return false;
  }
  if (isNaN(cupcakeQuantity)) {
    errorMessage.textContent = "Error: Please enter a numerical cupcake quantity.";
    document.getElementById("cupcake").focus();
    return false;
  }

  // If any quantity is numeric, clear the error message
  errorMessage.textContent = "";
  return true;
}

// Function to validate the entire form
function validateForm() {
  const isEmailValid = validateEmail();
  const isCardNumberValid = validateCardNumber();
  const isExpiryMonthValid = validateExpiryMonth();
  const isCardExpiryYearValid = validateCardExpiryYear();
  const isGroceryQuantityValid = validateGroceryQuantity();

  // Return true only if all validations are successful
  if(
    isEmailValid &&
    isCardNumberValid &&
    isExpiryMonthValid &&
    isCardExpiryYearValid &&
    isGroceryQuantityValid
  ){
    return true;
  }
  return false;
}

// Function to reset the form
function Reset() {
  window.location.href = "assignment2.html";
}

// Function to hide most of the credit card number, leaving only the last 4 digits visible
function hideCreditCard(cardNumber) {
  cardNumber = String(cardNumber);
  const cardLength = cardNumber.length;

  if (cardLength >= 5) {
    let hideDigits = '';
    const lastFourDigits = cardNumber.slice(-4);
    for (let i = 0; i < cardLength - 4; i++) {
      const character = cardNumber[i];
      if (!isNaN(character)) {
        hideDigits += 'x';
      } else {
        hideDigits += character;
      }
    }
    const hideCardNumber = hideDigits + lastFourDigits;
    return hideCardNumber;
  } else {
    return cardNumber;
  }
}

// JavaScript code to extract and display data
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const email = urlParams.get("email");
  const creditNumber = urlParams.get("creditNumber");
  const waterQuantity = urlParams.get("water");
  const pensQuantity = urlParams.get("pens");
  const capsQuantity = urlParams.get("caps");
  const candyQuantity = urlParams.get("candy");
  const cupcakeQuantity = urlParams.get("cupcake");

  // Populate the table cells with the retrieved data
  const nameData = document.getElementById("nameData");
  const emailData = document.getElementById("emailData");
  const creditNumberData = document.getElementById("creditNumberData");

  if (nameData) {
    nameData.textContent = name;
  }
  if (emailData) {
    emailData.textContent = email;
  }
  if (creditNumberData) {
    creditNumberData.textContent = hideCreditCard(creditNumber);
  }

  netPrice = 0;
  donation = 0;

  function addRow(item, quantity, unitPrice) {
    const tbody = document.querySelector("#quantityTable");

    console.log("Item: " + item);
    console.log("Quantity: " + quantity);
    console.log("Unit Price: " + unitPrice);

    if (quantity !== null && !isNaN(quantity) && quantity !== '') {
      const row = document.createElement("tr");
      const cell1 = document.createElement("td");
      const cell2 = document.createElement("td");
      const cell3 = document.createElement("td");
      const cell4 = document.createElement("td");
      cell1.textContent = item;
      cell2.textContent = quantity;
      cell3.textContent = "$" + unitPrice;
      const totalPrice = unitPrice * quantity;
      netPrice += totalPrice
      cell4.textContent = "$" + totalPrice;
      row.appendChild(cell1);
      row.appendChild(cell2);
      row.appendChild(cell3);
      row.appendChild(cell4);
      tbody.appendChild(row);
    }
  }

  addRow("water", waterQuantity, 5);
  addRow("pens", pensQuantity, 2);
  addRow("caps", capsQuantity, 20);
  addRow("candy", candyQuantity, 10);
  addRow("cupcake", cupcakeQuantity, 3);
  const tbody = document.querySelector("#quantityTable");
  const row = document.createElement("tr");
  const cell1 = document.createElement("td");
  cell1.textContent = "Donation";
  row.appendChild(cell1);

  if (netPrice * 0.10 > 10) {
    const cell2 = document.createElement("td");
    cell2.colSpan = 2;
    row.appendChild(cell2);
    const cell3 = document.createElement("td");
    donation = Math.round(netPrice * 0.10);
    cell3.textContent = "$" + donation;
    row.appendChild(cell3);
  } else {
    const cell2 = document.createElement("td");
    cell2.colSpan = 2;
    cell2.textContent = 'Minimum'
    row.appendChild(cell2);
    const cell3 = document.createElement("td");
    cell3.textContent = "$10";
    donation = 10;
    row.appendChild(cell3);
  }

  tbody.appendChild(row);
  const row1 = document.createElement("tr");
  const cell4 = document.createElement("td");
  cell4.colSpan = 3;
  const boldTotal = document.createElement("b");
  boldTotal.textContent = "Total"
  cell4.appendChild(boldTotal);
  row1.appendChild(cell4);
  const cell5 = document.createElement("td");
  const boldTotal1 = document.createElement("b");
  boldTotal1.textContent = "$" + Math.round(donation + netPrice);
  cell5.appendChild(boldTotal1);
  row1.appendChild(cell5);
  tbody.appendChild(row1);
});
