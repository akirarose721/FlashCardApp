var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer");
    
//APP CONGIG
let uri = "mongodb://<dbuser>:<dbpassword>@ds257848.mlab.com:57848/heroku_b8clfxrf";
mongoose.connect(uri);
let db = mongoose.connection;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

db.on("error", console.error.bind(console, "connection error: "));

    var deckSchema = new mongoose.Schema({
        subject: String,
        chapter: Number,
        cards: [{front: String, back: String}],
        created: {type: Date, default: Date.now}
    });

    var Deck = mongoose.model("Deck", deckSchema);


    app.get("/", function(req, res) {
        res.redirect("/decks");
    });
    
    //INDEX
    app.get("/decks", function(req, res){
       Deck.find({}, function(err, decks){
           if(err){
               console.log("Error!");
           } else {
               res.render("index", {decks: decks});
           }
       });
    });
    
    
    //NEW
    app.get("/decks/new", function(req, res) {
        res.render("new");
    })
    
    //CREATE
    app.post("/decks", function(req, res){
        //create deck
        Deck.create(req.body.deck, function(err, newDeck){
            if(err){
                res.send(err);
            } else {
                //Redirect to the index
                res.redirect("/decks");
            }
        });
    });
    
    //SHOW
    app.get("/decks/:id", function(req, res) {
        //get deck by id
        Deck.findById(req.params.id, function(err, foundDeck){
            if(err){
                res.redirect("/decks");
            } else {
                //redirect to show page
                res.render("show", {deck: foundDeck});
            }
        });
    });
    
    //EDIT ROUTE
    app.get("/decks/:id/edit", function(req, res) {
        Deck.findById(req.params.id, function(err, foundDeck){
            if(err){
                res.redirect("/decks");
            } else {
                res.render("edit", {deck: foundDeck});
            }
        });
    });
    
    //UPDATE ROUTE
    app.put("/decks/:id", function(req, res){
        var card = {"front": req.body.deck.cards.front, "back": req.body.deck.cards.back};
        Deck.findByIdAndUpdate(req.params.id, {$push:{cards:card}}, function(err, updatedDeck){
            if(err){
                res.send(err);
            }else {
                 res.redirect("/decks/" + req.params.id + "/edit");
            }
        });
    });
    
    //DELETE ROUTE
    app.delete("/decks/:id", function(req, res){
        Deck.findByIdAndRemove(req.params.id, function(err){
            if(err){
                res.send(err);
            }else {
                res.redirect("/decks");
            }
        });
    });
    
    app.listen(process.env.PORT, process.env.IP, function(){
        console.log("Flashcard App server is running!");
    });
