import {Request, Response} from 'express';
import {generateHash, isEmailAddressValid, isNameValid, isPasswordConfirmed, isPasswordValid} from '../models/utils';
import User from '../models/User';
import {sendInternalServerErrorResponse, sendUnauthorisedErrorResponse} from './response';
import {retrieveToken, saveToken} from './token-authenticator';

interface SignupErrors {
    firstNameError: string,
    lastNameError: string,
    emailAddressError: string,
    passwordError: string,
    passwordConfirmerError: string,
}

interface LoginErrors {
    emailAddressError: string,
    passwordError: string,
}

interface UserAndErrorWrapper {
    user: User | null,
    error: any,
}

const jwt = require('jsonwebtoken');

exports.signup = async (request: Request, response: Response) => {
    try {
        const firstName: string = request.body.firstName.trim();
        const lastName: string = request.body.lastName.trim();
        const emailAddress: string = request.body.emailAddress.trim();
        const password: string = request.body.password;
        const passwordConfirmer: string = request.body.passwordConfirmer;

        const signupError = await validateSignup(firstName, lastName, emailAddress, password, passwordConfirmer);
        const areUserDetailsValid = Object.values(signupError).every((error) => error === '');

        if (areUserDetailsValid) {
            const newUser = await User.create(
                {
                    firstName: firstName,
                    lastName: lastName,
                    emailAddress: emailAddress,
                    password: generateHash(password),
                }
            );

            sendSuccessfulSignupResponse(response, newUser);
        } else {
            sendUnauthorisedErrorResponse(response, signupError);
        }
    } catch (error) {
        console.log(error);

        sendInternalServerErrorResponse(response, 'trying to signup');
    }
}

const validateSignup = async (firstName: string, lastName: string, emailAddress: string, password: string, passwordConfirmer: string) => {
    const signupError: SignupErrors = {
        firstNameError: '',
        lastNameError: '',
        emailAddressError: '',
        passwordError: '',
        passwordConfirmerError: '',
    }

    if (!isNameValid(firstName)) {
        signupError.firstNameError = 'Sorry, first names can only contain letters and can only have a maximum of 100 characters';
    }

    if (!isNameValid(lastName)) {
        signupError.lastNameError = 'Sorry, last names can only contain letters and can only have a maximum of 100 characters';
    }

    if (!isEmailAddressValid(emailAddress)) {
        signupError.emailAddressError = 'Please enter a valid email address';
    } else {
        const existingUser = await User.findOne({
            where: {
                emailAddress: emailAddress,
            }
        });

        if (existingUser) {
            signupError.emailAddressError = `Sorry, this email address: ${emailAddress} is already in use`;
        }
    }

    if (!isPasswordValid(password)) {
        signupError.passwordError = 'Sorry, passwords must contain an uppercase, lowercase and a digit. It must be a minimum of 8 characters and a maximum of 20 characters';
    }

    if (!isPasswordConfirmed(password, passwordConfirmer)) {
        signupError.passwordConfirmerError = 'Please re-enter the password you chose';
    }

    return signupError;
};

exports.login = async (request: Request, response: Response) => {
    try {
        const emailAddress: string = request.body.emailAddress.trim();
        const password: string = request.body.password;

        const retrievedUserAndError = await validateLogin(emailAddress, password);
        const areUserDetailsValid = Object.values(retrievedUserAndError.error).every((error) => error === '');

        if (areUserDetailsValid) {
            const user = retrievedUserAndError.user;

            if (user) {
                saveToken(response, user);
                const {token} = retrieveToken(request);

                sendSuccessfulLoginResponse(response, user, token);
            }
        } else {
            sendUnauthorisedErrorResponse(response, retrievedUserAndError.error);
        }
    } catch (error) {
        console.log(error);

        sendInternalServerErrorResponse(response, 'trying to login');
    }
}

const validateLogin = async (emailAddress: string, password: string) => {
    const loginError: LoginErrors = {
        emailAddressError: '',
        passwordError: '',
    };

    const userAndErrorWrapper: UserAndErrorWrapper = {
        user: null,
        error: loginError,
    };

    let existingUser = await User.findOne({
        where: {
            emailAddress: emailAddress,
            password: generateHash(password),
        },
    });

    if (existingUser) {
        userAndErrorWrapper.user = existingUser;
    } else {
        existingUser = await User.findOne({
            where: {
                emailAddress: emailAddress,
            }
        });

        if (existingUser) {
            loginError.passwordError = `Sorry, the password you have entered is invalid`;
        } else {
            loginError.emailAddressError = `Sorry, this email address: ${emailAddress} could not be found`;
        }
    }

    userAndErrorWrapper.error = loginError;

    return userAndErrorWrapper;
};

const sendSuccessfulSignupResponse = function (response: Response, newUser: User) {
    response.status(201).json(
        {
            status: 201,
            message: 'Created',
            data: {
                user: getUserDetails(newUser),
            }
        }
    );
};

const sendSuccessfulLoginResponse = function (response: Response, user: User, token: string) {
    response.status(200).json(
        {
            status: 200,
            message: 'OK',
            data: {
                user: getUserDetails(user),
                token: token,
            }
        }
    );
};

function getUserDetails(user: User) {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        fullName: user.fullName,
    };
}