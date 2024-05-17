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
const User_1 = __importDefault(require("../models/User"));
const response_1 = require("./response");
exports.signup = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const firstName = request.body.firstName.trim();
        const lastName = request.body.lastName.trim();
        const emailAddress = request.body.emailAddress.trim();
        const password = request.body.password;
        const passwordConfirmer = request.body.passwordConfirmer;
        const signupError = yield validateSignup(firstName, lastName, emailAddress, password, passwordConfirmer);
        const areUserDetailsValid = Object.values(signupError).every((error) => error === '');
        if (areUserDetailsValid) {
            const newUser = yield User_1.default.create({
                firstName: firstName,
                lastName: lastName,
                emailAddress: emailAddress,
                password: (0, utils_1.generateHash)(password),
            });
            sendSuccessfulSignupResponse(response, newUser);
        }
        else {
            (0, response_1.sendUnauthorisedErrorResponse)(response, signupError);
        }
    }
    catch (error) {
        console.log(error);
        (0, response_1.sendInternalServerErrorResponse)(response, 'trying to signup');
    }
});
const validateSignup = (firstName, lastName, emailAddress, password, passwordConfirmer) => __awaiter(void 0, void 0, void 0, function* () {
    const signupError = {
        firstNameError: '',
        lastNameError: '',
        emailAddressError: '',
        passwordError: '',
        passwordConfirmerError: '',
    };
    if (!(0, utils_1.isNameValid)(firstName)) {
        signupError.firstNameError = 'Sorry, first names can only contain letters and can only have a maximum of 100 characters';
    }
    if (!(0, utils_1.isNameValid)(lastName)) {
        signupError.lastNameError = 'Sorry, last names can only contain letters and can only have a maximum of 100 characters';
    }
    if (!(0, utils_1.isEmailAddressValid)(emailAddress)) {
        signupError.emailAddressError = 'Please enter a valid email address';
    }
    else {
        const existingUser = yield User_1.default.findOne({
            where: {
                emailAddress: emailAddress,
            }
        });
        if (existingUser) {
            signupError.emailAddressError = `Sorry, this email address: ${emailAddress} is already in use`;
        }
    }
    if (!(0, utils_1.isPasswordValid)(password)) {
        signupError.passwordError = 'Sorry, passwords must contain an uppercase, lowercase and a digit. It must be a minimum of 8 characters and a maximum of 20 characters';
    }
    if (!(0, utils_1.isPasswordConfirmed)(password, passwordConfirmer)) {
        signupError.passwordConfirmerError = 'Please re-enter the password you chose';
    }
    return signupError;
});
const sendSuccessfulSignupResponse = function (response, newUser) {
    response.status(201).json({
        status: 201,
        message: 'Created',
        data: {
            user: getUserDetails(newUser),
        }
    });
};
function getUserDetails(user) {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        fullName: user.fullName,
    };
}
