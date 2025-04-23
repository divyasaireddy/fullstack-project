import Doctor from '../models/DoctorSchema.js';
import Booking from '../models/BookingSchema.js';

// Update Doctor
export const updateDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, { $set: req.body }, { new: true });

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.status(200).json({ success: true, message: 'Successfully updated', data: updatedDoctor });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update', error: err.message });
    }
};

// Delete Doctor
export const deleteDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(id);

        if (!deletedDoctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.status(200).json({ success: true, message: 'Successfully deleted' });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete', error: err.message });
    }
};

// Get single Doctor
export const getSingleDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const doctor = await Doctor.findById(id).populate('reviews').select('-password');

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'No Doctor found' });
        }

        res.status(200).json({ success: true, message: 'Doctor found', data: doctor });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Error finding Doctor', error: err.message });
    }
};

// Get all Doctors
export const getAllDoctor = async (req, res) => {

    try {
        
        const {query}=req.query
        let doctors;

        if(query){
            doctors=await Doctor.find({isApproved:'approved', $or:[{name:{$regex:query , $options:'i'}},
                {specialization:{$regex:query , $options:'i'}},
            ],
            }).select('-password')
        }else{

            doctors = await Doctor.find({isApproved:"approved"}).select('-password');
        }


        res.status(200).json({ success: true, message: 'Doctors found', data: doctors });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Not found', error: err.message });
    }
};


export const getDoctorProfile = async (req, res) => {
    const doctorId = req.userId;

    try {
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res
                .status(404)
                .json({ success: false, message: "Doctor not found" });
        }

        const { password, ...rest } = doctor._doc;
        const appointments = await Booking.find({ doctor: doctorId });

        res.status(200).json({
            success: true,
            message: "Profile info is getting",
            data: { ...rest, appointments },
        });
    } catch (err) {
        res
            .status(500)
            .json({ success: false, message: "Something went wrong, cannot get" });
    }
};
