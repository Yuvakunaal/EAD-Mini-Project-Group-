import { model, Schema } from "mongoose";

const eventSchema = new Schema({
    adminusername: {
        type: String,
        required: true,
    },
    eventname: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    datetimeStart: {
        type: Date,
        required: true,
    },
    datetimeEnd: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    posterlink: {
        type: String,
        required: true,
    },
    meetlink:{
        type : String,
        default : "",
    },
    organizers : [{
        type : String,
    }],
    participants: [{
        type: String, // Array to store usernames of participants
    }],
});

const eventModel = model("events", eventSchema);

export default eventModel;
