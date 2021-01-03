import React, { useEffect, useState } from "react"
import { useStore } from "Store"
import Log from "Core/utils/log";
import { waitForElement } from "Core/helpers/elementLoading";
import { PrependPortal } from "UI"

const SHARE_BUTTON = `[data-a-target='share-button']`;

function MultiStream() {
    const [store, dispatch] = useStore();
    const [rootElement, setRootElement] = useState(null);
    const [channelInput, setChannelInput] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                let elem = await waitForElement(SHARE_BUTTON);
                elem = elem.parentElement.parentElement.parentElement.parentElement;

                if (elem) {
                    setRootElement(elem);
                }
            } catch (error) {
                Log.error(
                    "Couldn't get parent element to inject Multi Stream button",
                    error,
                );
            }
        })();
    }, []);

    const handleClick = () => {
        setShowModal(!showModal);
    }

    if ( !rootElement ) return null;

    return (
        <PrependPortal root={rootElement} className={["twixera-multi-stream-bottom"]}>
            <button onClick={handleClick}>Multi Stream</button>
            {showModal && 
                <div className="twixera-page twixera-modal twixera-multi-stream-modal">
                    <h2 className="title is-2">Multi Stream</h2>
                </div>
            }
        </PrependPortal>
    )
}

MultiStream.settings = [
    {
        id: "multi_stream",
        name: "Multi Stream",
        description: "Adds multi streaming functionality",
        category: "channel",
        defaultValue: true,
        type: "toggle"
    },
];

export default MultiStream
