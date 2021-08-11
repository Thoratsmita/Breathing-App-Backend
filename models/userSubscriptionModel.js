const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require("validator");

const userSubscriptionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    premium_user: {
        type: Boolean,
        default: false
    },

    subscription_type: {
        type: String,
        enum: ["Monthly", "Biannually", "Annually"]
    },

    subscription_validity: {
        type: Number
    },

    start_date: {
        type: Date
    },

    end_date: {
        type: Date
    },

    free_premium: {
        type: Boolean
    },

    free_premium_available: {
        type: Boolean
    },

    referral_code_applied: {
        type: String
    }
})

const UserSubscription = mongoose.model("UserSubscription", userSubscriptionSchema);
module.exports = UserSubscription;