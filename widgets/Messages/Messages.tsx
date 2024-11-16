'use client'
import { Flex, ScrollArea, Image } from '@mantine/core';
import React, { useEffect, useState, useRef } from 'react';
import { HfInferenceEndpoint, HfInference } from "@huggingface/inference";
import { Editor } from '../Editor/Editor';
import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import * as styles from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Hero from '../Hero/Hero';

const client = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);
// const client = new HfInferenceEndpoint(process.env.NEXT_PUBLIC_ENDPOINT_URL);

const Messages: React.FC = () => 
{
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [responseText, setResponseText] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const sendMessage = async (text: string) => 
    {
        const userMessage = { role: "user", content: text };
        setMessages(prev => [...prev, userMessage]);

        const stream = client.chatCompletionStream({
            model: "Qwen/Qwen2.5-Coder-32B-Instruct",
            messages: [...messages, userMessage],
            temperature: 0.8,
            max_tokens: 10240,
            top_p: 0.7,
        });

        let out = "";
        for await (const chunk of stream) 
        {
            if (chunk.choices && chunk.choices.length > 0) 
            {
                const newContent = chunk.choices[0].delta.content;
                out += newContent;
                setResponseText(out);
            }
        }

        setResponseText('');
        setMessages(prev => [...prev, { role: "assistant", content: out }]);
    };

    const clearMessages = () => 
    {
        setMessages([]);
        setResponseText('');
    };

    const renderMessage = (msg: { role: string, content: string }, index: any) => 
    {
        const isCodeBlock = msg.content.includes('```');
        const avatarSrc = msg.role === 'user' ? '/images/User.png' : '/images/Bot.png';
        const textAlign = msg.role === 'user' ? 'right' : 'left';
        const justify = msg.role === 'user' ? 'flex-end' : 'flex-start';

        let content;
        if (isCodeBlock) 
        {
            const codeContent = msg.content.replace(/```[\s\S]*?\n([\s\S]*?)\n```/, '$1');
            const language = msg.content.match(/```(\w+)/)?.[1] || 'plaintext';
            content = (
                <SyntaxHighlighter 
                    wrapLongLines={true} 
                    wrapLines={true} 
                    language={language} 
                    style={styles.atomOneDark}
                >
                    {codeContent}
                </SyntaxHighlighter>
            );
        } else {
            content = <Markdown>{msg.content}</Markdown>;
        }

        return (
            <Flex key={index} justify={justify} ta={textAlign} align='flex-start' direction="row" mb='10px' w='96%'>
                {msg.role === 'assistant' && 
                    <Image 
                        src={avatarSrc} 
                        alt={`${msg.role} avatar`} 
                        width={48} height={48} 
                        mr='lg'
                    />
                }
                <div>
                    <strong>{msg.role}:</strong>
                    {content}
                </div>
                {msg.role === 'user' && 
                    <Image 
                        src={avatarSrc} 
                        alt={`${msg.role} avatar`} 
                        width={48} height={48} 
                        ml='lg'
                    />
                }
            </Flex>
        );
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages, responseText]);

    return (
        <Flex direction="column" h='100vh' p="md">
            {messages.length === 0 && <Hero />}
            <Flex flex={1} pos='relative' direction='column' mt='md' style={{overflowY: 'auto'}}>
                {messages.map((msg, index) => renderMessage(msg, index))}
                {responseText && renderMessage({ role: "assistant", content: responseText }, -1)}
            </Flex>
            <Editor 
                sendMessage={sendMessage} 
                clearMessages={clearMessages} 
                messages={messages}
            />
        </Flex>
    );
};

export default Messages;