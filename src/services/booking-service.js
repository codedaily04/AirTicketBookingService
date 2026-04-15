const axios = require('axios');

const{BookingRepository} = require('../Repository/index');
const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig');
const ServiceError = require('../utils/errors/service-error');

class BookingService{
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
        try {
            //First of all, we need to fetch the flightId from FlightAndSearch Microservice
            const flightId = data.flightId;
            // console.log(FLIGHT_SERVICE_PATH); 
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            // console.log("URL:", getFlightRequestURL);
            const response = await axios.get(getFlightRequestURL);
            // console.log("FULL RESPONSE:", response.data); 
            const flightData = response.data.data;
            // console.log(flightData);
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError('Something went wrong in the booking process', 'Insufficient seats in the flight');
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            /**
             * const totalCost = 6000;

             const bookingPayload = {
               userId: 1,
               flightId: 101,
               noOfSeats: 3,
               totalCost: 6000
             };
             */
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            console.log(updateFlightRequestURL);
            await axios.patch(updateFlightRequestURL, {totalSeats: flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status: "Booked"});
            return finalBooking;
                // return booking;

        } catch (error) {
            if(error.name=='RepositoryError' || error.name=='ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;