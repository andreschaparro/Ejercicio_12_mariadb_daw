const express = require("express");
const app = express();
const mariadb = require("./mariadb/db");

app.use(express.json());
app.use(express.static("."));

const port = 3000

const datos = require("./datos.json");

app.get("/devices", (req, res) => {
    mariadb.getConnection()
    .then( (conn) => {
        conn.query("SELECT * FROM devices")
        .then( (data) => {
            console.log(data);
            res.send(data).status(200);
            conn.end();
        });
    })
    .catch( (err) =>{
        console.error(err);
        res.send(err).status(400);
    });
});

app.get("/devices/:id", (req, res) => {
    mariadb.getConnection()
    .then( (conn) => {
        conn.query("SELECT * FROM devices WHERE id=?", req.params.id)
        .then( (data) => {
            console.log(data);
            res.send(data).status(200);
            conn.end();
        });
    })
    .catch( (err) =>{
        console.error(err);
        res.send(err).status(400);
    });
});

app.post("/devices", (req, res) => {
    mariadb.getConnection()
    .then( (conn) => {
        console.log(req.body);
        let sw=0;
        if (req.body.state) {
            sw=1;
        }
        let id = req.body.id.split("_")[1];
        conn.query("UPDATE devices SET state=? WHERE id=?", [sw, id])
        .then( (rta) => {
            console.log(rta);
            res.send(JSON.stringify(req.body)).status(200);
            conn.end();
        })
        .catch( (err) => {
            console.error(err);
            res.send(err).status(400);  
            conn.end();  
        });
    })
    .catch( (err) =>{
        console.error(err);
        res.send(err).status(400);
    });
    
});

app.listen(port, () => {
    console.log(`API funcionando en el puerto ${port}`)
});