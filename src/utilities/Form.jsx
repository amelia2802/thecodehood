import * as React from 'react';
import { FormControl, FormHelperText, Input, InputLabel, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { validateCommunitySubmission } from './validation';
import { submitCommunity } from './communityService';

export default function Form() {

    const typeId = React.useId();
    const globalId = React.useId();
    const initialValues = {
        name:'', city:'', state:'', zip:'', country:'',
        type:'',description:'',isGlobal:'',website:'',contact:''
    };

    const [values, setValues] = React.useState(initialValues);
    const [errors, setErrors] = React.useState({});
    const [visited, setVisited] = React.useState({});

    const handleChange = (e) => {
        const {name,value} = e.target;

        setValues((prev)=>({
            ...prev,
            [name]: value
        }));
    };

    const handleBlur=(e)=>{
        const {name} = e.target;

        setVisited((prev)=>({
            ...prev,
            [name]:true
        }))

        const validationErrors = validateCommunitySubmission(values);
        setErrors(validationErrors);
    }

    return (
        <form  noValidate className="flex flex-col mt-4 gap-4 w-full">
            <FormControl>
                <InputLabel>Fullname</InputLabel>
                <Input 
                    id="name" 
                    value={values.name} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={visited.name && Boolean(errors.name)} 
                    aria-describedby="Your community name" 
                    fullWidth 
                    required
                />
                <FormHelperText id="name">Your community name</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>City</InputLabel>
                <Input id="city" value={values.city} onChange={handleChange}  aria-describedby="City if any" fullWidth/>
                <FormHelperText id="city">City if any</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>State</InputLabel>
                <Input id="state" value={values.state} onChange={handleChange} aria-describedby="State if any" fullWidth/>
                <FormHelperText id="state">State if any</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>Zip</InputLabel>
                <Input id="zip" value={values.zip} onChange={handleChange} aria-describedby="Zip if any" fullWidth/>
                <FormHelperText id="zip">Zip if any</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>Country</InputLabel>
                <Input id="country" value={values.country} onChange={handleChange} aria-describedby="Country where the community is located" fullWidth required/>
                <FormHelperText id="country">Country where the community is located</FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel id={`${typeId}-label`}>Type of Operation</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby={`${typeId}-label`}
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                >
                    <FormControlLabel value="in-person" control={<Radio />} label="In-Person" />
                    <FormControlLabel value="hybrid" control={<Radio />} label="Hybrid" />
                    <FormControlLabel value="remote" control={<Radio />} label="Remote" />
                </RadioGroup>
                <FormHelperText id="type">Type of operation community is having</FormHelperText>
            </FormControl>
            <TextField id="standard-basic" value={values.description} onChange={handleChange} inputProps={{maxLength: 500}} label="Describe your community" variant="standard" multiline />
            <FormControl>
                <FormLabel id={`${globalId}-label`}>Is Global?</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby={`${globalId}-label`}
                    name="isGlobal"
                    value={values.isGlobal}
                    onChange={handleChange}
                >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
                <FormHelperText id="isglobal">Is people from around the world can join your community?</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>Website</InputLabel>
                <Input id="website" aria-describedby="Your community website" fullWidth required/>
                <FormHelperText id="website">Website to join your community</FormHelperText>
            </FormControl>
            <FormControl>
                <InputLabel>Contact</InputLabel>
                <Input id="contact" aria-describedby="Your community contact" fullWidth required/>
                <FormHelperText id="contact">contact to reach out</FormHelperText>
            </FormControl>
            <button onClick={submitCommunity} className="text-[#e3ddd7] bg-[#8b5b30] px-3 py-2 rounded-lg text-base">Submit</button>
        </form>
    );
}