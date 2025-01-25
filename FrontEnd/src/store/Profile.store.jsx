import axios from "axios";

export const userFollow = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/profile/follow`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (error) {
    console.error("Error fetching response:", error);
    throw error;
  }
};

export const UserProfile = async () => {
  
};
