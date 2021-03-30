import React, {useState, useEffect} from "react";
import "./scss/notification.scss";

interface INotificationProps {
    type: string,
    msg: string,
    addActive: boolean
}

const Notification = ({type, msg , addActive}: INotificationProps) => {
    return (
        <div className={`notification notification__${type} ${addActive ? "active" : "noactive"}`}>{msg}</div>
    )
}

export default Notification