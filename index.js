import express from 'express';
import axios from "axios"; // API
import bodyParser from 'body-parser';
import morgan from 'morgan';
import {dirname} from "path"; // these are just for the path
import  {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const PORT = 3000;


app.use(express.static('public')); // allows usage of static css files
app.use(morgan('tiny')); // gives me status info in terminal
app.use(bodyParser.urlencoded({extended: true})); // encodes and parses the form inputs

app.listen(PORT, () => { // create server
    console.log(`Server running on port ${PORT}.`);
});


let joke = "";

// SUBMIT JOKE REQUEST
app.post('/submit', (req, res) => {
    let type = req.body.category;

    // GET JOKE FROM API
    axios.get(`https://v2.jokeapi.dev/joke/${type}?format=json&amount=1`)
    .then(function (response) {
        // handle success
        let responseJSON = response.data;
        console.log(responseJSON.type);   
        if (responseJSON.type == 'twopart') {
            joke = responseJSON.setup + "\n" + responseJSON.delivery;
        } else {
            joke = responseJSON.joke;
        }
        console.log(joke);
        res.redirect('/');
    })
    .catch(function (error) {
        console.log(error);
    });
});

// HOME PAGE ROUTE
app.get("/", (req, res) => {
    res.render('index.ejs', {joke});
});
