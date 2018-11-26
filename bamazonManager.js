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

function selectAction () {
    inquirer.prompt([{
        type: "list",
        name: "actions",
        message: "Select Action.",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End This Session"]
    }]).then(function (answer) {
        switch(answer.actions) {
            case "View Products for Sale": viewProducts();
            break;
            case "View Low Inventory": viewLowInventory();
            break;
            case "Add to Inventory": addToInventory();
            break;
            case "Add New Product": addNewProduct();
            break;
            case "End This Session": endSession();
            break;
        }
    });
}

function viewProducts () {
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
        selectAction();
    });
}

function viewLowInventory () {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        console.log("----------------------------")
        console.log("--------Low Inventory-------");
        for ( i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 10) {
            console.log("Product ID: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Department: " + res[i].department_name);
            console.log("Price: " + "$" + res[i].price);
            console.log("Quantity: " + res[i].stock_quantity);
            console.log("\n")
            } 
        }
        console.log("----------------------------");
        console.log("----------------------------"); 
        selectAction();
    });
}

function addToInventory () {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        console.log("----------------------------")
        console.log("------Add to Inventory------");
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
        inquirer.prompt([{
            name: "selectID",
            message: "Enter the ID of the product you wish to update.",
            validate: function(value) {
                var valid = value.match(/^[0-9]+$/);
                if (valid) {
                    return true;
                } else {
                    return 'Please enter numerical value';
                }
            }
        }, {
            name: "addQuantity",
            message: "Enter the Quantity of the product you're adding.",
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
                console.log("Item Quatity Has Been Updated!")
                connection.query(
                    "UPDATE products SET ? WHERE ?", 
                        [
                            {
                                stock_quantity: res[0].stock_quantity + answer.addQuantity
                            },
                            {
                                item_id: answer.selectID
                            }
                        ], function(err, res){});
                    selectAction();
            });
        });
    });
}

function addNewProduct () {
    inquirer.prompt([
        {
            name: "productName",
            message: "Enter Product Name"
        }, 
        {
            name: "departmentName",
            message: "Enter Department Name"
        },
        {
            name: "price",
            message: "Enter Price"
        },
        {
            name: "quantity",
            message: "Enter Quantity"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO products SET ?", {
			product_name: answer.productName,
			department_name: answer.departmentName,
			price: answer.price,
			stock_quantity: answer.quantity
        });
        console.log("Product has been added!")
        selectAction();
    });
}

function endSession () {
    console.log("Goodbye");
    connection.end();
}

selectAction();