var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err){
	if (err) throw err;
	console.log('connected as id: ' + connection.threadId)
});

function displayProducts () {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        console.log("----------------------------")
        console.log("----------Products----------");
        for ( i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Department: " + res[i].department_name);
            console.log("Price: " + "$" + res[i].price);
            console.log("Quantity: " + res[i].stock_quantity);
            console.log("\n")
        }
        console.log("----------------------------");
        console.log("----------------------------"); 
        placeOrder();
    });
}

function placeOrder () {
    inquirer.prompt([{
        name: 'selectID',
        message: "Enter the ID of the product you wish to purchase.",
        validate: function(value) {
            var valid = value.match(/^[0-9]+$/);
            if (valid) {
                return true;
            } else {
                return 'Please enter numerical value';
            }
        }
    }, {
        name: 'selectQuantity',
        message: "Enter the quantity you wish to purchase.",
        validate: function(value) {
            var valid = value.match(/^[0-9]+$/);
            if (valid) {
                return true;
            } else {
                return 'Please enter numerical value';
            }
        }
    }]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE item_id = ?", [answer.selectID], function(err, res) {
            
        if (answer.selectQuantity > res[0].stock_quantity) {
            console.log("Insuficient Quantity!");
        } else {

            console.log("Your total is $" + (answer.selectQuantity * res[0].price)); 
            console.log("Thank you for your purchase!");

            connection.query(
                "UPDATE products SET ? WHERE ?", 
                [
                    {
                        stock_quantity: res[0].stock_quantity - answer.selectQuantity
                    },
                    {
                        item_id: answer.selectID
                    }
                ], function(err, res){});

            connection.end();
        }
    });
    });
}

displayProducts();


