export default function BentoGrid(){
    return(
        <div className="grid grid-cols-4 grid-rows-3 gap-2 w-full min-h-[400px] md:w-2/3 md:max-h-[600px]">
            <div className="bento-grid col-span-2">
                <img className="bento-img" src="https://images.pexels.com/photos/8344694/pexels-photo-8344694.jpeg" alt="cafe" />
            </div>
            <div className="bento-grid col-span-2 row-span-2">
                <img className="bento-img" src="https://images.pexels.com/photos/3182768/pexels-photo-3182768.jpeg" alt="women in tech" />
            </div>
            <div className="bento-grid col-span-2 row-span-2">
                <img className="bento-img" src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg" alt="working on laptop" />
            </div>
            <div className="bento-grid">
                <img className="bento-img" src="https://images.pexels.com/photos/9124752/pexels-photo-9124752.jpeg" alt="two women are talking" />
            </div>
            <div className="bento-grid">
                <img className="bento-img" src="https://images.pexels.com/photos/3183144/pexels-photo-3183144.jpeg" alt="in a tech conference" />
            </div>

        </div>
    )
}