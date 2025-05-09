import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    useMediaQuery,
    useTheme,
    Paper,
    IconButton
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    Close as CloseIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Forum as ForumIcon,
    MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import getToken from '../../../../services/getToken';
import CourseAccordion from './CourseAccordion';
import FileUploadForm from '../Buttons/video_and_pdf_button';
import DiscussionForum from "../DicussionForum/DicussionForum";
import SectionCreationForm from "../Buttons/button";
import Assignments from './Assignments';
import StudentList from './StudentList';
import { deleteSection, editSection } from './../../../../services/Apis';
import AssignmentUploadForm from '../Buttons/AssignmentUploadForm';

const SectionAccordion = ({
    index,
    title,
    content,
    sectionId,
    usertype,
    createdby,
    isEnrolled
}) => {
    const { courseId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [formData, setFormData] = useState({ title });

    const toggleFullScreen = () => setFullScreen(!fullScreen);
    const handleEditClick = () => setEditDialogOpen(true);
    const handleCloseEditDialog = () => setEditDialogOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error('Please enter section name');
            return;
        }

        try {
            const response = await editSection(courseId, sectionId, formData);
            if (response?.status === 201) {
                toast.success('Section updated successfully');
                handleCloseEditDialog();
                window.location.reload();
            } else {
                throw new Error(response?.message || 'Failed to update section');
            }
        } catch (error) {
            console.error('Section update error:', error);
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            try {
                const response = await deleteSection(courseId, sectionId);
                if (response?.status === 201) {
                    toast.success('Section deleted successfully');
                    window.location.reload();
                } else {
                    throw new Error(response?.message || 'Failed to delete section');
                }
            } catch (error) {
                console.error('Section deletion error:', error);
                toast.error(error.message);
            }
        }
    };

    return (
        <Accordion sx={{ mb: 2, boxShadow: 3 }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                    {title}
                </Typography>

                {usertype === 'educator' && getToken('educator')?.userId === createdby && (
                    <Box>
                        <IconButton onClick={handleEditClick} size="small" sx={{ mr: 1 }}>
                            <EditIcon fontSize="large" />
                        </IconButton>
                        <IconButton onClick={handleDelete} size="small">
                            <DeleteIcon fontSize="large" color="error" />
                        </IconButton>
                    </Box>
                )}
            </AccordionSummary>

            <AccordionDetails sx={{ pt: 2 }}>
                <Box sx={{ mb: 3 }}>
                    {content?.map((post, idx) => (
                        <CourseAccordion
                            key={idx}
                            post={post}
                            sectionId={sectionId}
                            usertype={usertype}
                            createdby={createdby}
                            isEnrolled={isEnrolled}
                        />
                    ))}
                </Box>

                {usertype === 'educator' && getToken('educator')?.userId === createdby && (
                    <FileUploadForm sectionId={sectionId} />
                )}
            </AccordionDetails>

            {/* Edit Section Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={handleCloseEditDialog}
                fullScreen={fullScreen || isMobile}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 600
                }}>
                    Edit Section
                    <Box>
                        <IconButton onClick={toggleFullScreen} size="large" sx={{ mr: 1 }}>
                            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                        <IconButton onClick={handleCloseEditDialog} size="large">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
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
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handleCloseEditDialog}
                        variant="outlined"
                        sx={{ fontSize: '1.1rem' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSubmit}
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: '1.1rem', ml: 2 }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Accordion>
    );
};

SectionAccordion.propTypes = {
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.array,
    sectionId: PropTypes.string.isRequired,
    usertype: PropTypes.string.isRequired,
    createdby: PropTypes.string.isRequired,
    isEnrolled: PropTypes.bool.isRequired
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function tabProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

export default function CourseTabs({
    sections,
    courseAssignments,
    enrolledStudents,
    discussionData,
    usertype,
    createdby,
    isEnrolled
}) {
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper elevation={3} sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant={isMobile ? 'scrollable' : 'standard'}
                    scrollButtons="auto"
                    aria-label="course tabs"
                >
                    <Tab
                        label="Sections"
                        icon={<MenuBookIcon />}
                        iconPosition="start"
                        sx={{ fontSize: '1rem', minHeight: 64 }}
                        {...tabProps(0)}
                    />
                    <Tab
                        label="Assignments"
                        icon={<AssignmentIcon />}
                        iconPosition="start"
                        sx={{ fontSize: '1rem', minHeight: 64 }}
                        {...tabProps(1)}
                    />
                    {((usertype === 'educator' && getToken('educator')?.userId === createdby) ||
                        (usertype === 'student' && isEnrolled)) && (
                            <Tab
                                label="Discussion"
                                icon={<ForumIcon />}
                                iconPosition="start"
                                sx={{ fontSize: '1rem', minHeight: 64 }}
                                {...tabProps(2)}
                            />
                        )}
                    {usertype === 'educator' && getToken('educator')?.userId === createdby && (
                        <Tab
                            label="Students"
                            icon={<PeopleIcon />}
                            iconPosition="start"
                            sx={{ fontSize: '1rem', minHeight: 64 }}
                            {...tabProps(3)}
                        />
                    )}
                </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
                <Box sx={{ mb: 3 }}>
                    {sections?.map((section, index) => (
                        <SectionAccordion
                            key={index}
                            index={index}
                            title={section.title}
                            content={section.posts}
                            sectionId={section._id}
                            usertype={usertype}
                            createdby={createdby}
                            isEnrolled={isEnrolled}
                        />
                    ))}
                </Box>

                {usertype === 'educator' && getToken('educator')?.userId === createdby && (
                    <SectionCreationForm />
                )}
            </TabPanel>

            <TabPanel value={value} index={1}>
                <Box sx={{ mb: 3 }}>
                    {courseAssignments?.map((assignment, index) => (
                        <Assignments
                            key={index}
                            isEnrolled={isEnrolled}
                            createdby={createdby}
                            usertype={usertype}
                            submissiondata={assignment.submission}
                            title={assignment.title}
                            description={assignment.description}
                            deadline={assignment.dueDate}
                            assignmentLink={assignment.attachment}
                            assignmentId={assignment._id}
                        />
                    ))}
                </Box>

                {usertype === 'educator' && getToken('educator')?.userId === createdby && (
                    <AssignmentUploadForm />
                )}
            </TabPanel>

            <TabPanel value={value} index={2}>
                {((usertype === 'educator' && getToken('educator')?.userId === createdby) ||
                    (usertype === 'student' && isEnrolled)) && (
                        <DiscussionForum
                            data={discussionData}
                            usertype={usertype}
                            createdby={createdby}
                            isEnrolled={isEnrolled}
                        />
                    )}
            </TabPanel>

            <TabPanel value={value} index={3}>
                {usertype === 'educator' && getToken('educator')?.userId === createdby ? (
                    <StudentList students={enrolledStudents} />
                ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
                        You are not authorized to view this content
                    </Typography>
                )}
            </TabPanel>
        </Paper>
    );
}

CourseTabs.propTypes = {
    sections: PropTypes.array,
    courseAssignments: PropTypes.array,
    enrolledStudents: PropTypes.array,
    discussionData: PropTypes.array,
    usertype: PropTypes.string.isRequired,
    createdby: PropTypes.string.isRequired,
    isEnrolled: PropTypes.bool.isRequired
};