"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
const client_1 = require("@repo/db/client");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const users = [];
function checkUser(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (typeof decoded == "string") {
            return null;
        }
        if (!decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    }
    catch (e) {
        return null;
    }
}
wss.on("connection", function connection(ws, request) {
    console.log("you are connecte to ws server");
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);
    if (userId == null) {
        ws.close();
        return null;
    }
    users.push({
        userId,
        rooms: [],
        ws,
    });
    ws.on("message", async function (data) {
        const parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
        try {
            if (parsedData.type === "join_room") {
                console.log("room joined");
                const user = users.find((x) => x.ws === ws);
                user?.rooms.push(parsedData.roomId);
            }
            if (parsedData.type === "leave_room") {
                const user = users.find((x) => x.ws === ws);
                if (!user) {
                    return;
                }
                user.rooms = user?.rooms.filter((x) => x === parsedData.room);
            }
            if (parsedData.type === "chat") {
                const roomId = parsedData.roomId;
                const message = parsedData.message;
                await client_1.prismaClient.chat.create({
                    data: {
                        roomId: Number(roomId),
                        message,
                        userId,
                    },
                });
                users.forEach((user) => {
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId,
                        }));
                    }
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
});
