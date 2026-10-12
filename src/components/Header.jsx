import { useState } from "react";
import { GiTechnoHeart } from "react-icons/gi";
import { IoCloseOutline, IoMenuOutline } from "react-icons/io5";
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMobileSearchSubmit = (value) => {
        onSearchSubmit?.(value);
        setIsMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-10 px-4 py-3.5 text-lg backdrop-blur-sm md:px-8">
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    className="flex shrink-0 cursor-pointer items-center gap-2"
                    onClick={onExploreClick}
                    aria-label="Explore theCodehood communities"
                >
                    <GiTechnoHeart className="text-2xl text-[#5A321A]" />
                    <span className="text-xl font-bold tracking-tight text-[#402e32] md:text-2xl">
                        theCodehood<span className="text-[#8b5b30]">.</span>
                    </span>
                </button>

                <div className="hidden max-w-sm flex-1 md:block md:mx-4">
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

                <div className="hidden items-center gap-3 md:flex">
                    <SubmitForm
                        buttonText="Submit Community"
                        buttonClassName="cursor-pointer rounded-lg border border-[#5A321A]/30 px-3 py-1.5 text-xs font-semibold text-[#5A321A] transition-colors hover:bg-[#8b5b30]/10 hover:text-[#402413] md:text-sm"
                        onSubmitSuccess={onSubmitSuccess}
                    />
                    <Explore onClick={onExploreClick} />
                </div>

                <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-2xl text-[#5A321A] hover:bg-[#8b5b30]/10 md:hidden"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                >
                    {isMenuOpen ? <IoCloseOutline aria-hidden="true" /> : <IoMenuOutline aria-hidden="true" />}
                </button>
            </div>

            {isMenuOpen && (
                <nav id="mobile-navigation" className="flex flex-col gap-3 border-t border-[#8b5b30]/15 py-4 md:hidden">
                    <Search
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={handleMobileSearchSubmit}
                        onClear={onClearSearch}
                        onLocationClick={onLocationClick}
                        isGeoLoading={isGeoLoading}
                        placeholder="Search city, state, zip..."
                        inputId="mobile-header-search-input"
                        className="w-full"
                    />
                    <SubmitForm
                        buttonText="Submit Community"
                        buttonClassName="w-full cursor-pointer rounded-lg border border-[#5A321A]/30 px-3 py-2 text-sm font-semibold text-[#5A321A] transition-colors hover:bg-[#8b5b30]/10"
                        onSubmitSuccess={onSubmitSuccess}
                    />
                    <Explore
                        onClick={() => {
                            setIsMenuOpen(false);
                            onExploreClick?.();
                        }}
                    />
                </nav>
            )}
        </header>
    );
}