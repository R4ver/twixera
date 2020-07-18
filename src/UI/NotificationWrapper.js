import { useEffect } from "react";
import { createPortal } from 'react-dom';
import Mixera, { events } from "Mixera";
import { ToastContainer, toast } from 'react-toastify';

const NotificationWrapper = () => {
    const notificationOptions = {
        title: `Mixera Notification`,
        type: "default",
        position: "bottom-left",
        autoClose: 8000
    };

    const handleNewNotification = event => {
        event.message = event.notification;
        delete event.notification;

        const options = {
            ...notificationOptions,
            ...event
        };

        const notification = () => <div style={{padding: "8px"}}>
            <p style={{
                borderBottom: "1px solid rgba(255,255,255,.5)",
                marginBottom: "6px"
            }}>{options.title}</p>
            <p>{options.message}</p>
        </div>

        toast(notification, options);
    }

    Mixera.on(events.NEW_NOTIFICATION, handleNewNotification);

    return createPortal(
        <ToastContainer />,
        document.body
    )
}

export default NotificationWrapper;

window.testNotification = () => {
    Mixera.emit(events.NEW_NOTIFICATION, {
        notification: "Test Notification",
        type: "warning"
    })
}