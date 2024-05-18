import {Request, Response} from 'express';
import {
    generateHash, isDescriptionValid,
    isEmailAddressValid, isEndTimeValid,
    isNameValid,
    isPasswordConfirmed,
    isPasswordValid, isStartTimeValid,
    isTitleValid
} from '../models/utils';
import User from '../models/User';
import {
    sendForbiddenResponse,
    sendInternalServerErrorResponse,
    sendNotFoundResponse,
    sendUnauthorisedErrorResponse
} from './response';
import {authenticateToken, retrieveToken, saveToken} from './token-authenticator';
import Task from '../models/Task';

interface TaskErrors {
    titleError: string,
    descriptionError: string,
    startTimeError: string,
    endTimeError: string,
    isCompletedError: string,
}

const jwt = require('jsonwebtoken');

exports.createTask = async (request: Request, response: Response) => {
    try {
        let userID: number = Number(request.params.id);

        if (isNaN(userID)) {
            userID = 0;
        }

        if (authenticateToken(request, userID)) {
            const title: string = request.body.title.trim();
            const description: string = request.body.description.trim();
            const startTime: string = request.body.startTime.trim();
            const endTime: string = request.body.endTime.trim();

            const taskCreationError = await validateTaskCreation(title, description, startTime, endTime);
            const areTaskDetailsValid = Object.values(taskCreationError).every((error) => error === '');

            if (areTaskDetailsValid) {
                const newTask = await Task.create(
                    {
                        userID: userID,
                        title: title,
                        description: description,
                        startTime: startTime,
                        endTime: endTime,
                    }
                );

                sendSuccessfulTaskCreationResponse(response, newTask);
            } else {
                sendUnauthorisedErrorResponse(response, taskCreationError);
            }
        } else {
            sendForbiddenResponse(response);
        }
    } catch (error) {
        console.log(error);

        sendInternalServerErrorResponse(response, 'trying to signup');
    }
}

const validateTaskCreation = async (title: string, description: string, startTime: string, endTime: string) => {
    const taskError: TaskErrors = {
        titleError: '',
        descriptionError: '',
        startTimeError: '',
        endTimeError: '',
        isCompletedError: '',
    }

    if (!isTitleValid(title)) {
        taskError.titleError = 'Sorry, task titles can only have a maximum of 100 characters';
    }

    if (!isDescriptionValid(description)) {
        taskError.descriptionError = 'Please, describe your task';
    }

    if (!isStartTimeValid(startTime)) {
        taskError.startTimeError = 'Sorry, time must be in the format: 2024-10-03 12:23:04 and start time must be a future time period';
    }

    if (!isEndTimeValid(startTime, endTime)) {
        taskError.endTimeError = 'Sorry, time must be in the format: 2024-10-03 12:23:04 and times must be a future time period after start time';
    }

    return taskError;
};

const sendSuccessfulTaskCreationResponse = function (response: Response, newTask: Task) {
    response.status(201).json(
        {
            status: 201,
            message: 'Created',
            data: {
                task: newTask,
            }
        }
    );
};

const sendSuccessfulIndividualTaskResponse = function (response: Response, task: Task) {
    response.status(200).json(
        {
            status: 200,
            message: 'OK',
            data: {
                task: task,
            }
        }
    );
};

exports.retrieveIndividualTask = async (request: Request, response: Response) => {
    try {
        let userID: number = Number(request.params.userID);
        let taskID: number = Number(request.params.taskID);

        if (isNaN(userID)) {
            userID = 0;
        }

        if (isNaN(taskID)) {
            taskID = 0;
        }

        if (authenticateToken(request, userID)) {
            const task = await Task.findOne({
                where: {
                    id: taskID,
                    userID: userID,
                }
            });

            if (task) {
                sendSuccessfulIndividualTaskResponse(response, task);
            } else {
                sendNotFoundResponse(response, 'task', taskID);
            }
        } else {
            sendForbiddenResponse(response);
        }
    } catch (error) {
        console.log(error);

        sendInternalServerErrorResponse(response, 'trying to signup');
    }
}
