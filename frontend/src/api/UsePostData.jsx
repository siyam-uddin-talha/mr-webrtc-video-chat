import axios from "axios";

const UsePostData = async (url, data) => {
  const response = await axios.post(url, data, { withCredentials: true });
  return response;
};

export default UsePostData;
