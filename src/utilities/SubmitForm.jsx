import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Form from './Form';

export default function SubmitForm({
    onSubmitSuccess,
    buttonText = 'Submit a Community',
    buttonClassName = 'text-[#e3ddd7] bg-[#8b5b30] px-3 py-2 rounded-lg text-base'
}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <button type="button" onClick={handleOpen} className={buttonClassName}>
                {buttonText}
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxSizing: 'border-box',
                        width: 'min(42rem, calc(100% - 2rem))',
                        maxHeight: '90dvh',
                        overflowY: 'auto',
                        bgcolor: '#e3ddd7',
                        p: { xs: 2, sm: 3 },
                        borderRadius: 1,
                        boxShadow: 2
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Submit Your Community
                    </Typography>
                    <Typography id="modal-modal-description" className="mt-2" component="div">
                        <Form onSubmitSuccess={onSubmitSuccess} onClose={handleClose} />
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}