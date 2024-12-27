import axios from "axios";
import React from 'react';

// const BASE_URL = "https://swapchic-api.onrender.com";
const BASE_URL = "http://192.168.1.8:3001";

export const loginUser = async (formData) => {
  try {
    // console.log("start")
    const response = await axios.post(`${BASE_URL}/user/login`, userData);
    // console.log("Server response:", response);  
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};



export const getProduct = async () => {
  try {
    // console.log("start")
    const response = await axios.get(`${BASE_URL}/Product`);
    // console.log("Server response:", response);  
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProductByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Product/category/` + categoryId);
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProductSearchName = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/Product/Search/${query}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProductByCategoryUser = async (categoryId, userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Product/category/${categoryId}/${userId}`);
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProductSearchNameUser = async (query, userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Product/Search/${query}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getMyProduct = async (id) => {
  try {
    // console.log("start");
    const response = await axios.get(`${BASE_URL}/Product/user/` + id);
    // console.log("Server response:", response.data);  
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getOneProduct = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Product/` + id);
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Product/remove/` + id);
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};


// gestion category
export const getOneCategory = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Category/` + id);
    // console.log("Server response:", response);  
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getCategory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Category`);
    // console.log("Server response:", response);  
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};