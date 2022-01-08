import Document,{DocumentContext, DocumentInitialProps, Head,Html,Main,NextScript} from "next/document";
import { ServerStyleSheets } from "@material-ui/core";
import React from "react";

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        //render the app and get the context of the page with collected side effects
        const sheets =  new ServerStyleSheets();
        const originalRenderPage =  ctx.renderPage; //We asign the last value Render

        ctx.renderPage = ()=> 
                            originalRenderPage({
                                enhanceApp: (App)=> (props) => sheets.collect(<App {...props} />)
                            });

        const initialProps = await Document.getInitialProps(ctx);
        return {...initialProps,styles:[
            ...React.Children.toArray(initialProps.styles),
            sheets.getStyleElement()
        ]};
    }

    render(): JSX.Element {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument;