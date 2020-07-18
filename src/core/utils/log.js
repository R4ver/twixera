const colors = {
    log: "#2f3542",
    success: "#2bbf66",
    info: "#5352ed",
    warning: "#f9ca24",
    error: "#ff4757",
    debug: "#EE5A24"
}

const Log = {
    get log() {
        const prefix = ["%c[TWIXERA LOG]", `color: white; background-color: ${colors.log}; padding: 4px 6px; border-radius: 3px`];
        return console.log.bind(window.console, ...prefix);
    },

    get success() {
        const prefix = ["%c[TWIXERA SUCCESS]", `color: white; background-color: ${colors.success}; padding: 4px 6px; border-radius: 3px`];
        return console.log.bind(window.console, ...prefix);
    },

    get info() {
        const prefix = ["%c[TWIXERA INFO]", `color: white; background-color: ${colors.info}; padding: 4px 6px; border-radius: 3px`];
        return console.log.bind(window.console, ...prefix);
    },

    get warning() {
        const prefix = ["%c[TWIXERA WARNING]", `color: black; background-color: ${colors.warning}; padding: 4px 6px; border-radius: 3px`];
        return console.log.bind(window.console, ...prefix);
    },

    get error() {
        const prefix = ["%c[TWIXERA ERROR]", `color: white; background-color: ${colors.error}; padding: 4px 6px; border-radius: 3px`];
        return console.error.bind(window.console, ...prefix);
    },

    get debug() {
        if ( process.env.NODE_ENV !== "development" ) return function(){};

        const prefix = [`%c[TWIXERA DEBUG]`, `color: white; background-color: ${colors.debug}; padding: 4px 6px; border-radius: 3px`];
        return console.log.bind(window.console, ...prefix);
    }
}


export default Log;