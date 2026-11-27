import {useState} from "react";
import { IoSearchOutline, IoCloseCircleOutline, IoLocationOutline } from "react-icons/io5";
export default function Search({onSearch}) {

    const [searchLocation, setSearchLocation] = useState("");

    const handleSubmit = (e) =>{
        e.preventDefault();
        onSearch(searchLocation.trim());
    }

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className={`relative flex items-center`}
        >
            <label className="sr-only">
                Search communities by location
            </label>
            <div className="relative flex items-center w-full">
                <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    aria-label="Search by city, state, country, or postal code"
                    placeholder="Search by city, state, country, or postal code"
                    className="w-full bg-[#fdfbf7] border border-[#8b5b30]/40 focus:border-[#5A321A] focus:outline-none focus:ring-2 focus:ring-[#8b5b30]/30 rounded-full py-2 pl-4 pr-24 text-sm text-[#402e32] placeholder:text-[#8b5b30]/60 transition-all shadow-xs"
                />

                <div className="absolute right-1.5 flex items-center gap-1">
                        <button
                            type="button"
                            onClick={()=>{
                                setSearchLocation("");
                                onSearch("");
                            }}
                            aria-label="Clear search query"
                            title="Clear search"
                            className="p-1 text-[#8b5b30] hover:text-[#5A321A] hover:bg-[#8b5b30]/10 rounded-full transition-colors cursor-pointer"
                        >
                            <IoCloseCircleOutline className="text-xl" />
                        </button>

                        <button
                            type="button"
                            aria-label="Use browser location"
                            title="Find communities near me"
                            className={`p-1.5 text-[#5A321A] hover:bg-[#8b5b30]/10 rounded-full transition-colors cursor-pointer "animate-spin opacity-50"
                            `}
                        >
                            <IoLocationOutline className="text-lg" />
                        </button>

                    <button
                        type="submit"
                        aria-label="Submit search"
                        title="Search"
                        className="flex items-center justify-center rounded-full bg-[#5A321A] hover:bg-[#402413] text-[#e3ddd7] p-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                        <IoSearchOutline className="text-lg" />
                    </button>
                </div>
            </div>
        </form>
    );
}