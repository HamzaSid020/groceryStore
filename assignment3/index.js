// Import the express module
const express = require("express");
// Create an instance of the express application
const app = express();
// Import the path module for working with file and directory paths
const path = require("path"); // Import the 'path' module for handling file paths

// Set up EJS as the view engine
app.set("view engine", "ejs");
// Parse URL-encoded bodies (for form data) and make the 'public' directory static
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Define a route for the home page
app.get("/", (req, res) => {
  // Render the 'home' page using EJS
  res.render("pages/home");
});

// Define a route for processing the form submission
app.post("/process-form", (req, res) => {
  // Extract form data from the request
  const {
    name,
    email,
    phoneNumber,
    address,
    city,
    province,
    pens,
    candy,
    cupcake,
  } = req.body;

  // Server-side validation logic
  const errors = [];
  // Check if essential fields are not empty
  if (
    !isNotEmpty(name) ||
    !isNotEmpty(address) ||
    !isNotEmpty(city) ||
    !isNotEmpty(province)
  ) {
    errors.push("One or more fields are missing");
  }

  // Validate email format
  if (!isValidEmail(email)) {
    errors.push("Invalid email address");
  }

  // Validate phone number format
  if (!isValidPhoneNumber(phoneNumber)) {
    errors.push("Invalid phone number format");
  }

  // Validate province code
  if (!isValidProvince(province)) {
    errors.push("Invalid province selection");
  }

  // Validate product quantities
  if (
    !isValidQuantity(pens) &&
    !isValidQuantity(candy) &&
    !isValidQuantity(cupcake)
  ) {
    errors.push("Invalid quantity for one or more products");
  } else {
    // Check total price requirement
    if (!isValidMinimumTotal(pens, candy, cupcake)) {
      errors.push("Total price must be at least $10");
    }
  }

  // Calculate individual product totals and overall total
  const pensTotal = calculateTotal("pens", pens);
  const candyTotal = calculateTotal("candy", candy);
  const cupcakeTotal = calculateTotal("cupcake", cupcake);
  const totalAmount = pensTotal + candyTotal + cupcakeTotal;

  // Calculate sales tax based on the province
  const taxCalculation = calculateSalesTax(totalAmount, province);
  const tax = taxCalculation.tax;
  const taxAmount = taxCalculation.total;

  // Check if there are any errors
  if (errors.length > 0) {
    // If there are errors, render an error page or redirect to the form page with error messages
    console.log(errors);
    res.render("pages/home", { errors: errors || [] });
  } else {
    // If no errors, continue with form processing and generate receipt

    // Render the result page
    res.render("pages/result", {
      name,
      email,
      phoneNumber,
      address,
      city,
      province,
      pens: {
        quantity: pens,
        total: pensTotal.toFixed(2),
      },
      candy: {
        quantity: candy,
        total: candyTotal.toFixed(2),
      },
      cupcake: {
        quantity: cupcake,
        total: cupcakeTotal.toFixed(2),
      },
      totalAmount,
      tax,
      taxAmount,
    }); // Pass an empty array for errors
  }
});

// Define a route for resetting the form
app.post("/reset", (req, res) => {
  // Redirect to the home page
  res.redirect("pages/home");
});

// Helper functions for validation

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate province code
function isValidProvince(provinceCode) {
  const validProvinces = ["AB", "BC", "MB", "NB", "NL", "NS", "ON", "QC", "SK"];
  const upperCaseProvinceCode = provinceCode.toUpperCase();
  return validProvinces.includes(upperCaseProvinceCode);
}

// Check if a string is not empty after trimming
function isNotEmpty(input) {
  return input.trim() !== "";
}

// Validate phone number format
function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^(\d{10}|\(\d{3}\)\d{7})$/;
  return phoneRegex.test(phoneNumber);
}

// Validate quantity format
function isValidQuantity(quantity) {
  return /^\d+$/.test(quantity);
}

// Calculate the total price for a specific item based on quantity
function calculateTotal(item, quantity) {
  const unitPrices = {
    pens: 5,
    candy: 10,
    cupcake: 5,
  };
  const itemQuantity = parseInt(quantity, 10) || 0;
  if (unitPrices.hasOwnProperty(item)) {
    const totalPrice = itemQuantity * unitPrices[item];
    return totalPrice;
  }
  return 0;
}

// Calculate sales tax based on the total amount and province
function calculateSalesTax(amount, provinceCode) {
  const taxRates = {
    AB: 0.05, // Alberta
    BC: 0.07, // British Columbia
    MB: 0.08, // Manitoba
    NB: 0.15, // New Brunswick
    NL: 0.15, // Newfoundland and Labrador
    NS: 0.15, // Nova Scotia
    ON: 0.13, // Ontario
    QC: 0.09975, // Quebec (9.975%)
    SK: 0.06, // Saskatchewan
  };
  if (isNaN(amount) || amount < 0) {
    throw new Error("Invalid amount");
  }
  const taxAmount = amount * taxRates[provinceCode];
  const totalAmount = amount + taxAmount;
  return {
    tax: taxAmount.toFixed(2),
    total: totalAmount.toFixed(2),
  };
}

// Check if the total price is at least $10
function isValidMinimumTotal(pens, candy, cupcake) {
  const pensPrice = 5;
  const candyPrice = 10;
  const cupcakePrice = 5;
  const pensQuantity = parseInt(pens, 10) || 0;
  const candyQuantity = parseInt(candy, 10) || 0;
  const cupcakeQuantity = parseInt(cupcake, 10) || 0;
  const totalPrice =
    pensQuantity * pensPrice +
    candyQuantity * candyPrice +
    cupcakeQuantity * cupcakePrice;
  return totalPrice >= 10;
}

// Specify the port for the server to listen on
const port = 8000;
// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
