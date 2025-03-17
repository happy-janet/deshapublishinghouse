require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path"); // ✅ Add this to avoid "path is not defined" error

const Booking = require("./Models/PublishingBooking");
const app = express();

// Middleware
app.use(express.static("public")); // Serve static files
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(bodyParser.json()); // Parse JSON form data
app.use(
  cors({
    origin: [
      "https://deshapublishinghouse.com", 
      "https://www.deshapublishinghouse.com"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(helmet()); // Set security headers

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

// **Updated sendEmail Function for Gmail**
const sendEmail = async (recipient, subject, text, from) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Use an App Password if 2FA is enabled
      },
    });

    const mailOptions = {
      from: `"Desha Publishing House" <${process.env.EMAIL_USER}>`, // Keep your email
      to: recipient,
      subject: subject,
      text: text,
      replyTo: from || process.env.EMAIL_USER, // Use client's email for replies
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


// **Handle Publishing Booking Form Submission**
app.post("/book-publishing", async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      phone,
      country,
      bookTitle,
      wordCount,
      language,
      category,
      howFindUs,
      additionalInfo,
    } = req.body;

    console.log("Publishing Booking Data Received");

    // Send confirmation email to the client
    const clientSubject = "Publishing Booking Confirmation";
    const clientText = `Thank you for reaching out to us!\n\nHere are your submission details:\n- Name: ${name} ${surname}\n- Email: ${email}\n- Phone: ${phone}\n- Country: ${country}\n- Book Title: ${bookTitle}\n- Word Count: ${wordCount}\n- Language: ${language}\n- Category: ${category}\n- How Did You Find Us: ${howFindUs}\n- Additional Info: ${additionalInfo}`;

    await sendEmail(email, clientSubject, clientText);

    // Prepare the email for Desha
    const companySubject = "New Publishing Booking Received";
    const companyText = `New publishing request received!\n\nDetails:\n- Name: ${name} ${surname}\n- Email: ${email}\n- Phone: ${phone}\n- Country: ${country}\n- Book Title: ${bookTitle}\n- Word Count: ${wordCount}\n- Language: ${language}\n- Category: ${category}\n- How Did You Find Us: ${howFindUs}\n- Additional Info: ${additionalInfo}`;

    await sendEmail("deshaapps@gmail.com", companySubject, companyText);

    res.send("Your publishing submission has been received. We will get back to you soon!");
  } catch (error) {
    console.error("Error processing publishing booking:", error.message);
    res.status(500).send("There was an error processing your request. Please try again later.");
  }
});

// **Handle Contact Form Submission**
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("Contact form submitted:", { name, email, message });

    // Send email to Desha
    const companySubject = "New Contact Form Submission";
    const companyText = `New message received from ${name} (${email}):\n\n${message}`;

    await sendEmail("deshaapps@gmail.com", companySubject, companyText);

    res.send("Thank you for contacting us! We shall get back to you shortly.");
  } catch (error) {
    console.error("Error processing contact form:", error.message);
    res.status(500).send("There was an error processing your request.");
  }
});

// Serve Static Pages
app.get("/desha-blog", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "desha_blog.html"));
});

app.get("/echoes-of-africa", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "echoes-of-africa.html"));
});

// ✅ **FIX: Keep only ONE `PORT` declaration**
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
