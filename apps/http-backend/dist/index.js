"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
const middleware_1 = require("./middleware");
const types_1 = require("@repo/common/types");
const client_1 = require("@repo/db/client");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: "GET, POST ,DELETE, OPTIONS",
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const port = 3001;
app.get("/", (_, res) => {
    res.send("server is running");
});
app.post("/signup", async (req, res) => {
    const parsedData = types_1.CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            success: false,
            message: "Incorrect inputs",
        });
        return;
    }
    try {
        const exits = await client_1.prismaClient.user.findFirst({
            where: {
                email: parsedData.data.username,
            },
        });
        if (exits) {
            res.json({
                success: false,
                message: "User already exits",
            });
            return;
        }
        const user = await client_1.prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                // TODO: Hash the pw
                password: parsedData.data.password,
                name: parsedData.data.name,
            },
        });
        res.json({
            success: true,
            message: "user register successfully",
            data: user,
        });
    }
    catch (e) {
        console.log(e);
        if (e instanceof Error)
            console.log(e.message);
        res.status(500).json({ success: false, message: "intenal server error" });
    }
});
app.post("/signin", async (req, res) => {
    const parsedData = types_1.SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            success: false,
            message: "Incorrect inputs",
        });
        return;
    }
    try {
        // TODO: Compare the hashed pws here
        const user = await client_1.prismaClient.user.findFirst({
            where: {
                email: parsedData.data.username,
                password: parsedData.data.password,
            },
        });
        if (!user) {
            res.json({
                success: false,
                message: "Invalid Creadentials",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user?.id,
        }, config_1.JWT_SECRET, {
            expiresIn: "30d",
        });
        res.cookie("token", token, {
            maxAge: 30 * 60 * 60 * 24 * 1000,
            httpOnly: true,
            secure: false,
        });
        res.json({
            success: true,
            message: "user signin successfully",
            data: user,
            token: token,
        });
        return;
    }
    catch (e) {
        console.log(e);
        if (e instanceof Error)
            console.log(e.message);
        res.status(500).json({ success: false, message: "intenal server error" });
    }
});
app.post("/room", middleware_1.middleware, async (req, res) => {
    const parsedData = types_1.CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            success: false,
            message: "Incorrect inputs",
        });
        return;
    }
    // @ts-ignore: TODO: Fix this
    const userId = req.userId;
    try {
        const exits = await client_1.prismaClient.room.findFirst({
            where: {
                slug: parsedData.data.name,
                adminId: userId,
            },
        });
        if (exits) {
            res
                .json({
                success: false,
                message: "Room already exits",
            })
                .end();
            return;
        }
        const room = await client_1.prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId,
            },
        });
        res.json({
            success: true,
            message: "Room Create now you can invite your friends",
            data: room.id,
        });
    }
    catch (e) {
        console.log(e);
        if (e instanceof Error)
            console.log(e.message);
        res.status(500).json({ success: false, message: "intenal server error" });
    }
});
app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const messages = await client_1.prismaClient.chat.findMany({
            where: {
                roomId: roomId,
            },
            orderBy: {
                id: "desc",
            },
            take: 50,
        });
        if (!messages) {
            res.json({ success: false, message: "No messages founded" });
            return;
        }
        res.json({
            success: true,
            message: "message get successfully",
            data: messages,
        });
    }
    catch (e) {
        console.log(e);
        if (e instanceof Error)
            console.log(e.message);
        res.status(500).json({ success: false, message: "intenal server error" });
    }
});
app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await client_1.prismaClient.room.findFirst({
        where: {
            slug,
        },
    });
    res.json({
        room,
    });
});
app.get("/room", middleware_1.middleware, async (req, res) => {
    //@ts-ignore
    const userId = req?.userId;
    try {
        const room = await client_1.prismaClient.room.findMany({
            where: {
                adminId: userId,
            },
        });
        if (!room) {
            res.json({ succes: false, message: "room not found" });
        }
        res.json({
            succes: true,
            message: "all rooms found successfully",
            data: room,
        });
    }
    catch (e) {
        console.log(e);
        if (e instanceof Error)
            console.log(e.message);
        res.status(500).json({ success: false, message: "intenal server error" });
    }
});
app.listen(port, () => {
    console.log("server is running at port" + port);
});
