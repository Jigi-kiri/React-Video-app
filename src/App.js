import * as React from "react";
import ReactPlayer from "react-player";
import {
  AppBar,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles"
import PlayerControls from "./components/PlayerControls";
import screenfull from "screenfull";

const useStyle = makeStyles({
  playerWrapper: {
    width: "100%",
    position: "relative",
  }
})

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

function App() {
  const classes = useStyle();
  const [timeFormat, setTimeFormat] = React.useState("stable");
  const [bookmarks, setBookmarks] = React.useState([]);

  const [state, setState] = React.useState({
    playing: true,
    muted: false,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: true,
    url: null
  });

  const { playing, muted, volume, playbackRate, played, seeking, url } = state;

  const playerRef = React.useRef(null);
  const playerControlRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const controlsRef = React.useRef(null);

  const urlData = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  ]

  const currentTime = playerRef && playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";

  const duration = playerRef && playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const elapsedTime = timeFormat === "stable"
    ? format(currentTime)
    : `-${format(duration - currentTime)}`;
  const totalDuration = format(duration);

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing })
  }

  const handleMute = () => {
    setState({ ...state, muted: !state.muted })
  }

  const handleVolumeChange = (event, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    })
  }

  const handleVolumeSeekUp = (event, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    })
  }

  const handleProgress = (changeState) => {
    if (count > 3) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility == "visible") {
      count += 1;
    }
    if (seeking) {
      setState({ ...state, ...changeState })
    }
  }

  const handelPlaybackRateChange = (rate) => {
    setState({ ...state, playbackRate: rate })
  }

  const handleDispalyTimeFormat = () => {
    setTimeFormat(timeFormat === "stable" ? "remaining" : "stable")
  }

  const fullScreenToggle = () => {
    screenfull.toggle(playerControlRef.current)
  }

  const handleSeekChange = (event, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) })
  }

  const handleSeekMouseDown = (event) => {
    setState({ ...state, seeking: true })
  }

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0;
  }

  const handleSeekMouseUp = (event, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100);
  }

  const handleRewind = () => {
    playerRef?.current?.seekTo(currentTime - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(currentTime + 10);
  };

  const addBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      playerRef.current.getInternalPlayer(), 0, 0, canvas.width, canvas.height
    );

    const ImageUrl = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;

    setBookmarks([
      ...bookmarks, { time: currentTime, display: elapsedTime, image: ImageUrl },
    ])
  }

  const handlePlayVideo = (url) => {
    setState({ ...state, url: url })
  }
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">React Video Player</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="md">
        <div
          onMouseMove={handleMouseMove}
          ref={playerControlRef}
          className={classes.playerWrapper}
        >
          <ReactPlayer
            ref={playerRef}
            width="100%"
            height="100%"
            url={url ? url : urlData[0]}
            playing={playing}
            muted={muted}
            volume={volume}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            config={{
              file: {
                attributes: {
                  crossOrigin: "anonymous",
                },
              },
            }}
          />
          <PlayerControls
            ref={controlsRef}
            onPlayPause={handlePlayPause}
            playing={playing}
            url={url}
            muted={muted}
            played={played}
            onMute={handleMute}
            onRewind={handleRewind}
            onFastForward={handleFastForward}
            volume={volume}
            onVolumechange={handleVolumeChange}
            onVolumeSeekUp={handleVolumeSeekUp}
            playbackRate={playbackRate}
            playbackRateChange={handelPlaybackRateChange}
            onToggleFullScreen={fullScreenToggle}
            onSeek={handleSeekChange}
            onSeekMouseDown={handleSeekMouseDown}
            onSeekMouseUp={handleSeekMouseUp}
            elapsedTime={elapsedTime}
            totalDuration={totalDuration}
            onChangeDisplayTimeFormat={handleDispalyTimeFormat}
            onBookmard={addBookmark}
          />
        </div>

        <Grid container direction="row" style={{ marginTop: 10 }} spacing={3} xs={12}>
          <Grid xs={12}>
            <Typography variant="h6" color="primary">Play List</Typography>
          </Grid>
          {urlData.map((url, index) => (
            <Grid key={index} item xs={3}>
              <Paper
                onClick={() => {
                  handlePlayVideo(url);
                }}
                elevation={3}
              >
                <Typography variant="body2" align="center" style={{ padding: 8 }}>
                  {url.split('/').pop().split('#').shift().split('?').shift()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {bookmarks.length > 0 && (
          <Grid container style={{ marginTop: 20 }} spacing={3}>
            <Grid xs={12}>
              <Typography variant="h6" color="primary">BookMarks</Typography>
            </Grid>
            {bookmarks.map((item, index) => (
              <Grid key={index} item>
                <Paper
                  onClick={() => {
                    playerRef.current.seekTo(item.time);
                    controlsRef.current.style.visibility = "visible";

                    setTimeout(() => {
                      controlsRef.current.style.visibility = "hidden";
                    }, 1000);
                  }}
                  elevation={3}
                >
                  <img crossOrigin="anonymous" src={item.image} />
                  <Typography variant="body2" align="center">
                    Bookmark at {item.display}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>)}
        <canvas ref={canvasRef} />
      </Container>
    </>
  );
}

export default App;
