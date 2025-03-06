require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const axios = require("axios");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path"); // Add this line if it's missing

const Booking = require("./Models/Booking");
const app = express();

// Middleware
app.use(express.static("public")); // Serve static files
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(bodyParser.json()); // Parse JSON form data
app.use(
  cors({
    origin: "https://your-frontend-domain.com", // Replace with your frontend domain
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet()); // Set security headers

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });


// Update the sendEmail function
const sendEmail = async (recipient, subject, text, from) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: from || process.env.EMAIL_USER, // Use client's email if provided
      to: recipient,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

app.get("/blog1", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "./blog1.html"));
});

app.get("/blog2", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "./blog2.html"));
});



// Handle General Booking Form Submission
app.post("/book", async (req, res) => {
  try {
    // Capture all fields from the generic booking form
    const { placeName, numberOfGuests, arrivalDate, leavingDate, email } =
      req.body;

    // Process the booking data
    console.log("General Booking Data:", {
      placeName,
      numberOfGuests,
      arrivalDate,
      leavingDate,
    });

    // Send confirmation email to the client
    const clientSubject = "Booking Confirmation";
    const clientText = `Thank you for your booking!\n\nDetails:\n- Place: ${placeName}\n- Number of Guests: ${numberOfGuests}\n- Arrival Date: ${arrivalDate}\n- Leaving Date: ${leavingDate}`;
    await sendEmail(email, clientSubject, clientText); // Send email to client

    // Prepare the email to the company
    const companySubject = "New General Booking Received";
    const companyText = `New booking received!\n\nDetails:\n- Place: ${placeName}\n- Number of Guests: ${numberOfGuests}\n- Arrival Date: ${arrivalDate}\n- Leaving Date: ${leavingDate}`;

    // Send email to the company
    await sendEmail("deshapublishinghousehelp@outlook.com", companySubject, companyText);

    // Respond to the client
    res.send("Your submission has been received , we shall get back to you very soon!");
  } catch (error) {
    console.error("Error processing booking:", error.message);
    res
      .status(500)
      .send(
        "There was an error processing your request. Please try again later."
      );
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});























// OAuth 1.0a setup for Pesapal
// const oauth = OAuth({
//   consumer: {
//     key: process.env.PESAPAL_CONSUMER_KEY,
//     secret: process.env.PESAPAL_CONSUMER_SECRET,
//   },
//   signature_method: "HMAC-SHA1",
//   hash_function(base_string, key) {
//     return crypto.createHmac("sha1", key).update(base_string).digest("base64");
//   },
// });

// // Handle Pesapal payment request
// app.post("/pay", async (req, res) => {
//   const { amount, currency, description, callback_url } = req.body;

//   // Pesapal endpoint
//   const pesapalUrl =
//     "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken";

//   // Prepare OAuth request
//   const request_data = {
//     url: pesapalUrl,
//     method: "POST",
//     data: {},
//   };

//   // Generate OAuth headers
//   const headers = oauth.toHeader(oauth.authorize(request_data));

//   try {
//     // Request authentication token from Pesapal
//     const authResponse = await axios.post(pesapalUrl, {}, { headers });

//     const token = authResponse.data.token; // Extract token from response

//     // Prepare payment request
//     const paymentPayload = {
//       amount,
//       currency,
//       description,
//       callback_url: process.env.PESAPAL_CALLBACK_URL,
//       notification_id: process.env.PESAPAL_NOTIFICATION_ID,
//       reference: "order_id", // Use your actual order ID or generate a unique ID
//     };

//     const paymentResponse = await axios.post(
//       "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest",
//       paymentPayload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Redirect user to Pesapal payment page
//     res.redirect(paymentResponse.data.redirect_url);
//   } catch (error) {
//     console.error("Error initiating payment:", error);
//     res.status(500).send("Error initiating payment");
//   }
// });

// // Callback route to handle Pesapal response
// app.post("/callback", (req, res) => {
//   const { status, transaction_id, order_id } = req.body;

//   // Handle the payment response from Pesapal
//   if (status === "COMPLETED") {
//     console.log("Payment successful:", { transaction_id, order_id });
//     res.send("Payment successful");
//   } else {
//     console.log("Payment failed:", { transaction_id, order_id });
//     res.send("Payment failed");
//   }
// });




// Handle Sipifalls Booking Form Submission
// app.post("/sipifalls", async (req, res) => {
//   console.log("Received POST request to /sipifalls"); // Log request received
//   try {
//     const {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     } = req.body;

//     console.log("Sipifalls Booking Data:", {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     });

//     // You can send a confirmation email for Sipifalls booking here if needed
//     res.send("Your booking for Sipifalls has been received!");
//   } catch (error) {
//     console.error("Error processing Sipifalls booking:", error.message);
//     res
//       .status(500)
//       .send(
//         "There was an error processing your request. Please try again later."
//       );
//   }
// });

// // Serve Queen Elizabeth Booking Form
// app.get("/queen-elizabeth", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "./queen-elizabeth.html"));
// });

// // Handle Queen Elizabeth Booking Form Submission
// app.post("/queen-elizabeth", async (req, res) => {
//   console.log("Received POST request to /queen-elizabeth"); // Log request received
//   try {
//     const {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     } = req.body;

//     console.log("Queen Elizabeth Booking Data:", {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     });

//     // You can send a confirmation email for Queen Elizabeth booking here if needed
//     res.send("Your booking for Queen Elizabeth has been received!");
//   } catch (error) {
//     console.error("Error processing Queen Elizabeth booking:", error.message);
//     res
//       .status(500)
//       .send(
//         "There was an error processing your request. Please try again later."
//       );
//   }
// });

// // Serve Mount Rwenzori Booking Form
// app.get("/mount-rwenzori", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "./mount-rwenzori.html"));
// });

// // Handle Mount Rwenzori Booking Form Submission
// app.post("/mount-rwenzori", async (req, res) => {
//   console.log("Received POST request to /mount-rwenzori"); // Log request received
//   try {
//     const {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     } = req.body;

//     console.log("Mount Rwenzori Booking Data:", {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     });

//     // You can send a confirmation email for Mount Rwenzori booking here if needed
//     res.send("Your booking for Mount Rwenzori has been received!");
//   } catch (error) {
//     console.error("Error processing Mount Rwenzori booking:", error.message);
//     res
//       .status(500)
//       .send(
//         "There was an error processing your request. Please try again later."
//       );
//   }
// });

// // Serve Lake Mburo Booking Form
// app.get("/lake-mburo", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "./lake-mburo.html"));
// });

// // Handle Lake Mburo Booking Form Submission
// app.post("/lake-mburo", async (req, res) => {
//   console.log("Received POST request to /lake-mburo"); // Log request received
//   try {
//     const {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     } = req.body;

//     console.log("Lake Mburo Booking Data:", {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     });

//     // You can send a confirmation email for Lake Mburo booking here if needed
//     res.send("Your booking for Lake Mburo has been received!");
//   } catch (error) {
//     console.error("Error processing Lake Mburo booking:", error.message);
//     res
//       .status(500)
//       .send(
//         "There was an error processing your request. Please try again later."
//       );
//   }
// });

// // Serve Kidepo Booking Form
// app.get("/kidepo", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "./kidepo.html"));
// });

// // Handle Kidepo Booking Form Submission
// app.post("/kidepo", async (req, res) => {
//   console.log("Received POST request to /kidepo"); // Log request received
//   try {
//     const {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     } = req.body;

//     console.log("Kidepo Booking Data:", {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     });

//     // You can send a confirmation email for Kidepo booking here if needed
//     res.send("Your booking for Kidepo has been received!");
//   } catch (error) {
//     console.error("Error processing Kidepo booking:", error.message);
//     res
//       .status(500)
//       .send(
//         "There was an error processing your request. Please try again later."
//       );
//   }
// });

// // Serve Gorilla Booking Form
// app.get("/gorilla", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "./gorilla.html"));
// });

// // Handle Gorilla Booking Form Submission
// app.post("/gorilla", async (req, res) => {
//   console.log("Received POST request to /gorilla"); // Log request received
//   try {
//     const {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     } = req.body;

//     console.log("Gorilla Booking Data:", {
//       name,
//       email,
//       phone,
//       adults,
//       children,
//       nationality,
//       accommodationType,
//       safariPackage,
//       safariType,
//       startDate,
//       endDate,
//       specialRequests,
//     });

//     // You can send a confirmation email for Gorilla booking here if needed
//     res.send("Your booking for Gorilla has been received!");
//   } catch (error) {
//     console.error("Error processing Gorilla booking:", error.message);
//     res
//       .status(500)
//       .send(
//         "There was an error processing your request. Please try again later."
//       );
//   }
// });
