"use strict";

var express = require('express'),
    userController = require('../../controllers/userController'),
    auth = require('../../utils/authenticate'),
    secret = require('../../config/config').secret,
    router = express.Router();

/* User routes */

router.get('/', userController.showAll);
router.get('/:_id', userController.show);
router.post('/', userController.new);
router.post('/authenticate', userController.authenticate);
router.put('/:_id', auth({ secret: secret }), userController.update);
router.delete('/:_id', auth({ secret: secret }), userController.delete);

module.exports = router;

/* API DOCUMENTATION for apidoc.js */
/**
 * @apiDefine UnexpectedBehaviorError
 *
 * @apiError UnexpectedBehavior There is an unexpected behavior from the server.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 500 Internal Server Error
 *		{
 *			"success": false,
 *			"error": "Unexpected behavior."
 *		{
 *
 */

/**
 * @apiDefine ForbiddenError
 *
 * @apiError Forbidden The user doesn't have the rights to perform the request.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 403 Forbidden
 *		{
 *			"success": false,
 *			"error": "Forbidden."
 *		}
 *
 */

/**
 * @apiDefine TokenNotFoundError
 *
 * @apiError TokenNotFound There is no token provided.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 401 Unauthorized
 *		{
 *			"success": false,
 *			"error": "Please provide a token."
 *		}
 *
 */

/**
 * @apiDefine TokenInvalidError
 *
 * @apiError TokenInvalid Failed to authenticate token.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 401 Unauthorized
 *		{
 *			"success": false,
 *			"error": "Failed to authenticate token."
 *		}
 *
 */

/**
 * @apiDefine TokenExpiredError
 *
 * @apiError TokenExpired The token is no longer valid.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 401 Unauthorized
 *		{
 *			"success": false,
 *			"error": "Token is expired."
 *		}
 *
 */

/**
 * @apiDefine MissingParametersError
 *
 * @apiError MissingParameters Missing mandatory parameters to run the operation.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 400 Bad Request
 *		{
 *			"success": false,
 *			"error": "Missing parameters :("
 *		}
 *
 */

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound User doesn't exist.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 404 Not Found
 *		{
 *			"success": false,
 *			"error": "User doesn't exist."
 *		}
 */

/**
 * @api {get} /api/users/ Request Users informations
 * @apiPermission none
 * @apiVersion 0.0.2
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiSuccess {String} _id Id of the User.
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} [name] Name of the User.
 *
 * @apiSuccessExample Success-Response:
 * 		HTTP/1.1 200 OK
 *		{
 *			"success": true,
 *			"users": [
 *				{
 *					"_id": "5898d55ccacc3208f0341728",
 *					"email": "faucheur@faucheur.fr"
 *				},
 *				{
 *					"_id": "5898d5c456ef7714c8216b31",
 *					"email": "faucheur2@faucheur.fr"
 *				}
 *			]
 *		}
 *
 * @apiError UsersNotFound There are no users found.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 404 Not Found
 *		{
 *			"success": false,
 *			"error": "There are no users."
 *		}
 *
 * @apiUse UnexpectedBehaviorError
 */

/**
 * @api {get} /api/users/:_id Request User informations
 * @apiPermission none
 * @apiVersion 0.0.2
 * @apiName GetUserById
 * @apiGroup User
 *
 * @apiSuccess {String} _id Id of the User.
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} [name] Name of the User.
 *
 * @apiSuccessExample Success-Response:
 * 		HTTP/1.1 200 OK
 *		{
 *			"success": true,
 *			"user": {
 *				"_id": "5898d55ccacc3208f0341728",
 *				"email": "faucheur@faucheur.fr"
 *			}
 *		}
 *
 * @apiUse UserNotFoundError
 */

/**
 * @api {post} /api/users/ Create an User
 * @apiPermission none
 * @apiName NewUser
 * @apiGroup User
 *
 * @apiParam {String} email Email of the User.
 * @apiParam {String} password Password of the User.
 *
 * @apiSuccess {Boolean} success Return true on success.
 * @apiSuccess {String} message Human readable message to display for clients.
 *
 * @apiSuccessExample Success-Response:
 * 		HTTP/1.1 200 OK
 *		{
 *			"success": true,
 *			"message": "User saved successfully."
 *		}
 *
 * @apiError UserExists The user already exists.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 409 Conflict
 *		{
 *			"success": false,
 *			"error": "User already exists."
 *		}
 *
 * @apiError UserInvalidEmail The email field is not acceptable as a good email format.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 400 Bad Request
 *		{
 *			"success": false,
 *			"error": "Email is not valid."
 *		}
 *
 * @apiUse MissingParametersError
 * @apiUse UnexpectedBehaviorError
 */

/**
 * @api {post} /api/users/authenticate Authenticate an User
 * @apiPermission none
 * @apiName AuthenticateUser
 * @apiGroup User
 *
 * @apiParam {String} email Email of the User.
 * @apiParam {String} password Password of the User.
 *
 * @apiSuccess {Boolean} success Return true on success.
 * @apiSuccess {String} message Human readable message to display for clients.
 * @apiSuccess {String} token JWT token expires in 24 hours.
 *
 * @apiSuccessExample Success-Response:
 * 		HTTP/1.1 200 OK
 *		{
 *			"success": true,
 *			"message": "User authenticated successfully.",
 *			"token": "jwttoken"
 *		}
 *
 * @apiError UserAuthNotFound Authentication failed because the user not found.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 404 Not Found
 *		{
 *			"success": false,
 *			"error": "Authentication failed because the user not found."
 *		}
 *
 * @apiError UserAuthFailed The email address or password you entered is not valid.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 401 Unauthorized
 *		{
 *			"success": false,
 *			"error": "The email address or password you entered is not valid."
 *		}
 *
 * @apiUse MissingParametersError
 * @apiUse UnexpectedBehaviorError
 */

/**
 * @api {put} /api/users/:_id Update an User
 * @apiPermission user
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {String} _id Id of the User.
 * @apiParam {String} [email] Email of the User.
 * @apiParam {String} [password] Password of the User.
 * @apiParam {String} [name] Name of the User.
 *
 * @apiSuccess {Boolean} success Return true on success.
 * @apiSuccess {String} message Human readable message to display for clients.
 *
 * @apiSuccessExample Success-Response:
 * 		HTTP/1.1 200 OK
 *		{
 *			"success": true,
 *			"message": "User updated successfully."
 *		}
 *
 * @apiError UserEmailExists The email is already taken by another user.
 *
 * @apiErrorExample Error-Response:
 *		HTTP/1.1 409 Conflict
 *		{
 *			"success": false,
 *			"error": "This email is already taken by another user."
 *		}
 *
 * @apiUse UnexpectedBehaviorError
 * @apiUse UserNotFoundError
 * @apiUse TokenNotFoundError
 * @apiUse TokenInvalidError
 * @apiUse TokenExpiredError
 * @apiUse ForbiddenError
 */

/**
 * @api {delete} /api/users/:_id Delete an User
 * @apiPermission user
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {String} _id Id of the User.
 *
 * @apiSuccess {Boolean} success Return true on success.
 * @apiSuccess {String} message Human readable message to display for clients.
 *
 * @apiSuccessExample Success-Response:
 * 		HTTP/1.1 200 OK
 *		{
 *			"success": true,
 *			"message": "User removed successfully."
 *		}
 *
 * @apiUse UnexpectedBehaviorError
 * @apiUse UserNotFoundError
 * @apiUse TokenNotFoundError
 * @apiUse TokenInvalidError
 * @apiUse TokenExpiredError
 * @apiUse ForbiddenError
 */
