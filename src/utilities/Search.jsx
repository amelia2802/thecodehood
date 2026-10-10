import { IoSearchOutline, IoCloseCircleOutline, IoLocationOutline } from "react-icons/io5";

export default function Search({
    value = "",
    onChange,
    onSubmit,
    onClear,
    onLocationClick,
    isGeoLoading = false,
    placeholder = "City, State, Country, or Zip",
    className = "",
    inputId = "location-search-input"
}) {
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (onSubmit) {
            onSubmit(value);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className={`relative flex items-center ${className}`}
        >
            <label htmlFor={inputId} className="sr-only">
                Search communities by location
            </label>
            <div className="relative flex items-center w-full">
                <input
                    id={inputId}
                    type="text"
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    aria-label="Search by city, state, country, or postal code"
                    className="w-full bg-[#fdfbf7] border border-[#8b5b30]/40 focus:border-[#5A321A] focus:outline-none focus:ring-2 focus:ring-[#8b5b30]/30 rounded-full py-2 pl-4 pr-24 text-sm text-[#402e32] placeholder:text-[#8b5b30]/60 transition-all shadow-xs"
                />

                <div className="absolute right-1.5 flex items-center gap-1">
                    {value && value.trim().length > 0 && (
                        <button
                            type="button"
                            onClick={onClear}
                            aria-label="Clear search query"
                            title="Clear search"
                            className="p-1 text-[#8b5b30] hover:text-[#5A321A] hover:bg-[#8b5b30]/10 rounded-full transition-colors cursor-pointer"
                        >
                            <IoCloseCircleOutline className="text-xl" />
                        </button>
                    )}

                    {onLocationClick && (
                        <button
                            type="button"
                            onClick={onLocationClick}
                            disabled={isGeoLoading}
                            aria-label="Use browser location"
                            title="Find communities near me"
                            className={`p-1.5 text-[#5A321A] hover:bg-[#8b5b30]/10 rounded-full transition-colors cursor-pointer ${
                                isGeoLoading ? "animate-spin opacity-50" : ""
                            }`}
                        >
                            <IoLocationOutline className="text-lg" />
                        </button>
                    )}

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