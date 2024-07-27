import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Dialog,
  IconButton,
  Rating,
  Slide,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  Button,
} from '@mui/material';
import { Close, StarBorder, Delete } from '@mui/icons-material';
import { forwardRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow, Autoplay, Zoom } from 'swiper/modules';
//import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/zoom';
import { useValue } from '../context/ContextProvider';
import ConfirmationDialog from './ConfirmationDialog';
import { getRooms, deleteRoom } from '../actions/room';

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" {...props} ref={ref} />;
});

const ManageRooms = ({ open, onClose }) => {
  const {
    state: { rooms, currentUser },
    dispatch
  } = useValue();

  const [userRooms, setUserRooms] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const filteredRooms = rooms.filter((room) => room.uid === currentUser.id);
      setUserRooms(filteredRooms);
    }
  }, [rooms, currentUser]);

  const handleDeleteRoom = (roomId) => {
    setConfirmDelete(roomId);
  };

  const handleConfirmDelete = async (roomId) => {
    try {
      console.log(`Attempting to delete room with ID: ${roomId}`);
      await deleteRoom(roomId, currentUser, dispatch); // Use deleteRoom function

      // Optionally, refresh the list of rooms
      await getRooms(dispatch);
      
      // Remove deleted room from state
      setUserRooms(userRooms.filter((room) => room._id !== roomId));
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="h3" sx={{ ml: 2, flex: 1 }}>
            Manage Rooms
          </Typography>
          <IconButton color="inherit" onClick={onClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ pt: 5 }}>
        {userRooms.length > 0 ? (
          userRooms.map((room) => (
            <Box key={room._id} sx={{ mb: 2, p: 2, border: '1px solid gray' }}>
              <Typography variant="h6">{room.title}</Typography>
              <Swiper
                modules={[Navigation, Autoplay, EffectCoverflow, Zoom]}
                centeredSlides
                slidesPerView={2}
                grabCursor
                navigation
                autoplay
                lazy
                zoom
                effect="coverflow"
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
              >
                {room.images?.map((url) => (
                  <SwiperSlide key={url}>
                    <div className="swiper-zoom-container">
                      <img src={url} alt="room" />
                    </div>
                  </SwiperSlide>
                ))}
                <Tooltip
                  title={room.uName || ''}
                  sx={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    zIndex: 2,
                  }}
                >
                  <Avatar src={room.uPhoto} />
                </Tooltip>
              </Swiper>
              <Stack sx={{ p: 3 }} spacing={2}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="h6" component="span">
                      Rent per month:
                    </Typography>
                    <Typography component="span">
                      {room.price === 0 ? 'Free Stay' : '$' + room.price}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" component="span">
                      Ratings:
                    </Typography>
                    <Rating
                      name="room-ratings"
                      defaultValue={3.5}
                      precision={0.5}
                      emptyIcon={<StarBorder />}
                    />
                  </Box>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="h6" component="span">
                      Place Name:
                    </Typography>
                    <Typography component="span">{room.placeName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" component="span">
                      Address:
                    </Typography>
                    <Typography component="span">{room.address}</Typography>
                  </Box>
                </Stack>
                <Stack>
                  <Typography variant="h6" component="span">
                    Details:
                  </Typography>
                  <Typography component="span">{room.description}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-end">
                  <IconButton onClick={() => handleDeleteRoom(room._id)}>
                    <Delete />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No rooms found</Typography>
        )}
      </Container>
      {confirmDelete && (
        <ConfirmationDialog
          message="Are you sure you want to delete this room?"
          onConfirm={() => handleConfirmDelete(confirmDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </Dialog>
  );
};

export default ManageRooms;
