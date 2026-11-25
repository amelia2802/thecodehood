export function validateCommunitySubmission(data){

    const errors = {};

    if(!data.name.trim()){
        errors.name = "Community name is required";
    }
    else if(data.name.trim().length < 3){
        errors.name = "Name must be at least 3 characters";
    }

    if(data.zip && !/^[A-Za-z0-9\s-]{3,10}$/.test(data.zip.trim())){
        errors.zip="Enter a valid zip / postal code!";
    }

    if(!data.country.trim()){
        errors.country = "Country is required";
    }

    if(!data.type){
        errors.type = "Select a type of operation";
    }

    if(data.isGlobal===""){
        errors.isGlobal = "Please choose Yes or No";
    }

    if (data.description.length > 500){
        errors.description = "Keep it under 500 characters";
    }

    if(!data.website.trim()){
        errors.website = "Website is required";
    }
    else{
        try{
            const url = new URL(data.website.trim());
            if(!["http:", "https:"].includes(url.protocol)) throw new Error();
        }
        catch{
            errors.website = "Enter a valid URL, e.g. https://example.com"
        }
    }

    if(!data.image_url.trim()){
        errors.image_url = "Website is required";
    }
    else{
        try{
            const url = new URL(data.image_url.trim());
            if(!["http:", "https:"].includes(url.protocol)) throw new Error();
        }
        catch{
            errors.image_url = "Enter a valid URL, e.g. https://example.jpg"
        }
    }

    if(!data.contact.trim()){
        errors.contact = "Contact is required";
    }
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.trim())){
        errors.contact = "Enter a valid email address";
    }

    return errors;
    
}