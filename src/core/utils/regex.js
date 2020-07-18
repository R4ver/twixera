export const escape = text => {
    return text.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&');
}

export const stripAll = (haystack, needle) => {
    while (haystack.indexOf(needle) > -1) {
        haystack = haystack.replace(needle, '');
    }
    return haystack;
}

export const mustacheFormat = (string, replacements) => {
    return string.replace(/\{\{(.*?)\}\}/g, (_, key) => replacements[key]);
}