import axios from "axios";

const UseGetData = async (url) => {
  const response = await axios.get(url, {
    withCredentials: true,
  });
  return response;
};

export default UseGetData;
