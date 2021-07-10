import React, { useEffect, useRef, useState } from 'react';
import { Button, Container } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import Blockchain from './Blockchain';
import { useDispatch, useSelector } from 'react-redux';
import { ACTIONS, ReduxState } from '../redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import Backdrop from '@material-ui/core/Backdrop';
import Minting from './Minting';

type DappMainProps = { data: number };

export default function Dapp({ data }: DappMainProps) {
  const counterRef = useRef(0);
  counterRef.current++;

  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Container>
      <TxBackdrop />
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Blockchain" {...a11yProps(0)} />
          <Tab label="Minting" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Blockchain />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Minting />
      </TabPanel>
    </Container>
  );
}

function TxBackdrop() {
  const tx = useSelector((state: ReduxState) => state.tx);
  const dispatch = useDispatch();

  const useStyles = makeStyles((theme: any) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff'
    }
  }));

  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop + ' dapp'} open={tx}>
      <h2>Transaction in progress...</h2>
      <CircularProgress color="inherit" />
      <Button onClick={() => dispatch({ type: ACTIONS.TX_OFF })}>Force Close</Button>
    </Backdrop>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
