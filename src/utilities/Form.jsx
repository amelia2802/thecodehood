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

    const handleSubmit =  async(e)=>{
        e.preventDefault();

        const validationErrors = validateCommunitySubmission(values);

        setErrors(validationErrors);

        const allVisited = Object.keys(values).reduce((acc,key)=>{
            acc[key] = true
            return acc
        },{});

        setVisited(allVisited);

        /*if(Object.keys(validationErrors).length>0){
            return;
        }

        try{
            await submitCommunity(values)

            alert("Community submitted successfully!");

            setValues(initialValues);
            setErrors({});
            setVisited({});

        } 
        catch (error) {
            console.error("Submission failed:", error);
            alert("Something went wrong. Please try again.");
        }*/
       if (Object.keys(validationErrors).length > 0) {
        console.log("Validation failed:", validationErrors);
        return;
    }

    // 5. Temporary testing (no backend yet)
    console.log("Form submitted successfully:", values);

    alert("Form validation successful!");
    }

    return (
        <form  
            noValidate
            onSubmit={handleSubmit} 
            className="flex flex-col mt-4 gap-4 w-full"
        >
            <FormControl error={visited.name && Boolean(errors.name)} >
                <InputLabel>Fullname</InputLabel>
                <Input 
                    id="name" 
                    name="name"
                    value={values.name} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby="Your community name" 
                    fullWidth 
                    required
                />
                <FormHelperText id="name">
                    {visited.name && errors.name
                        ? errors.name
                        : "Your community name"
                    }
                </FormHelperText>
            </FormControl>
            <FormControl error={visited.city && Boolean(errors.city)}>
                <InputLabel>City</InputLabel>
                <Input 
                    id="city"
                    name="city" 
                    value={values.city} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    aria-describedby="City if any" 
                    fullWidth
                />
                <FormHelperText id="city"> 
                    {visited.city && errors.city
                        ? errors.city
                        : "Your community city"
                    }
                </FormHelperText>
            </FormControl>
            <FormControl error={visited.state && Boolean(errors.state)}>
                <InputLabel>State</InputLabel>
                <Input 
                    id="state" 
                    name="state"
                    value={values.state} 
                    onChange={handleChange}
                    onBlur={handleBlur} 
                    aria-describedby="State if any" 
                    fullWidth
                />
                <FormHelperText id="state"> 
                    {visited.state && errors.state
                        ? errors.state
                        : "Your community state"
                    }
                </FormHelperText>
            </FormControl>
            <FormControl error={visited.zip && Boolean(errors.zip)}>
                <InputLabel>Zip</InputLabel>
                <Input 
                    id="zip" 
                    name="zip"
                    value={values.zip} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    aria-describedby="Zip if any" 
                    fullWidth
                />
                <FormHelperText id="zip">
                     {visited.zip && errors.zip
                        ? errors.zip
                        : "Your community zip"
                    }
                </FormHelperText>
            </FormControl>
            <FormControl error={visited.country && Boolean(errors.country)}>
                <InputLabel>Country</InputLabel>
                <Input 
                    id="country" 
                    name="country"
                    value={values.country} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    aria-describedby="Country where the community is located" 
                    fullWidth 
                    required
                />
                <FormHelperText id="country">
                     {visited.country && errors.country
                        ? errors.country
                        : "Your community country"
                    }
                </FormHelperText>
            </FormControl>
            <FormControl error={visited.type && Boolean(errors.type)}>
                <FormLabel id={`${typeId}-label`}>Type of Operation</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby={`${typeId}-label`}
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    <FormControlLabel value="in-person" control={<Radio />} label="In-Person" />
                    <FormControlLabel value="hybrid" control={<Radio />} label="Hybrid" />
                    <FormControlLabel value="remote" control={<Radio />} label="Remote" />
                </RadioGroup>
                <FormHelperText id="type">
                     {visited.type && errors.type
                        ? errors.type
                        : "Your community type"
                    }
                </FormHelperText>
            </FormControl>
            <TextField 
                id="standard-basic" 
                name="description"
                value={values.description} 
                onChange={handleChange} 
                onBlur={handleBlur}
                error={visited.description && Boolean(errors.description)}
                helperText={visited.description ? errors.description : ""}
                inputProps={{maxLength: 500}} 
                label="Describe your community" 
                variant="standard" 
                multiline 
            />
            <FormControl error={visited.isGlobal && Boolean(errors.isGlobal)}>
                <FormLabel id={`${globalId}-label`}>Is Global?</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby={`${globalId}-label`}
                    name="isGlobal"
                    value={values.isGlobal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
                <FormHelperText id="isglobal">Can people from around the world can join your community?</FormHelperText>
            </FormControl>
            <FormControl error={visited.website && Boolean(errors.website)}>
                <InputLabel>Website</InputLabel>
                <Input 
                    id="website" 
                    aria-describedby="Your community website" 
                    name="website"
                    value={values.website}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth 
                    required
                />
                <FormHelperText id="website">Website to join your community</FormHelperText>
            </FormControl>
            <FormControl error={visited.contact && Boolean(errors.contact)}>
                <InputLabel>Contact</InputLabel>
                <Input 
                    id="contact" 
                    aria-describedby="Your community contact" 
                    name="contact"
                    value={values.contact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth 
                    required
                />
                <FormHelperText id="contact">contact to reach out</FormHelperText>
            </FormControl>
            <button 
                type="submit"
                className="text-[#e3ddd7] bg-[#8b5b30] px-3 py-2 rounded-lg text-base"
            >
                Submit
            </button>
        </form>
    );
}