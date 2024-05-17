import {Response} from 'express';

function sendInternalServerErrorResponse(response: Response, cause: string) {
    response.status(500).json(
        {
            status: 500,
            message: 'Internal server error',
            error: `Sorry, an error occurred while ${cause}. Please try again later.`,
        }
    );
}

function sendUnauthorisedErrorResponse(response: Response, error: any) {
    response.status(401).json(
        {
            status: 401,
            message: 'Unauthorised',
            error: error,
        }
    );
}

function sendForbiddenResponse(response: Response) {
    response.status(403).json(
        {
            status: 403,
            message: 'Forbidden',
            error: 'Sorry, you do not have access to make this request',
        }
    );
}

function sendNotFoundResponse(response: Response, item: string, id: string) {
    response.status(404).json(
        {
            status: 404,
            message: 'Not found',
            error: `Sorry, no ${item} with id ${id} could be found`,
        }
    );
}

export {sendInternalServerErrorResponse, sendUnauthorisedErrorResponse, sendForbiddenResponse, sendNotFoundResponse};