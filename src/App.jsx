import PokeCard from "./components/PokeCard"
import SideNav from "./components/SideNav"
import Header from "./components/Header"

import { useState } from "react"
import { ToastContainer } from "react-fox-toast";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0);

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <Header />
      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon} />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  )
}

export default App
