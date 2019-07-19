var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Eexy6993+",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    manage();
});


function manage(){
    inquirer
    .prompt({
      name: "manage",
      type: "list",
      message: "------",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
      ]
    })
    .then(function(answer) {
        switch(answer.manage){
        case "View Products for Sale" :
            viewProdSale();
            break;
        case "View Low Inventory" :
            viewLowInv();
            break;
        case "Add to Inventory" :
            addToInv();
            break;
        case "Add New Product" :
            addNewProd();
            break;
        }
    });
}

function viewProdSale(){
    connection.query("SELECT * FROM products ", function(err, res) {
        if (err) throw err;
        for(i=0;i<res.length;i++){
            console.log("---------------------","\n",
                        "id: ",res[i].item_id,"\n",
                        "product name: ",res[i].product_name,"\n",
                        "price: ",res[i].price,"\n",
                        "quantity: ",res[i].stock_quantity,"")
        }
        manage();
    })
}
function viewLowInv(){
    connection.query("SELECT * FROM products ", function(err, res) {
        if (err) throw err;
        for(i=0;i<res.length;i++){
            if (res[i].stock_quantity < 5){
            console.log("---------------------","\n",
                        "id: ",res[i].item_id,"\n",
                        "product name: ",res[i].product_name,"\n",
                        "price: ",res[i].price,"\n",
                        "quantity: ",res[i].stock_quantity,"")
                    }
              }
        manage();
    })
}
function addToInv(){
    inquirer
    .prompt({
      name: "product",
      type: "input",
      message: "What product do you want to add more quantity to?"
    })
    .then(function(answer) {
        var id = answer.product;
        addmore(id);
    });
}

function addmore(id){
    inquirer
    .prompt({
      name: "quantity",
      type: "number",
      message: "insert the quantity you want to add?"
    })
    .then(function(answer) {
    var qua = answer.quantity;
    connection.query("SELECT stock_quantity FROM products WHERE ?",{product_name: id },function(err, res) {
        if (err) throw err;
        var currentQua =res[0].stock_quantity;
        var sql = "UPDATE products SET stock_quantity = ? WHERE product_name = ? ";
        currentQua =currentQua +qua;
        var update =[currentQua,id]
        connection.query(sql, update, function (err, result) {
         if (err) throw err;
        });
        manage();
    })
    })
   
}


function addNewProd(){
    inquirer
    .prompt({
      name: "newprodid",
      type: "input",
      message: "insert new product name?"
    })
    .then(function(answer) {
        var name = answer.newprodid;
        insertqua(name);
    });

}
function insertqua(name){
    inquirer
    .prompt({
      name: "qua",
      type: "number",
      message: "insert the quantity?"
    })
    .then(function(answer) {
        var qua = answer.qua;
        insertprice(name,qua);
    });
}
function insertprice(name,qua){
    inquirer
    .prompt({
      name: "price",
      type: "number",
      message: "insert the price?"
    })
    .then(function(answer) {
        var price = answer.price;
        insertdepName(name,qua,price);
    });
}
function insertdepName(name,qua,price){
    inquirer
    .prompt({
      name: "dep",
      type: "input",
      message: "insert the departement name?"
    })
    .then(function(answer) {

        var dep = answer.dep;
        var data={ product_name : name , department_name: dep , price : price , stock_quantity: qua}
        connection.query("INSERT INTO products SET ? ",data,function (err, result, fields) {
            if (err) throw err;
        })
        manage();
    });
}