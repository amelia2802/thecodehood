import { GiTechnoHeart } from "react-icons/gi";
import Explore from "../utilities/Explore";
import SubmitForm from "../utilities/SubmitForm.jsx";

const COMMUNITY_IMAGES = [
    {
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
        alt: "Students and peers collaborating around a table",
        layout: "col-span-2 row-span-2"
    },
    {
        src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80",
        alt: "A group sharing ideas during a team discussion",
        layout: "col-span-1 row-span-1"
    },
    {
        src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80",
        alt: "People networking at a community gathering",
        layout: "col-span-1 row-span-2"
    },
    {
        src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=700&q=80",
        alt: "Friends connecting over a shared meal",
        layout: "col-span-1 row-span-1"
    },
    {
        src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
        alt: "People working together on a laptop",
        layout: "col-span-2 row-span-1"
    }
];

export default function Hero({ onExploreClick, onSubmitSuccess }) {
    return (
        <main className="bg-linear-to-b from-[#e3ddd7] via-[#d2b8a0] to-[#8b5b30] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="mx-auto grid w-full max-w-7xl items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
                <div className="flex min-w-0 flex-col items-start gap-5 sm:gap-6">
                    <div className="flex items-center gap-2 text-lg font-semibold text-[#5A321A] sm:text-xl">
                        <GiTechnoHeart className="shrink-0 text-2xl" aria-hidden="true" />
                        <span>theCodehood.</span>
                    </div>
                    <div>
                        <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-[#402e32] sm:text-5xl lg:text-6xl">
                            Find your people in tech.
                        </h1>
                        <p className="mt-4 max-w-lg text-base leading-relaxed text-[#402e32] sm:text-lg">
                            Finding your little corner of the tech community locally.
                            Meet, learn, and build alongside people who get you.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                        <Explore onClick={onExploreClick} />
                        <SubmitForm
                            onSubmitSuccess={onSubmitSuccess}
                            buttonText="Submit a Community"
                            buttonClassName="w-full cursor-pointer rounded-lg border border-[#5A321A]/35 bg-[#faf6f0]/75 px-4 py-2 text-base font-semibold text-[#5A321A] transition-colors hover:bg-[#faf6f0] sm:w-auto"
                        />
                    </div>
                </div>

                <div
                    role="group"
                    className="grid h-60 grid-cols-4 grid-rows-3 gap-2.5 sm:h-80 sm:gap-3 lg:h-[28rem]"
                    aria-label="Community members collaborating and connecting"
                >
                    {COMMUNITY_IMAGES.map((image) => (
                        <div
                            key={image.src}
                            className={`group relative min-h-0 min-w-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/40 ${image.layout}`}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
