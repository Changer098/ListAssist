var express = require('express');
var router = express.Router();
var authenticator = require('../management/authenticator');
var helpers = require('./helpers');
var userManager = require('../management/userManagement'); 
/*
id: user id
name: profile name
imageUrl: url to profile pic
email: profile email
tokenId: token ID
provider: [google, ANYTHING ELSE WE PLAN ON implementing]
*/
router.post('/login', function(req, res, next) {
    console.log("Called login");
    helpers.resolveBody(req, function(body) {
        res.setHeader("content-type", "application/json");
        console.log("body: " + body);
        if (body == null) {
            res.status(400).send(JSON.stringify({ error: "Empty Request" }));
            return;
        }
        var json = helpers.toJson(body);
        if (json == null) {
            res.status(400).send(JSON.stringify({ error: "Bad JSON" }));
            return;
        }
        /*try {
            json = JSON.parse(body);
            if (json == null) {
                console.log("json null");
                res.setHeader("content-type", "application/json");
                res.send(400, JSON.stringify({ error: "Bad JSON" }));
                return;
            }
        }
        catch (e) {
            console.log(e);
            res.setHeader("content-type", "application/json");
            res.send(400, JSON.stringify({ error: "Bad JSON" }));
            return;
        }*/
        //authenticate before proceeding
        var AuthObj = {
            tokenId : json.tokenId,
            provider : json.provider,
            name : json.name,
            email : json.email
        };
        authenticator.authenticate(AuthObj, function(UserObj) {
            if (UserObj !== null) {
                /*res.setHeader("content-type", "application/json");
                res.send(200, "Authenticated: " + JSON.stringify(UserObj));
                return;*/
                /* UserObj : {
                            name : full_name, email, profile_pic : url, id (google id),
                            timestamp (expiration time), provider, token
                        }*/
                userManager.addUser(UserObj, function(token) {
                    if (token !== null) {
                        res.status(200).send(JSON.stringify({ token : token}));
                        return;
                    }
                    else {
                        //send failure
                        res.status(400).send(JSON.stringify({error : "failed to addUser()"}));
                        return;
                    }
                });
            }
            else {
                res.status(500).send(JSON.stringify({error : "Failed to Authenticate"}));
                return;
            }
        });
    });
});
router.post('/logout', function(req, res, next) {
    console.log("Called /logout");
    helpers.resolveBody(req, function(body) {
        res.setHeader("content-type", "application/json");
        var json = helpers.toJson(body);
        if (json == null) {
            res.status(400).send(JSON.stringify({ error: "Bad JSON" }));
            return;
        }
        var token = json.token;
        if (token === null) {
            res.status(400).send(JSON.stringify({ error: "Invalid Arguments, no token supplied" }));
            return;
        }
        if (userManager.logoutUser(token)) {
            res.status(200).send();
        }
        else {
            res.status(400).send(JSON.stringify({
                error : "User is not logged in"
            }));
        }
        /*res.setHeader("content-type", "application/json");
        res.send(501, JSON.stringify({ error : "/user/logout not implemented yet"}));*/
        return;
    });
});
router.post('/get', function (req, res, next) {
    console.log("Called user/get");
    helpers.resolveBody(req, function (body) {
        res.setHeader("content-type", "application/json");
        var json = helpers.toJson(body);
        if (json == null) {
            res.status(400).send(JSON.stringify({ error: "Bad JSON" }));
            return;
        }
        var token = json.token;
        if (token === null) {
            res.status(400).send(JSON.stringify({ error: "Invalid Arguments, no token supplied" }));
            return;
        }
        userManager.getUser(token, function (User) {
            if (User === null) {
                res.send(400, JSON.stringify({ error: "Invalid Token, unable to retrieve user" }));
                return;
            }
            /*
                Possibly
                var User = userManager.getInfo(userid)
            */
            res.status(200).send(JSON.stringify({
                name: User.getName(),
                image: User.getImage(),
                email: User.getEmail(),
                id: User.getListId()
            }));
            return;
        });
        /*res.setHeader("content-type", "application/json");
        res.send(501, JSON.stringify({ error : "/user/get not implemented yet"}));*/
        return;
    });
});
module.exports = router;