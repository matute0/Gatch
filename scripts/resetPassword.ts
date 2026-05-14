import { PasswordRequest } from './../types/PasswordRequest';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const genCode = async (email: string) => {
    const response = await fetch(`${API_URL}/password/code?email=${email}`, {
        method: "POST",
        headers: { "Content-Type": 'application/json' }
    });

    const rawText = await response.text();

    if (!response.ok) {
        let errorMessage = "Error";
        try {
            const errorData = JSON.parse(rawText);
            errorMessage = errorData.message || errorMessage;
        } catch {
            errorMessage = rawText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    try {
        return JSON.parse(rawText);
    } catch {
        return rawText;
    }
}
export const changePassword = async(pwRequest: PasswordRequest) => {
        const response = await fetch(`${API_URL}/password/reset`, {
        method: "PATCH",
        headers:{"Content-Type": 'application/json'},
        body: JSON.stringify(pwRequest)
    });

       const rawText = await response.text();

    if (!response.ok) {
        let errorMessage = "Error";
        try {
            const errorData = JSON.parse(rawText);
            errorMessage = errorData.message || errorMessage;
        } catch {
            errorMessage = rawText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    try {
        return JSON.parse(rawText);
    } catch {
        return rawText;
    }
}