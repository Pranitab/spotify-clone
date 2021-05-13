import { useState ,useEffect } from 'react';
import useAuth from './useAuth';
import { Container , Form } from 'react-bootstrap';
import spotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from './TrackSearchResult';
import Player from './Player';

const spotifyApi = new spotifyWebApi({
    clientId:'05450f477aeb45d98c58a4b810042c73'
})

const Dashboard = ({ code }) => {
    const accessToken = useAuth(code);
    const [search , setSearch] = useState("");
    const [searchResult , setSearchResult] = useState([]);
    const [playingTrack , setPlayingTrack] = useState('');

    function chooseTrack(track) {
        setPlayingTrack(track);
        setSearch('');
    }

    console.log('search result', searchResult);
    useEffect(() => {
        if(!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    useEffect(()=>{
        console.log('search',search,accessToken,'accessToken')
        if(!search) return setSearchResult([]);
        if(!accessToken) return;

        let cancel = false;
        spotifyApi.searchTracks(search).then(res=>{
             console.log(res.body.tracks.items,'res');

            if(cancel) return;
            setSearchResult(res.body.tracks.items.map(track=>{
                const smallestAlbumUrl = track.album.images.reduce((smallest , image)=>{
                    if(image.height<smallest.height) return image
                    return smallest
                },track.album.images[0])

                return ({
                    artistName: track.artists[0].name,
                    title:track.name,
                    uri:track.uri.search,
                    albumUrl:smallestAlbumUrl.url
                })
            }))
        })

        return ()=> (cancel = true)
    },[search , accessToken])
    return (
        <Container className='d-flex flex-column dy-2'>
            <Form.Control
            placeholder="Search songs/artist"
            type="search"
            onChange={e=>setSearch(e.target.value)}
            value={search}
            />
            <div className ='flex-grow-1 my-2' style={{overflowY: 'auto'}}>
                {console.log(searchResult,'in list')}
                {
                searchResult?.map(track=>{
                    return <TrackSearchResult track={track} key={track.uri}
                    chooseTrack ={chooseTrack} />
                })}
            </div>
            <div>
                <Player accessToken ={accessToken} trackUri={playingTrack?.uri}/>
            </div>
        </Container>
        
    )
}

export default Dashboard
