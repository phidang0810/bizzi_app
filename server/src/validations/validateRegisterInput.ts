import { RegisterInput } from '../types/RegisterInput';
export const validateRegisterInput = (registerInput: RegisterInput) => {
    if(!registerInput.email.includes('@')) {
        return {
            message: 'Invalid email',
            errors: [
                {field: 'email', message: 'Emailsdf'}
            ]
        }        
    }
    return null;
}