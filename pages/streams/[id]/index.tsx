import Container from '@material-ui/core/Container';

import Hero from 'components/Hero';
import Content from 'components/Content';
import { useStreamQuery,Stream } from 'lib/graphql/stream.graphql';


export default function StreamDetail({id}){
    const {data,loading} =  useStreamQuery({
        variables:{
            streamId:id
        }
    })

    if(!loading && data && data.getStream){
        return (
            <Container maxWidth="lg" >
                <Hero stream= {data.getStream as Stream} />
                <Content  url ={data.getStream.url} />
            </Container>
        )
    }

    return null;
}

StreamDetail.getInitialProps = ({query:{id}})=>{
    return {id};
}
