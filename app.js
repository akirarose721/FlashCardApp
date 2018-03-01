var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer");
    
//APP CONGIG
mongoose.connect("mongodb://localhost/flash_card_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE MODEL/CONFIG
var deckSchema = new mongoose.Schema({
    subject: String,
    chapter: Number,
    cards: Array,
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
            res.render("new");
        } else {
            //Redirect to the index
            res.redirect("/decks");
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Flashcard App server is running!");
});