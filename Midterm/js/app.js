function increaseQty(itemName) {
  const qty = document.getElementById(itemName).value;
  if (qty == "") {
    newQty = 1;
  } else {
    newQty = parseInt(qty, 10) + 1;
  }
  document.getElementById(itemName).value = newQty;
}

function decreaseQty(itemName) {
  const qty = document.getElementById(itemName).value;
  if (qty == "" || qty == "0") {
    newQty = 0;
  } else {
    newQty = parseInt(qty, 10) - 1;
  }
  document.getElementById(itemName).value = newQty;
}

function validateMarketItems() {
  const capQty = document.getElementById("caps_input").value;
  const tshirtQty = document.getElementById("tshirt_input").value;
  const braceletQty = document.getElementById("bracelet_input").value;
  const jacketQty = document.getElementById("jacket_input").value;
  const sunglassQty = document.getElementById("sunglass_input").value;
  const errorMessage = document.getElementById("marketItemErrorMessage");

  if (
    (capQty === "" || capQty === "0") &&
    (tshirtQty === "" || tshirtQty === "0")&&
    (braceletQty === "" || braceletQty === "0") &&
    (jacketQty === "" || jacketQty === "0")&&
    (sunglassQty === ""|| sunglassQty === "0")
  ) {
    errorMessage.textContent = "Error: Please enter at least one quantity.";
    return false;
  } else {
    if (isNaN(capQty)) {
      errorMessage.textContent =
        "Error: Please enter a numerical cap quantity.";
      return false;
    }
    if (isNaN(tshirtQty)) {
      errorMessage.textContent =
        "Error: Please enter a numerical tshirt quantity.";
      return false;
    }
    if (isNaN(jacketQty)) {
      errorMessage.textContent =
        "Error: Please enter a numerical jacket quantity.";
      return false;
    }
    if (isNaN(sunglassQty)) {
      errorMessage.textContent =
        "Error: Please enter a numerical sunglass quantity.";
      return false;
    }
    if (isNaN(braceletQty)) {
      errorMessage.textContent =
        "Error: Please enter a numerical bracelet quantity.";
      return false;
    }
  }

  errorMessage.textContent = "";
  return true;
}

function validateProvince() {
  const provinceInput = document.getElementById("province");
  const errorMessage = document.getElementById("provinceErrorMessage");
  const value = provinceInput.value.trim(); // Convert to uppercase for case-insensitive check
  const validProvince = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
  ];

  if (!validProvince.includes(value)) {
    errorMessage.textContent =
      "Error: Please enter a valid Province (select from dropdown).";
    return false;
  }

  errorMessage.textContent = "";
  return true;
}

function validatePhoneNumber() {
  const phoneNumberInput = document.getElementById("phoneNumber");
  const value = phoneNumberInput.value.trim();
  const errorMessage = document.getElementById("phoneNumberErrorMessage");

  // Define a regular expression pattern for the format "XXX-XXX-XXXX"
  var pattern = /^\d{3}-\d{3}-\d{4}$/;

  if (!pattern.test(value)) {
    errorMessage.textContent =
      "Error: Please enter phone number in correct format.";
    return false;
  }
  errorMessage.textContent = "";
  return true;
}

function validateName() {
  const nameInput = document.getElementById("name");
  const value = nameInput.value.trim();
  const errorMessage = document.getElementById("nameErrorMessage");
  
  if (!isNaN(value)) {
    errorMessage.textContent =
      "Error: Please enter alphabetical name.";
    return false;
  }
  errorMessage.textContent = "";
  return true;
}

function validateForm() {
  const isNameValid = validateName();
  const isProvinceValid = validateProvince();
  const isMarketItemsValid = validateMarketItems();
  const isPhoneNumberValid = validatePhoneNumber();

  // Return true only if all validations are successful
  if (isMarketItemsValid && isNameValid && isPhoneNumberValid && isProvinceValid ) {
    return true;
  }

  return false;
}

function moreInfo(buttonStr) {
  if (buttonStr === "sunglass") {
    var element = document.getElementById("sunglass_info");
    var element1 = document.getElementById("sunglass_hidden_info");
  }

  if (buttonStr === "tshirt") {
    var element = document.getElementById("tshirt_info");
    var element1 = document.getElementById("tshirt_hidden_info");
  }

  if (buttonStr === "cap") {
    var element = document.getElementById("cap_info");
    var element1 = document.getElementById("cap_hidden_info");
  }

  if (element1.style.display === "none" || element1.style.display === "") {
    element1.style.display = "block";
  }
  if (element.style.display !== "none") {
    element.style.display = "none";
  }
}

function lessInfo(buttonStr) {
  if (buttonStr === "sunglass") {
    var element = document.getElementById("sunglass_info");
    var element1 = document.getElementById("sunglass_hidden_info");
  }
  if (buttonStr === "tshirt") {
    var element = document.getElementById("tshirt_info");
    var element1 = document.getElementById("tshirt_hidden_info");
  }
  if (buttonStr === "cap") {
    var element = document.getElementById("cap_info");
    var element1 = document.getElementById("cap_hidden_info");
  }

  if (element.style.display === "none" || element1.style.display === "") {
    element.style.display = "block";
  }
  if (element1.style.display !== "none") {
    element1.style.display = "none";
  }
}
