const { StatusCodes } = require('http-status-codes');
const  { BookingService } = require('../services/index');

const bookingService = new BookingService();

const create = async (req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            message: "Successfully created a booking",
            success: true,
            data: response,
            err:{}
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({
            data: {},
            success: false,
            message: error.message,
            err: error.explanation
        });
    }
}

module.exports = {
    create
}