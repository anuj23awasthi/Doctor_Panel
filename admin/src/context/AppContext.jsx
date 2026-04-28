import {createContext} from "react";

export const AppContext = createContext();

const AppContextProvider= (props)=>{

    const currency ='$';

    const calculateAge = (dob) => {
        if (!dob || dob === 'Not Selected') return null;

        let birthDate;
        if (typeof dob === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dob)) {
            const [year, month, day] = dob.split('-').map(Number);
            birthDate = new Date(year, month - 1, day);
        } else {
            birthDate = new Date(dob);
        }

        if (Number.isNaN(birthDate.getTime())) return null;

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age -= 1;
        }

        return age >= 0 ? age : null;
    }

     const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

   

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + (dateArray[2])
    }

    const value={
        calculateAge,
        slotDateFormat,
        currency

    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider;