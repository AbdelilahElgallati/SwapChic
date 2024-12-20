import axios from "axios";
import React from 'react';

const BASE_URL = "http://192.168.1.2:3001";

export const registerUser = async (formData) => {
  try {
    console.log("start")
    const response = await axios.post(`${BASE_URL}/user/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    console.log("Server response:", response);  
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

