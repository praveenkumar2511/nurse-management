// src/lib/service/nurseService.ts
import axios from "axios";
import { log } from "node:console";

const API_URL = "http://127.0.0.1:5000/api/v1/nurses";

export const nurseService = {
  fetchNurses: async ({ page, limit }: { page: number; limit: number }) => {
    const res = await axios.get(`${API_URL}/get`, {
      params: { page, limit }, // ✅ send pagination params
    });
    console.log(res.data,">>>>>>>>>>>>>>>>>>>>>>>");
    
    return { data: res.data.data, total: res.data.total };
  },

  createNurse: async (nurse: any) => {
    const res = await axios.post(`${API_URL}/create`, nurse);
    return res.data;
  },

  updateNurse: async (id: number, nurse: any) => {
    const res = await axios.put(`${API_URL}/update/${id}`, nurse);
    return res.data;
  },

  deleteNurse: async (id: number) => {
    const res = await axios.delete(`${API_URL}/delete/${id}`);
    return res.data;
  },
};
