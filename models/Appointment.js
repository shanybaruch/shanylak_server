const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: { type: String, required: true },
    day: { type: String, required: true },
    hour: { type: String, required: true },
    additionalNotes: { type: String },
    longNails: { type: Boolean, default: false },
    nailFixNeeded: { type: Boolean, default: false },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
