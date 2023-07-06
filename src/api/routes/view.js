import { Router } from "express";
import discordRoutes from "./discord.routes.js";

const viewRoutes = Router();

viewRoutes.use("/", discordRoutes);

export default viewRoutes;