let total_price     = 0;
let tax             = 0;

let juices_array = [
    { name: 'Apple', quantity: 0, price: 5 },
    { name: 'Banana', quantity: 0, price: 7 },
    { name: 'Grape', quantity: 0, price: 4 },
    { name: 'Peach', quantity: 0, price: 3 },
    { name: 'Orange', quantity: 0, price: 8 },
];

function AddToCart(quantity, index) {
    juices_array[index].quantity = Number(quantity);
    // Update the displayed quantity on the page
    document.getElementById(juices_array[index].name.toLowerCase()).innerHTML =
        juices_array[index].name + ' &nbsp-&nbsp $' + juices_array[index].price + ' &nbsp x' + quantity;
}
function AddApple()
{
   let quantity =  prompt('Enter the quantity required? ');
   while (isNaN(quantity) || quantity == false) {
        quantity =  prompt('Please enter a number only');
   }
   if( quantity != null)
   {
       AddToCart( quantity, 0 );
   }
}

function AddBanana()
{
   let quantity =  prompt('Enter the quantity required? ');
   while (isNaN(quantity) || quantity == false) {
        quantity =  prompt('Please enter a number only');
    }

   if( quantity != null)
   {
       AddToCart( quantity, 1 );
   }
}

function AddGrape()
{
   let quantity =  prompt('Enter the quantity required? ');
    while (isNaN(quantity) || quantity == false) {
        quantity =  prompt('Please enter a number only');
    }
    
   if( quantity != null)
   {
       AddToCart( quantity, 2 );
   }
}

function AddPeach()
{
   let quantity =  prompt('Enter the quantity required? ');
   while (isNaN(quantity) || quantity == false) {
        quantity =  prompt('Please enter a number only');
    }
    
   if( quantity != null)
   {
       AddToCart( quantity, 3 );
   }
}

function AddOrange()
{
   let quantity =  prompt('Enter the quantity required? ');
   while (isNaN(quantity) || quantity == false) {
        quantity =  prompt('Please enter a number only');
    }
    
   if( quantity != null)
   {
       AddToCart( quantity, 4 );
   }
}

function PriceMultiply(fruit) {
    return fruit.quantity * fruit.price;
}

function Checkout() {
    var customerName = prompt('Enter your name? ');
    document.getElementById('customer').innerHTML = 'Customer Name: ' + customerName;
    var table = document.getElementById("myTable");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    let total_price = 0;

    for (let fruit of juices_array) {
        if ( fruit.quantity > 0)
        {
            let row = table.insertRow();
            let cell_1 = row.insertCell();
            let cell_2 = row.insertCell();
            let cell_3 = row.insertCell();
            cell_1.appendChild(document.createTextNode(fruit.name));
            cell_2.appendChild(document.createTextNode(fruit.quantity));
            cell_3.appendChild(document.createTextNode('$' + PriceMultiply( fruit ) ) );
            total_price += PriceMultiply(fruit);
        }
    }

    let tax = (total_price * 0.13).toFixed(2);
    total_price += parseFloat(tax);

    let row_1 = table.insertRow();
    let row_2 = table.insertRow();
    let cell_1 = row_1.insertCell();
    let cell_2 = row_1.insertCell();
    let cell_3 = row_2.insertCell();
    let cell_4 = row_2.insertCell();

    cell_1.appendChild(document.createTextNode("GST @ 13%"));
    cell_1.colSpan = 2;
    cell_2.appendChild(document.createTextNode('$'+ tax));
    cell_3.appendChild(document.createTextNode("Total:"));
    cell_3.colSpan = 2;
    cell_4.appendChild(document.createTextNode('$' + total_price.toFixed(2) ) );
}