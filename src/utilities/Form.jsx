import { useState } from 'react';
import { FaUpload } from "react-icons/fa";
import { FormControl, FormHelperText, Input, InputLabel} from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
export default function Form(){
    const [type, setType] = useState('');

    const handleChange = (event) => {
        setType(event.target.value);
    };

    return(
        <div className="flex flex-col items-center gap-4">
            <button className="flex items-center gap-2 text-[#e3ddd7] bg-[#8b5b30] px-3 py-2 rounded-lg text-base"> <FaUpload /> Upload Image</button>
            <FormControl fullWidth required>
                <InputLabel htmlFor="my-input">Community Name</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel htmlFor="my-input">Country</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel htmlFor="my-input">City</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel htmlFor="my-input">State</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel htmlFor="my-input">Zip</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel htmlFor="my-input">Description</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
            </FormControl>
            <FormControl fullWidth required>
                <TextField
                    select
                    label="Select Type of Your Community"
                    value={type}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    >
                    <MenuItem value="phy">Physical</MenuItem>
                    <MenuItem value="hyb">Hybrid</MenuItem>
                    <MenuItem value="rem">Remote</MenuItem>
                    </TextField>
                    <FormHelperText>Please select the mode of your Community Events handled</FormHelperText>
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel htmlFor="my-input">Link to your Community</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
            </FormControl>
            <FormControl fullWidth>
                <InputLabel htmlFor="my-input">Contact Email</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
            </FormControl>
            <button className="w-1/4 text-[#e3ddd7] bg-[#8b5b30] px-3 py-2 rounded-lg text-base">Submit</button>
        </div>
    )
}