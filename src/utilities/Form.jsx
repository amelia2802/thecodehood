import * as React from 'react';
import { FormControl, FormHelperText, Input, InputLabel, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Alert} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { validateCommunitySubmission } from './validation';


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

    const [alert, setAlert] = React.useState({
        show: false,
        severity: "success",
        message:""
    })

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


        setVisited(
            Object.keys(values).reduce((acc,key)=>{
                acc[key] = true;
                return acc;
            },{})
        );

        if(Object.keys(validationErrors).length > 0){
            setAlert({
                show:true,
                severity:"error",
                message:"Please fix the error before submitting!"
            });
            return;
        }

        try{
            const response = await fetch(
                "http://localhost:5000/api/communities",
                {
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify(values)
                }
            );

            const result = await response.json();

            if(!response.ok){
                throw new Error(result.message || "Submission failed!");
            }

            setAlert({
                show: true,
                severity:"success",
                message: "Community submitted successfully!"
            });

            setValues(initialValues);
            setErrors({});
            setVisited({});

        } 
        catch (error) {
            console.error("Submission failed:", error);
            setAlert({
                show: true,
                severity: "error",
                message: error.message || "Something went wrong. Please try again."
            });
        }
    };

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
                        : "City if any"
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
                        : "State if any"
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
                        : "Zip if any"
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
                        : "Country where the community is located"
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
                <FormHelperText id="isglobal">
                    {visited.isGlobal && errors.isGlobal
                        ? errors.isGlobal
                        : "Can people from around the world can join your community?"
                    }
                </FormHelperText>
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
                <FormHelperText id="website">
                    {visited.website && errors.website
                        ? errors.website
                        : "Website to join your community"
                    }
                </FormHelperText>
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
                <FormHelperText id="contact">
                    {visited.contact && errors.contact
                        ? errors.contact
                        : "Contact to reach out"
                    }
                </FormHelperText>
            </FormControl>
            {alert.show && (
                <Alert
                    icon={<CheckIcon fontSize="inherit" />}
                    severity={alert.severity}
                    onClose={() => setAlert(prev => ({
                        ...prev,
                        show: false
                    }))}
                >
                    {alert.message}
                </Alert>
            )}
            <button 
                type="submit"
                className="text-[#e3ddd7] bg-[#8b5b30] px-3 py-2 rounded-lg text-base"
            >
                Submit
            </button>
        </form>
    );
}