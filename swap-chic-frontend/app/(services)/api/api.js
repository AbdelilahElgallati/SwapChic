import axios from "axios";
import React from 'react';

// const BASE_URL = "https://swapchic-api.onrender.com";

export const loginUser = async (formData) => {
  try {
    console.log("start")
    const response = await axios.post(`https://swapchic-api.onrender.com/user/login`, userData);
    console.log("Server response:", response);  
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getCategory = async () => {
  try {
    const response = await axios.get(`https://swapchic-api.onrender.com/Category`);
    // console.log("Server response:", response);  
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProduct = async () => {
  try {
    const response = await axios.get(`https://swapchic-api.onrender.com/Product`);
    // console.log("Server response:", response);  
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

