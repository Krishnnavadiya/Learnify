import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import { RateCourse } from '../../../services/Apis';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Button, Modal, Typography, TextField } from '@mui/material';
import { useParams } from "react-router-dom";

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

const getLabelText = (value) => `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: '#fff',
  color: '#000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

function RateCourseDialog() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const { courseId } = useParams();

  const handleRateCourse = async () => {
    const data = {
      rating,
      comment,
    };
    try {
      const response = await RateCourse(courseId, data);
      if (response?.status === 200) {
        toast.success('Course rated successfully');
        setRating(0);
        setComment('');
      } else {
        toast.error(response.response.data.message || 'Error rating the course');
      }
    } catch (error) {
      console.error('Error rating the course:', error);
      toast.error(error.message || 'Error rating the course');
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={<CheckCircleOutlineIcon />}
        >
          Rate
        </Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>Rate this Course</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating
              name="hover-feedback"
              value={rating}
              precision={0.5}
              getLabelText={getLabelText}
              onChange={(event, newRating) => {
                setRating(newRating);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={<StarIcon style={{ opacity: 0.55, color: 'yellow' }} fontSize="inherit" />}
              sx={{ fontSize: 40 }}
            />
            {rating !== null && (
              <Box sx={{ ml: 2, color: '#000' }}>
                {labels[hover !== -1 ? hover : rating]}
              </Box>
            )}
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a comment..."
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 3, bgcolor: 'white', borderRadius: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" color="primary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            {/* <Button 
              variant="contained" 
              color="success" 
              onClick={handleRateCourse}
              >
              Cancel
            </Button> */}
            <Button
              variant="contained"
              color="success"
              onClick={handleRateCourse}
            >
              Submit
            </Button>


          </Box>
        </Box>
      </Modal>
    </>
  );
}

RateCourseDialog.propTypes = {
  courseId: PropTypes.string,
};

export default RateCourseDialog;
