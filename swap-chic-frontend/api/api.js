import axios from "axios";

const BASE_URL = "http://localhost:3001/";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Erreur serveur." };
  }
};
