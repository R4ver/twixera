/** @license
 * Copyright (c) 2019 R4ver, https://r4ver.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without limitation of the rights to use, copy, modify, merge,
 * and/or publish copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice, any copyright notices herein, and this permission
 * notice shall be included in all copies or substantial portions of the Software,
 * the Software, or portions of the Software, may not be sold for profit, and the
 * Software may not be distributed nor sub-licensed without explicit permission
 * from the copyright owner.
 * 
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * Should any questions arise concerning your usage of this Software, or to
 * request permission to distribute this Software, please contact the copyright
 * holder at business.r4ver@gmail.com
 * 
 * ---------------------------------
 * 
 *   Unofficial TLDR:
 * 
 *   Free to modify for personal use
 *   Need permission to distribute the code
 *   Can't sell addon or features of the addon
 * 
 * ---------------------------------
 * 
 *   Twixera is not endorsed nor affiliated with https://twitch.tv/.
 *   This is simply an extension made to enhance the experience of twitch.tv.
 *   Made for the community by the community.
 * 
 * ---------------------------------
 */


(function Twixera() {
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    var isFirefox = typeof InstallTrigger !== 'undefined';

    var cssURL;
    var jsURL;

    if ( isChrome ) {
        cssURL = chrome.runtime.getURL('twixera.css');
        jsURL = chrome.runtime.getURL('twixera.js');
    }

    if ( isFirefox ) {
        cssURL = browser.runtime.getURL('twixera.css');
        jsURL = browser.runtime.getURL('twixera.js');
    }

    var twixeraStyles = document.createElement("link");
    twixeraStyles.id = "twixera-styles";
    twixeraStyles.rel = "stylesheet";
    twixeraStyles.href = cssURL;

    var twixera = document.createElement("script");
    twixera.id = "twixera";
    twixera.src = jsURL;

    var head = document.getElementsByTagName('head')[0];

    var themes = {
        twixera: {
            "color-background-base": "#1D1B29",
            "color-background-body": "#12111A",
        },
        white: {
            "theme-primary": "#FFFFFF",
            "theme-primary-dark": "#ECF0F3",
            "theme-primary-light": "#D1D9E6",
            "theme-primary-invert": "#000000",
        },
    };

    function setTheme(theme) {
        var twitchDarkClass = "tw-root--theme-dark";

        switch (theme) {
            case "twixera":
                document.getElementsByTagName("html")[0].classList.remove(twitchDarkClass);
                document.getElementsByTagName("html")[0].classList.add(`twixera--theme-${theme}`);
                document.getElementsByTagName("html")[0].classList.add(twitchDarkClass);
                document.body.classList.add("theme", theme);
                break;

            case "dark":
                document.getElementsByTagName("html")[0].classList.remove(`twixera--theme-${theme}`);
                document.body.classList.add("theme", theme);
                break;
        
            default:
                break;
        }

        localStorage.setItem("twixera_twitch_theme", JSON.stringify(theme));
    }
    
    var getTheme = JSON.parse(localStorage.getItem("twixera_twitch_theme"));
    var getTwilightTheme = JSON.parse(localStorage.getItem("twilight.theme"));

    if ( !getTheme ) {
        setTheme("twixera");
    } else {
        var theme = getTheme === "twixera" ? "twixera" : (getTwilightTheme === 1 ? "dark" : "white")
        setTheme(theme);
    }

    if (!head) return;
    head.appendChild(twixeraStyles);
    head.appendChild(twixera);
})()
