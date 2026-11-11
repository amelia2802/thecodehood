import { data } from "../data";
import Search from "../utilities/Search";
import DisplayCard from "../utilities/DisplayCard";

export default function Catalouge(){
    return(
        <section className="flex flex-col gap-8">
            <div className="flex flex-col items-center justify-center gap-4">
                <h3 className="text-3xl text-center font-semibold">Explore Tech Communities</h3>
                <p>From online worlds to real-world connections.</p>
                <Search />
            </div>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-8">
                {data.map((community)=> {
                    return(
                        <DisplayCard 
                            key={community.id} 
                            img={community.img} 
                            title={community.name} 
                            city={community.city} 
                            state={community.state}
                            country={community.country}
                            format={community.format}
                            details={community.description} 
                            url={community.website_url} 
                            contact={community.contact} 
                        />
                    )
                })}
            </div>
        </section>
    )
}