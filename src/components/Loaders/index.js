import Spinner from "react-bootstrap/Spinner";
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ViewBookLoader = () => {
    return (
        <div className="text-center my-3 py-3">
            <Spinner animation="border" variant="primary" />
        </div>
    )
}
const ApiLoader = (props) => {
    const classes = useStyles();
    return (
        <Backdrop className={classes.backdrop} open={props.loading}>
            <CircularProgress color="primary" />
        </Backdrop>
    )
}
export { ViewBookLoader,ApiLoader }