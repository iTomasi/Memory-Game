import React, {useState, useEffect} from 'react';

// Components
import Window from "./components/Window";
import Dashboard from "./components/Dashboard";
import Card from "./components/Card";
import Notification from "./components/Notification";
import PlayAgain from "./components/PlayAgain";

// SCSS Style
import "./app.scss";

interface IApiLoaded {
  showGrid: boolean,
  apiRdy: boolean,
  pokemonLoaded: number
}

interface ICheckPair {
  first: {id: number, CF_id: number},
  second: {id: number, CF_id: number}
}

interface INotification {
  type: string,
  msg: string,
  addActive: boolean
}

const App = () => {

  const [pokeList, setPokeList] = useState<any[]>([])
  const [apiLoaded, setApiLoaded] = useState<IApiLoaded>({
    showGrid: false,
    apiRdy: false,
    pokemonLoaded: 0
  });
  const [displayWindow, setDisplayWindow] = useState<boolean>(true);
  const [checkPair, setCheckPair] = useState<ICheckPair>({
    first: {id: 0, CF_id: 0},
    second: {id: 0, CF_id: 0}
  });
  
  const [totalPairs, setTotalPairs] = useState<number>(0)
  const [timerCurrent, setTimerCurrent] = useState<number>(0);
  const [pairsFound, setPairsFound] = useState<number>(0);
  const [waitingTimeout, setWaitingTimeout] = useState<boolean>(true);
  const [totalTimer, setTotalTimer] = useState<number>(0)
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [notification, setNotification] = useState<INotification>({
    type: "",
    msg: "",
    addActive: false
  })
  const [playAgainScreen, setPlayAgainScreen] = useState<boolean>(false);

  useEffect(() => {
    checkingPairs(checkPair)

    if (apiLoaded.apiRdy && timerCurrent === 0) {
      setTimerCurrent((prev: any) => ++prev)
      setInterval(() => {
        setTimerCurrent((prev: any) => ++prev)
      }, 1000)
    }

    else if (pairsFound === totalPairs && pairsFound !== 0 && totalPairs !== 0) {
      setTotalTimer(timerCurrent)
      setGameFinished(true)
      setPlayAgainScreen(true)
    }
  }, [checkPair, waitingTimeout, apiLoaded])


  const callingPokeAPI = async (num: number) => {

    let pokeArray: any[] = [];
    let theId = 1;

    for (let i = 1; i <= num; i++) {
      const callingPokemon = await fetch("https://pokeapi.co/api/v2/pokemon/" + i)
      const poke = await callingPokemon.json();

      pokeArray = [...pokeArray, {
        pokeID: poke.id,
        id: theId,
        name: poke.forms[0].name,
        img: poke.sprites.other["official-artwork"].front_default
      }, {
        pokeID: poke.id,
        id: ++theId,
        name: poke.forms[0].name,
        img: poke.sprites.other["official-artwork"].front_default
      }]

      pokeArray.sort(() => Math.random() - 0.5)

      setApiLoaded((prev: any) => ({...prev, pokemonLoaded: i}))
      setPokeList(pokeArray)
      ++theId
    }

    setApiLoaded((prev: any) => (
      {...prev, showGrid: true, apiRdy: true}
    ))

    setTotalPairs(num)
  }

  const formWindow = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const pairs:any = formData.get("pairs")
    const pairsNum = parseInt(pairs)

    if (isNaN(pairsNum)) return showNotification("Only Numbers...", "error");
    else if (pairsNum <= 0) return showNotification("The number should be high that 0", "error")

    setDisplayWindow(false)
    callingPokeAPI(pairsNum)
  }

  const handleCards = (e: any) => {

    const cardID = e.currentTarget.dataset.id;
    const card_CF_ID = e.currentTarget.dataset.cfid;

    if (e.target.classList.contains("card__back") && waitingTimeout) {
      
      const CF_flip: any = document.getElementById("card__front-" + card_CF_ID);

      e.target.style.display = "none";
      CF_flip.style.display = "block";

      if (checkPair.first.id === 0) return setCheckPair((prev: any) => ({...prev, first: {id: cardID, CF_id: card_CF_ID}}));
      else if (checkPair.first.id >= 1 && checkPair.second.id === 0) {
        setCheckPair((prev: any) => ({...prev, second: {id: cardID, CF_id: card_CF_ID}}))
      }

    }
  }

  const checkingPairs = (pair: ICheckPair) => {
    if (pair.first.id === 0 || pair.second.id === 0) return;
    setWaitingTimeout(false)

    if (pair.first.id === pair.second.id) {
      setPairsFound((prev: any) => ++prev)
      setWaitingTimeout(true)
    }

    else {
      setTimeout(() => {
        const card_CF_1: any = document.getElementById("card__front-" + pair.first.CF_id);
        const card_CF_2: any = document.getElementById("card__front-" + pair.second.CF_id);
        const card_CB_1: any = document.getElementById("card__back-" + pair.first.CF_id);
        const card_CB_2: any = document.getElementById("card__back-" + pair.second.CF_id);
        // FIRST
        card_CF_1.style.display = "none";
        card_CB_1.style.display = "block";
        // SECOND
        card_CF_2.style.display = "none";
        card_CB_2.style.display = "block";
        setWaitingTimeout(true)
      }, 2000)
    }

    setCheckPair((prev: any) => ({...prev, first: {id: 0, CF_id: 0}, second: {id: 0, CF_id: 0}}))
  }

  let notification_timeout: any;

  const showNotification = (msg: string, type: string) => {

    if (notification_timeout === undefined) {
      clearTimeout(notification_timeout)
    }

    setNotification((prev: any) => ({...prev, msg, type, addActive: true}))

    notification_timeout = setTimeout(() => {
      setNotification((prev: any) => ({...prev, addActive: false}))
    }, 2000)
  }

  const handlePlayAgain = () => {
    setPlayAgainScreen(false)
  }

  return (
    <>
    <Notification type={notification.type} msg={notification.msg} addActive={notification.addActive}/>
    <div className="content">
      <Window onSubmit={formWindow} display={displayWindow}/>
      <Dashboard foundPairs={pairsFound} totalPairs={totalPairs} timer={gameFinished ? totalTimer - 1 : timerCurrent - 1}/>
      <div className="grid" style={{display: apiLoaded.showGrid ? "grid" : "none"}}>
        {pokeList.map((pokemon: any) => (
          <Card id={pokemon.pokeID} CF_id={pokemon.id} name={pokemon.name} img={pokemon.img} onClick={handleCards}/>
        ))}
      </div>
      <h2 style={{display: apiLoaded.apiRdy ? "none" : "block", textAlign: "center"}}>{!apiLoaded.apiRdy ? `Loaded.. (${apiLoaded.pokemonLoaded})` : "Loaded."}</h2>
    </div>
    <PlayAgain onClick={handlePlayAgain} display={playAgainScreen} />
    </>
  )
}

export default App