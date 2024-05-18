"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../models/utils");
const response_1 = require("./response");
const token_authenticator_1 = require("./token-authenticator");
const Task_1 = __importDefault(require("../models/Task"));
const jwt = require('jsonwebtoken');
exports.createTask = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userID = Number(request.params.id);
        if (isNaN(userID)) {
            userID = 0;
        }
        if ((0, token_authenticator_1.authenticateToken)(request, userID)) {
            const title = request.body.title.trim();
            const description = request.body.description.trim();
            const startTime = request.body.startTime.trim();
            const endTime = request.body.endTime.trim();
            const taskCreationError = yield validateTaskCreation(title, description, startTime, endTime);
            const areTaskDetailsValid = Object.values(taskCreationError).every((error) => error === '');
            if (areTaskDetailsValid) {
                const newTask = yield Task_1.default.create({
                    userID: userID,
                    title: title,
                    description: description,
                    startTime: startTime,
                    endTime: endTime,
                });
                sendSuccessfulTaskCreationResponse(response, newTask);
            }
            else {
                (0, response_1.sendUnauthorisedErrorResponse)(response, taskCreationError);
            }
        }
        else {
            (0, response_1.sendForbiddenResponse)(response);
        }
    }
    catch (error) {
        console.log(error);
        (0, response_1.sendInternalServerErrorResponse)(response, 'trying to signup');
    }
});
const validateTaskCreation = (title, description, startTime, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    const taskError = {
        titleError: '',
        descriptionError: '',
        startTimeError: '',
        endTimeError: '',
        isCompletedError: '',
    };
    if (!(0, utils_1.isTitleValid)(title)) {
        taskError.titleError = 'Sorry, task titles can only have a maximum of 100 characters';
    }
    if (!(0, utils_1.isDescriptionValid)(description)) {
        taskError.descriptionError = 'Please, describe your task';
    }
    if (!(0, utils_1.isStartTimeValid)(startTime)) {
        taskError.startTimeError = 'Sorry, time must be in the format: 2024-10-03 12:23:04 and start time must be a future time period';
    }
    if (!(0, utils_1.isEndTimeValid)(startTime, endTime)) {
        taskError.endTimeError = 'Sorry, time must be in the format: 2024-10-03 12:23:04 and times must be a future time period after start time';
    }
    return taskError;
});
const sendSuccessfulTaskCreationResponse = function (response, newTask) {
    response.status(201).json({
        status: 201,
        message: 'Created',
        data: {
            task: newTask,
        }
    });
};
const sendSuccessfulIndividualTaskResponse = function (response, task) {
    response.status(200).json({
        status: 200,
        message: 'OK',
        data: {
            task: task,
        }
    });
};
exports.retrieveIndividualTask = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userID = Number(request.params.userID);
        let taskID = Number(request.params.taskID);
        if (isNaN(userID)) {
            userID = 0;
        }
        if (isNaN(taskID)) {
            taskID = 0;
        }
        if ((0, token_authenticator_1.authenticateToken)(request, userID)) {
            const task = yield Task_1.default.findOne({
                where: {
                    id: taskID,
                    userID: userID,
                }
            });
            if (task) {
                sendSuccessfulIndividualTaskResponse(response, task);
            }
            else {
                (0, response_1.sendNotFoundResponse)(response, 'task', taskID);
            }
        }
        else {
            (0, response_1.sendForbiddenResponse)(response);
        }
    }
    catch (error) {
        console.log(error);
        (0, response_1.sendInternalServerErrorResponse)(response, 'trying to signup');
    }
});
