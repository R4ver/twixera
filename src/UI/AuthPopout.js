import { useState, useEffect } from "react";
import mixerApi from "Core/utils/mixerApi";
import Crypto from "Core/utils/crypto";
import { getCurrentUser } from "Core/utils/mixer";
import Mixera from "Core/utils/mixera";
import { removeSetting, getSettings } from "Core/settings";
import { setSetting } from "../core/settings";

let storageKey = "__mixera_auth";
let pw;

const AuthPopout = props => {
    const [isAuthed, setIsAuthed] = useState(false);
    const [isPoppedOut, setIsPoppedOut] = useState(false);
    
    useEffect( () => {
        Crypto = new Crypto();
        setIsAuthed(Crypto.isAuthed());
    }, [])
    
    const popout = (url, winName, w, h, scroll) => {
        setIsPoppedOut(true);
        let LeftPosition = (screen.width) ? (screen.width - w) / 2 : 0;
        let TopPosition = (screen.height) ? (screen.height - h) / 2 : 0;
        let settings ='height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=' + scroll + ',resizable';
        pw = window.open(url, winName, settings);

        waitForToken().then(authed => {
            pw.close();

            setIsAuthed(authed);

            popoutClosed();
        });
    }

    const popoutClosed = () => {
        setIsPoppedOut(false);
    }

    const generateAuthUrl = () => {
        return `https://mixer.com/oauth/authorize?client_id=${process.env.MIXER_CLIENT_ID}&redirect_uri=https://mixer.com&response_type=token&scope=channel:update:self`;
    }

    const logoutMixer = () => {
        removeSetting(storageKey);

        getSettings().filter(e => e.auth).map(e => setSetting(e.id, false));

        setIsAuthed(false);
    }

    let popoutButton = <button onClick={() => popout(generateAuthUrl(), "Mixera - Mixer Auth", 500, 600, true)} className="mixera-button has-primary-gradient"><img src="_latest/assets/images/main/logos/merge.svg" /> Login With Mixer</button>
    let logoutButton = <button onClick={logoutMixer} className="mixera-button has-danger-gradient"><img src="_latest/assets/images/main/logos/merge.svg" /> Logout</button>
    return (
        <>
            { isAuthed ? (
                logoutButton
            ) : (
                popoutButton
            )}
        </>
    );
}

export default AuthPopout;

/**
 * TODO:
 * Rewrite this function to handle and return the implicit auth token.
 * Also remove old auth flow
 * 
 * Resources:
 * Check if token is valid: https://dev.mixer.com/rest/index.html#oauth_token_introspect_post
 */

const waitForToken = () => {
    let timeout;
    let interval;
    let token;
    Crypto = new Crypto();
    return Promise.race([
        new Promise(resolve => {
            timeout = setTimeout(resolve, 10000);
        }),
        new Promise(resolve => {
            interval = setInterval(() => {

                const getCode = () => {
                    let hashSearch = pw.location.hash.match(/\#(?:access_token)\=([\S\s]*?)\&/);
                    // token = params.get("#access_token");

                    return hashSearch || false;
                }

                token = getCode();

                if (token[1]) {
                    resolve(token[1]);
                }
            }, 25);
        })
    ]).then(token => {
        clearTimeout(timeout);
        clearInterval(interval);
        let encryptedToken = Crypto.encrypt(token);
        localStorage.setItem(storageKey, encryptedToken);

        if ( Crypto.isAuthed() ) {
            return true;
        }

        return false;

    }).catch(err => console.error(err));
}