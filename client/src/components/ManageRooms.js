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
import mapboxgl from 'mapbox-gl';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = mbxGeocoding({ accessToken: process.env.REACT_APP_MAP_TOKEN });

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" {...props} ref={ref} />;
});

const ManageRooms = ({ open, onClose }) => {
  const {
    state: { rooms, currentUser },
    dispatch,
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

  const fetchAddresses = async (rooms) => {
    return Promise.all(
      rooms.map(async (room) => {
        const response = await geocodingClient.reverseGeocode({
          query: [room.lng, room.lat],  // Note: lng comes before lat in Mapbox
          limit: 1,
        }).send();

        const feature = response.body.features[0];
        const address = feature?.place_name || 'Address not found';
        const placeName = feature?.text || 'Place name not found';  // Extract place name from feature

        return { ...room, address, placeName };
      })
    );
  };

  useEffect(() => {
    const fetchAndSetAddresses = async () => {
      try {
        const roomsWithAddresses = await fetchAddresses(userRooms);
        setUserRooms(roomsWithAddresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    if (userRooms.length > 0) {
      fetchAndSetAddresses();
    }
  }, [userRooms]);

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
                    <Typography component="span">{room.placeName || 'Place name not available'}</Typography>
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
