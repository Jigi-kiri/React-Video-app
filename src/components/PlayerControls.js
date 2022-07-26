import * as React from "react";
import {
  Button,
  Grid,
  IconButton,
  Slider,
  Tooltip,
  Typography
} from "@material-ui/core";
import {
  Bookmarks,
  FastForward,
  FastRewind,
  Fullscreen,
  Pause,
  PlayArrow,
  VolumeOff,
  VolumeUp
} from "@material-ui/icons"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import Popover from '@material-ui/core/Popover';

const useStyle = makeStyles({
  gridWrapper: {
    display: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  playerWrapper: {
    width: "100%",
    position: "relative",
  },
  controlsWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0,0)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1
  },
  controlIcons: {
    color: "#777",
    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)"
    }
  },
  bottomIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff"
    }
  },
  volumeSlider: {
    width: 100
  }
})

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const PlayerControls = ({
  onPlayPause,
  playing,
  onRewind,
  onFastForward,
  onMute,
  muted,
  played,
  volume,
  onVolumechange,
  onVolumeSeekUp,
  playbackRate,
  playbackRateChange,
  onToggleFullScreen,
  onSeek,
  onSeekMouseDown,
  onSeekMouseUp,
  elapsedTime,
  totalDuration,
  onChangeDisplayTimeFormat,
  onBookmard,
  url
}, ref) => {
  const classes = useStyle();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopOver = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'playbackrate-popover' : undefined;
  return (
    <div className={classes.controlsWrapper} ref={ref}>
      {/* Top Controls */}
      <Grid
        container
        className={classes.gridWrapper}
        style={{ padding: 16 }}
      >
        <Grid item>
          <Typography variant="h5" style={{ color: "white" }}>
            {url ? url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(".")) : ""}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={onBookmard}
            variant="contained"
            color="primary"
            startIcon={<Bookmarks />}
          >
            Bookmarks
          </Button>
        </Grid>
      </Grid>

      {/* Middle Controls */}

      <Grid container display="row" alignItems="center" justifyContent="center">
        <IconButton onClick={onRewind} className={classes.controlIcons} aria-label="required">
          <FastRewind fontSize="inherit" />
        </IconButton>
        <IconButton
          onClick={onPlayPause}
          className={classes.controlIcons}
          aria-label="required"
        >
          {playing ? (
            <Pause fontSize="inherit" />
          ) : (
            <PlayArrow fontSize="inherit" />
          )}
        </IconButton>
        <IconButton
          onClick={onFastForward}
          className={classes.controlIcons}
          aria-label="required"
        >
          <FastForward fontSize="inherit" />
        </IconButton>
      </Grid>

      {/* Bottom Controls */}
      <Grid container className={classes.gridWrapper} style={{ padding: 16 }}>
        <Grid item xs={12}>
          <PrettoSlider
            min={0}
            max={100}
            value={parseInt(played * 100)}
            ValueLabelComponent={(props) => (
              <ValueLabelComponent {...props} value={elapsedTime} />)}
            onChange={onSeek}
            onMouseDown={onSeekMouseDown}
            onChangeCommitted={onSeekMouseUp}
          />
        </Grid>
        <Grid item>
          <Grid container className={classes.gridWrapper}>
            <IconButton className={classes.bottomIcons} onClick={onPlayPause}>
              {playing ? (
                <Pause fontSize="inherit" />
              ) : (
                <PlayArrow fontSize="inherit" />
              )}
            </IconButton>
            <IconButton onClick={onMute} className={classes.bottomIcons}>
              {muted ? (
                <VolumeOff fontSize="large" />
              ) : (
                <VolumeUp fontSize="large" />
              )}
            </IconButton>
            <Slider
              min={0}
              max={100}
              value={volume * 100}
              className={classes.volumeSlider}
              onChange={onVolumechange}
              onChangeCommitted={onVolumeSeekUp}
            />
            <Button
              onClick={onChangeDisplayTimeFormat}
              variant="text"
              style={{ color: "white", marginLeft: 16 }}
            >
              <Typography>{elapsedTime}/{totalDuration}</Typography>
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Button variant="text" className={classes.bottomIcons} onClick={handlePopOver}>
            <Typography>{playbackRate}x</Typography>
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <Grid container direction="column-reverse">
              {[0.5, 1, 1.5, 2].map((rate) => (
                <Button
                  onClick={() => playbackRateChange(rate)}
                  variant="text">
                  <Typography color={rate === playbackRate ? "secondary" : "default"}>
                    {rate}
                  </Typography>
                </Button>))}
            </Grid>
          </Popover>

          <IconButton onClick={onToggleFullScreen} className={classes.bottomIcons}>
            <Fullscreen fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default React.forwardRef(PlayerControls)