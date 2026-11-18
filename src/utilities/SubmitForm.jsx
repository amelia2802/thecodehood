import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Form from './Form';

export default function SubmitForm() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <div>
            <button className="text-[#8b5b30] bg-[#e3ddd7] px-3 py-2 rounded-lg text-base border border-[#8b5b30]" onClick={handleOpen}>Submit Community</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="submit-community"
                aria-describedby="submit-community-form"
                className="flex items-center justify-center"
            >
                <Box className="absolute w-1/2 max-h-[90vh] overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#e3ddd7] px-4 py-6 rounded-lg">
                    <Typography id="submit-community" variant="h6" component="h2" className="text-center">
                        Fill Up the Form to Add Your Community
                    </Typography>
                    <Form />
                </Box>
            </Modal>
        </div>
    );
}