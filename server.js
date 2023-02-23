//express app
const express = require('express');
let app = express();

//database
let mongo = require("mongodb");
let MongoClient = mongo.MongoClient;
let db;

//session
const session = require('express-session');
app.use(session({
    secret: 'top secret key',
    resave: true,
    saveUninitialized: false
}))

//store usernames and passwords, also use to check if username and password match when logging in
//username: {username, password, patron/artist}
let userDatabase = {
    'Dummy': {username: "Dummy", password: "Dummy", artist: true, art: [], following: [], liked: [], workshops: [], reviews: []},
    'Corrine Hunt': {username: "Corrine Hunt", password: "Corrine", artist: true, art: [0], following: [], liked: [], workshops: [], reviews: []},
    'Luke': {username: "Luke", password: "Luke", artist: true, art: [1], following: [], liked: [], workshops: [], reviews: []},
    'Anatoliy Kushch': {username: 'Anatoliy Kushch', password: 'Anatoliy', artist: true, art: [2], following: [], liked: [], workshops: [], reviews: []},
    'Lea Roche': {username: 'Lea Roche', password: 'Lea', artist: true, art: [3], following: [], liked: [], workshops: [], reviews: []},
    'Jim Dine': {username: 'Jim Dine', password: 'Jim', artist: true, art: [4], following: [], liked: [], workshops: [], reviews: []},
    'Shari Hatt': {username: 'Shari Hatt', password: 'Shari', artist: true, art: [5], following: [], liked: [], workshops: [], reviews: []},
    'Sebastian McKinnon': {username: 'Sebastian McKinnon', password: 'Sebastian', artist: true, art: [6], following: [], liked: [], workshops: [], reviews: []},
    'Kimika Hara': {username: 'Kimika Hara', password: 'Kimika', artist: true, art: [7], following: [], liked: [], workshops: [], reviews: []},
    'Keith Mallett': {username: 'Keith Mallett', password: 'Keith', artist: true, art: [8], following: [], liked: [], workshops: [], reviews: []},
    'ArtMind': {username: 'ArtMind', password: 'ArtMind', artist: true, art: [9], following: [], liked: [], workshops: [], reviews: []},
    'Joyce Wieland': {username: 'Joyce Wieland', password: 'ArtMJoyceind', artist: true, art: [10], following: [], liked: [], workshops: [], reviews: []}
};
let workshopCounter = 0;

//view engine
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(express.json());

const ROOT_DIR_JS = '/public/js';
app.use(express.static(__dirname + ROOT_DIR_JS));

//routes
app.get('/', (req,res,next) => {
    console.log(req.session);
    res.render("home");
});

app.get("/register", (req, res, next) => {
    res.render("register", {session: req.session});
});

app.put('/registerUser', (req, res, next) => {
    //check if username already exists
    if(req.body.username in userDatabase){
        //console.log("username is already taken")
        res.status(400).send("Username taken");
    } else{
        let user = {
            username: req.body.username,
            password: req.body.password,
            artist: false,
            art: [],
            following: [],
            liked: [],
            reviews: [],
            workshops: []
        }
        //add the user to the user database (just in the server)
        userDatabase[user.username] = user;
        console.log(userDatabase);
        res.status(200).send();
    }
});

app.put('/loginUser', (req, res, next) => {
    //check if username and password are valid
    let u = req.body;
    if(u == undefined){
        res.status(404).send();
        res.end();
    }

    if(u.username in userDatabase == false){
        res.status(401).send();
    }
    else if(userDatabase[u.username].password != u.password){
        res.status(401).send();
    } else{
        user = userDatabase[u.username];
        req.session.loggedin = true;
        req.session.username = user.username;
        req.session.artist = user.artist;
        req.session.following = user.following;
        req.session.liked = user.liked;
        req.session.reviewed = user.reviews;
        res.status(200).send();
    }
    //credentials are valid: log the user in -> start a session...
});

app.put('/toggleArtistPatron', (req, res, next) => {
    //if account is currently artist, make it patron. and vice-versa
    userDatabase[req.session.username].artist = !userDatabase[req.session.username].artist;
    req.session.artist = !req.session.artist;
    res.status(200).send();
});

app.put('/logoutUser', (req, res, next) => {
    //end the current session
    req.session.destroy();
    res.status(200).send();
})

app.get("/account", (req, res, next) => {
    db.collection("gallery").find({}).toArray(function(err,result){
        if (err){
            res.status(500).send('error');
            return;
        }
        //make an array of the objects that user has liked
        if(req.session.username != undefined){
            let likedPosts = [];
            result.forEach(post => {
                if(req.session.liked.includes(post.id.toString())){
                    likedPosts.push(post);
                }          
            });

            console.log(req.session.reviewed);

            let reviewedPosts = [];
            //if(req.session.reviewed != undefined){
                result.forEach(post =>{
                    if(req.session.reviewed.includes(post.id)){
                        reviewedPosts.push(post);
                    }
                })
           // }
            console.log("REVIEWED:")
            console.log(reviewedPosts);
            res.render("account", {session: req.session, liked: likedPosts, reviewed: reviewedPosts});
        } else{
            res.render("account", {session: req.session});
        }
    })
});

app.get("/artwork", (req, res, next) => {
    let n = req.query.name;
    let a = req.query.artist;
    let c = req.query.category;

    db.collection("gallery").find({artist:{$regex: a}, name:{$regex: n}, category:{$regex: c}}).toArray(function(err, result){
		if(err){
			res.status(500).send("error");
			return;
		}
		res.send(result);
		res.end();
	})

});

//view a specific artwork
app.get("/artwork/:id", async (req, res) => {
    if(req.session.username == undefined){
        res.status(404).send();
    }
    else{
        let tempID = parseInt(req.params.id);
        console.log(tempID);
        let currLiked;
        if(req.session.liked.includes(tempID.toString())){
            currLiked = true;
        } else{
            currLiked = false;
        }

        db.collection("gallery").find({id: {$gte: tempID, $lte: tempID}}).toArray(function(err, result){
            if(err) throw err;
            //console.log(result);
            if(result[0] == undefined){
                res.status(404).send();
            }
            else{
                //send the artwork object
                console.log(result[0]);https://www.gallery.ca/sites/default/files/styles/ngc_scale_1200/public/01otwaagbrownell.jpg?itok=kj3dohZ9&timestamp=1524495853
                res.render("artwork", {artwork: result[0], liked: currLiked});
            }
        })
    }
})

//view list of artworks
app.get("/artworks", (req, res, next) =>{
    db.collection("gallery").find({}).toArray(function(err,result){
        if (err){
            res.status(500).send('error');
            return;
        }
        console.log(result);
        res.render("artworks", result); //do better
    })
})

//view a specific artist
app.get("/artist/:id", (req, res, next) => {
    let id = req.params.id;
    console.log(id);

    //search user database for the artist
    if(id in userDatabase == false){
        res.status(404).send();
    }
    let artistUser = userDatabase[id];
    let currFollowing;

    console.log('req.session is: ');
    console.log(req.session);
    if(req.session.following.includes(id)){
        currFollowing = true;
    } else{
        currFollowing = false;
    }
    
    db.collection("gallery").find({artist: id}).toArray(function(err,result){
        if (err){
            res.status(500).send('error');
            return;
        }
        //console.log(result);
        //console.log(artistUser);
        res.render('artist', {artist: artistUser, artworks: result, session: req.session, follow: currFollowing});
    })
})

app.put("/follow/:username", (req,res,next) => {
    //update database and session
    if(!req.session.following.includes(req.params.username)){
        userDatabase[req.session.username].following.push(req.params.username);
        req.session.following = userDatabase[req.session.username].following;
    } else{
        //remove the followed user
        userDatabase[req.session.username].following.splice(userDatabase[req.session.username].following.indexOf(req.params.username), 1);
        req.session.following = userDatabase[req.session.username].following;   
    }

    console.log(userDatabase[req.session.username]);
    console.log(req.session);

    res.status(200).send();
})

app.put("/like/:artwork", (req, res, next) => {
    let art = req.params.artwork;
    console.log(art);
    console.log(req.session);

    //update database and session
    if(!req.session.liked.includes(art)){
        userDatabase[req.session.username].liked.push(art);
        req.session.liked = userDatabase[req.session.username].liked;

        db.collection("gallery").updateOne({id: {$gte: parseInt(art), $lte: parseInt(art)}}, {$inc: {likes: 1}});
    } else{
        //remove the followed user
        userDatabase[req.session.username].liked.splice(userDatabase[req.session.username].liked.indexOf(art), 1);
        req.session.liked = userDatabase[req.session.username].liked;   

        db.collection("gallery").updateOne({id: {$gte: parseInt(art), $lte: parseInt(art)}}, {$inc: {likes: -1}});
    }
    console.log(req.session);
    res.status(200).send();
})

app.get("/addartwork", (req, res, next) => {
    res.render("addartwork", {session: req.session})
});

app.post("/addartwork", (req, res, next) => {
    let artwork = req.body;
    artwork.artist = req.session.username;
    //must 1) update the gallery -> mongoDB database: add a new object
    db.collection("gallery").count({}, function(error, numOfObjects){
        artwork.likes = 0;
        artwork.id = numOfObjects;
        artwork.reviews = [];

        MongoClient.connect("mongodb://127.0.0.1:27017/", function(err, db){
            if(err) throw err;
            let dbo = db.db("termproject");
            let art = artwork;

            dbo.collection("gallery").insertOne(art, function(err, res){
                if(err) throw err;
                console.log("Artwork successfully added");
                db.close();
            })
        })
        
        
    });
    res.status(200).send();
});

app.post("/addworkshop", (req, res, next) => {
    let workshop = req.body;
    workshop.enrolled = [];
    workshop.id = workshopCounter;
    workshopCounter++;

    //add it to the artist that is logged in.
    userDatabase[req.session.username].workshops.push(workshop);
    console.log(userDatabase[0])
});

app.put("/enroll", (req, res, next) => {
    let work = req.body;

    req.session.workshops = [];
    req.session.workshops.push(work);
    userDatabase[req.session.username].workshopsEnrolled.push(work.workshop);

    res.status(200).send();
})

app.post("/review", (req, res, next) => {
    //update the gallery 
    let review = {}
    review.text = req.body.text;
    review.user = req.session.username;
    let artID = parseInt(req.body.artwork);
  
    db.collection("gallery").updateOne({id: {$gte: artID, $lte: artID}}, {$push: {reviews: review}});

    //update the account 
    userDatabase[review.user].reviews.push(artID);
    req.session.reviewed = userDatabase[review.user].reviews;
    console.log(userDatabase[review.user]);
    res.status(200).send();
})

//initialize database connection
MongoClient.connect("mongodb://127.0.0.1:27017/", {useNewUrlParser: true}, function(err, client){
    if(err) throw err;

    db = client.db('termproject');

    //start server
    app.listen(3000);
    console.log("Listening on port 3000");
});
