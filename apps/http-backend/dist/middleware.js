"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = middleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
function middleware(req, res, next) {
    try {
        const token = req.cookies["token"];
        console.log(token);
        if (!token) {
            res.json({
                success: false,
                message: "Failed to get token",
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (decoded) {
            // @ts-ignore: TODO: Fix this
            req.userId = decoded.userId;
            next();
        }
        else {
            res.json({
                success: false,
                message: "Unauthorization",
            });
        }
    }
    catch (e) {
        console.log(e);
        if (e instanceof Error)
            console.log(e.message);
        res.status(500).json({ success: false, message: "intenal server error" });
    }
}
