import {useState, useEffect} from "react";
import Search from "../utilities/Search";
import DisplayCard from "../utilities/DisplayCard";
import CircularProgress from '@mui/material/CircularProgress';
import SubmitForm from "../utilities/SubmitForm";

export default function Catalouge({ref}){

    const [communities, setCommunities] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");
    const [searchLocation, setSearchLocation] = useState("");

    const filteredCommunities = communities.filter((community)=>{
        const query = searchLocation.toLowerCase();

        return[
            community.city,
            community.state,
            community.country,
            community.zip
        ].some((location)=>
            String(location || "").toLowerCase().includes(query)
        );
    });

    useEffect(()=>{

        const fetchCommunities = async()=>{
            try{
                const response = await fetch("http://localhost:5000/api/communities")
                
                if(!response.ok){
                    throw new Error("Failed to fetch communities")
                }

                const result = await response.json();

                setCommunities(result);
            }
            catch(error){
                console.error(error);
                setError(error.message);
            }
            finally{
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    return(
        <section ref={ref} className="flex flex-col gap-8">
            <div className="flex flex-col items-center justify-center gap-4">
                <h3 className="text-3xl text-center font-semibold">Explore Tech Communities</h3>
                <p>From online worlds to real-world connections.</p>
                <Search onSearch={setSearchLocation}/>
            </div>

            {loading && (
                <div className="flex justify-center">
                    <CircularProgress color="inherit" aria-label="Loading…" />
                </div>
            )}

            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && communities.length===0 && (
                <div className="flex flex-col items-center justify-center gap-2">
                    <p>No communities have been added in your location.</p>
                    <SubmitForm />
                </div>
            )}

            {filteredCommunities.length > 0 ? (            
                <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-8">
                    {filteredCommunities.map((community)=> {
                    return(
                        <DisplayCard 
                            key={community.id} 
                            img={community.image_url} 
                            title={community.name} 
                            city={community.city} 
                            state={community.state}
                            country={community.country}
                            format={community.type}
                            details={community.description} 
                            url={community.website} 
                            contact={community.contact} 
                        />
                    )
                })}
            </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p>No communities have been added in {searchLocation.toUpperCase()}.</p>
                        <SubmitForm />
                    </div>
                )}
        </section>
    )
}