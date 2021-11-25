import moment from 'moment';


export const formatTime = (date: string, formatDate = 'DD-MM-YYYY at h:mm a') => {
    if (date === null) return date;
    let newTime = moment(date);
    return newTime.format(formatDate);
}

export const formatDate = (date: string, formatDate = 'DD-MM-YYYY') => {
        if (date === null) return date;
        let newTime = moment(date);
        return newTime.format(formatDate);
}

export const formatTimeFromNow = (date: string) => {    
    return moment(date).calendar();
}
