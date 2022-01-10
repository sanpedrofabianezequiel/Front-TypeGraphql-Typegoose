import { Typography,Grid,Card,CardActionArea,CardContent,CardMedia,Hidden} from '@material-ui/core';
import Link from 'next/link';
import { makeStyles,Theme } from '@material-ui/core';
import { Stream } from 'lib/graphql/createStream.graphql';

interface Props {
    streams:Stream [];
}

export default function Posts(props:Props){
    const styles  = useStyles();
    const {streams} =  props;

    return (
        <Grid container className = {styles.container} spacing= {4}>
            {streams.map((post)=>(
                <Grid item  key ={post._id} xs={12} md ={6} >
                    <Link href={`/streams/${post._id}`}>
                    </Link>
                </Grid>
            ))}

        </Grid>
    )
}

const useStyles = makeStyles((theme:Theme)=>({
    container:{
        marginTop:theme.spacing(4)
    },
    card:{
        display:'flex'
    },
    cardDetails:{
        flex:1,
    },
    cardMEDIA:{
        width:160,
    }
}))