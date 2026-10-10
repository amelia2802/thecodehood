import { GiTechnoHeart } from "react-icons/gi";
import Search from "../utilities/Search.jsx";
import Explore from "../utilities/Explore.jsx";
import SubmitForm from "../utilities/SubmitForm.jsx";

export default function Header({
    onExploreClick,
    searchQuery = "",
    setSearchQuery,
    onSearchSubmit,
    onClearSearch,
    onLocationClick,
    isGeoLoading = false,
    onSubmitSuccess
}) {
    return (
        <header className="flex z-10 items-center px-4 md:px-8 py-3.5 justify-between text-lg bg-[#faf6f0]/90 backdrop-blur-sm sticky top-0 border-b border-[#8b5b30]/15 shadow-xs">
            <section className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={onExploreClick}>
                <GiTechnoHeart className="text-[#5A321A] text-2xl" />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#402e32]">
                    theCodehood<span className="text-[#8b5b30]">.</span>
                </h1>
            </section>

            <div className="flex-1 max-w-sm mx-4 hidden sm:block">
                <Search
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={onSearchSubmit}
                    onClear={onClearSearch}
                    onLocationClick={onLocationClick}
                    isGeoLoading={isGeoLoading}
                    placeholder="Search city, state, zip..."
                    inputId="header-search-input"
                    className="w-full"
                />
            </div>

            <div className="flex items-center gap-3">
                <SubmitForm
                    buttonText="Submit Community"
                    buttonClassName="text-xs md:text-sm font-semibold text-[#5A321A] hover:text-[#402413] px-3 py-1.5 rounded-lg border border-[#5A321A]/30 hover:bg-[#8b5b30]/10 transition-colors cursor-pointer"
                    onSubmitSuccess={onSubmitSuccess}
                />
                <Explore onClick={onExploreClick} />
            </div>
        </header>
    );
}