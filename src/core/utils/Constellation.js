import { Carina } from "carina";

let num = 0;
window.CarinaListeners = {};

class Constellation {
    constructor({type, id, event}) {
        this.type = type;
        this.id = id;
        this.event = event;
        this.slug = `${this.type}:${this.id}:${this.event}`;
        this.slugTracker = `${this.slug}_${num++}`;

        this.ca = new Carina({ isBot: true }).open();
    }

    listen = callback => {
        if ( !callback || typeof callback !== "function" ) throw new Error("Constellation events need a callback on the listener");

        window.CarinaListeners[this.slugTracker] = this.ca;

        this.ca.subscribe(this.slug, data => {
            callback(data);
        });
    }

    unsub = () => {
        console.log(this.ca);
        this.ca.unsubscribe(this.slug);
        this.ca.close();
        console.log("should remove slug")
        delete window.CarinaListeners[this.slugTracker];
        console.log("Constellation: Unsubbing: ", this.slug, this.ca);
    }
}

export default Constellation