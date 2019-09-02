//import packages
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
//import module mangodb
const mongodb = require('mongodb');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(morgan('short'));

//Setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Setup the static assets directories
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('css'));

app.listen(8080);

// function uniqueid(){
//     let newid= Math.round(Math.random()*1000);
//     let repeated=0;
//     db.collection('task').find({}).toArray(function(err, result) {
//     while(1){
//     for (let i = 0; i <result.length;i++){
//         if (result[i].taskId===newid){
//             repeated=1;
//         } 
//     }

//     if (repeated===0){

//         return newid;
        
//     }else{
//         newid= Math.round(Math.random()*1000);
//     }
//     }
// });
// }

        
//Initialise a database (Array) and push some dummy data
let db;



//define url for db server
//get reference to mandoclient
//connect to server using client
//can be find in sample code
const url = "mongodb://localhost:27017/";
const MongoClient = mongodb.MongoClient;
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("lab6");
           
        }

    });



app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/newtask', function (req, res) {
    //res.sendFile(__dirname+'views/newtask.html');
    res.render('newtask.html');
});

app.post('/addtasks', function (req, res) {
    // let id=uniqueid();
    let id=Math.round(Math.random()*1000);
  



    db.collection('task').insertOne (
        {
            taskId:id,
            taskName: req.body.taskName,
            assignTo: req.body.assignTo,
            dueDate: req.body.dueDate,
            taskStatus: req.body.taskStatus,
            taskDescription: req.body.taskDescription
            
        }
    );

    res.redirect('/listtasks');

});



app.get('/listtasks', function (req, res) {
   
    db.collection('task').find({}).toArray(function (err, data) {
        res.render('listtasks.html', { lab6: data });
        console.log(data[4]);
    });

});



app.post('/deleteWithId', function (req, res) {
    
    db.collection('task').deleteOne({ taskId: parseInt(req.body.taskId2)}, function (err) { });
   
    res.redirect('/listtasks');

});
app.get ('/update',function(req,res){
    res.render('listtasks.html');
});
app.post('/updateStatus', function (req, res) {

    db.collection('task').updateOne({ taskId: parseInt(req.body.taskId) }, { $set: { taskStatus: req.body.taskStatus } });
  
    res.redirect('/listtasks');

});

app.get('/deleteCompletedtask', function (req, res) {

    db.collection('task').deleteMany({ taskStatus: 'Complete' }, function (err) { });
    
    res.redirect('/listtasks');
});