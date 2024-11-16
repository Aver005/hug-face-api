'use client'
import { Card, Flex, Text, Title } from '@mantine/core';
import React from 'react';

const Hero: React.FC = () =>
{

    return (
        <Flex 
            direction='column' 
            flex={1} 
            gap='xl'
            justify='center' 
            align='center'
            ta='center'
            bg='#ffffff35'
            c='#fff'
            style={{borderRadius: '4em', backdropFilter: 'blur(2em)'}}
            mt='4em'
        >
            <Title fz='6vh'>Kiviuly Chat: Hug Face API</Title>
            <Title fz='3.8vh' fw='normal'>Chat with the power of Hugging Face</Title>
        </Flex>
    );
}

export default Hero;