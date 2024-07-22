const Express = require("express");
const express = Express.Router();
const fs = require("fs");
const path = require("path");
const iniparser = require("ini");
const config = iniparser.parse(fs.readFileSync(path.join(__dirname, "..", "Config", "config.ini")).toString());
const functions = require("./functions.js");
const accounts = require("./../responses/account.json");
var Memory_CurrentAccountID = config.Config.displayName;

express.get("/account/api/public/account", async (req, res) => {
    var response = [];

    if (Memory_CurrentAccountID.includes("@")) Memory_CurrentAccountID = Memory_CurrentAccountID.split("@")[0];

    if (config.Config.bUseConfigDisplayName == false) {
        if (typeof req.query.accountId == "string") {
            Memory_CurrentAccountID = req.query.accountId;
            if (Memory_CurrentAccountID.includes("@")) Memory_CurrentAccountID = Memory_CurrentAccountID.split("@")[0];

            if (!accounts.find(i => i.id == req.query.accountId)) {
                accounts.push({
                    "id": req.query.accountId,
                    "displayName": Memory_CurrentAccountID,
                    "externalAuths": {}
                })
            }

            if (accounts.find(i => i.id == req.query.accountId).displayName != Memory_CurrentAccountID) {
                var index = accounts.findIndex(i => i.id == req.query.accountId);
                accounts[index].displayName = Memory_CurrentAccountID;
            }
        }
    } else if (typeof req.query.accountId == "string") {
        if (!accounts.find(i => i.id == req.query.accountId)) {
            accounts.push({
                "id": req.query.accountId,
                "displayName": Memory_CurrentAccountID,
                "externalAuths": {}
            })
        }

        if (accounts.find(i => i.id == req.query.accountId).displayName != Memory_CurrentAccountID) {
            var index = accounts.findIndex(i => i.id == req.query.accountId);
            accounts[index].displayName = Memory_CurrentAccountID;
        }
    }

    if (typeof req.query.accountId == "string") {
        if (accounts.find(i => i.id == req.query.accountId)) {
            response.push(accounts.find(i => i.id == req.query.accountId))
        }
    }

    if (Array.isArray(req.query.accountId)) {
        for (var x in req.query.accountId) {
            if (accounts.find(i => i.id == req.query.accountId[x])) {
                response.push(accounts.find(i => i.id == req.query.accountId[x]))
            }
        }
    }

    fs.writeFileSync("./responses/account.json", JSON.stringify(accounts, null, 2));

    res.json(response)
})

express.get("/account/api/public/account/:accountId", async (req, res) => {
    if (config.Config.bUseConfigDisplayName == false) {
        Memory_CurrentAccountID = req.params.accountId;
    }

    if (Memory_CurrentAccountID.includes("@")) Memory_CurrentAccountID = Memory_CurrentAccountID.split("@")[0];

    res.json({
        "id": req.params.accountId,
        "displayName": Memory_CurrentAccountID,
        "name": "Lawin",
        "email": Memory_CurrentAccountID + "@lawin.com",
        "failedLoginAttempts": 0,
        "lastLogin": new Date().toISOString(),
        "numberOfDisplayNameChanges": 0,
        "ageGroup": "UNKNOWN",
        "headless": false,
        "country": "US",
        "lastName": "Server",
        "preferredLanguage": "en",
        "canUpdateDisplayName": false,
        "tfaEnabled": false,
        "emailVerified": true,
        "minorVerified": false,
        "minorExpected": false,
        "minorStatus": "UNKNOWN"
    })
})

express.get("/account/api/public/account/*/externalAuths", async (req, res) => {
    res.json([])
})

express.delete("/account/api/oauth/sessions/kill", async (req, res) => {
    res.status(204);
    res.end();
})

express.delete("/account/api/oauth/sessions/kill/*", async (req, res) => {
    res.status(204);
    res.end();
})

express.get("/account/api/oauth/verify", async (req, res) => {
    res.json({
        "token": "lawinstokenlol",
        "session_id": "3c3662bcb661d6de679c636744c66b62",
        "token_type": "bearer",
        "client_id": "lawinsclientidlol",
        "internal_client": true,
        "client_service": "fortnite",
        "account_id": Memory_CurrentAccountID,
        "expires_in": 28800,
        "expires_at": "9999-12-02T01:12:01.100Z",
        "auth_method": "exchange_code",
        "display_name": Memory_CurrentAccountID,
        "app": "fortnite",
        "in_app_id": Memory_CurrentAccountID,
        "device_id": "lawinsdeviceidlol"
    })
})

express.post("/account/api/oauth/token", async (req, res) => {
    if (config.Config.bUseConfigDisplayName == false) {
        Memory_CurrentAccountID = req.body.username || "LawinServer"
    }

    if (Memory_CurrentAccountID.includes("@")) Memory_CurrentAccountID = Memory_CurrentAccountID.split("@")[0];

    res.json({
        "access_token": "lawinstokenlol",
        "expires_in": 28800,
        "expires_at": "9999-12-02T01:12:01.100Z",
        "token_type": "bearer",
        "refresh_token": "lawinstokenlol",
        "refresh_expires": 86400,
        "refresh_expires_at": "9999-12-02T01:12:01.100Z",
        "account_id": Memory_CurrentAccountID,
        "client_id": "lawinsclientidlol",
        "internal_client": true,
        "client_service": "fortnite",
        "displayName": Memory_CurrentAccountID,
        "app": "fortnite",
        "in_app_id": Memory_CurrentAccountID,
        "device_id": "lawinsdeviceidlol"
    })
})

express.post("/account/api/oauth/exchange", async (req, res) => {
    res.json({})
})

express.get("/account/api/epicdomains/ssodomains", async (req, res) => {
    res.json([
        "unrealengine.com",
        "unrealtournament.com",
        "fortnite.com",
        "epicgames.com"
    ])
})

express.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/*", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(true);
})

module.exports = express;
