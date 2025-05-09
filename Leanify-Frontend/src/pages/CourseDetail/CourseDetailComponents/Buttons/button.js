import React, { useState } from 'react';
import {
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useMediaQuery,
    useTheme,
    Typography,
    IconButton
} from '@mui/material';
import {
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    Add as AddIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { createSection } from '../../../../services/Apis';
import { useParams } from 'react-router-dom';

export default function SectionCreationForm() {
    const { courseId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openDialog, setOpenDialog] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
    });

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const toggleFullScreen = () => setFullScreen(!fullScreen);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error('Please enter section name');
            return;
        }

        if (!courseId) {
            toast.error('Course ID is not defined');
            return;
        }

        try {
            const response = await createSection(courseId, formData);
            if (response?.message === "Section created") {
                toast.success('Section created successfully');
                handleCloseDialog();
                window.location.reload();
            } else {
                throw new Error(response?.message || 'Failed to create section');
            }
        } catch (error) {
            console.error('Section creation error:', error);
            toast.error(error.message);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
                sx={{
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    fontWeight: 600,
                    py: 1.5,
                    px: 3
                }}
            >
                Add Section
            </Button>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullScreen={fullScreen || isMobile}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    p: 3
                }}>
                    <Typography variant="h6" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                        Create New Section
                    </Typography>
                    <Box>
                        <IconButton onClick={toggleFullScreen} size="large" sx={{ mr: 1 }}>
                            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                        <IconButton onClick={handleCloseDialog} size="large">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3
                        }}
                    >
                        <TextField
                            label="Section Name"
                            variant="outlined"
                            fullWidth
                            value={formData.title}
                            name="title"
                            onChange={handleChange}
                            InputProps={{
                                style: { fontSize: '1.1rem' }
                            }}
                            InputLabelProps={{
                                style: { fontSize: '1.1rem' }
                            }}
                            autoFocus
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                        sx={{
                            fontSize: '1.1rem',
                            px: 3,
                            py: 1
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        sx={{
                            fontSize: '1.1rem',
                            px: 3,
                            py: 1,
                            ml: 2
                        }}
                    >
                        Create Section
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}