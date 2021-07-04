const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const cors = require("cors")
const bodyParser = require("body-parser")

mongoose.connect(process.env.MONGODB || "mongodb://localhost:27017/test", { useUnifiedTopology: true, useNewUrlParser: true });

let siteSchema = new mongoose.Schema({
    link: String,
    title: String,
    seoq: Number,
    seo: {
        description: String,
        keywords: [String],
        author: String
    },
    hs: [String]
})


const site = mongoose.model("site", siteSchema)

site.createIndexes({seo: 'text', title: 'text', hs: 'text'})

const port = process.env.PORT || 3000;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev })
const handle = app.getRequestHandler();

const server = express();
server.set('trust proxy', 1)
server.use(cors())
server.use(bodyParser.json())
server.use(express.urlencoded({ extended: false }))

app.prepare().then(() => {
    server.post("/api", (req, res) => {
        site.find({$text: {$search: req.body.search}, seoq: { $exists: true }}, { score: {$meta: "textScore"}}, {lean: true})
        .sort({seoq: -1, score: { $meta: 'textScore' }})
        .skip(0)
        .limit(20)
        .then((docs, err) => {
            site.countDocuments({$text: {$search: req.body.search}, seoq: { $exists: true }}).then((count, err) => {
                res.json([(parseInt(parseFloat(count)/20)), ...docs])
            })
        })
    })

    server.get('*', (req, res) => {
        return handle(req, res);
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log("server started")
    })
})