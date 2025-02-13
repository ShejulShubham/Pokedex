import PokeCard from "./components/PokeCard"
import SideNav from "./components/SideNav"
import Header from "./components/Header"

import { useState } from "react"
import { ToastContainer } from "react-fox-toast";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const [showSideMenu, setShowSideMenu] = useState(false);

  function handleToggleMenu() {
    setShowSideMenu(!showSideMenu);
  }

  function handleCloseMenu(){
    setShowSideMenu(!showSideMenu);
  }

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <Header handleToggleMenu={handleToggleMenu} />
      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
        handleToggleMenu={handleToggleMenu}
        showSideMenu={showSideMenu} />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  )
}

export default App
