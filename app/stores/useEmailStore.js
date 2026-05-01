import {create} from 'zustand';

export const useEmailStore = create((set) => ({
    email: '',
    setEmail: (newEmail) => set({email: newEmail}),
    clearEmail: ()=> set({email: ''}),
}))