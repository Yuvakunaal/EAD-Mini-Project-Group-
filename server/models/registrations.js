import { model, Schema } from "mongoose";

const registerSchema = Schema({
    username: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    phno: {
        type: Number,
        required: true,
    },
    eventid: {
        type: Schema.Types.ObjectId, 
        ref: "events", 
        required: true,
    },
});

const registerModel = model("registrations", registerSchema);

export default registerModel;
