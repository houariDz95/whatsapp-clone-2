import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
function Loading() {
  return(
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh'}}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <img 
        src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=w240-h480-rw"
        alt="loading-image"
        style={{  marginBottom: 10, borderRadius: '50%'}}
        height={200}
        width={200}
        />
        <CircularProgress color="success" />     
      </div> 
    </center>
  )
}

export default Loading

