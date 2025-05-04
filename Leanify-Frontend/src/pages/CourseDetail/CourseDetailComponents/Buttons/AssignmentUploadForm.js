import React, { useState } from 'react';
import {
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    InputAdornment,
    Typography,
    useMediaQuery,
    useTheme,
    IconButton
} from '@mui/material';
import {
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    Event as EventIcon,
    Description as DescriptionIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { createAssignment } from '../../../../services/Apis';
import { useParams } from 'react-router-dom';

const AssignmentUploadForm = ({ sectionId }) => {
    const { courseId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openDialog, setOpenDialog] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        deadline: '',
    });

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error('Please enter an assignment title');
            return;
        }
        if (!formData.deadline) {
            toast.error('Please set a deadline');
            return;
        }
        if (selectedFiles.length === 0) {
            toast.error('Please upload at least one file');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('dueDate', formData.deadline);
        data.append('description', 'Assignment created by instructor');
        selectedFiles.forEach(file => data.append('attachments', file));

        try {
            const response = await createAssignment(courseId, data);
            if (response?.status === 201) {
                toast.success('Assignment created successfully');
                setOpenDialog(false);
                window.location.reload();
            } else {
                throw new Error(response?.message || 'Failed to create assignment');
            }
        } catch (error) {
            console.error('Assignment creation error:', error);
            toast.error(error.message);
        }
    };

    const toggleFullScreen = () => setFullScreen(!fullScreen);

    return (
        <>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    fontWeight: 600,
                    py: 1.5,
                    px: 3
                }}
            >
                Add Assignment
            </Button>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullScreen={fullScreen || isMobile}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 600
                }}>
                    Create New Assignment
                    <IconButton onClick={toggleFullScreen} size="large">
                        {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            pt: 2
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            label="Assignment Title"
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
                        />

                        <TextField
                            label="Deadline"
                            variant="outlined"
                            type="datetime-local"
                            fullWidth
                            value={formData.deadline}
                            name="deadline"
                            onChange={handleChange}
                            InputProps={{
                                style: { fontSize: '1.1rem' },
                                inputProps: { min: getCurrentDateTime() },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EventIcon fontSize="large" />
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                style: { fontSize: '1.1rem' }
                            }}
                        />

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 600 }}>
                                Upload Files (PDF)
                            </Typography>

                            <label htmlFor="file-upload" style={{ width: '100%', display: 'block' }}>
                                <Box
                                    sx={{
                                        border: '2px dashed #aaa',
                                        borderRadius: '8px',
                                        padding: '40px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        mb: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&:hover': {
                                            borderColor: '#333',
                                            backgroundColor: '#f9f9f9'
                                        }
                                    }}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        // hidden
                                        style={{
                                            display: 'none'
                                        }}
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                    <DescriptionIcon sx={{ fontSize: 40, color: '#555', mb: 1 }} />
                                    <Typography variant="body1" sx={{ color: '#555' }}>
                                        {selectedFiles.length > 0 ? (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="subtitle1" sx={{ fontSize: '1.1rem', mb: 1 }}>
                                                    Selected Files:
                                                </Typography>
                                                <ul style={{
                                                    paddingLeft: '1.5rem',
                                                    fontSize: '1.1rem'
                                                }}>
                                                    {selectedFiles.map((file, index) => (
                                                        <li key={index}>{file.name}</li>
                                                    ))}
                                                </ul>
                                            </Box>
                                        ) : (
                                            "Click to Upload PDF Files"
                                        )}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#888', mt: 0.5 }}>
                                        (Only .pdf files supported)
                                    </Typography>
                                </Box>
                            </label>


                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setOpenDialog(false)}
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
                        Create Assignment
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AssignmentUploadForm;