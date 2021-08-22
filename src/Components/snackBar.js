import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

export default function ConsecutiveSnackbars(props) {
  let { snackBarMsg } = props;

  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  useEffect(() => {
    showSnackBar(snackBarMsg);
  });

  const showSnackBar = (message) => () => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const ExitedSnackBar = () => {
    setMessageInfo(undefined);
  };

  const classes = useStyles();

  return (
    <div>
      {/* <Button onClick={showSnackBar('Message A')}>SNACK BAR</Button> */}
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={closeSnackBar}
        onExited={ExitedSnackBar}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              className={classes.close}
              onClick={closeSnackBar}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}