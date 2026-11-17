import * as React from 'react';
import { FormControl, FormHelperText, Input, InputLabel, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { validateCommunitySubmission } from './validation';
import { submitCommunity } from './communityService';

export default function Form() {

    const typeId = React.useId();
    return (
        <form  noValidate className="flex flex-col mt-4 gap-4 w-full">
            <FormControl>
                <InputLabel>Fullname</InputLabel>
                <Input id="name" aria-describedby="Your community name" fullWidth required/>
                <FormHelperText id="name">Your community name</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>City</InputLabel>
                <Input id="name" aria-describedby="City if any" fullWidth/>
                <FormHelperText id="name">City if any</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>State</InputLabel>
                <Input id="name" aria-describedby="State if any" fullWidth/>
                <FormHelperText id="name">State if any</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>Country</InputLabel>
                <Input id="name" aria-describedby="Country where the community is located" fullWidth required/>
                <FormHelperText id="name">Country where the community is located</FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel id={`${typeId}-label`}>Type of Operation</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby={`${typeId}-label`}
                    name="type"
                >
                    <FormControlLabel value="in-person" control={<Radio />} label="In-Person" />
                    <FormControlLabel value="hybrid" control={<Radio />} label="Hybrid" />
                    <FormControlLabel value="remote" control={<Radio />} label="Remote" />
                </RadioGroup>
                <FormHelperText id="name">Type of operation community is having</FormHelperText>
                <TextField id="standard-basic" label="Describe your community" variant="standard" />
            </FormControl>
        </form>
    );
}