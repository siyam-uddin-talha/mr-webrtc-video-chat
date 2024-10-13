import axios from "axios";

const UsePostData = async (url, data) => {
  const response = await axios.post(
    process.env.REACT_APP_SERVER_URL + url,
    data,
    { withCredentials: true }
  );
  return response;
};

export default UsePostData;
