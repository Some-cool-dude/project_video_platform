const mongoose = require('mongoose');

let videoSchema = new mongoose.Schema({
    title: String,
    format: String,
    quality: Number,
    size: Number,
    addedAt: Date,
    urlPath: String,
    poster: String,
    user_id: mongoose.Schema.Types.ObjectId,
    owner_id: mongoose.Schema.Types.ObjectId,
}, {
    versionKey: false
});

videoSchema.statics.insert = function (obj, owner_id, user_id, videoUrl, poster) {
    let date = new Date();
    obj.addedAt = date.toISOString().slice(0, 19) + 'Z';
    obj.size = parseInt(obj.size);
    obj.quality = parseInt(obj.quality);
    obj.owner_id = owner_id;
    obj.user_id = user_id
    obj.urlPath = videoUrl;
    obj.poster = poster;
    let Video = this.model('Videos');
    let video = new Video(obj);
    return video.save();
};

videoSchema.statics.update = function (id, size, title, quality) {
    let obj = {};
    obj.size = size;
    obj.title = title;
    obj.quality = quality;
    return Video.findByIdAndUpdate(id, obj);
}

const Video = mongoose.model('Videos', videoSchema);

module.exports = Video;