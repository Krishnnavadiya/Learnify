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
    IconButton,
    InputAdornment
} from '@mui/material';
import {
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Description as DescriptionIcon,
    VideoFile as VideoFileIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { createPost } from '../../../../services/Apis';
import { useParams } from 'react-router-dom';

const PostCreationForm = ({ sectionId }) => {
    const { courseId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [openDialog, setOpenDialog] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        body: ''
    });

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const toggleFullScreen = () => setFullScreen(!fullScreen);

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
            toast.error('Please enter a post title');
            return;
        }
        if (!formData.body) {
            toast.error('Please enter post content');
            return;
        }

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('body', formData.body);
            selectedFiles.forEach(file => data.append('attachments', file));

            const response = await createPost(courseId, sectionId, data);

            if (response?.status === 201) {
                toast.success('Post created successfully');
                handleCloseDialog();
                window.location.reload();
            } else {
                throw new Error(response?.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Post creation error:', error);
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
                Add Post
            </Button>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullScreen={fullScreen || isMobile}
                maxWidth="md"
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
                        Create New Post
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
                            label="Post Title"
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

                        <TextField
                            label="Post Content"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.body}
                            name="body"
                            onChange={handleChange}
                            InputProps={{
                                style: { fontSize: '1.1rem' }
                            }}
                            InputLabelProps={{
                                style: { fontSize: '1.1rem' }
                            }}
                        />

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 600 }}>
                                Attach Files (PDF or Video)
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
                                        '&:hover': {
                                            borderColor: '#333',
                                            backgroundColor: '#f9f9f9'
                                        },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        // hidden
                                        style={{ display: 'none' }}
                                        accept=".pdf,video/*"
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                    <DescriptionIcon sx={{ fontSize: 40, color: '#555', mb: 1 }} />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#555'
                                        }}
                                    >
                                        {selectedFiles.length > 0 ? (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="subtitle1" sx={{ fontSize: '1.1rem', mb: 1 }}>
                                                    Selected Files:
                                                </Typography>
                                                <ul style={{
                                                    paddingLeft: '1.5rem',
                                                    fontSize: '1.1rem',
                                                    listStyleType: 'none'
                                                }}>
                                                    {selectedFiles.map((file, index) => (
                                                        <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                            {file.type.includes('pdf') ? <DescriptionIcon /> : <VideoFileIcon />}
                                                            {file.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Box>
                                        ) : ("Click to Upload Files")}

                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#888', mt: 0.5 }}>
                                        (Supported: .pdf, video files)
                                    </Typography>
                                </Box>
                            </label>


                        </Box>
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
                        Create Post
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PostCreationForm;