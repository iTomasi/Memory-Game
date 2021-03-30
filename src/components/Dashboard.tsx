import React from "react";
import "./scss/dashboard.scss";

interface IDashboardProps {
    foundPairs: number,
    totalPairs: number,
    timer: number
}

const Dashboard = ({foundPairs, totalPairs, timer} : IDashboardProps) => {

    const second_to_minute = (time: number) => {
        const minute = time / 60;
        const second = time % 60;
        const resMinute = ("00" + Math.floor(minute)).slice(-2);
        const resSecond = ("0" + second).slice(-2);

        return `${resMinute}:${resSecond}`
    } 

    return (
        <div className="dashboard">
            <div className="dashboard__evenly">
                <label>Time</label>
                <span>{second_to_minute(timer)}</span>
            </div>

            <div className="dashboard__evenly">
                <label>Pairs Found</label>
                <span>{foundPairs}/{totalPairs}</span>
            </div>
        </div>
    )
}

export default Dashboard