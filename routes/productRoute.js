const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/auth");

// Get all products
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Single product|| with middleware
// router.get("/products", middleware, (req, res) => {
//   res.send(req.product);
//   try {
//     let sql = "SELECT * FROM products WHERE ?";
//     let product = {
//       product_id: req.product.id,
//     };
//     con.query(sql, product, (err, result) => {
//       if (err) throw err;
//       res.send(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// Single Product
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM products WHERE id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
    // res.send({ id: req.params.id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Add product
router.post("/add_product", (req, res) => {
  try {
    let sql = "INSERT INTO products SET ?";
    const {
      sku,
      name,
      price,
      anime_theme,
      descriptions,
      categories,
      stock,
      product_catergory,
      image1,
      image2,
      image3,
    } = req.body;
    let create_date = new Date().toISOString().slice(0, 19).replace("T", " ");
    let user = {
      sku,
      name,
      price,
      anime_theme,
      descriptions,
      categories,
      create_date,
      stock,
      product_catergory,
      image1,
      image2,
      image3,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`Product ${user.name} was created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete one product
router.delete("/:id", (req, res) => {
  {
    con.query(
      `DELETE FROM products WHERE product_id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send("Sucessfully deleted this product");
      }
    );
    // res.send({ id: req.params.id });
  }
});

// Update user
router.put("/update-user/:id", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      user_id: req.params.id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        let updateSql = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        let updateUser = {
          full_name: req.body.full_name,
          email: req.body.email,
          password: hash,
          user_type: req.body.user_type,
          phone: req.body.phone,
          country: req.body.country,
          billing_address: req.body.billing_address,
          default_shipping_address: req.body.default_shipping_address,
        };
        con.query(updateSql, updateUser, (err, updated) => {
          if (err) throw err;
          console.log(updated);
          res.send("Successfully Updated");
        });
      } else {
        res.send("User not found");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
