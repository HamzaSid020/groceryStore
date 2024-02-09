function addCustomTotal(title, value) {
  const tbody = document.querySelector("#quantityTable");
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = 3;
  const boldTotal = document.createElement("b");
  boldTotal.textContent = title;
  cell.appendChild(boldTotal);
  row.appendChild(cell);
  const cell5 = document.createElement("td");
  const boldTotal1 = document.createElement("b");
  if (title === "Discount") {
    boldTotal1.textContent = "- $" + value.toFixed(2);
  } else if (title === "Total Tax (13%)") {
    boldTotal1.textContent = "+ $" + value.toFixed(2);
  } else {
    boldTotal1.textContent = "$" + value.toFixed(2);
  }
  cell5.appendChild(boldTotal1);
  row.appendChild(cell5);
  tbody.appendChild(row);
}

// JavaScript code to extract and display data
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tshirtQty = urlParams.get("tshirt_input");
  const capQty = urlParams.get("caps_input");
  const jacketQty = urlParams.get("jacket_input");
  const braceletQty = urlParams.get("bracelet_input");
  const sunglassQty = urlParams.get("sunglass_input");
  provinceStr = urlParams.get("province");

  // Populate the table cells with the retrieved data
  document.querySelector("#nameData").textContent = urlParams.get("name");
  document.querySelector("#phoneNumber").textContent =
    urlParams.get("phoneNumber");
  document.querySelector("#province").textContent = provinceStr;

  netPrice = 0;
  discount = 0;

  function addRow(item, quantity, unitPrice) {
    const tbody = document.querySelector("#quantityTable");

    console.log("Item: " + item);
    console.log("Quantity: " + quantity);
    console.log("Unit Price: " + unitPrice);

    if (
      quantity !== null &&
      !isNaN(quantity) &&
      quantity !== "" &&
      quantity !== "0"
    ) {
      const row = document.createElement("tr");
      const cell1 = document.createElement("td");
      const cell2 = document.createElement("td");
      const cell3 = document.createElement("td");
      const cell4 = document.createElement("td");
      cell1.textContent = item;
      cell2.textContent = quantity;
      cell3.textContent = "$" + unitPrice;
      const totalPrice = unitPrice * quantity;
      netPrice += totalPrice;
      cell4.textContent = "$" + totalPrice;
      row.appendChild(cell1);
      row.appendChild(cell2);
      row.appendChild(cell3);
      row.appendChild(cell4);
      tbody.appendChild(row);
    }
  }

  addRow("Tshirt", tshirtQty, 15);
  addRow("Bracelet", braceletQty, 25);
  addRow("Caps", capQty, 10);
  addRow("Sunglass", sunglassQty, 35);
  addRow("Jacket", jacketQty, 50);
  tax = netPrice * 0.13;
  discount = netPrice * 0.1;
  addCustomTotal("Sub Total(before Tax)", netPrice);
  addCustomTotal("Total Tax (13%)", tax);
  if (provinceStr == "Ontario") {
    addCustomTotal("Discount", discount);
  }
  addCustomTotal("Sales Total", netPrice - discount + tax);
});
