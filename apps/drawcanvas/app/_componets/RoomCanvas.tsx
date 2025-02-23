"use client";

import { BASE_WS_URL } from "@/lib/config";
import React, { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { token } from "@/lib/helper";

interface roomProps {
  roomId: string;
}

const RoomCanvas = ({ roomId }: roomProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const ws_url = process.env.NEXT_PUBLIC_WS_SERVER ?? BASE_WS_URL;

  console.log(ws_url)

  useEffect(() => {
    const ws = new WebSocket(`${ws_url}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);

      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };
  }, [roomId, ws_url]);

  if (!socket) {
    return (
      <div className="flex w-screen h-screen items-center justify-center">
        <span className="text-purple-600 ">
          please wait connecting....🙂
        </span>
      </div>
    );
  }

  return <Canvas roomId={roomId} socket={socket} />;
};

export default RoomCanvas;
