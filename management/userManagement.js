var UserControl = require('../database/UserControl');
/*
    token : {
        userid : (in database), provider, name, token
    }
*/
var tokens; //list of tokens
var TOKEN_LENGTH = 20;
/* UserObj : {
    name : full_name, email, profile_pic : url, id (google id),
    timestamp (expiration time), provider, token
}*/
exports.init = function() {
    tokens = {
        0 : null
     }
}
/*exports.generateToken = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (var i = 0; i < TOKEN_LENGTH; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
}*/
//adds a user to the tokens list and to the db if need be and returns the token
//if fails to add, return null
//callback(token|null)
exports.addUser = function(UserObj, callback) {
    UserControl.putUser(UserObj, function(success) {
        if (success) {
            tokens.token = UserObj;
            callback(UserObj.token);
        }
        else {
            callback(null);
        }
    });
}
//checks if the user exists in the database
//
exports.userExists = function(UserObj, callback) {

}
//gets a user from the database from a given token
//returns a User if successful, null if else 
exports.getUser = function(token) {

}
//remove token from 
exports.logoutUser = function(token) {

}