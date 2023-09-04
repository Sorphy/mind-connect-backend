"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/* GET home page. */
// router.post("/testrun", async function (req: Request, res: Response, next) {
//   const { email } = req.body
//   const user = await userModel.create({
//     email
//   })
//   res.status(200).json({ user });
// });
exports.default = router;
