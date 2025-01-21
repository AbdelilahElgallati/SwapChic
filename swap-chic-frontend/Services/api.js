import React from "react";
import axios from "axios";


export const BASE_URL = "http://192.168.167.74:3001";


// User function

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, userData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/clerk/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};



// Product function

export const getProduct = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Product`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getProductByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/Product/category/` + categoryId
    );
    return response.data;
  } catch (error) {
    console.error(error);
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
    const response = await axios.get(
      `${BASE_URL}/Product/category/${categoryId}/${userId}`
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
      `${BASE_URL}/Product/Search/${query}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getMyProduct = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Product/user/` + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getOneProduct = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Product/` + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Product/remove/` + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};



// Category function

export const getOneCategory = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Category/` + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getCategory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Category`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getCategoriesWithProductCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Category/product-count`);
    // console.log("Server response:", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const getCategorySearchName = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/Category/Search/${query}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};



// LIke function

export const addLike = async (likeData) => {
  try {
    const response = await axios.post(`${BASE_URL}/like/add`, likeData);
    return response;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
}

export const getAllLikeUser = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/like/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
}

export const getAllLikeUserId = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/like/favories/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
}

export const getOneLikeByProductIdAndUserId = async (productId, userId)  => {
  try {
    const response = await axios.get(`${BASE_URL}/like/${userId}/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; 
    }
    console.error("Erreur API:", error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};

export const removeLike = async (likeId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/like/remove/${likeId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
}