import { useEffect } from "react";
import { Container,Typography,Box } from "@material-ui/core";


import Posts from '../../components/Post';
import { useStreamsQuery,Stream } from "lib/graphql/streams.graphql";


export default function Streams(){
    const {data,loading,refetch} =  useStreamsQuery({errorPolicy:'ignore'});

    useEffect(() => {
        refetch();
    }, [])


    return (
        <Container maxWidth="lg" >
            <Box  my={4}>
                <Typography variant="h4" >Streams</Typography>
            </Box>
            {
                !loading && data && data.getStreams && (
                    <Posts  streams={data.getStreams as Stream[]} />
                )
            }
        </Container>
    )
}