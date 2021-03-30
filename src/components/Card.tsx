import React from "react";
import "./scss/card.scss";

interface ICardProps {
    id: number,
    CF_id: number,
    img: string,
    name: string,
    onClick: any
}

const Card = ({id, CF_id, img, name, onClick}: ICardProps) => {
    return (
        <div className="card" data-id={id} data-cfid={CF_id} onClick={onClick}>
            <img id={"card__back-" + CF_id} className="card__back" src="card_back.png" alt="cardBack"/>
            <img id={"card__front-" + CF_id} className="card__front" src={img} alt={name}/>
        </div>
    )
}

export default Card;