const { StatusCodes } = require('http-status-codes');

const { Booking } = require('../models/index');
const { AppError, ValidationError } = require('../utils/errors/index');
//error handling with error utils 

class BookingRepository {
    async create(data) {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if(error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'Repository Error',
                'Error creating booking',
                'There was some issue in creating the booking, please again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getBookingById(id) {
        try {
            const booking = await Booking.findByPk(id);
            return booking;
        } catch (error) {
            if(error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            throw new AppError(
                'Repository Error',
                'Error getting bookingId',
                'There was some issue in getting the booking, please again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateBooking(id, data) {
        try {
            const booking = await Booking.findByPk(id);
            if (!booking) {
                throw new Error('Booking not found');
            }
            await booking.update(data);
            return booking;
        } catch (error) {
            console.error('Error updating booking:', error);
            throw error;
        }
    }

    async deleteBooking(id) {
        try {
            const booking = await Booking.findByPk(id);
            if (!booking) {
                throw new Error('Booking not found');
            }
            await booking.destroy();
            return true;
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw error;
        }
    }
}

module.exports = BookingRepository;