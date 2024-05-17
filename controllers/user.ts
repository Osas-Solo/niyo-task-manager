import {Request, Response} from 'express';
import {generateHash, isEmailAddressValid, isNameValid, isPasswordConfirmed, isPasswordValid} from '../models/utils';
import User from '../models/User';
import {sendInternalServerErrorResponse, sendUnauthorisedErrorResponse} from './response';

interface SignupErrors {
    firstNameError: string,
    lastNameError: string,
    emailAddressError: string,
    passwordError: string,
    passwordConfirmerError: string,
}

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

function getUserDetails(user: User) {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        fullName: user.fullName,
    };
}