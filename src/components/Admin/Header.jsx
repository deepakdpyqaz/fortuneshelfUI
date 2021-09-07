import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import axios from 'axios';
import { logout } from '../../reducers/admin';
import { useAlert } from 'react-alert';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function AdminHeader(props) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const alert = useAlert();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const admin = useSelector((state) => state.admin.adminDetails);
  const logoutAdmin = () => {
    reactLocalStorage.remove("admin_token");
    dispatch(logout());
    axios.post("/manager/logout").then(() => {
      alert.success("Succesfully Logged Out");
      history.push("/manager/login");
    }).catch((err) => {
      alert.error("Error in logging out");
    })
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {(admin && admin.id) ? admin.firstname : "FortuneShelf Admin"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        {!(admin && admin.id) ?
          <List>
            <Link to="/admin/login">
              <ListItem button>
                <ListItemIcon><AccountCircleIcon color="primary" /></ListItemIcon>
                <ListItemText primary={"Login"} />
              </ListItem>
            </Link>
          </List>
          :
          <List>
            {admin.books ?
              <Link to="/admin/book">
                <ListItem button>
                  <ListItemIcon> <LibraryBooksIcon color="primary" /></ListItemIcon>
                  <ListItemText primary={"Books"} />
                </ListItem>
              </Link>
              : null}
            {admin.orders ?
              <Link to="/admin/order">
                <ListItem button>
                  <ListItemIcon> <LocalShippingIcon color="primary" /></ListItemIcon>
                  <ListItemText primary={"Orders"} />
                </ListItem>
              </Link>
              : null}
            {admin.payment ?
              <Link to="/admin/payment">
                <ListItem button>
                  <ListItemIcon> <CreditCardIcon color="primary" /></ListItemIcon>
                  <ListItemText primary={"Payments"} />
                </ListItem>
              </Link>
              : null}
            {admin.users ?
              <Link to="/admin/admins">
                <ListItem button>
                  <ListItemIcon> <SupervisorAccountIcon color="primary" /></ListItemIcon>
                  <ListItemText primary={"Admins"} />
                </ListItem>
              </Link>
              : null}
            <ListItem button onClick={logoutAdmin}>
              <ListItemIcon> <AccountCircleIcon color="primary" /></ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItem>
          </List>
        }
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
}
