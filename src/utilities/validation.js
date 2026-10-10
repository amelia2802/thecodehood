export function isValidUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    try {
        const parsed = new URL(trimmed);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return true;
    const trimmed = email.trim();
    if (trimmed.length === 0) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function validateCommunitySubmission(formData = {}) {
    const errors = {};

    // 1. Community Name (required)
    if (!formData.name || formData.name.trim().length === 0) {
        errors.name = "Community name is required.";
    } else if (formData.name.trim().length < 2) {
        errors.name = "Community name must be at least 2 characters.";
    }

    // 2. Description (required)
    if (!formData.description || formData.description.trim().length === 0) {
        errors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
        errors.description = "Description must be at least 10 characters long.";
    }

    // 3. Format (required)
    const validFormats = ['online', 'in_person', 'hybrid'];
    if (!formData.format || !validFormats.includes(formData.format)) {
        errors.format = "Please select a participation format (in-person, hybrid, or online).";
    }

    // 4. Technologies (required, at least 1 tag)
    if (!formData.technologies || !Array.isArray(formData.technologies) || formData.technologies.length === 0) {
        errors.technologies = "Please select at least one technology or interest tag.";
    }

    // 5. Website URL (required and valid)
    if (!formData.website_url || formData.website_url.trim().length === 0) {
        errors.website_url = "Website or joining URL is required.";
    } else if (!isValidUrl(formData.website_url)) {
        errors.website_url = "Please enter a valid website URL starting with http:// or https://.";
    }

    // 6. Contact Email (optional, but validate if provided)
    if (formData.email && formData.email.trim().length > 0 && !isValidEmail(formData.email)) {
        errors.email = "Please enter a valid email address.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

export function createPendingSubmission(formData) {
    return {
        name: formData.name.trim(),
        description: formData.description.trim(),
        desc: formData.description.trim(),
        city: (formData.city || '').trim(),
        state: (formData.state || '').trim(),
        country: (formData.country || '').trim(),
        postal_code: (formData.postal_code || formData.zip || '').trim(),
        zip: (formData.postal_code || formData.zip || '').trim(),
        technologies: [...(formData.technologies || [])],
        format: formData.format,
        type: formData.format,
        website_url: formData.website_url.trim(),
        url: formData.website_url.trim(),
        email: (formData.email || '').trim(),
        img: formData.img || '',
        status: 'pending',
        is_demo: false,
        created_at: new Date().toISOString()
    };
}
