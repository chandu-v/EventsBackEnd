const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express')
const app = express()
const port = 3000


// Connection URL
const url = 'mongodb+srv://chandu:iamchandu@cluster0.jpohj.azure.mongodb.net/sample_airbnb?retryWrites=true&w=majority';

// Database Name
const dbName = 'sample_airbnb';


const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('listingsAndReviews');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        for (let index = 0; index < 10; index++) {
            const element = docs[index];
            console.log(element);
        }
        //   console.log(docs)
        callback(docs);
    });
}

const insertDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        { a: 1 }, { a: 2 }, { a: 3 }
    ], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/list', (req, res) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);


        findDocuments(db, function () {
    res.send('Hey dude');

            client.close();

        });


    });

});

app.get("/insert",(req,res)=>{
// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    insertDocuments(db, function () {
        res.send("inserted");

        client.close();
    });



});

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})