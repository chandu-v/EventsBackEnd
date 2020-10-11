const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express')
const env = require('dotenv');
const { ObjectID } = require('mongodb');

const app = express()
const port = 3000

env.config();
// Connection URL
const url = process.env.URL;

// Database Name
const dbName = 'namlatec-db-test';
const collectionName = 'documents';


const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        callback(docs);
    });
}

const findDocumentsById = function (db, id, callback) {
    const collection = db.collection(collectionName);
    try{
        collection.find({ _id: new ObjectID(id) }).toArray(function (err, docs) {
                assert.equal(err, null);
                console.log("Found Records");
                callback(docs);
            });
    }catch{
        callback({result:"NotFound"})
    }
    
}

const updateDocumentById = function (db, id, seats, callback) {
    const collection = db.collection(collectionName);
    try {
        const query = { _id: new ObjectID(id) };
        const newValue = { $set: { seats: `${seats}` } };
        collection.updateOne(query, newValue, function (err, res) {
            if (err) {
                // throw err;
                callback({result:"NotFound"});
            } else {
                callback(res);
            }
        })
    } catch {
        callback({result:"NotFound"});
    }

}

const insertDocuments = function (db, callback) {
    // Insert the documents collection
    const collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany([
        {
            name: "Event 1",
            date: "23-May-2020",
            seats: 23,
        },
        {
            name: "Event 2",
            date: "23-May-2020",
            seats: 23,
        },
        {
            name: "Event 3",
            date: "23-May-2020",
            seats: 23,
        },
        {
            name: "Event 4",
            date: "23-May-2020",
            seats: 23,
        },
        {
            name: "Event 5",
            date: "23-May-2020",
            seats: 23,
        },
        {
            name: "Event 6",
            date: "23-May-2020",
            seats: 23,
        },
        {
            name: "Event 7",
            date: "23-May-2020",
            seats: 23,
        },
        {
            name: "Event 8",
            date: "23-May-2020",
            seats: 23,
        }

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
        console.log("Connected successfully to server")
        const db = client.db(dbName);

        findDocuments(db, function (docs) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader('Content-Type', 'application/json');
            res.send(docs);
            client.close();
        });
    });
});

app.get("/insert", (req, res) => {
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
});

app.get("/getById/:id", (req, res) => {
    const id = req.params["id"];
    console.log(id);
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        findDocumentsById(db, id, function (docs) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader('Content-Type', 'application/json');
            res.send(docs);
            client.close();
        });
    });

});

app.get("/update/:id/:seats", (req, res) => {
    const id = req.params["id"];
    const seats = req.params["seats"];
    console.log(id);
    MongoClient.connect(url, function (err, client) {
        const db = client.db(dbName);
        updateDocumentById(db, id, seats, function (docs) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader('Content-Type', 'application/json');
            res.send(docs);
            client.close();
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})