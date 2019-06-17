const express = require('express');
const cors    = require('cors');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const router = express.Router();
const Issue  = require('./model/Issue');
const path   = require('path');


//Database Connection
let connection=mongoose.connect('mongodb+srv://sai:sai@cluster0-jr1xb.mongodb.net/test?retryWrites=true&w=majority',(err)=>{
    if(!err){
            console.log('successfully connected to db');
    }
    else{
        console.log('Failed Connection');
    }
});

const app = express();

//set Static Folder 
app.use(express.static(path.join(__dirname , 'public')));

app.use(cors());
app.use(bodyParser.json());


app.use('/', router);

app.get('*', function(req, res){
    res.sendFile(__dirname + '/public/dist/index.html');
});

router.route('/issues').get((req, res) => {
    Issue.find((err, issues) => {
        if (err)
            console.log(err);
        else
            res.json(issues);
    });
});

router.route('/issues/:id').get((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (err)
            console.log(err);
        else
            res.json(issue);
    })
});

router.route('/issues/add').post((req, res) => {
    let issue = new Issue(req.body);
    issue.save()
        .then(issue => {
            res.status(200).json({'issue': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/issues/update/:id').post((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('Could not load Document'));
        else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;
            issue.save().then(issue => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});


router.route('/issues/delete/:id').get((req, res) => {
    Issue.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
        if (err)
            res.json(err);
        else
            res.json('Removed successfully');
    });
});


app.set('port',(process.env.PORT || 3000))
app.listen(app.get('port'), ()=>{
    console.log('Server started at 3000');
});
