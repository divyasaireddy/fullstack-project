import User from '../models/UserSchema.js';
import Booking from '../models/BookingSchema.js';
import Doctor from '../models/DoctorSchema.js';

// ✅ Update user (including profile picture)
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, phone, photo } = req.body; // Extract data

    try {
        const updatedUser = await User.findByIdAndUpdate(   
            id,
            { name, phone, photo }, // ✅ Store profile photo
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Successfully updated', data: updatedUser });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update', error: err.message });
    }
    
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Successfully deleted' });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete' });
    }
};

// ✅ Get single user
export const getSingleUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found' });
        }

        res.status(200).json({ success: true, message: 'User found', data: user });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Error finding user' });
    }
};

// ✅ Get all users
export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        res.status(200).json({ success: true, message: 'Users found', data: users });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Not found' });
    }
};

// ✅ Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated request

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User profile retrieved', data: user });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving user profile' });
    }
};

// ✅ Get user's bookings (appointments)
export const getMyAppointments = async (req, res) => {
    try {
      console.log("req.user received:", req.user);
  
      const userId = req.user?.id || req.user?._id;
  
      if (!userId) {
        return res.status(400).json({ success: false, message: 'No user ID found in token' });
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const bookings = await Booking.find({ user: userId });
      const doctorIds = bookings.map((el) => el.doctor);
      const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select('-password');
  
      res.status(200).json({
        success: true,
        message: 'Appointments retrieved successfully',
        data: { bookings, doctors },
      });
  
    } catch (err) {
      console.error('Appointment fetch error:', err);
      res.status(500).json({ success: false, message: 'Error retrieving appointments' });
    }
  };
  
  
  

// ✅ Book an appointment
// ✅ Book an appointment (Updated version)
export const bookAppointment = async (req, res) => {
    try {
      const { doctor, appointmentDate, ticketPrice, symptoms } = req.body;
  
      if (!doctor || !appointmentDate || !ticketPrice) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
  
      const booking = new Booking({
        doctor,
        user: req.user.id,
        ticketPrice,
        appointmentDate,
        symptoms: symptoms || "Not specified", // ✅ Add this line
        status: "pending",
        isPaid: false,
      });
  
      await booking.save();
  
      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        data: booking,
      });
    } catch (err) {
      console.error("Book appointment error:", err);
      res.status(500).json({ success: false, message: 'Error booking appointment', error: err.message });
    }
    console.log("Bookings being sent to frontend:", Booking);

  };
  
  
// ✅ Cancel an appointment

export const cancelAppointment = async (req, res) => {
    const { id } = req.params; // Extract booking ID from request parameters

    try {
        // Find and delete the booking
        const booking = await Booking.findByIdAndDelete(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment canceled successfully',
            data: booking
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Error canceling appointment' });
    }
}
// ✅ Get all appointments (for admin or doctor)
export const getAllAppointments = async (req, res) => {
    try {
        // Retrieve all bookings
        const bookings = await Booking.find({});

        res.status(200).json({
            success: true,
            message: 'All appointments retrieved successfully',
            data: bookings
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving appointments' });
    }
};
// ✅ Get a single appointment (for admin or doctor)
export const getSingleAppointment = async (req, res) => {
    const { id } = req.params; // Extract booking ID from request parameters

    try {
        // Find the booking by ID
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment retrieved successfully',
            data: booking
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving appointment' });
    }
};
// ✅ Update an appointment (for admin or doctor)
export const updateAppointment = async (req, res) => {
    const { id } = req.params; // Extract booking ID from request parameters
    const { doctor, date, time } = req.body; // Extract data from request body

    try {
        // Find and update the booking
        const booking = await Booking.findByIdAndUpdate(
            id,
            { doctor, date, time },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            data: booking
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating appointment' });
    }
};



  