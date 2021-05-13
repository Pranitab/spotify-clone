import React from 'react'

function TrackSearchResult({ track,chooseTrack }) {
    function handlePlay(track){
        chooseTrack(track);
    }
    return (
        <div className="d-flex m-2 align-items-center" style={{cursor: 'pointer'}}
        onClick={handlePlay}>
            <img src ={track.albumUrl} style={{width:'64px',height:'64px'}} />
            <div className="ml-3">
                <div>{track.title}</div>
                <div className="text-muted">{track.artistName}</div>
            </div>
        </div>
    )
}

export default TrackSearchResult;