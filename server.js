let express = require("express");
//const { studentsData } = require("./studentData");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header(
"Access-Control-Allow-Methods",
"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
);
res.header(
"Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept"
);
next();
});
var port=process.env.PORT || 2410
app.listen(port, () =>console.log(`Node app listening on port ${port}!`));

//postsql---------------------------------------------->
const { Client } = require("pg");
 const client = new Client({
    user: "postgres",
     password: "Rdatabase@2216",
     database:"postgres",
    port: 5432,
    host: "db.nvpowactnetkahazvbds.supabase.co", 
    ssl: { rejectUnauthorized: false },
    }); 
    client.connect(function (res, error)
     { console.log("Connected!!!");
    
    });
    
    app.get("/shops", function (req, res, next) 
    { //console.log("Inside /users get api");
    const query = `SELECT * FROM shops`;
client.query(query, function (err, result)
 { if (err) 
{ res.status(400).send(err);}
res.send(result.rows);
client.end();
});
});

app.post("/shops", function (req, res, next)
 { //console.log("Inside post of user"); 
 var values = Object.values (req.body);
console.log(values);
const query =`INSERT INTO shops (name,rent) VALUES ($1,$2)`;
client.query(query, values, function (err, result) {
    if (err) {
    res.status(400).send(err);
    }
    //console.log(result);
    res.send(`${result.rowCount} insertion successful`);
    });
    
    });

    //products-------------------------------->
    app.get("/products", function (req, res, next) 
    { //console.log("Inside /users get api");
    const query = `SELECT * FROM products`;
client.query(query, function (err, result)
 { if (err) 
{ res.status(400).send(err);}
res.send(result.rows);
client.end();
});
});

app.post("/products", function (req, res, next)
 { //console.log("Inside post of user"); 
 var values = Object.values (req.body);
console.log(values);
const query =`INSERT INTO products (productName,category,description) VALUES ($1,$2,$3)`;
client.query(query, values, function (err, result) {
    if (err) {
    res.status(400).send(err);
    }
    //console.log(result);
    res.send(`${result.rowCount} insertion successful`);
    });
    });

    //put
    app.put("/products/:id", function (req, res, next) 
    { 
    let userId =req.params.id;
   let cat= req.body.category;
   let desc=req.body.description;
  let values= [cat,desc,userId]
const query =`UPDATE products SET category=$1,description=$2 WHERE id= $3`;
client.query(query, values, function (err, result)
 { if (err) {res.status(400).send(err);}

res.send(`${result.rowCount} updation successful`);
});
});
/// purchases----------------------------------------------------->
app.get("/purchases", function (req, res, next) 
{
const query = `SELECT * FROM purchases`;
client.query(query, function (err, result)
{ if (err) 
{ res.status(400).send(err);}
res.send(result.rows);
client.end();
});
});
app.get("/purchases/shops/:id", function (req, res, next) 
{
    let id =req.params.id;
    let values=[id];
const query = `SELECT * FROM purchases WHERE shopId=$1`;
client.query(query,values, function (err, result)
{ if (err) 
{ res.status(400).send(err);}
res.send(result.rows);
client.end();
});
});
app.get("/purchases/products/:id", function (req, res, next) 
{
    let id =req.params.id;
    let values=[id];
const query = `SELECT * FROM purchases WHERE productid=$1`;
client.query(query,values, function (err, result)
{ if (err) 
{ res.status(400).send(err);}
res.send(result.rows);
client.end();
});
});

//totalPurchase---------------------------------------------------->
app.get("/totalPurchase/shop/:id", function (req, res, next) 
{
    let id =req.params.id;
    let values=[id];
const query = `SELECT productid,COUNT(purchaseId) AS totalPurchase FROM purchases WHERE shopId=$1 GROUP BY productid`;
client.query(query,values, function (err, result)
{ if (err) 
{ res.status(400).send(err);}
res.send(result.rows);
client.end();
});
});
app.get("/totalPurchase/product/:id", function (req, res, next) 
{
    let id =req.params.id;
    let values=[id];
const query = `SELECT shopId,COUNT(purchaseId) AS totalPurchase FROM purchases WHERE productid=$1 GROUP BY shopId`;
client.query(query,values, function (err, result)
{ if (err) 
{ res.status(400).send(err);}
res.send(result.rows);
client.end();
});
});
app.post("/purchases", function (req, res, next)
 {  
 var values = Object.values (req.body);
console.log(values);
const query =`INSERT INTO purchases (shopId,productid,quantity,price) VALUES ($1,$2,$3,$4)`;
client.query(query, values, function (err, result) {
    if (err) {
    res.status(400).send(err);
    }
    //console.log(result);
    res.send(`${result.rowCount} insertion successful`);
    });
    });