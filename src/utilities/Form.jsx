import { useState, useRef } from 'react';
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { validateCommunitySubmission } from './validation';
import { submitCommunity } from './communityService';

export default function Form() {

    return (
        <form  noValidate className="flex flex-col items-center gap-4 w-full">
        </form>
    );
}