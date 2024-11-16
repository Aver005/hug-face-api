import Messages from "@/widgets/Messages/Messages";
import { Container, Flex } from "@mantine/core";

export default function Home() 
{
    return (
        <>
            <Container size='md' ps={0} pe={0}>
                <Messages />
            </Container>
        </>
    );
}