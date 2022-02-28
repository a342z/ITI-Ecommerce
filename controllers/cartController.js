const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Product = require("../models/product");

const Seller = require("../models/seller");
const bcrypt = require("bcrypt");
const { redirect } = require("express/lib/response");
var ls = require("local-storage");
const res = require("express/lib/response");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const ObjectId = require("mongoose").Types.ObjectId;

exports.addToCart = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }

  User.findOne({ email: request.body.email })

    .then((data) => {
      if (data.role != request.role /*||data.email!=request.email*/)
        next(Error("login first plz"));
      if (data == null) {
        throw new Error("email not found");
      }
      let product_id_var = new ObjectId(request.body.cart.product_id);
      let product_obj = {
        product_id: product_id_var,
        quantity: request.body.cart.quantity,
      };
      let cart = data.cart;

      let doesProductInCartExist = cart.find(
        (e) => e.product_id.toString() === request.body.cart.product_id
      );
      Product.exists({ _id: product_id_var })
        .then((res) => {
          if (!res||doesProductInCartExist) next(Error("errrrrrror"));
        })
        .catch((error) => {
          next(error.message);
        });

        console.log(product_obj);
        User.findByIdAndUpdate(data._id, {
          $push: { cart: product_obj },
        }).then((data) => {
          if (data == null) next(new Error("User not fount"));

          response.json({ message: "cart updated" });
          // else response.redirect("http://127.0.0.1:5500/index.html")
        });
      
    })
    .catch((error) => {
      // error.message = "error happened while login3";
      next(error.message);
    });
};

exports.removeFromCart = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }

  User.findOne({ email: request.body.email })

    .then((data) => {
      if (data.role != request.role /*||data.email!=request.email*/)
        next(Error("login first plz"));
      if (data == null) {
        throw new Error("email not found");
      }
      let product_id_var = new ObjectId(request.body.cart.product_id);
      let cart = data.cart;
      let doesProductInCartExist = cart.find(
        (e) => e.product_id.toString() === request.body.cart.product_id
      );
      Product.exists({ _id: product_id_var })
        .then((res) => {
          if (!res || !doesProductInCartExist)
            next(Error("product doesnt exist"));
        })
        .catch((error) => {
          next(error.message);
        });

      User.updateOne(
        { _id: data._id },
        {
          $pull: {
            cart: { product_id: product_id_var },
          },
        }
      )
        .then((x) => response.send("DELETED"))
        .catch((err) => next(err));
    })
    .catch((error) => {
      // error.message = "error happened while login3";
      next(error.message);
    });
};

exports.updateQuantityCart = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }

  User.findOne({ email: request.body.email })

    .then((data) => {
      if (data.role != request.role /*||data.email!=request.email*/)
        next(Error("login first plz"));
      if (data == null) {
        throw new Error("email not found");
      }
      let product_id_var = new ObjectId(request.body.cart.product_id);
      let cart = data.cart;

      let doesProductInCartExist = cart.find(
        (e) => e.product_id.toString() === request.body.cart.product_id
      );
      Product.exists({ _id: product_id_var })
        .then((res) => {
          if (!res||!doesProductInCartExist) next(Error("product doesnt exit5"));
        })
        .catch((error) => {
          next(error.message);
        });
        User.findOne({ "cart.product_id": product_id_var })
          .then((doc) => {
            item = doc.cart[0];

            console.log(item);
            item.quantity = request.body.cart.quantity;
            doc.save();
            response.send("Done");

            //sent respnse to client
          })
          .catch((err) => {
            console.log("Oh! Dark");
            response.send("dark");
          });
      
    })
    .catch((error) => {
      // error.message = "error happened while login3";
      next(error.message);
    });
};