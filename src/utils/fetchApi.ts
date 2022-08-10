import axiosClient from "./axiosClient";
import { AddPartner } from "../pages/partner";
import {typePolicy} from "../pages/policy";

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
export const addPartner = async (data: AddPartner) => {
  let resData = await axiosClient.post("partners", data);
  return resData;
};
export const deletePartner = async (id: string) => {
  let resData = await axiosClient.delete(`partners/${id}`);
  return resData;
};
export const updateOnePartner = async (id: string, data: AddPartner) => {
  let resData = await axiosClient.patch(`partners/${id}`, data);
  return resData;
};

////////////////////policy/////////////////////////////
export const getPolicy = async () => {
  let resData = await axiosClient.get("policies");
  return resData;
};
export const updatePolicy = async (id: string, data: object) => {
  let resData = await axiosClient.patch(`policies/${id}`, data);
  return resData;
};
