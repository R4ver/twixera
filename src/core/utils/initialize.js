import Log from "Core/utils/log";

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector;
}

// MutationSelectorObserver represents a selector and it's associated initialization callback.
let MutationSelectorObserver = function (selector, callback, options) {
    this.selector = selector;
    this.callback = callback;
    this.options = options;
};

// List of MutationSelectorObservers.
let msobservers = [];
const initializer = (selector, callback, options) => {

    // Wrap the callback so that we can ensure that it is only
    // called once per element.
    let seen = [];
    let callbackOnce = elem => {
        if (seen.indexOf(elem) == -1) {
            seen.push(elem);
            if ( callback ) {
                callback(elem);
            }
        }
    };

    // See if the selector matches any elements already on the page.
    let elem = document.querySelectorAll(selector);
    if ( elem ) {
        callbackOnce(elem)
    }

    // Then, add it to the list of selector observers.
    let msobserver = new MutationSelectorObserver(selector, callbackOnce, options)

    let observer = new MutationObserver(function (mutations) {
        var matches = [];

        // For each mutation.
        for (var m = 0; m < mutations.length; m++) {

            // If this is an attributes mutation, then the target is the node upon which the mutation occurred.
            if (mutations[m].type == 'attributes') {
                // Check if the mutated node matchs.
                if (mutations[m].target.matches(msobserver.selector))
                    matches.push(mutations[m].target);

                // If the selector is fraternal, query siblings of the mutated node for matches.
                if (msobserver.isFraternal)
                    matches.push.apply(matches, mutations[m].target.parentElement.querySelectorAll(msobserver.selector));
                else
                    matches.push.apply(matches, mutations[m].target.querySelectorAll(msobserver.selector));
            }

            // If this is an childList mutation, then inspect added nodes.
            if (mutations[m].type == 'childList') {
                // Search added nodes for matching selectors.
                for (var n = 0; n < mutations[m].addedNodes.length; n++) {
                    if (!(mutations[m].addedNodes[n] instanceof Element)) continue;

                    // Check if the added node matches the selector
                    if (mutations[m].addedNodes[n].matches(msobserver.selector))
                        matches.push(mutations[m].addedNodes[n]);

                    // If the selector is fraternal, query siblings for matches.
                    if (msobserver.isFraternal)
                        matches.push.apply(matches, mutations[m].addedNodes[n].parentElement.querySelectorAll(msobserver.selector));
                    else
                        matches.push.apply(matches, mutations[m].addedNodes[n].querySelectorAll(msobserver.selector));
                }
            }
        }

        // For each match, call the callback using jQuery.each() to initialize the element (once only.)
        for (var i = 0; i < matches.length; i++)
            msobserver.callback(matches[i]);

        
    });
    
    // Observe the target element.
    var defaultObeserverOpts = {
        childList: true,
        subtree: true,
        attributes: true
    }
    observer.observe(options.target, options.observer || defaultObeserverOpts);
    msobserver.disconnect = () => {
        observer.disconnect();
    }
    msobservers.push(msobserver);
    window.msobservers = msobservers;
    return observer;
};

export const initialize = (selector, callback, options) => {
    const defaultOptions = {
        target: document.documentElement, // Defaults to observe the entire document.
        observer: null // MutationObserverInit: Defaults to internal configuration if not provided.
    }
    return initializer(selector, callback, {...defaultOptions, ...options});
};

//remove any previous observers for this selector
export const deinitialize = selector => {
    msobservers = msobservers.filter((o) => {
        if ( o.selector === selector ) {
            o.disconnect();
            return;
        }

        return o.selector !== selector
    });

    window.msobservers = msobservers;
};
