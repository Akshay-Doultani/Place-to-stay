import fetchData from './utils/fetchData';

const url = process.env.REACT_APP_SERVER_URL + '/room';

export const createRoom = async (room, currentUser, dispatch, setPage) => {
  dispatch({ type: 'START_LOADING' });

  const result = await fetchData(
    { url, body: room, token: currentUser?.token },
    dispatch
  );
  if (result) {
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'success',
        message: 'The room has been added successfully',
      },
    });
    dispatch({ type: 'RESET_ROOM' });
    setPage(0);
    dispatch({ type: 'UPDATE_ROOM', payload: result });
  }

  dispatch({ type: 'END_LOADING' });
};

export const getRooms = async (dispatch) => {
  const result = await fetchData({ url, method: 'GET' }, dispatch);
  if (result) {
    dispatch({ type: 'UPDATE_ROOMS', payload: result });
  }
};


// Function to delete a room
export const deleteRoom = async (roomId, currentUser, dispatch) => {
  const fullUrl = `${url}/${roomId}`;

  dispatch({ type: 'START_LOADING' });

  const result = await fetchData(
    { url: fullUrl, method: 'DELETE', token: currentUser?.token },
    dispatch
  );
  
  if (result) {
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'success',
        message: 'Room has been deleted successfully',
      },
    });
    // Optionally, update the state to remove the deleted room
    dispatch({ type: 'REMOVE_ROOM', payload: roomId });
  }

  dispatch({ type: 'END_LOADING' });
};