import React, {useState, useEffect} from 'react'

const UsersProfile = () => {
    const [userData, setUserData] = useState(null);


    const LOGGEDUSER_API = (id) => `http://localhost:5000/api/user/user/${id}`;


    const fetchUserData = async (userIdToUse, token) => {
    try {
      const response = await axios.get(LOGGEDUSER_API(userIdToUse), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
      console.log("Saved recipes:", response.data.savedRecipes);
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error?.response?.data || error.message
      );
    }
  };

   useEffect(() => {
      const token = localStorage.getItem("authToken");
      const storedGoogleUser = JSON.parse(localStorage.getItem("googleUser"));
  
      if (!token) {
        console.log("No token found");
        return;
      }
  
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.userId;
        const userIdToUse = userId || storedGoogleUser?._id;
  
        if (!userIdToUse) {
          console.warn(
            "No valid user ID found (neither decoded token nor Google User)."
          );
          return;
        }
  
        fetchRecipe(userIdToUse, token);
        fetchUserData(userIdToUse, token);
      } catch (error) {
        console.error("Error decoding token:", error.message);
      }
    }, []);
  return (
    <div className='py-28 px-12'>
    <p>ajgdfyhjsgfyu</p>
    </div>
  )
}

export default UsersProfile