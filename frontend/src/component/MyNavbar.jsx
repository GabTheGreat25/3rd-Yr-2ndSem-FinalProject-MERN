import React from 'react'
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import logo from '../assets/logo-main-white-transparent.png'

const useStyles = makeStyles((theme) => ({
  logo: {
    marginRight: theme.spacing(2),
    width: '70px', // adjust the width as desired
    height: 'auto', // adjust the height to preserve aspect ratio
  },
  loginBtn: {
    marginLeft: 'auto',
    marginRight: theme.spacing(2),
  },
}))

export default function MyNavbar() {
  const classes = useStyles()

  return (
    <AppBar position="static">
      <Toolbar>
        <img src={logo} alt="Logo" className={classes.logo} />
        <Typography variant="h6">RedFrame Camera Rentals</Typography>
        <Button color="inherit" className={classes.loginBtn}>
          Login
        </Button>
        <Button color="inherit">Signup</Button>
      </Toolbar>
    </AppBar>
  )
}
