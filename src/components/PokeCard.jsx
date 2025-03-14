import { useEffect, useState, useSyncExternalStore } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";
import { toast } from "react-fox-toast";
import Loading from "./Loading";

export default function PokeCard(props) {
    const { selectedPokemon } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skill, setSkill] = useState(null);
    const [loadingSkill, setLoadingSkill] = useState(false);

    const { name, height, abilitites, stats, types, moves, sprites } = data || {};

    const sortedMoves = (moves || []).sort((a, b) => {
        if (a.move.name > b.move.name) { return 1 }
        if (a.move.name < b.move.name) { return -1 }
        return 0;
    });

    const imgList = Object.keys(sprites || {}).filter((val) => {
        if (!sprites[val]) {
            return false;
        }
        if (["versions", "other"].includes(val)) {
            return false;
        }
        return true;
    });

    async function fetchMoveData(move, moveURL) {
        if (loadingSkill || !localStorage || !moveURL) { return }

        //check cache for moves
        let c = {}
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in c) {
            setSkill(c[move])
            toast.success("Found move in cache");
            return
        }

        try {
            setLoadingSkill(true)
            const res = await fetch(moveURL);
            const moveData = await res.json();
            toast.info("fetched move from API");
            const description = moveData?.flavor_text_entries.filter(
                val => {
                    return val.version_group.name == 'firered-leafgreen'
                }
            )[0]?.flavor_text

            const skillData = {
                name: move,
                description
            }

            setSkill(skillData);
            c[move] = skillData;

            localStorage.setItem('pokemon-moves', JSON.stringify(c));
        } catch (err) {
            toast.error("Error occurred");
            console.log(err);
        } finally {
            setLoadingSkill(false);
        }
    }

    useEffect(() => {
        // if loading, exit logic
        if (loading || !localStorage) {
            return;
        }

        // check if the selected pokemon informatio is available in the cache
        // 1. define the cache
        let cache = {};
        if (localStorage.getItem("pokedex")) {
            cache = JSON.parse(localStorage.getItem("pokedex"));
        }

        // 2. check if the selected pokemon is in the cache, otherwise fetch from the API

        if (selectedPokemon in cache) {
            //read from cache
            setData(cache[selectedPokemon]);
            toast.success("Found pokemon in cache");
            return;
        }

        // we passed all the cache stuff to no avail and now need
        // to fetch the data from the API

        async function fetchPokemonData() {
            setLoading(true);
            try {
                const baseURL = "https://pokeapi.co/api/v2/";
                const suffix = "pokemon/" + getPokedexNumber(selectedPokemon);
                const finalURL = baseURL + suffix;
                const response = await fetch(finalURL);
                const pokemonData = await response.json();
                setData(pokemonData);
                toast.info("Fetched pokemon data from API");
                cache[selectedPokemon] = pokemonData;
                localStorage.setItem("pokedex", JSON.stringify(cache));
            } catch (err) {
                toast.error("Error occurred");
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPokemonData();

        // if we fetch fro the API, make sure to save the informatin to the cache for next time
    }, [selectedPokemon]);

    if (loading || !data) {
        return (
            <Loading/>
        );
    }

    return (
        <div className="poke-card">
            {skill && (
                <Modal handleCloseModal={() => { setSkill(null) }}>
                    <div>
                        <h6>Name</h6>
                        <h2 className="skill-name">{skill?.name.replaceAll('-', ' ')}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill?.description || "No description found!"}</p>
                    </div>
                </Modal>
            )}
            <div>
                <h4>#{getFullPokedexNumber[selectedPokemon]}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
                })}
            </div>
            <img
                className="default-img"
                src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
                alt={`${name}-large-img`}
            />
            <div className="img-container">
                {imgList.map((spriteURL, spriteIndex) => {
                    const imgURL = sprites[spriteURL];
                    return (
                        <img
                            key={spriteIndex}
                            src={imgURL}
                            alt={`${name}-img-${spriteURL}`}
                        />
                    );
                })}
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                {stats.map((statObj, stateIndex) => {
                    const { stat, base_stat } = statObj;
                    return (
                        <div key={stateIndex} className="stat-item">
                            <p>{stat?.name.replaceAll("-", " ")}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    );
                })}
            </div>
            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {sortedMoves.map((moveObj, moveIndex) => {
                    return (
                        <button className="pokemon-move" key={moveIndex} onClick={() => {
                            fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                        }}>
                            <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
