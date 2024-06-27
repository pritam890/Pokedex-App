import { useEffect , useState } from "react"
import axios from "axios";
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";
function PokemonList(){
    
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    const [pokedexurl,setpokedexurl]=useState('https://pokeapi.co/api/v2/pokemon');
    const [nexturl,setnexturl]=useState('');
    const [prevurl,setprevurl]=useState('');
    async function downloadPokemons(){
        setIsloading(true);
        const response = await axios.get(pokedexurl);
        console.log(response);
        const pokemonResults = response.data.results;
        console.log(pokemonResults);
        setnexturl(response.data.next);
        setprevurl(response.data.previous);
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));
        const pokemonData = await axios.all(pokemonResultPromise);
        console.log(pokemonData)
        const res = pokemonData.map((pokedata)=>{
            const pokemon = pokedata.data;
            return ({
                id : pokemon.id,
                name : pokemon.name, 
                image : pokemon.sprites.other.dream_world.front_default, 
                types : pokemon.types})
        });
        console.log(res);
        setPokemonList(res);
        setIsloading(false);
    }
    useEffect(()=>{
        downloadPokemons();
    },[pokedexurl]);
  
    return(
        <>
           <div className="pokemon-list-wrapper">
                <div>Pokemon List</div>  
                <div className="pokemon-wrapper">
                    {(isLoading) ? 'Loading...' : 
                        pokemonList.map((p)=> <Pokemon name={p.name} image={p.image} key={p.id} id={p.id}/>)
                    }
                </div>
                <div className="controls">
                    <button disabled={prevurl == null} onClick={()=>setpokedexurl(prevurl)}>Prev</button>
                    <button disabled={nexturl == null} onClick={()=>setpokedexurl(nexturl)}>Next</button>
                </div>
           </div>
        </>
    )
}
export default PokemonList