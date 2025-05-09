import React, { useState } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    useMediaQuery,
    useTheme,
    Typography,
    Box,
    Card,
    CardContent,
    Divider,
    Chip
} from '@mui/material';
import {
    Attachment as AttachmentIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    Delete as DeleteIcon,
    Upload as UploadIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { SubmitAssignment, DeleteAssignmentSubmission } from '../../../../services/Apis';
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AssignmentSubmission({
    assignmentId,
    submissionId,
    deadline,
    submissiondata,
    isSubmitted,
    createdby,
    usertype,
    isEnrolled
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const token = Cookies.get('token');
    const { courseId } = useParams();

    // State management
    const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Handlers
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.warning('Please select a file to upload');
            return;
        }

        try {
            const formData = new FormData();
            formData.append("submission", selectedFile);

            const response = await SubmitAssignment(courseId, assignmentId, formData);
            if (response?.status === 201) {
                toast.success('Assignment submitted successfully');
                window.location.reload();
            } else {
                throw new Error(response?.message || 'Error submitting assignment');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.message);
        } finally {
            setOpenSubmitDialog(false);
        }
    };

    const handleDeleteSubmission = async () => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                const response = await DeleteAssignmentSubmission(courseId, submissionId);
                if (response?.status === 200) {
                    toast.success('Submission deleted successfully');
                    window.location.reload();
                } else {
                    throw new Error(response?.message || 'Error deleting submission');
                }
            } catch (error) {
                console.error('Deletion error:', error);
                toast.error(error.message);
            }
        }
    };

    const checkDeadline = () => {
        const submissionDeadline = new Date(deadline).getTime();
        const currentTime = new Date().getTime();
        return submissionDeadline > currentTime;
    };

    // Helper functions
    const getFileName = (url) => {
        const match = url?.match(/\/ASSIGNMENTS\/(.+?\.\w+)/i);
        return match ? match[1] : 'Submission File';
    };

    const renderSubmissionStatus = () => {
        if (!isSubmitted) {
            const canSubmit = checkDeadline();
            return (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<UploadIcon />}
                    onClick={() => canSubmit ? setOpenSubmitDialog(true) : toast.error('Submission deadline has passed')}
                    sx={{
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        fontWeight: 600,
                        py: 1.5,
                        px: 3
                    }}
                >
                    Submit Assignment
                </Button>
            );
        }

        return (
            <Card variant="outlined" sx={{ mt: 2, mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 600 }}>
                        Your Submission
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton
                            onClick={() => setOpenViewDialog(true)}
                            sx={{ mr: 1 }}
                        >
                            <AttachmentIcon fontSize="large" color="primary" />
                        </IconButton>
                        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                            {getFileName(submissiondata[0]?.submission[0])}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Chip
                            label={`Grade: ${submissiondata[0]?.grade || 'Not graded yet'}`}
                            color="primary"
                            sx={{
                                fontSize: '1rem',
                                px: 1.5,
                                py: 0.5
                            }}
                        />

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteSubmission}
                            sx={{
                                fontSize: isMobile ? '0.875rem' : '1rem',
                                fontWeight: 600,
                                ml: 'auto'
                            }}
                        >
                            Delete Submission
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ mt: 3 }}>
            {/* Only show to enrolled students */}
            {usertype === 'student' && isEnrolled && renderSubmissionStatus()}

            {/* Submit Assignment Dialog */}
            <Dialog
                open={openSubmitDialog}
                onClose={() => setOpenSubmitDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ fontSize: '2.25rem', fontWeight: 600 }}>
                    Submit Assignment
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 3, fontSize: '2rem' }}>
                        Please upload your assignment file
                    </Typography>

                    <label htmlFor="file-upload" style={{ width: '100%' }}>
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
                                }
                            }}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#000',
                                    fontSize: '1.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px'
                                }}
                            >
                                {
                                    selectedFile && selectedFile.name ? selectedFile.name : <><AiOutlineCloudUpload size={24} />Click to Upload</>
                                }

                            </Typography>
                        </Box>
                    </label>

                    {selectedFile && (
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            Selected file: {selectedFile.name}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenSubmitDialog(false)}
                        sx={{ fontSize: '1.6rem' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        sx={{ fontSize: '1.6rem' }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Submission Dialog */}
            <Dialog
                open={openViewDialog}
                onClose={() => setOpenViewDialog(false)}
                fullScreen={fullScreen || isMobile}
                maxWidth="lg"
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 600
                }}>
                    {getFileName(submissiondata[0]?.submission[0])}
                    <IconButton
                        onClick={() => setFullScreen(!fullScreen)}
                        size="large"
                    >
                        {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ minHeight: '60vh' }}>
                    <iframe
                        title="Assignment Submission"
                        src={`http://localhost:8000/file/retrieve?courseId=${courseId}&path=${submissiondata[0]?.submission[0]}&jwt=${token}`}
                        width="100%"
                        height="100%"
                        style={{ border: 'none', minHeight: '500px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenViewDialog(false)}
                        sx={{ fontSize: '1rem' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}