import { loginFailure, loginStart, loginSuccess } from "./loginRedux";
import { request } from "../requestMethods";
import {
  getProductFailure,
  getProductStart,
  getProductSuccess,
  deleteProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  updateProductFailure,
  updateProductStart,
  updateProductSuccess,
  addProductFailure,
  addProductStart,
  addProductSuccess,
} from "./productRedux";

import {
  getOrderStart,
  getOrderSuccess,
  getOrderFailure,
  deleteOrderStart,
  deleteOrderSuccess,
  deleteOrderFailure,
  updateOrderStart,
  updateOrderSuccess,
  updateOrderFailure,
} from "./orderRedux";

import {
  getUserStart,
  getUserSuccess,
  getUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "./userRedux";
import axios from "axios";

const CONFIG = () => {
  let token = "";
  if (localStorage.getItem("persist:root"))
    token = JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.user)
      .currentUser?.accessToken;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
export const login = async (navigate, dispatch, user) => {
  dispatch(loginStart());

  const res = request
    .post("/login", user)
    .then((res) => {
      console.log(res);
      if (res.data.data.role == "admin") {
        dispatch(loginSuccess(res.data));
      } else dispatch(loginFailure());
    })
    .catch((err) => dispatch(loginFailure()));

  // try {
  //   const res = publicRequest.post("/login", user).then();
  //   dispatch(loginSuccess(res.data));
  // } catch (err) {
  //   dispatch(loginFailure());
  // }
};

export const getProducts = async (dispatch) => {
  dispatch(getProductStart());
  try {
    const res = await request.get("/products");
    dispatch(getProductSuccess(res.data));
  } catch (err) {
    dispatch(getProductFailure());
  }
};

export const deleteProduct = async (id, dispatch) => {
  dispatch(deleteProductStart());

  try {
    const res = await request.delete(`/products/${id}`, CONFIG());
    // console.log(res);
    dispatch(deleteProductSuccess(id));
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};

export const updateProduct = async (id, product, dispatch) => {
  dispatch(updateProductStart());
  try {
    // update
    // console.log("request ===");
    // console.log("id", id);
    // console.log("product", product);
    // const res = await userRequest.put(`/products/${id}`, product);
    const res = await request.put(`/products/${id}`, product, CONFIG());
    console.log("Update Result", res);
    dispatch(updateProductSuccess({ id, product }));
  } catch (err) {
    console.log("error", err);
    dispatch(updateProductFailure());
  }
};

export const addProduct = async (product, dispatch) => {
  dispatch(addProductStart());
  try {
    const res = await request.post(`/products`, product, CONFIG());
    console.log("res", res.data.data);
    dispatch(addProductSuccess(res.data.data));
  } catch (err) {
    console.log("err", err);
    dispatch(addProductFailure());
  }
};

//ORDERS
//GET
export const getOrders = async (dispatch) => {
  dispatch(getOrderStart());
  try {
    const res = await request.get("/orders", CONFIG());
    // const res = await userRequest.get("/orders");
    // const res = await axios.get("http://localhost:8080/orders",{ headers: { Authorization: `Bearer ${TOKEN}` }})
    console.log("res.data", res.data);
    dispatch(getOrderSuccess(res.data));
  } catch (err) {
    dispatch(getOrderFailure());
  }
};

//DELETE
export const deleteOrder = async (id, dispatch) => {
  dispatch(deleteOrderStart());
  try {
    // const res = await request.delete(`/orders/${id}`);
    const res = await request.delete(`/orders/${id}`, CONFIG());
    console.log(res.data);
    dispatch(deleteOrderSuccess(id));
  } catch (err) {
    dispatch(deleteOrderFailure());
  }
};

//Update
export const updateOrder = async (id, order, dispatch) => {
  dispatch(updateOrderStart());
  try {
    // const res = await userRequest.put(`/orders/${id}`, order);
    const res = await request.put(`/orders/${id}`, order, CONFIG());
    console.log("Update Result", res);
    dispatch(updateOrderSuccess({ id, order }));
  } catch (err) {
    console.log("error", err);
    dispatch(updateOrderFailure());
  }
};

//USERS
export const getUsers = async (dispatch) => {
  dispatch(getUserStart());
  try {
    console.log("userRequest");
    const res = await request.get("/users", CONFIG());
    console.log("res.data", res.data);
    dispatch(getUserSuccess(res.data));
  } catch (err) {
    dispatch(getUserFailure());
  }
};

export const deleteUser = async (id, dispatch) => {
  dispatch(deleteUserStart());
  try {
    const res = await request.delete(`/users/${id}`, CONFIG());
    console.log(res.data);
    dispatch(deleteUserSuccess(id));
  } catch (err) {
    dispatch(deleteUserFailure());
  }
};

export const updateUser = async (id, user, dispatch) => {
  dispatch(updateUserStart());
  try {
    const res = await request.put(`/users/${id}`, user, CONFIG());
    console.log("Update Result", res);
    dispatch(updateUserSuccess({ id, user }));
  } catch (err) {
    console.log("error", err);
    dispatch(updateUserFailure());
  }
};

export const getStats = async () => {
  try {
    let stats = {};
    console.log("start of function");
    const res = await request.get("/stats/", CONFIG());
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
