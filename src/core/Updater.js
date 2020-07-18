import { getSetting, setSetting, removeSetting } from "Core/settings";
import Mixera, { events, mixeraVersion, isLatestVersion } from "Mixera";

console.log(getSetting("version"))

const currentVersion = getSetting("version") || "0.0.0";
export const checkForUpdates = (currentVersion !== mixeraVersion ? true : false);

// Updates for 1.3.7
const updates = []

export const update = () => {
    return new Promise( async (resolve, reject) => {      
        console.log("Updating");  
        for ( let i = 0; i < updates.length; i++ ) {
            let item = updates[i];
            console.log(item.minVersion, currentVersion);
            if ( item.minVersion > currentVersion ) {
                console.log("Updating");
                console.log(item);
                let updated = await item.update();
    
                if (updated && item.showNotification) {
                    const { notification, type } = item;
                    Mixera.emit(events.NEW_NOTIFICATION, {
                        notification,
                        type
                    })
                }
            }

    
            if ( i === updates.length - 1 ) {
                setSetting("version", mixeraVersion);
                resolve(true);
            }
        }
        resolve(true);
    })
}