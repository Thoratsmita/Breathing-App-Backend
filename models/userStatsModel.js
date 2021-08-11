const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require("validator");

const userStatsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    date_joined: {
        type: Date
    },

    last_login: {
        type: Date
    },

    total_breathe_sessions: {
        type: Number,
    },

    total_sleep_sessions: {
        type: Number,
    },

    total_relax_sessions: {
        type: Number,
    },

    total_meditation_sessions: {
        type: Number,
    },

    total_relax_music_played: {
        type: Number,
    },

    is_active: {
        type: Boolean
    }
})

const UserStats = mongoose.model("UserStats", userStatsSchema);
module.exports = UserStats;