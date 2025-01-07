import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard  from "./TypeCard";

export default function PokeCard(props) {
    const { selectedPokemon } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const { name, height, abilitites, stats, types, moves, sprites } = data || {}

    useEffect(() => {
        // if loading, exit logic
        if (loading || !localStorage) { return }

        // check if the selected pokemon informatio is available in the cache
        // 1. define the cache
        let cache = {};
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'));
        }

        // 2. check if the selected pokemon is in the cache, otherwise fetch from the API

        if (selectedPokemon in cache) {
            //read from cache
            setData(cache[selectedPokemon])
            return
        }

        // we passed all the cache stuff to no avail and now need
        // to fetch the data from the API

        async function fetchPokemonData() {
            setLoading(true);
            try {
                const baseURL = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalURL = baseURL + suffix
                const response = await fetch(finalURL)
                const pokemonData = await response.json()
                setData(pokemonData)
                // console.log(pokemonData)
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))

            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false);
            }
        }

        fetchPokemonData()

        // if we fetch fro the API, make sure to save the informatin to the cache for next time
    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <div>
                <h4>Loading......</h4>
            </div>
        )
    }


    return (
        <div className="poke-card">
            <div >
                <h4>#{getFullPokedexNumber[selectedPokemon]}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((type, typeIndex)=>{
                    return (
                        <TypeCard key={typeIndex} type={type} />
                    )
                })}
            </div>
        </div>
    )
}