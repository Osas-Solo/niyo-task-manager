import {Request, Response} from 'express';
import {
    isDescriptionValid,
    isEndTimeValid,
    isStartTimeValid,
    isTaskCompletedValid,
    isTitleValid
} from '../models/utils';
import {
    sendForbiddenResponse,
    sendInternalServerErrorResponse,
    sendNotFoundResponse,
    sendUnauthorisedErrorResponse
} from './response';
import {authenticateToken} from './token-authenticator';
import Task from '../models/Task';

import {io} from '../index';

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

                io.emit(`task_${newTask.id}`, {message: 'Task Creation', newTask: newTask});

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

const sendSuccessfulTaskCreationResponse = (response: Response, newTask: Task) => {
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
                io.emit(`task_${task.id}`, {message: 'Read Individual Task', task: task});

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

exports.retrieveMultipleTasks = async (request: Request, response: Response) => {
    try {
        let userID: number = Number(request.params.userID);

        if (isNaN(userID)) {
            userID = 0;
        }

        if (authenticateToken(request, userID)) {
            const tasks = await Task.findAll({
                where: {
                    userID: userID,
                }
            });

            io.emit(`tasks_${userID}`, {message: 'Read All Tasks', task: tasks});

            sendSuccessfulMultipleTasksResponse(response, tasks);
        } else {
            sendForbiddenResponse(response);
        }
    } catch (error) {
        console.log(error);

        sendInternalServerErrorResponse(response, 'trying to signup');
    }
}

const sendSuccessfulIndividualTaskResponse = (response: Response, task: Task) => {
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

const sendSuccessfulMultipleTasksResponse = (response: Response, tasks: Task[]) => {
    response.status(200).json(
        {
            status: 200,
            message: 'OK',
            data: {
                tasks: tasks,
            }
        }
    );
};

exports.updateTask = async (request: Request, response: Response) => {
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
            let task = await Task.findOne({
                where: {
                    id: taskID,
                    userID: userID,
                }
            });

            if (task) {
                const title: string = request.body.title.trim();
                const description: string = request.body.description.trim();
                const startTime: string = request.body.startTime.trim();
                const endTime: string = request.body.endTime.trim();
                const isCompleted: boolean = Boolean(Number(request.body.isCompleted.trim()));

                const taskUpdateError = await validateTaskUpdate(title, description, startTime, endTime, isCompleted);
                const areTaskDetailsValid = Object.values(taskUpdateError).every((error) => error === '');

                if (areTaskDetailsValid) {
                    task = await task.update({
                        title: title,
                        description: description,
                        startTime: startTime,
                        endTime: endTime,
                        isCompleted: isCompleted,
                    });

                    io.emit(`task_${task.id}`, {message: 'Task Update', task: task});

                    sendSuccessfulIndividualTaskResponse(response, task);
                } else {
                    sendUnauthorisedErrorResponse(response, taskUpdateError);
                }
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
};

const validateTaskUpdate = async (title: string, description: string, startTime: string, endTime: string, isCompleted: any) => {
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

    if (!isTaskCompletedValid(isCompleted)) {
        taskError.isCompletedError = 'Sorry, select only true or false';
    }

    return taskError;
};

exports.deleteTask = async (request: Request, response: Response) => {
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
            let task = await Task.findOne({
                where: {
                    id: taskID,
                    userID: userID,
                }
            });

            if (task) {
                io.emit(`task_${task.id}`, {message: 'Task Delete', task: task});

                await task.destroy();

                sendSuccessfulTaskDeleteResponse(response);
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
};

const sendSuccessfulTaskDeleteResponse = (response: Response) => {
    response.status(204).json(
        {
            status: 204,
            message: 'Not Content',
            data: {},
        }
    );
};