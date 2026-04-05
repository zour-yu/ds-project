const Doctor = require("../models/Doctor");

exports.createDoctor = async (req, res) => {
    try {
        const existing = await Doctor.findOne({ userId: req.user.id });

        if (existing) {
            return res.status(400).json({ message: "Profile already exists" });
        }

        const doctor = new Doctor({
            ...req.body,
            userId: req.user.id
        });

        await doctor.save();
        res.json(doctor);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
    const doctors = await Doctor.find();
    res.json(doctors);
};

exports.getMyProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(doctor);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate(
            { userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!doctor) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(doctor);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addAvailability = async (req, res) => {
    try {
        const { date, startTime, endTime, slotDuration } = req.body;

        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Prevent duplicate date
        const alreadyExists = doctor.availability.find(a => a.date === date);

        if (alreadyExists) {
            return res.status(400).json({ message: "Availability already set for this date" });
        }

        const duration = slotDuration || doctor.slotDuration || 30;

        const generateSlots = (start, end, duration) => {
            const slots = [];
            let current = new Date(`1970-01-01T${start}:00`);
            const endTimeObj = new Date(`1970-01-01T${end}:00`);

            while (current < endTimeObj) {
                slots.push({
                    time: current.toTimeString().slice(0, 5),
                    isBooked: false
                });

                current.setMinutes(current.getMinutes() + duration);
            }

            return slots;
        };

        const slots = generateSlots(startTime, endTime, duration);

        doctor.availability.push({ date, slots });

        await doctor.save();

        res.json(doctor);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getDoctorAvailability = async (req, res) => {
    try {
        const doctorId = req.params.id;

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.json({
            doctorId: doctor._id,
            availability: doctor.availability
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctorId = req.params.id;

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.json(doctor);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.bookSlot = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const day = doctor.availability.find(d => d.date === date);

        if (!day) {
            return res.status(404).json({ message: "Date not available" });
        }

        const slot = day.slots.find(s => s.time === time);

        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        if (slot.isBooked) {
            return res.status(400).json({ message: "Already booked" });
        }

        slot.isBooked = true;

        await doctor.save();

        res.json({ message: "Slot booked successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.freeSlot = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;

        const doctor = await Doctor.findById(doctorId);

        const day = doctor.availability.find(d => d.date === date);

        const slot = day.slots.find(s => s.time === time);

        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        slot.isBooked = false;

        await doctor.save();

        res.json({ message: "Slot freed successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAvailability = async (req, res) => {
    try {
        const { doctorId, date } = req.body;

        const doctor = await Doctor.findById(doctorId);

        doctor.availability = doctor.availability.filter(
            d => d.date !== date
        );

        await doctor.save();

        res.json({ message: "Availability removed" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAvailability = async (req, res) => {
    try {
        const { doctorId, date, startTime, endTime, slotDuration } = req.body;

        const doctor = await Doctor.findById(doctorId);

        const day = doctor.availability.find(d => d.date === date);

        if (!day) {
            return res.status(404).json({ message: "Date not found" });
        }

        const duration = slotDuration || doctor.slotDuration || 30;

        // 🔹 Generate new slots
        const generateSlots = (start, end, duration) => {
            const slots = [];
            let current = new Date(`1970-01-01T${start}:00`);
            const endTimeObj = new Date(`1970-01-01T${end}:00`);

            while (current < endTimeObj) {
                slots.push(current.toTimeString().slice(0, 5));
                current.setMinutes(current.getMinutes() + duration);
            }

            return slots;
        };

        const newTimes = generateSlots(startTime, endTime, duration);

        //  Step 1 — Separate booked and free slots
        const bookedSlots = day.slots.filter(s => s.isBooked);
        const freeSlots = day.slots.filter(s => !s.isBooked);

        //  Step 2 — Create new free slots only
        const newFreeSlots = newTimes.map(time => ({
            time,
            isBooked: false
        }));

        //  Step 3 — Merge booked slots ALWAYS (no matter what)
        const finalSlotsMap = new Map();

        // add new free slots
        newFreeSlots.forEach(slot => {
            finalSlotsMap.set(slot.time, slot);
        });

        // add booked slots (override if exists)
        bookedSlots.forEach(slot => {
            finalSlotsMap.set(slot.time, slot);
        });

        // 🔥 Step 4 — Convert map → array and sort
        const finalSlots = Array.from(finalSlotsMap.values()).sort((a, b) =>
            a.time.localeCompare(b.time)
        );

        day.slots = finalSlots;

        await doctor.save();

        res.json({
            message: "Availability updated safely",
            slots: finalSlots
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};