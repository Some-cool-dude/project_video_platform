const user = require('../models/user');
const video = require('../models/video');
const channel = require('../models/channel');
const subscribe = require('../models/subsribe');

const express = require('express');
const router = express.Router();
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = (passport) => {
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'dsdy4#%$#hsgdfY%dRDgs65fgsdfdfT%$$35a3s54H\h/fbfd'
    },
    function (jwtPayload, cb) {
        return user.findById(jwtPayload.id)
            .then(user => cb(null, user))
            .catch(err => cb(err));
    }
    ));
     
     passport.serializeUser((user, done) => {
         done(null, user.id);
     });
       
     passport.deserializeUser((id, done) => {
         user.findById(id, (err, user) => {
             done(err, user);
         });
     });

     router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
            res.json(req.user);
        });
     
     router.get('/', (req, res) => {
         res.json();
     });

     router.post('/register', async (req, res) => {
        try
        {
            if(!req.body.username || !req.body.password) return res.status(400).json({message: "Please fill username and password"});
            if(req.body.password !== req.body.repeat) return res.status(400).json({message: "Password does nor match"});
            let data = await user.findOne({login: req.body.username})
            if(data) return res.status(400).json({message: "This username is already exist"});
            data = await user.insert(req.body.username, req.body.password, req.body.fullname);
            const token = jwt.sign({ id: data.id }, 'dsdy4#%$#hsgdfY%dRDgs65fgsdfdfT%$$35a3s54H\h/fbfd');
            return res.json({ data, token });
        }
        catch(err)
        {
            res.status(500).json(err);
        }
     });

     router.post('/login', async (req, res) => {
        try
        {
            if(!req.body.username || !req.body.password) return res.status(400).json({message: "Please fill username and password"});
            let data = await user.findOne({login: req.body.username});
            if(!data || !await data.verifyPassword(req.body.password)) return res.status(400).json({message: "Wrong password or username"});
            const token = jwt.sign({ id: data.id }, 'dsdy4#%$#hsgdfY%dRDgs65fgsdfdfT%$$35a3s54H\h/fbfd');
            return res.json({ user: data, token });
        }
        catch(err)
        {
            console.log(err);
            res.status(500).json(err);
        }
     });

     router.use('/subscribes', passport.authenticate('jwt', { session: false }), checkAuth);

     router.route('/subscribes')
     .post(async (req, res) => {
         try {
            await subscribe.insert(req.body.ch_id, req.body.user_id);
            let count = req.body.subscribers;
            count++;
            let data = await channel.findByIdAndUpdate(req.body.ch_id, {subscribers: count});
            res.json(data);
         }
         catch(err) {
            res.status(500).json(err);
         }
     })

     router.route('/subscribes/:id')
     .get((req, res) => {
        subscribe.findOne({user_id: req.params.id})
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(500).json(err));
    })

     router.use('/users', passport.authenticate('jwt', { session: false }), checkAdmin);
     
     router.route('/users')
     .get(async (req, res) => {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        if (page < 1) return res.sendStatus(400);
        let count = 3;
        let offset = (page - 1) * count;
        let limit = count;
        let search = req.query.search;
        let query = new RegExp(search, "i");
        try {
            let pages = await user.countDocuments({login: query});
            search = pages;
            if (page > pages && pages !== 0) return res.sendStatus(400);
            let data = await user.find().skip(offset).limit(limit).exec();
            pages = Math.ceil(pages/count);
            res.json({items: data, page: page, pages: pages, search: search});
        }
        catch(err) {
            res.status(500).json(err);
        }
     })
     .post(async (req, res) => {
        try {
            let data = await user.findOne({login: req.body.username});
            if (!data) {
                data = await user.insert(req.body.username, req.body.password, req.body.fullname);
                res.status(201).json(data);
            }
            else {
                res.status(400).json({message: "This user is already exist"});
            }
        }
        catch(error) {
            res.status(500).json(error);
        }
     });

     router.route('/users/:id')
     .get((req, res) => {
         user.findById(req.params.id)
         .then(data => {
             if (!data) return res.sendStatus(404);
             res.json(data);
         })
         .catch(err => {
             if (err.name === "CastError") return res.sendStatus(404);
             res.status(500).json(err);
        });
     })
     .put((req, res) => {
        user.update(req.params.id, req.body.avaUrl, req.body.fullname, req.body.password, req.body.role)
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err));
     })
     .delete((req, res) => {
        Promise.all([user.findByIdAndDelete(req.params.id), video.deleteMany({user_id: req.params.id}), channel.deleteMany({owner_id: req.params.id})])
        .then(() => res.sendStatus(204))
        .catch(err => res.status(500).send(err))
     })
     
     router.route('/videos')
     .get(async (req, res) => {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        if (page < 1) return res.sendStatus(400);
        let count = 3;
        let offset = (page - 1) * count;
        let limit = count;
        let search = req.query.search;
        let query = new RegExp(search, "i");
        try {
            let pages = await video.countDocuments({title: query});
            search = pages;
            if (page > pages && pages !== 0) return res.sendStatus(400);
            let data = await video.find({title: query}).skip(offset).limit(limit).exec();
            pages = Math.ceil(pages/count);
            res.json({items: data, page: page, pages: pages, search: search});
        }
        catch(err) {
            res.status(500).json(err);
        }
     })
     .post(passport.authenticate('jwt', { session: false }), checkAuth, async (req, res) => {
        try {
            if (!req.body) return res.sendStatus(400);
            let owner = req.user.id;
            if (req.body.ch) {
                let id = await channel.findById(req.body.ch, 'owner_id');
                if (id.toString() === req.user.id) {
                    owner = id;
                }
                else {
                    return res.sendStatus(403);
                }
            }
            let data = await video.insert(req.body, owner, req.user.id, req.body.videoUrl, req.body.posterUrl)
            res.status(201).json(data)
        }
        catch(err) {
            res.status(500).json(err)
        } 
     });

     router.route('/videos/:id')
     .get((req, res) => {
         video.findById(req.params.id)
         .then(data => {
             if (!data) return res.sendStatus(404);
             res.json(data);
         })
         .catch(err => {
            if (err.name === "CastError") return res.sendStatus(404);
             res.status(500).json(err);
            });
     })
     .put(passport.authenticate('jwt', { session: false }), checkAuth, async (req, res) => {
         try {
            let data = await video.findById(req.params.id);
            if (req.user.id.toString() !== data.user_id.toString()) {
                res.sendStatus(403);
            }
            else {
                let data = await video.update(req.params.id, req.body.size, req.body.title, req.body.quality);
                res.json(data);
            }
         }
         catch (err) {
            res.status(500).json(err);
         }
     })
     .delete(passport.authenticate('jwt', { session: false }), checkAuth, async (req, res) => {
        try {
           let data = await video.findById(req.params.id);
           if (req.user.id.toString() !== data.user_id.toString()) {
               res.sendStatus(403);
           }
           else {
               await video.findByIdAndDelete(req.params.id);
               res.sendStatus(204);
           }
        }
        catch (err) {
           res.status(500).json(err);
        }
     });
     
     router.route('/channels')
     .get(async (req, res) => {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        if (page < 1) return res.sendStatus(400);
        let count = 3;
        let offset = (page - 1) * count;
        let limit = count;
        let search = req.query.search;
        let query = new RegExp(search, "i");
        try {
            let pages = await channel.countDocuments({title: query});
            search = pages;
            if (page > pages && pages !== 0) return res.sendStatus(400);
            let data = await channel.find({title: query}).skip(offset).limit(limit).exec();
            pages = Math.ceil(pages/count);
            res.json({items: data, page: page, pages: pages, search: search});
        }
        catch(err) {
            res.status(500).json(err);
        }
     })
     .post(passport.authenticate('jwt', { session: false }), checkAuth, (req, res) => {
             if (!req.body) return res.sendStatus(400);
             channel.insert(req.body, req.user.id)
             .then(data => res.json(data))
             .catch(err => res.status(500).json(err));    
     });
     
     router.route('/channels/:id')
     .get(async (req, res) => {
        try {
            let data = await channel.findById(req.params.id);
            if (!data) return res.sendStatus(404);
            let videos = await video.find({owner_id: data._id}, '_id');
            data.videos = videos;
            res.json(data);
        }
        catch(err) {
            if (err.name === "CastError") return res.sendStatus(404);
            res.status(500).json(err);
        }
     })
     .put(passport.authenticate('jwt', { session: false }), checkAuth, async (req, res) => {
        try {
            let data = await channel.findById(req.params.id);
            if (req.user.id.toString() !== data.owner_id.toString()) {
                res.sendStatus(403);
            }
            else {
                let data = await channel.update(req.params.id, req.body.title);
                res.json(data);
            }
         }
         catch (err) {
            res.status(500).json(err);
         }
     })
     .delete(passport.authenticate('jwt', { session: false }), checkAuth, async (req, res) => {
        try {
            let data = await channel.findById(req.params.id);
            if (req.user.id.toString() !== data.owner_id.toString()) {
                res.sendStatus(403);
            }
            else {
                await video.deleteMany({owner_id: req.params.id});
                await channel.findByIdAndDelete(req.params.id);
                res.sendStatus(204);
            }
        }
        catch(err) {
            res.status(500).send(err)
        }
     });

     router.get('*', (req, res) => res.sendStatus(404));

    return router
}

function checkAuth(req, res, next) {
    if (!req.user) return res.status(401).json();
    next();
}

function checkAdmin(req, res, next) {
    if (!req.user) res.sendStatus(401);
    else if (req.user.role !== 1) res.status(403).json();
    else next();
}
