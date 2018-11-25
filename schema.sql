CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL, 
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cat Litter", "Pet", 30.00, 100),
        ("Speaker", "Audio", 60.00, 200),
        ("Laptop", "Electronics", 1000.00, 50),
        ("Microwave", "Kitchen", 100.00, 20),
        ("PlayStation", "Games", 200.00, 300),
        ("Camera", "Photo", 500.00, 80),
        ("Coffee Table", "Furniture", 80.00, 10),
        ("Tylenol", "Health", 10.00, 500),
        ("Tent", "Outdoors", 150.00, 70),
        ("Hair Dryer", "Beauty", 80.00, 150);