import { User } from "../models/user/user";

export const registerFetch = async (userSave: User) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
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
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    try{
        const response = await fetch(`${API_URL}/user/token/activate?token=${code}&email=${email}`, {
            method: "PATCH",
            headers: {
                "Content-Type": 'application/json',
            }
        })
      const rawText = await response.text();

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Error");
        }
        try {
            return JSON.parse(rawText);
        } catch (parseError) {
            return rawText; 
        }
        
    } catch(error){
        console.error("Error");
        throw error;
    }
}


