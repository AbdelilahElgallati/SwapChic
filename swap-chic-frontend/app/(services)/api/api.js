import axios from "axios";
import React from 'react';

// const BASE_URL = "https://swapchic-api.onrender.com";

export const loginUser = async (formData) => {
  try {
    console.log("start")
    const response = await axios.post(`http://192.168.1.2:3001/user/login`, userData);
    console.log("Server response:", response);  
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

