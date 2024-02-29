import { atom } from 'recoil';

export const recieverUser = atom({
    key:'recieverUser',
    default: {
        name: 'null',
        userId: 'null'
    }
})