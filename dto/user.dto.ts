export interface CreateUserInputs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


export interface LoginUserInputs {
    email: string,
    password: string,
}

export interface UserPaylaod {
    _id: string,
    email: string,
    role: string,
}