import { AuthRequest } from "@/types/AuthRequest";
import { User } from "../models/user/user";
import * as SecureStore from 'expo-secure-store';

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const registerFetch = async (userSave: User) => {
    try{
        const response = await fetch(`${API_URL}/user/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userSave),
        });
        

        if(!response.ok){
            const errorData = await response.json();
            
            throw new Error(errorData.message || "Error");
        }
        return await response.json();
    } catch(error){
        console.error("Error");
        throw error;
    }
}

export const activateUser = async (email: string, code: string) => {
    try {
        const response = await fetch(`${API_URL}/user/token/activate?token=${code}&email=${email}`, {
            method: "PATCH",
            headers: {
                "Content-Type": 'application/json',
            }
        });

        const rawText = await response.text();

        if (!response.ok) {
            let errorMessage = "Error";
            try {
                const errorData = JSON.parse(rawText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = rawText || errorMessage; 
            }
            throw new Error(errorMessage);
        }

        try {
            return JSON.parse(rawText);
        } catch (parseError) {
            return rawText; 
        }
        
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const login = async (auth: AuthRequest)=>{
    try{
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(auth),
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Error");
        }
        const tokenString = await response.text();
        await SecureStore.setItemAsync('jwt', tokenString);
    } catch(error){
        console.error("Error")
        throw error;
    }
}


