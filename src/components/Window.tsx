import React from "react";
import "./scss/window.scss";

interface IWindowProps {
    onSubmit: any,
    display: boolean
}

const Window = ({onSubmit, display}: IWindowProps) => {
    return (
        <div className="window" style={{display: display ? "flex" : "none"}}>
            <form className="iw_form" onSubmit={onSubmit}>
                <div className="formSection">
                    <label>Pairs Quantity</label>
                    <input type="text" placeholder="Pairs Quantity..." name="pairs"/>
                </div>

                <button type="submit">Start!</button>
            </form>
        </div>
    )
}

export default Window