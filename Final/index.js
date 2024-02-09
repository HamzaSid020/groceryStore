// Import necessary modules
const express_hs = require("express");
const mongoose_hs = require("mongoose");

// Create an Express_hs app_hs
const app_hs = express_hs();
// In-memory storage for user sessions (for demonstration purposes)
let isLoggedIn_hs = false; // Variable to track whether the user is logged in or not

// Define MongoDB Schemas
const AdminSchema = new mongoose_hs.Schema({
  username: String,
  password: Number,
});

const JuiceSchema = new mongoose_hs.Schema({
  name: String,
  phoneNumber: Number,
  mangoQuantity: Number,
  berryQuantity: Number,
  appleQuantity: Number,
  subTotal: Number,
  tax: Number,
  totalCost: Number,
});

// Create MongoDB Models
const Admin_hs = mongoose_hs.model("admin", AdminSchema);
const Juice_hs = mongoose_hs.model("juice", JuiceSchema);

// Connect to MongoDB
mongoose_hs
  .connect("mongodb://localhost:27017/juice_store")
  .then(() => {
    console.log("Connected to MongoDB");
    createCollections(); // Function to create collections if they don't exist
    createDefaultDocuments(); // Function to create default admin document
    startServer(); // Function to start the Express_hs server
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Function to create collections if they don't exist
async function createCollections() {
  const collections_hs = await mongoose_hs.connection.db.collections();
  const collectionNames = collections_hs.map(
    (collection) => collection.collectionName
  );

  if (!collectionNames.includes("admin")) {
    await Admin_hs.createCollection(); // Create 'admin' collection if not exists
    console.log("Collection created: admin");
  }

  if (!collectionNames.includes("pages")) {
    await Juice_hs.createCollection(); // Create 'juice' collection if not exists
    console.log("Collection created: Juice_hs");
  }
}

// Function to create default documents if they don't exist
async function createDefaultDocuments() {
  createAdminDocument("hamza", 123); // Create default admin document
}

// Function to create an admin document
async function createAdminDocument(adminUsername, adminPassword) {
  const existingAdmin_hs = await Admin_hs.findOne({ username: adminUsername });
  if (!existingAdmin_hs) {
    const newAdmin_hs = new Admin_hs({
      username: adminUsername,
      password: adminPassword,
    });
    await newAdmin_hs.save();
    console.log("Admin_hs document created:", adminUsername);
  }
}

// Function to create a page document
async function createJuiceDocument(
  name,
  phoneNumber,
  mangoQuantity,
  berryQuantity,
  appleQuantity,
  subTotal,
  tax,
  totalCost
) {
  const newPage_hs = new Juice_hs({
    name: name,
    phoneNumber: parseInt(phoneNumber.replace(/-/g, ''), 10),
    mangoQuantity: mangoQuantity,
    berryQuantity: berryQuantity,
    appleQuantity: appleQuantity,
    subTotal: subTotal,
    tax: tax,
    totalCost: totalCost,
  });
  await newPage_hs.save();
  console.log("Juice_hs document created for:", name);
  return newPage_hs._id;
}

// Function to start the Express_hs server
function startServer() {
  app_hs.listen(8080, () => {
    console.log("Server is listening on port 8080");
  });
}

// Set up view engine and middleware
app_hs.set("view engine", "ejs"); // Set EJS as the view engine
app_hs.use(express_hs.urlencoded({ extended: true })); // Parse incoming requests with urlencoded payloads
app_hs.use("/public", express_hs.static("public")); // Serve static files from the 'public' directory

// Define routes

// Home route
app_hs.get("/home", isAuthenticatedHome, async (req, res) => {
  // Render the home page with the isAdmin variable
  res.render("pages/home-hs", {
    isAdmin: isLoggedIn_hs,
    errors: {},
    inputValues: {},
  });
});

app_hs.get("/", isAuthenticatedHome, async (req, res) => {
  // If the user is not an admin, redirect to "/home"
  if (!isLoggedIn_hs) {
    res.redirect("/home");
    return;
  }

  // If the user is an admin, render the home page with the isAdmin variable
  res.render("pages/home-hs", {
    isAdmin: isLoggedIn_hs,
    errors: {},
    inputValues: {},
  });
});

// Middleware to check if the user is authenticated for the home route
function isAuthenticatedHome(req, res, next) {
  if (isLoggedIn_hs) {
    next();
  } else {
    // Redirect to "/home" only if the current route is not already "/home"
    if (req.path !== "/home") {
      res.redirect("/home");
      return;
    }
    next();
  }
}

// Validation function for phone numbers
const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex_hs = /^\d{3}-\d{3}-\d{4}$/; // Regex for xxx-xxx-xxxx format
  const integerRegex_hs = /^\d+$/; // Regex for checking if the string contains only integers

  return (
    typeof phoneNumber === "string" &&
    phoneNumber.trim() !== "" &&
    phoneRegex_hs.test(phoneNumber) &&
    integerRegex_hs.test(phoneNumber.replace(/-/g, '')) // Remove dashes before checking for integers
  );
};

const validateQuantity = (quantity) => {
  const integerRegex = /^\d+$/; // Regex for checking if the string contains only integers

  return (
    typeof quantity === "string" &&
    quantity.trim() !== "" &&
    integerRegex.test(quantity) &&
    parseInt(quantity, 10) >= 0
  );
};

// Route to handle form submission
app_hs.post("/submit-form", async (req, res) => {

  const name_hs = req.body.name;
  const phoneNumber_hs = req.body.phoneNumber;
  const mangoQuantity_hs = req.body.mangoJuices;
  const berryQuantity_hs = req.body.berryJuices;
  const appleQuantity_hs = req.body.appleJuice;
  const mangoJuicePrice_hs = 2.99;
  const berryJuicePrice_hs = 1.99;
  const appleJuicePrice_hs = 2.49;
  const taxRate_hs = 0.13;
  const errors = {};
  const inputValues = {};

  // Validate name
  if (!name_hs || name_hs.trim() == "") {
    errors.name = "Name is required.";
  } else {
    inputValues.name = name_hs;
  }

  // Validate phone number
  if (!validatePhoneNumber(phoneNumber_hs)) {
    errors.phoneNumber = "Valid phone number is required";
  } else {
    inputValues.phoneNumber = phoneNumber_hs;
  }

  // Validate at least one quantity of juice
  if (
    !validateQuantity(mangoQuantity_hs) &&
    !validateQuantity(berryQuantity_hs) &&
    !validateQuantity(appleQuantity_hs)
  ) {
    errors.quantity = "At least one quantity of juice is required";
  }

  if (Object.keys(errors).length > 0) {
    // If there are errors, send them to the client
    return res
      .status(400)
      .render("pages/home-hs", { isAdmin: isLoggedIn_hs, errors, inputValues });
  }
  // Calculate subtotal for each juice type
  const mangoSubtotal_hs = parseFloat(
    (mangoQuantity_hs * mangoJuicePrice_hs).toFixed(2)
  );
  const berrySubtotal_hs = parseFloat(
    (berryQuantity_hs * berryJuicePrice_hs).toFixed(2)
  );
  const appleSubtotal_hs = parseFloat(
    (appleQuantity_hs * appleJuicePrice_hs).toFixed(2)
  );

  // Calculate total cost before tax
  const subTotal_hs = parseFloat(
    (mangoSubtotal_hs + berrySubtotal_hs + appleSubtotal_hs).toFixed(2)
  );

  // Calculate tax
  const tax_hs = parseFloat((subTotal_hs * taxRate_hs).toFixed(2));

  // Calculate total cost with tax
  const totalCost_hs = parseFloat((subTotal_hs + tax_hs).toFixed(2));

  try {
    const juiceId_hs = await createJuiceDocument(
      name_hs,
      phoneNumber_hs,
      mangoQuantity_hs,
      berryQuantity_hs,
      appleQuantity_hs,
      subTotal_hs,
      tax_hs,
      totalCost_hs
    );

    if (juiceId_hs) {
      res.redirect(`/new-juice-order?juiceId=${juiceId_hs}`);
    } else {
      res.status(400).send("Error creating Juice_hs document: Already exists");
    }
  } catch (error) {
    res.status(500).send(`Error creating Juice_hs document: ${error.message}`);
  }
});

// View juices route
app_hs.get("/view-juices", isAuthenticated, async (req, res) => {
  try {
    const AllInfo_hs = await Juice_hs.find({});
    res.render("pages/view-juices-hs", { AllInfo_hs, isAdmin: isLoggedIn_hs });
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Delete page route
app_hs.post("/delete-page", async (req, res) => {
  try {
    const { _id } = req.body;
    // Find the page in the database
    const page_hs = await Juice_hs.findOne({ _id: _id });
    if (!page_hs) {
      console.error("Juice_hs record not found");
      return res.status(500).send("Internal Server Error");
    }

    console.log("Deleting record from the database");

    // Delete the record from the database
    await Juice_hs.deleteOne({ _id: _id });

    // Redirect to the delete page message
    res.redirect("/delete-page-message");
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Login routes
app_hs.get("/login", (req, res) => {
  res.render("pages/login-hs");
});

app_hs.post("/login", handleLogin);

// Logout route
app_hs.get("/logout", (req, res) => {
  console.log("Logging out...");
  isLoggedIn_hs = false;
  res.render("pages/logout-hs");
});

// New page message route
app_hs.get("/new-juice-order", async (req, res) => {
  const { juiceId } = req.query; // Change from req.body to req.query

  try {
    const orderDetails_hs = await Juice_hs.findOne({ _id: juiceId });
    if (orderDetails_hs) {
      res.render("pages/new-juice-order-hs", {
        isAdmin: isLoggedIn_hs,
        orderDetails_hs,
      });
    } else {
      res.status(404).send("Order not found");
    }
  } catch (error) {
    res.status(500).send(`Error fetching order details: ${error.message}`);
  }
});

// Delete page message route
app_hs.get("/delete-page-message", async (req, res) => {
  res.render("pages/delete-page-message-hs");
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (isLoggedIn_hs) {
    // Proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect("/login");
  }
}

// Function to handle login
async function handleLogin(req, res) {
  const { username, password } = req.body;
  const user_hs = await Admin_hs.findOne({ username, password });
  if (user_hs) {
    console.log("Login successful");

    // Set the global variable to true
    isLoggedIn_hs = true;

    res.redirect("/view-juices");
  } else {
    console.log("Login failed");
    res.redirect("/login");
  }
}

// Route to render admin header
app_hs.get("/admin-header", async function renderAdminHeader(req, res) {
  res.render("pages/admin-header-hs");
});
