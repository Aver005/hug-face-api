'use client'

import React, { useState, useEffect, KeyboardEventHandler } from 'react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';

import { RichTextEditor, Link } from '@mantine/tiptap';
import { Button, Flex, Group } from '@mantine/core';
import { useMediaQuery } from 'react-responsive';
import { useEditor } from '@tiptap/react';

import { IconTrashXFilled, IconBallpenFilled, IconSend2, 
    IconBubbleX, IconTrashX, IconBallpen 
} from '@tabler/icons-react';
import './Editor.css';

const content = '';

export function Editor({sendMessage, clearMessages, messages}: any) 
{
    const editor = useEditor(
    {
        extensions: 
        [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content,
    });

    const isDesktop = useMediaQuery({ minWidth: 992 });
    const [showControls, setShowControls] = useState(isDesktop);
    useEffect(() => {setShowControls(isDesktop)}, [isDesktop]);

    const send = () =>
    {
        if (!editor) return;
        const text = editor.getText();
        if (text.trim().length === 0) return;
        sendMessage(text);
        editor.commands.clearContent();
    }

    const clear = () => {editor?.commands.clearContent();}

    const handleEnter = (e: any) =>
    {
        if (!editor) return;
        if (e.key !== 'Enter' || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (editor.getHTML().endsWith('<p></p><p></p>')) send();
    }

    if (!editor) return <>Error</>

    return (
        <RichTextEditor editor={editor} w='100%' mt='md' mb='md'>
            <RichTextEditor.Content onKeyDown={handleEnter} />
            
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <Flex 
                    className='markdown-controls' 
                    justify='space-between' 
                    wrap='wrap' 
                    w='100%' gap='xs'
                    style={{ display: showControls ? 'flex' : 'none' }}
                >
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                        <RichTextEditor.Subscript />
                        <RichTextEditor.Superscript />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignJustify />
                        <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Undo />
                        <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>
                </Flex>
                
                <Flex gap='sm' w='100%' justify='space-between'>
                    <Group>
                        <Button onClick={clearMessages}>
                            {messages.length > 0 ? <IconBubbleX /> : <IconBubbleX />}
                        </Button>
                    </Group>
                    <Group>
                        <Button onClick={clear}>
                            {editor.getText().length > 0 ? <IconTrashXFilled /> : <IconTrashX />}
                        </Button>
                        <Button onClick={() => setShowControls(!showControls)}>
                            {showControls ? <IconBallpenFilled /> : <IconBallpen />}
                        </Button>
                        <Button onClick={send}>
                            <IconSend2 />
                        </Button>
                    </Group>
                </Flex>
            </RichTextEditor.Toolbar>
        </RichTextEditor>
    );
}