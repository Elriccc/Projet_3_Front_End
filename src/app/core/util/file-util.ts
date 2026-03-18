export function buildExpirationMessage(daysUntilExpired: number, prefix?: string
        , suffix?: string){
    prefix = prefix? prefix: "";
    suffix = suffix? suffix: "";
    let message = prefix;
    switch(daysUntilExpired){
        case 1: return message + "un jours"+ suffix;
        case 2: return message + "deux jours"+ suffix;
        case 3: return message + "trois jours"+ suffix;
        case 4: return message + "quatre jours"+ suffix;
        case 5: return message + "cinq jours"+ suffix;
        case 6: return message + "six jours"+ suffix;
        case 7: return message + "une semaine"+ suffix;
        default: return message + suffix;
    }
}

export function buildFileSizeLabel(fileSize: number){
    if (fileSize < 1000) {
        return fileSize + " o";
    } else if (fileSize < 1000 * 1000) {
        return (fileSize / 1000).toFixed(2) + " Ko";
    } else if (fileSize < 1000 * 1000 * 1000) {
        return (fileSize / (1000 * 1000)).toFixed(2) + " Mo";
    } else {
        return (fileSize / (1000 * 1000 * 1000)).toFixed(2) + " Go";
    }
}