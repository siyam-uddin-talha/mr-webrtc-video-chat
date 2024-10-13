import axios from "axios";

const UseGetData = async (url) => {
  const response = await axios.get(process.env.REACT_APP_SERVER_URL + url, {
    withCredentials: true,
  });
  return response;
};

export default UseGetData;
