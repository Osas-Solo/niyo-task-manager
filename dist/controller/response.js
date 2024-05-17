"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotFoundResponse = exports.sendForbiddenResponse = exports.sendUnauthorisedErrorResponse = exports.sendInternalServerErrorResponse = void 0;
function sendInternalServerErrorResponse(response, cause) {
    response.status(500).json({
        status: 500,
        message: 'Internal server error',
        error: `Sorry, an error occurred while ${cause}. Please try again later.`,
    });
}
exports.sendInternalServerErrorResponse = sendInternalServerErrorResponse;
function sendUnauthorisedErrorResponse(response, error) {
    response.status(401).json({
        status: 401,
        message: 'Unauthorised',
        error: error,
    });
}
exports.sendUnauthorisedErrorResponse = sendUnauthorisedErrorResponse;
function sendForbiddenResponse(response) {
    response.status(403).json({
        status: 403,
        message: 'Forbidden',
        error: 'Sorry, you do not have access to make this request',
    });
}
exports.sendForbiddenResponse = sendForbiddenResponse;
function sendNotFoundResponse(response, item, id) {
    response.status(404).json({
        status: 404,
        message: 'Not found',
        error: `Sorry, no ${item} with id ${id} could be found`,
    });
}
exports.sendNotFoundResponse = sendNotFoundResponse;
