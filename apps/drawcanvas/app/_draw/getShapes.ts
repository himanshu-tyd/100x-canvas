import { useState } from "react";
import { shapes } from "./shapes";
import api from "@/lib/axiosInstance";
import { toast } from "sonner";
import { messageType } from "@/types/types";


const useGetShapes = () => {
  const [loading, setLoading] = useState(false);

  const getShapes = async (roomId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/chats/${roomId}`);
      const context = res.data;
      if (!context.success) {
        toast.error(context.message);
        return [];
      }
      const shapesData = context.data;
      if (!shapesData) return [];
      const dataShape: shapes[] = shapesData.map((x: messageType) => {
        const messageData = JSON.parse(x.message);
        return messageData.shape;
      });
      setLoading(false);
      return dataShape;
    } catch (e) {
      if (e instanceof Error) toast.error(e.message);
      console.log(e);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, getShapes };
};

export default useGetShapes