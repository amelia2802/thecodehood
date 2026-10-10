import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Form from './Form';

export default function SubmitForm({ onSubmitSuccess }){
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return(
        <div>
            <button onClick={handleOpen} className="text-[#e3ddd7] bg-[#8b5b30] px-3 py-2 rounded-lg text-base">Submit a Community</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e3ddd7] p-4 w-150 rounded shadow-sm max-h-[90vh] overflow-y-auto">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Submit Your Community
                    </Typography>
                    <Typography id="modal-modal-description" className="mt-2" component="div">
                        <Form onSubmitSuccess={onSubmitSuccess} onClose={handleClose} />
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}