const mongoose = require('mongoose');

let channelSchema = new mongoose.Schema({
    title: String,
    createdAt: Date,
    chimgUrl: String,
    owner_id: mongoose.Schema.Types.ObjectId,
    subscribers: {type: Number, default: 0},
}, {
    versionKey: false
});

channelSchema.statics.insert = function (obj, owner_id) {
    let date = new Date();
    obj.createdAt = date.toISOString().slice(0, 19) + 'Z';
    obj.chimgUrl = obj.chimgUrl;
    obj.owner_id = owner_id;
    let Channel = this.model('Channels');
    let channel = new Channel(obj);
    return channel.save();
};

channelSchema.statics.update = function(id, title) {
    let obj = {};
    obj.title = title;
    return Channel.findByIdAndUpdate(id, obj);
}

const Channel = mongoose.model('Channels', channelSchema);

module.exports = Channel;