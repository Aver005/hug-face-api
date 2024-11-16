import type { Metadata } from "next";
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import './styles/Main.css';

import { ColorSchemeScript, createTheme, Flex, MantineProvider } from '@mantine/core';
import Waves from "@/widgets/Waves/Waves";

export const metadata: Metadata = 
{
    title: "Hug Face Web UI",
    description: "Created by Curly Aver",
};

const theme = createTheme({
    
});

export default function RootLayout({children,}: 
    Readonly<{children: React.ReactNode;}>) 
{
    return (
        <html lang="ru" suppressHydrationWarning>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <Waves options={{ fps: false, waves: 3, width: 200 }} />
                <main style={{position: 'relative', zIndex: 10}}>
                    <MantineProvider defaultColorScheme="dark" theme={theme}>
                        {children}
                    </MantineProvider>
                </main>
            </body>
        </html>
    );
}
