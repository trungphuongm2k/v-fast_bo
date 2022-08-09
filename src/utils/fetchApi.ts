import axiosClient from "./axiosClient";

export const login = async (data: object) => {
  let resData = await axiosClient.post("users/login", data);
  return resData;
};

export const whoAmI = async () => {
  let resData = await axiosClient.get("whoAmI");
  return resData;
};

export const resetPassword = async (data: object) => {
  let resData = await axiosClient.put("users/reset-password", data);
  return resData;
};
////////////////////upload file/////////////////////////////
export const uploadFile = async (data: FormData) => {
  let resData = await axiosClient.post("files", data, {
    headers: {
      accept: "multipart/form-data",
    },
  });
  return resData;
};
////////////////////Partner/////////////////////////////

export const partners = async () => {
  let resData = await axiosClient.get("partners");
  return resData;
};
export const addPartner = async (data: object) => {
  let resData = await axiosClient.post("partners", data);
  return resData;
};
