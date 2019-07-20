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
    supervise();
  });
  function supervise(){
    inquirer
    .prompt({
      name: "supervise",
      type: "list",
      message: "------",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
      ]
    })
    .then(function(answer) {   
        if(answer.supervise === "View Product Sales by Department"){
            veiwprod();
        }else{
            createdep();
        }
    });
  }

function veiwprod(){
    var sqlQ = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, over_head_costs-product_sales AS 'total_profit' FROM departments INNER JOIN products ON departments.department_name = products.department_name"
    connection.query(sqlQ, function(err, res) {
        if (err) throw err;
        console.log("___________________________________________________________________________________________________");
        console.log("department_id 	    department_name 	   over_head_costs  	   product_sales       total_profit")
        console.log("___________________________________________________________________________________________________")
        for(i=0;i<res.length;i++){
            console.log(res[i].department_id,"               ",res[i].department_name,"       ",res[i].over_head_costs,"       ",res[i].product_sales,"       ",res[i].total_profit)
            console.log("___________________________________________________________________________________________________")
        }
    })
}