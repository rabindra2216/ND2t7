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
//let {students}=require('./studentData.js')

let mysql = require("mysql");
let connData = {
host: "localhost",
user: "root",
database: "testdb",
password: ""
};
app.delete("/svr/resetData", function (req, res)
 {
    let connection = mysql.createConnection(connData);
    let sql1 = "DELETE FROM mobiles";
    connection.query(sql1, function(err, result){
        if (err) res.status(404).send(err);
        else res.send('totalDeleted row : ',result.affectedRows)
})
});
app.get("/employees", function (req, res) {
    let dept=req.query.department;
    let design=req.query.designation;
    let gen=req.query.gender;
    let arr=[]
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM employees";
    connection.query(sql, function (err, result){
        if (err) res.status(404).send(err);
        else { arr=result;
            //console.log(arr);
            res.send(arr);
        }
  
    });
    //if(dept) arr=arr.filter(st=>st.department===dept);
    //if(design) arr=arr.filter(st=>st.designation===design);
    //if(gen) arr=arr.filter(st=>st.Gender===gen);
    //console.log('Filter Arr=',arr);
      //res.send(arr);
    });

    app.get("/employees/:empCode", function (req, res) { 
        let empcode = req.params.empCode;
        let connection = mysql.createConnection(connData);
        let sql = `SELECT * FROM employees where empCode='${empcode}'`;
        connection.query(sql,empcode, function (err, result){
            if (err) res.status(404).send(err);
            else res.send(result)
        });
        });
        app.get("/svr/mobiles/brandName/:brand", function (req, res) { 
            let brand =req.params.brand;
            let connection = mysql.createConnection(connData);
            let sql = `SELECT * FROM mobiles where brand='${brand}'`;
            connection.query(sql,brand, function (err, result){
                if (err) res.status(404).send(err);
                else res.send(result)
            });
            });

        // app.get("/svr/students/course/:name", function (req, res) 
        // { let name = req.params.name;
        //     fs.readFile(fname, "utf8", function (err, data) {
        //     if (err) res.status(404).send(err); 
        //     else{
        //     let studentsArray = JSON.parse(data);
        //     let arr1 = studentsArray.filter((st) => st.course === name); 
        //     res.send(arr1);
        //     }
        //     });
            
        //     });
      app.post("/employees",function(req,res){
                let body=req.body;
                console.log(body);
                let connection = mysql.createConnection(connData);
                let sql = `INSERT INTO employees (empcode,name,department,designation,salary,gender) VALUES ('${body.empCode}','${body.Name}','${body.Department}','${body.Designation}',${body.Salary},'${body.Gender}')`;
                 connection.query(sql, body, function (err, result) {
                if (err) res.status(404).send(err);
                    else res.send(result)
            });
        
         });     
    
    app.put("/employees/:empCode",function(req,res){ 
        let body=req.body;
        let id=req.params.empCode;
        let connection = mysql.createConnection(connData);
        let sql = `UPDATE employees SET name='${body.Name}',department='${body.Department}',designation='${body.Designation}',salary=${body.Salary},gender='${body.Gender}' WHERE empCode =?` ; 
        connection.query(sql, id, function(err, result) {
            if (err) res.status(404).send(err);
            else res.send(result)
        })
}); 

app.delete("/employees/:empCode",function(req,res){
    let id=req.params.empCode;
    let connection = mysql.createConnection(connData);
    let sql1 = "DELETE FROM employees where empcode=?";
    connection.query(sql1,id, function(err, result){
        if (err) res.status(404).send(err);
        else res.send(result)
})
});

// postsql
const { Client } = require("pg");
 const client = new Client({
    user: "postgres",
     password: "Rdatabase@2216",
     database:"postgres",
    port: 5432,
    host: "db.aldnuxtgfiamykwzhnxv.supabase.co", 
    ssl: { rejectUnauthorized: false },
    }); 
    client.connect(function (res, error)
     { console.log("Connected!!!");
    
    });
    
    app.get("/users", function (req, res, next) 
    { console.log("Inside /users get api");
    const query = `SELECT * FROM users`;
client.query(query, function (err, result)
 { if (err) 
{ res.status(400).send(err);}
res.send(result.rows);
client.end();
});
});

app.post("/user", function (req, res, next)
 { console.log("Inside post of user"); 
 var values = Object.values (req.body);
console.log(values);
const query =`INSERT INTO users (email, firstname, lastname, age) VALUES ($1,$2,$3,$4)`;
client.query(query, values, function (err, result) {
    if (err) {
    res.status(400).send(err);
    }
    //console.log(result);
    res.send(`${result.rowCount} insertion successful`);
    });
    
    });

    //put
    app.put("/user/:id", function (req, res, next) 
    { console.log("Inside put of use r^ prime prime ") ;
    let userId = req.params.id;
   let age = req.body.age;
  let values= [age,userId]
const query =`UPDATE users SET age =$1 WHERE id= $2`;
client.query(query, values, function (err, result)
 { if (err) {res.status(400).send(err);}

res.send(`${result.rowCount} updation successful`);
});
});