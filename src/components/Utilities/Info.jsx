import React,{useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Container from 'react-bootstrap/Container';


const useStyles = makeStyles((theme)=>({
  backdrop:{
    zIndex:100000
  },
  backdrop_comp:{
    display:"flex",
    minHeight:"200px",
    minWidth:"200px",
    background:"#FFF",
    alignItems:"center",
    justifyContent:"center"
  }
}))
export default function Info(props) {
  const [open,setOpen] = useState(props.open);
  const classes = useStyles();
  const handleClose = ()=>{
    setOpen(false);
  }
  return (
    <div>
      <Backdrop className={classes.backdrop}  open={open} onClick={handleClose}>
        <div className="d-flex align-items-center justify-content-center">
            <div className={classes.backdrop_comp}>
              {props.children}
            </div> 
        </div>
      </Backdrop>
    </div>
  );
}