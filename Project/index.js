// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fileUpload = require("express-fileupload");
const fs = require("fs");

// Create an Express app
const app = express();
let globalPageTitles = [];

// Middleware to fetch page data from MongoDB
app.use(async function fetchPageDataMiddleware(req, res, next) {
  try {
    // Fetch all documents from the "pages" collection if globalPageTitles is empty
    const allPages = await Page.find({}, "title");
    globalPageTitles = allPages.map((page) => page.title);

    // Make globalPageTitles available to all templates
    res.locals.pageTitles = globalPageTitles;

    // Call the function to generate EJS files and update s
    generateEJSFiles();

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    // Handle the error, for example, render an error page
    res.status(500).send("Internal Server Error");
  }
});

// Middleware for handling file uploads
app.use(fileUpload());

// Define MongoDB Schemas
const AdminSchema = new mongoose.Schema({
  username: String,
  password: Number,
});

const PageSchema = new mongoose.Schema({
  title: String,
  pageTitle: String,
  imgSrc: String,
  body: String,
});

// Create MongoDB Models
const Admin = mongoose.model("admin", AdminSchema);
const Page = mongoose.model("pages", PageSchema);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/fashion_store")
  .then(() => {
    console.log("Connected to MongoDB");
    createCollections();
    createDefaultDocuments();
    startServer();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Function to create collections if they don't exist
async function createCollections() {
  const collections = await mongoose.connection.db.collections();
  const collectionNames = collections.map(
    (collection) => collection.collectionName
  );

  if (!collectionNames.includes("admin")) {
    await Admin.createCollection();
    console.log("Collection created: admin");
  }

  if (!collectionNames.includes("pages")) {
    await Page.createCollection();
    console.log("Collection created: Page");
  }
}

// Function to create default documents if they don't exist
async function createDefaultDocuments() {
  createAdminDocument("hamza", 123);
  createPageDocument(
    "Home",
    "About",
    "public/img/main-pic.jpg",
    "<h1>Welcome to Fashion Store!</h1><p>At Fashion Store, we believe that fashion is more than just clothing; it's a form of self-expression, an art that reflects your unique style and personality...</p>"
  );
}

// Function to create an admin document
async function createAdminDocument(adminUsername, adminPassword) {
  const existingAdmin = await Admin.findOne({ username: adminUsername });
  if (!existingAdmin) {
    const newAdmin = new Admin({
      username: adminUsername,
      password: adminPassword,
    });
    await newAdmin.save();
    console.log("Admin document created:", adminUsername);
  }
}

// Function to create a page document
async function createPageDocument(
  pageTitle,
  pageHeading,
  imgSource,
  pageBody
) {
  const existingPage = await Page.findOne({ title: pageTitle });
  if (!existingPage) {
    const newPage = new Page({
      title: pageTitle,
      pageTitle: pageHeading,
      imgSrc: imgSource,
      body: pageBody,
    });
    await newPage.save();
    console.log("Page document created:", pageTitle);
  }
}

// Function to start the Express server
function startServer() {
  app.listen(8080, () => {
    console.log("Server is listening on port 8080");
  });
}

// Set up view engine and middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

// Define routes

// Home route
app.get("/home", renderHomePage);
app.get("/", renderHomePage);

// Edit page route
app.get("/edit-page", renderEditPage);

// Delete page route
app.post("/delete-page", deletePage);

// Update page route
app.get("/update-page", renderUpdatePage);

// Admin welcome route
app.get("/admin-welcome", (req, res) => {
  res.render("pages/admin-welcome");
});

// Login routes
app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.post("/login", handleLogin);

// New page routes
app.get("/new-page", (req, res) => {
  res.render("pages/new-page");
});

app.post("/submit-new-page", submitNewPage);

// Logout route
app.get("/logout", (req, res) => {
  res.render("pages/logout");
});

// Edit page message route
app.get("/edit-page-message", (req, res) => {
  res.render("pages/edit-page-message");
});

// New page message route
app.get("/new-page-message", (req, res) => {
  res.render("pages/new-page-message");
});

// Delete page message route
app.get("/delete-page-message", (req, res) => {
  res.render("pages/delete-page-message");
});

// Function to render the home page
async function renderHomePage(req, res) {
  try {
    const homeData = await Page.findOne({ title: "Home" });
    if (!homeData) {
      console.error("Home page not found");
      return res.status(500).send("Internal Server Error");
    }
    res.render("pages/home", { homeData });
  } catch (error) {
    console.error("Error retrieving home page data:", error);
    return res.status(500).send("Internal Server Error");
  }
}
// Function to render the edit page
async function renderEditPage(req, res) {
  try {
    const allPages = await Page.find({}, "title");
    const pageTitles = allPages.map((page) => page.title);
    res.render("pages/edit-page", { pageTitles });
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    return res.status(500).send("Internal Server Error");
  }
}

// Function to delete a page
async function deletePage(req, res) {
  try {
    const { pageTitle } = req.body;
    console.log(`Deleting page: ${pageTitle}`);

    // Find the page in the database
    const page = await Page.findOne({ title: pageTitle });

    if (!page) {
      console.error("Page not found");
      return res.status(500).send("Internal Server Error");
    }

    // Get the paths
    const imgSrc = page.imgSrc;
    const ejsFilePath = path.join(
      __dirname,
      "views",
      "pages",
      `${pageTitle.toLowerCase().replace(/\s+/g, '-')}.ejs`
    );

    console.log(`Deleting EJS file: ${ejsFilePath}`);

    // Delete the EJS file
    await fs.unlinkSync(ejsFilePath);

    console.log(`Unlinking image file: ${imgSrc}`);

    // Unlink the image file
    await fs.unlinkSync(path.join(__dirname, imgSrc));

    console.log("Deleting page from the database");

    // Delete the page from the database
    await Page.deleteOne({ title: pageTitle });

    console.log("Removing route from index.js");

    // Remove the route from index.js
    const indexFilePath = path.join(__dirname, "index.js");
    const routeToRemove = generatePageRoute(page); // Use the same function to generate the route

    const indexFileContent = fs.readFileSync(indexFilePath, "utf-8");

    // Remove the route content from the index file
    const updatedIndexFileContent = indexFileContent.replace(
      routeToRemove,
      ""
    );

    // Write the updated content back to the index file
    fs.writeFileSync(indexFilePath, updatedIndexFileContent);
    console.log("Route removed from index.js");

    // Redirect to the delete page message
    res.redirect("/delete-page-message");
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Function to render the update page
async function renderUpdatePage(req, res) {
  try {
    const pageTitle = req.query.title;
    const pageData = await Page.findOne({ title: pageTitle });
    if (!pageData) {
      console.error("Page not found");
      return res.status(500).send("Internal Server Error");
    }
    res.render("pages/update-page", { pageData });
  } catch (error) {
    console.error("Error retrieving page data:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Function to handle login
async function handleLogin(req, res) {
  const { username, password } = req.body;
  const user = await Admin.findOne({ username, password });
  if (user) {
    console.log("Login successful");
    res.redirect("/admin-welcome");
  } else {
    console.log("Login failed");
    res.redirect("/login");
  }
}

// Function to submit a new page
async function submitNewPage(req, res) {
  const { pageTitleText, pageContent } = req.body;
  const uploadedFile = req.files && req.files.imageUpload;

  try {
    if (uploadedFile) {
      const fileName = `${uploadedFile.name}`;
      const filePath = path.join(__dirname, "public", "img", fileName);

      uploadedFile.mv(filePath, async (err) => {
        if (err) {
          console.error("Error saving file:", err);
          res.status(500).send("Internal Server Error");
          return;
        }

        const newPage = new Page({
          title: pageTitleText,
          pageTitle: pageTitleText,
          body: pageContent,
          imgSrc: `public/img/${fileName}`,
        });

        try {
          const savedPage = await newPage.save();
          console.log("New Page saved:", savedPage);
          res.redirect("/new-page-message");
        } catch (saveError) {
          console.error("Error saving page:", saveError);
          res.status(500).send("Internal Server Error");
        }
      });
    } else {
      console.error("Failed to upload file");
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error("Error saving page:", error);
    res.status(500).send("Internal Server Error");
  }
}

app.post("/submit-update-page", async (req, res) => {
  const { pageTitleText, pageContent, pageId } = req.body;
  const uploadedFile = req.files && req.files.imageUpload;

  try {
    // Retrieve the existing Page document to get the old imgSrc
    const existingPage = await Page.findById(pageId);

    // Check if a file was uploaded
    if (uploadedFile) {
      // Create a unique filename for the uploaded file
      const fileName = `${uploadedFile.name}`;
      const filePath = path.join(__dirname, "public", "img", fileName);

      // Write the file to the server
      uploadedFile.mv(filePath, async (err) => {
        if (err) {
          console.error("Error saving file:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        console.log("File saved:", filePath);

        // Update the existing Page document based on id
        try {
          const updatedPage = await Page.findByIdAndUpdate(
            pageId,
            {
              pageTitle: pageTitleText,
              body: pageContent,
              imgSrc: `public/img/${fileName}`,
            },
            { new: true } // Set to true to return the updated document
          );

          console.log("Page Id:", pageId);
          console.log("Page updated:", updatedPage);

          // Delete the old image file
          if (existingPage && existingPage.imgSrc) {
            const oldFilePath = path.join(__dirname, existingPage.imgSrc);
            fs.unlink(oldFilePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Error deleting old image:", unlinkErr);
              } else {
                console.log("Old image deleted:", oldFilePath);
              }
            });
          }

          res.redirect("/edit-page-message"); // Redirect to the updated page or another page
        } catch (updateError) {
          console.error("Error updating page:", updateError);
          res.status(500).send("Internal Server Error");
        }
      });
    } else {
      // If no file is uploaded, update without modifying the imgSrc field
      try {
        const updatedPage = await Page.findByIdAndUpdate(
          pageId,
          {
            pageTitle: pageTitleText,
            body: pageContent,
          },
          { new: true } // Set to true to return the updated document
        );

        console.log("Page Id:", pageId);
        console.log("Page updated:", updatedPage);

        res.redirect("/edit-page-message"); // Redirect to the updated page or another page
      } catch (updateError) {
        console.error("Error updating page:", updateError);
        res.status(500).send("Internal Server Error");
      }
    }
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/admin-header", async function renderAdminHeader(req, res) {
  try {
    // Fetch all documents from the "pages" collection
    const allPages = await Page.find({}, "title");

    // Extract the "title" field from each document
    const pageTitles = allPages.map((page) => page.title);

    // Render the "edit-page" view and pass the titles array
    res.render("pages/admin-header", { pageTitles });
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    // Handle the error, for example, render an error page
    res.status(500).send("Internal Server Error");
  }
});

function generateEJSContent() {
  return `<!DOCTYPE html>
<html lang="en">

<%- include('../partials/head', { pageTitle: pageData.pageTitle }); %>

<body>
    <div class="container">

        <%- include('../partials/header'); %>

        <main>
            <img src="<%= pageData.imgSrc %>" alt="Main Image">
            <%- pageData.body %>
        </main>
        <%- include('../partials/footer'); %>
    </div>
</body>

</html>`;
}

async function generateEJSFiles() {
  try {
    // Fetch all documents from the "pages" collection and convert to plain JavaScript objects
    const allPages = await Page.find({}).lean().exec();

    // Create a views/pages directory if it doesn't exist
    const pagesDirectory = path.join(__dirname, "views", "pages");
    fs.mkdirSync(pagesDirectory, { recursive: true });

    // Iterate through each page and create an EJS file
    for (const page of allPages) {
      const sanitizedPageName = page.title.toLowerCase().replace(/\s+/g, '-');
      const pageFilePath = path.join(pagesDirectory, `${sanitizedPageName}.ejs`);

      try {
        // Check if the file already exists
        if (!fs.existsSync(pageFilePath)){
          const ejsContent = generateEJSContent();
          fs.writeFileSync(pageFilePath, ejsContent);
          console.log(`EJS file created: ${sanitizedPageName}.ejs`);

          // Add route content for the current page
          const route = generatePageRoute(page);
          // Update the index.js file with the accumulated route content
          const indexFilePath = path.join(__dirname, "index.js");
          fs.appendFileSync(indexFilePath, route);

          console.log(`${sanitizedPageName} Route added to index.js`);
        }
      } catch (error) {
        console.error("Error generating EJS files:", error);
      }
    }
  } catch (error) {
    console.error("Error generating EJS files:", error);
  }
}

function generatePageRoute(page) {
  // Exclude the 'Home' page from routes
  if (page.title.toLowerCase() !== "home") {
    const route = `
// ${page.pageTitle} route
app.get("/${page.title.toLowerCase().replace(/\s+/g, "-")}", async (req, res) => {
  try {
    const pageData = await Page.findOne({ title: "${page.title}" });
    if (!pageData) {
      console.error("${page.title} page not found");
      return res.status(500).send("Internal Server Error");
    }
    res.render("pages/${page.title.toLowerCase().replace(/\s+/g, "-")}", { pageData });
  } catch (error) {
    console.error("Error retrieving ${page.title} page data:", error);
    res.status(500).send("Internal Server Error");
  }
});`;
    return route;
  }
  return ""; // Return an empty string for the 'Home' page
}


// hoodie route
app.get("/hoodie", async (req, res) => {
  try {
    const pageData = await Page.findOne({ title: "hoodie" });
    if (!pageData) {
      console.error("hoodie page not found");
      return res.status(500).send("Internal Server Error");
    }
    res.render("pages/hoodie", { pageData });
  } catch (error) {
    console.error("Error retrieving hoodie page data:", error);
    res.status(500).send("Internal Server Error");
  }
});
// hamza route
app.get("/hamza", async (req, res) => {
  try {
    const pageData = await Page.findOne({ title: "hamza" });
    if (!pageData) {
      console.error("hamza page not found");
      return res.status(500).send("Internal Server Error");
    }
    res.render("pages/hamza", { pageData });
  } catch (error) {
    console.error("Error retrieving hamza page data:", error);
    res.status(500).send("Internal Server Error");
  }
});