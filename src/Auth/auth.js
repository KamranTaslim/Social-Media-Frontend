export const validateToken = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/validate-token",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Token is not valid");
    }

    const data = await response.json();
    return data.valid;
  } catch (error) {
    return false;
  }
};
