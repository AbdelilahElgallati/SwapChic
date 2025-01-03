import React from "react";
import axios from "axios";

// import { BASE_URL } from "@env";
const URL_BACKEND = "http://192.168.167.74:3001"


export const loginUser = async (formData) => {
  try {
    // console.log("start")
    const response = await axios.post(`${URL_BACKEND}/user/login`, userData);
    // console.log("Server response:", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProduct = async () => {
  try {
    // console.log("start")
    const response = await axios.get(`${URL_BACKEND}/Product`);
    // console.log("Server response:", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProductByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${URL_BACKEND}/Product/category/` + categoryId
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProductSearchName = async (query) => {
  try {
    const response = await axios.get(`${URL_BACKEND}/Product/Search/${query}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProductByCategoryUser = async (categoryId, userId) => {
  try {
    const response = await axios.get(
      `${URL_BACKEND}/Product/category/${categoryId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProductSearchNameUser = async (query, userId) => {
  try {
    const response = await axios.get(
      `${URL_BACKEND}/Product/Search/${query}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getMyProduct = async (id) => {
  try {
    // console.log("start");
    const response = await axios.get(`${URL_BACKEND}/Product/user/` + id);
    // console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getOneProduct = async (id) => {
  try {
    const response = await axios.get(`${URL_BACKEND}/Product/` + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${URL_BACKEND}/Product/remove/` + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

// gestion category
export const getOneCategory = async (id) => {
  try {
    const response = await axios.get(`${URL_BACKEND}/Category/` + id);
    // console.log("Server response:", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getCategory = async () => {
  try {
    const response = await axios.get(`${URL_BACKEND}/Category`);
    // console.log("Server response:", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getCategoriesWithProductCount = async () => {
  try {
    const response = await axios.get(`${URL_BACKEND}/Category/product-count`);
    // console.log("Server response:", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const fetchUsers = async () => {
  try {
    // console.log("getting all users")
    const response = await axios.get(`${URL_BACKEND}/user/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await axios.get(`${URL_BACKEND}/user/clerk/${userId}`);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const getCategorySearchName = async (query) => {
  try {
    const response = await axios.get(`${URL_BACKEND}/Category/Search/${query}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};