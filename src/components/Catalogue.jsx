
import Search from "../utilities/Search"
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import DisplayCard from "../utilities/DisplayCard"
import SubmitForm from "../utilities/SubmitForm"
export default function Catalogue({ refProp }){
    return(
        <section ref={refProp} className="flex flex-col items-center justify-center gap-6 px-6 py-3">
            <h3 className="text-2xl font-bold italic text-center">Browse Communites</h3>
            <Search />
            <div className="flex items-center gap-2">
                <p className="italic text-sm"> Location has 000000000 number of Tech communities and events nearby.</p>
                <Stack direction="row" spacing={1}>
                    <Chip label="IRL/Virtual/Hybrid" />
                    <Chip label="Type" variant="outlined" />
                </Stack>
            </div>
            <p>No Communities and Events are near Location. Want to submit a Community?</p> <SubmitForm />
            <DisplayCard />
        </section>
    )
}