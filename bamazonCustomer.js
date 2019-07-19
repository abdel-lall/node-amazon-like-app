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
    proId();
  });

  function proId(){
    inquirer
    .prompt({
      name: "product",
      type: "input",
      message: "What product are you searching for?"
    })
    .then(function(answer) {
        var id = answer.product;
        proQua(id);
    });

  }

  function proQua(id){
    var proName = id;
    inquirer
    .prompt({
      name: "quantity",
      type: "input",
      message: "how many units of the product would you like to buy?"
    })
    .then(function(answer) {
        var qua = answer.quantity;
        
      connection.query("SELECT stock_quantity,price FROM products WHERE ?", { product_name: proName }, function(err, res) {
        if (err) throw err;
         var quaAvailable = res[0].stock_quantity;
        if (qua <= quaAvailable){
            quaAvailable = quaAvailable - qua;
            var unitPrice = res[0].price;
            var total = unitPrice * qua;
            var sql = "UPDATE products SET stock_quantity = ? WHERE product_name = ? ";
            var update =[quaAvailable,proName]
            connection.query(sql, update, function (err, result) {
             if (err) throw err;
            console.log("your total is: ",total);
            console.log("            ");
            proId()

  });
        }else{
            insertDiffQua(proName);
        }
        
      })
    });

  }
   
  function insertDiffQua(id){
    inquirer
    .prompt({
      name: "diffqua",
      type: "list",
      message: "-we don't have the quantity you asked for-",
      choices: [
        "insert different quantity",
        "exit"
      ]
    })
    .then(function(answer) {
        if (answer.diffqua == "insert different quantity"){
            proQua(id);
        }
        if (answer.diffqua == "exit"){
            proId();
        }
    });
  }
