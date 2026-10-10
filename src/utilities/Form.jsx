import { useState, useRef } from 'react';
import { FaUpload } from "react-icons/fa";
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { validateCommunitySubmission } from './validation';
import { submitCommunity } from './communityService';

const AVAILABLE_TECH_TAGS = [
    'JavaScript',
    'React',
    'Java',
    'Python',
    'AI/ML',
    'open source',
    'career development'
];

export default function Form({ onSubmitSuccess, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        city: '',
        state: '',
        postal_code: '',
        description: '',
        format: '',
        website_url: '',
        email: '',
        img: '',
        technologies: []
    });

    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFileName, setImageFileName] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleToggleTech = (tech) => {
        setFormData((prev) => {
            const exists = prev.technologies.includes(tech);
            const nextTechs = exists
                ? prev.technologies.filter((t) => t !== tech)
                : [...prev.technologies, tech];
            return { ...prev, technologies: nextTechs };
        });
        if (errors.technologies) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.technologies;
                return next;
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { isValid, errors: validationErrors } = validateCommunitySubmission(formData);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const res = await submitCommunity(formData);
            setIsSubmitting(false);

            if (!res.success) {
                setErrors({ submit: res.error || 'Database submission failed. Please try again.' });
                return;
            }

            setSubmittedData(res.data);
            if (onSubmitSuccess) {
                onSubmitSuccess(res.data);
            }
        } catch (err) {
            setIsSubmitting(false);
            setErrors({ submit: err.message || 'An unexpected error occurred.' });
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Url = reader.result;
                setImagePreview(base64Url);
                setFormData((prev) => ({
                    ...prev,
                    img: base64Url
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFileName('');
        setFormData((prev) => ({
            ...prev,
            img: ''
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            country: '',
            city: '',
            state: '',
            postal_code: '',
            description: '',
            format: '',
            website_url: '',
            email: '',
            img: '',
            technologies: []
        });
        setImagePreview(null);
        setImageFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setErrors({});
        setSubmittedData(null);
    };

    if (submittedData) {
        return (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
                <Alert severity="success" className="w-full text-left" role="status">
                    <div>
                        <strong>Submission Received!</strong>
                        <p className="mt-1">
                            Thank you for submitting <strong>{submittedData.name}</strong>. Your listing has been received and is <strong>pending moderation</strong>.
                        </p>
                        <p className="text-xs text-stone-600 mt-1 italic">
                            (Note: New submissions are kept pending review before appearing in the public directory and are stored in session memory pending database setup.)
                        </p>
                    </div>
                </Alert>

                <div className="flex gap-3 mt-2">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="text-[#e3ddd7] bg-[#8b5b30] hover:bg-[#5A321A] px-3 py-2 rounded-lg text-base cursor-pointer"
                    >
                        Submit Another
                    </button>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[#5A321A] border border-[#5A321A] px-3 py-2 rounded-lg text-base cursor-pointer hover:bg-[#8b5b30]/10"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center gap-4 w-full">
            {/* Hidden native file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload Community Image"
            />

            <button
                type="button"
                onClick={handleUploadClick}
                className="flex items-center gap-2 text-[#e3ddd7] bg-[#8b5b30] hover:bg-[#5A321A] px-3 py-2 rounded-lg text-base cursor-pointer transition-colors"
            >
                <FaUpload /> Upload Image
            </button>

            {imagePreview && (
                <div className="flex items-center gap-3 p-2 bg-[#faf6f0] border border-[#8b5b30]/30 rounded-lg w-full">
                    <img
                        src={imagePreview}
                        alt="Community upload preview"
                        className="w-12 h-12 rounded object-cover border border-[#8b5b30]/30"
                    />
                    <div className="flex-1 text-xs truncate">
                        <p className="font-semibold text-[#5A321A] truncate">{imageFileName}</p>
                        <p className="text-stone-500">Image attached</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-xs text-red-700 hover:text-red-900 font-semibold px-2 py-1 rounded cursor-pointer"
                    >
                        Remove
                    </button>
                </div>
            )}

            {Object.keys(errors).length > 0 && (
                <Alert severity="error" className="w-full text-left" role="alert">
                    {errors.submit || "Please correct the highlighted fields before submitting."}
                </Alert>
            )}

            {/* Community Name */}
            <FormControl fullWidth required error={!!errors.name}>
                <InputLabel htmlFor="community-name">Community Name</InputLabel>
                <Input
                    id="community-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-describedby="name-helper"
                />
                <FormHelperText id="name-helper">
                    {errors.name || "Enter the community display name (Required)"}
                </FormHelperText>
            </FormControl>

            {/* Country */}
            <FormControl fullWidth>
                <InputLabel htmlFor="community-country">Country</InputLabel>
                <Input
                    id="community-country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    aria-describedby="country-helper"
                />
                <FormHelperText id="country-helper">Optional</FormHelperText>
            </FormControl>

            {/* City */}
            <FormControl fullWidth>
                <InputLabel htmlFor="community-city">City</InputLabel>
                <Input
                    id="community-city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    aria-describedby="city-helper"
                />
                <FormHelperText id="city-helper">Optional</FormHelperText>
            </FormControl>

            {/* State */}
            <FormControl fullWidth>
                <InputLabel htmlFor="community-state">State</InputLabel>
                <Input
                    id="community-state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    aria-describedby="state-helper"
                />
                <FormHelperText id="state-helper">Optional</FormHelperText>
            </FormControl>

            {/* Zip */}
            <FormControl fullWidth>
                <InputLabel htmlFor="community-zip">Zip</InputLabel>
                <Input
                    id="community-zip"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    aria-describedby="zip-helper"
                />
                <FormHelperText id="zip-helper">Optional</FormHelperText>
            </FormControl>

            {/* Description */}
            <FormControl fullWidth required error={!!errors.description}>
                <InputLabel htmlFor="community-desc">Description</InputLabel>
                <Input
                    id="community-desc"
                    name="description"
                    multiline
                    rows={2}
                    value={formData.description}
                    onChange={handleChange}
                    aria-describedby="desc-helper"
                />
                <FormHelperText id="desc-helper">
                    {errors.description || "Briefly explain the community's purpose (Required, min 10 characters)"}
                </FormHelperText>
            </FormControl>

            {/* Technologies */}
            <FormControl fullWidth required error={!!errors.technologies}>
                <FormHelperText className="!text-sm !font-semibold !text-[#5A321A] !mb-1">
                    Select Technologies &amp; Interests (Required)
                </FormHelperText>
                <div className="flex flex-wrap gap-1.5 py-1">
                    {AVAILABLE_TECH_TAGS.map((tech) => {
                        const isSelected = formData.technologies.includes(tech);
                        return (
                            <Chip
                                key={tech}
                                label={tech}
                                onClick={() => handleToggleTech(tech)}
                                variant={isSelected ? "filled" : "outlined"}
                                sx={
                                    isSelected
                                        ? { bgcolor: '#5A321A', color: '#e3ddd7', fontWeight: 600 }
                                        : { borderColor: '#8b5b30', color: '#5A321A' }
                                }
                                size="small"
                            />
                        );
                    })}
                </div>
                {errors.technologies && (
                    <FormHelperText id="tech-error" error>
                        {errors.technologies}
                    </FormHelperText>
                )}
            </FormControl>

            {/* Type / Format */}
            <FormControl fullWidth required error={!!errors.format}>
                <TextField
                    select
                    id="community-type"
                    name="format"
                    label="Select Type of Your Community"
                    value={formData.format}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    error={!!errors.format}
                >
                    <MenuItem value="in_person">Physical</MenuItem>
                    <MenuItem value="hybrid">Hybrid</MenuItem>
                    <MenuItem value="online">Remote</MenuItem>
                </TextField>
                <FormHelperText id="format-helper">
                    {errors.format || "Please select the mode of your Community Events handled (Required)"}
                </FormHelperText>
            </FormControl>

            {/* Link / Website URL */}
            <FormControl fullWidth required error={!!errors.website_url}>
                <InputLabel htmlFor="community-url">Link to your Community</InputLabel>
                <Input
                    id="community-url"
                    name="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={handleChange}
                    aria-describedby="url-helper"
                />
                <FormHelperText id="url-helper">
                    {errors.website_url || "Website or joining URL starting with http:// or https:// (Required)"}
                </FormHelperText>
            </FormControl>

            {/* Contact Email */}
            <FormControl fullWidth error={!!errors.email}>
                <InputLabel htmlFor="community-email">Contact Email</InputLabel>
                <Input
                    id="community-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-describedby="email-helper"
                />
                <FormHelperText id="email-helper">
                    {errors.email || "Optional contact email"}
                </FormHelperText>
            </FormControl>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/4 text-[#e3ddd7] bg-[#8b5b30] hover:bg-[#5A321A] disabled:opacity-50 px-3 py-2 rounded-lg text-base cursor-pointer transition-colors"
            >
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
}