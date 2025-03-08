const mongoose = require('mongoose');

// Define the publishing booking schema
const publishingBookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  bookTitle: { type: String, required: false },
  wordCount: { type: String, required: true },
  language: { type: String, required: true },
  category: { type: String, required: true },
  howFindUs: { type: String, required: false },
  additionalInfo: { type: String, required: false }
});

// Create the publishing booking model
const PublishingBooking = mongoose.model('PublishingBooking', publishingBookingSchema);

module.exports = PublishingBooking;




// const mongoose = require('mongoose');

// // Define the booking schema
// const bookingSchema = new mongoose.Schema({
//   placeName: {
//     type: String,
//     required: true
//   },
//   numberOfGuests: {
//     type: Number,
//     required: true
//   },
//   arrivalDate: {
//     type: Date,
//     required: true
//   },
//   leavingDate: {
//     type: Date,
//     required: true
//   }
// });

// // Create the booking model
// const Booking = mongoose.model('Booking', bookingSchema);

// module.exports = Booking;
