import React from "react";
import "./scss/playAgain.scss";

interface IPlayAgain {
    onClick: any,
    display: boolean
}

const PlayAgain = ({onClick, display}: IPlayAgain) => {

    const refreshPage = () => {
        return window.location.reload();
    }

    return (
        <div className="window-playagain" style={{display: display ? "flex" : "none"}}>
            <div className="playagain">
                <h3>Wanna play again?</h3>
                <div className="playagain__btns">
                    <button className="btn-yes" type="button" onClick={refreshPage}>Yes</button>
                    <button className="btn-no" type="button" onClick={onClick}>No</button>
                </div>
            </div>
        </div>
    )
}

export default PlayAgain