const mongoose = require('mongoose');

let subscribeSchema = new mongoose.Schema({
    channel_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
}, {
    versionKey: false
});

subscribeSchema.statics.insert = function (ch_id, user_id) {
    let Subscribe = this.model('Subscribes');
    let subscribe = new Subscribe({channel_id: ch_id, user_id: user_id});
    return subscribe.save();
};

const Subscribe = mongoose.model('Subscribes', subscribeSchema);

module.exports = Subscribe;