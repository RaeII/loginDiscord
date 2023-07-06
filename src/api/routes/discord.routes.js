import express from "express";
import discordController from "../1.controllers/discord.controller.js";


const serverRouter = express.Router();


serverRouter.post("/discord/auth", discordController.auth);
serverRouter.post("/discord/authLoginTokenAccess", discordController.authLoginTokenAccess);
serverRouter.post("/discord/add_bot_server", discordController.addBotServer);
serverRouter.get("/", discordController.home);
serverRouter.get("/discord/authRedirect", discordController.authRedirect);
serverRouter.post("/eventTest", discordController.eventTest);
serverRouter.get("/bot/servers/active", discordController.getBotServers);

export default serverRouter;   
