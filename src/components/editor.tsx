"use client";
import ContentEditorPage from "@/app/(app)/(user)/editor/content/[sectionId]/page";
import { cn, generateGUID } from "@/lib/utils";
import Accordion from "@yoopta/accordion";
import ActionMenuList, {
    DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Blockquote from "@yoopta/blockquote";
import Callout from "@yoopta/callout";
import Divider from "@yoopta/divider";
import YooptaEditor, {
    createYooptaEditor,
    YooEditor,
    YooptaContentValue,
    YooptaPlugin,
} from "@yoopta/editor";
import Embed from "@yoopta/embed";
import File from "@yoopta/file";
import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import {
    Bold,
    CodeMark,
    Highlight,
    Italic,
    Strike,
    Underline,
} from "@yoopta/marks";
import Paragraph, { ParagraphCommands } from "@yoopta/paragraph";
import Table from "@yoopta/table";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import { useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";

function replaceText(text: string): string {
    // Replace {{name}} with a specified name
    text = text.replace(/{{name}}/g, "John Doe");

    // Replace {{email address}} with a corresponding specified email address
    text = text.replace(/{{email address}}/g, "john.doe@example.com");

    return text;
}

const plugins = [
    Paragraph.extend({
        renders: {
            paragraph: ({ attributes, children, element }) => {
                // const text = element?.children?.[0]?.text as string;
                const text = children[0]?.props?.text?.text as string;
                if (text) {
                    console.log("text", text, typeof text);
                    const replacedText = replaceText(text);
                    // const updatedChild = {
                    //     ...element.children[0],
                    //     text: replacedText,
                    // };
                    if (replacedText === text) {
                        // return element;
                        return <p {...attributes}>{children}</p>;
                    }
                    const updatedChild = {
                        ...children[0].props,
                        text: { text: replacedText },
                    };
                    // const newChildren = [
                    //     updatedChild,
                    //     ...element.children.slice(1),
                    // ];
                    children[0].props.text.text = replacedText;
                    console.log("ELEMENT", element);
                    console.log("CHILDREN", children);
                    return (
                        <p {...attributes} {...element}>
                            {children}
                        </p>
                    );
                }
                return <p {...attributes}>{children}</p>;
            },
        },
    }),
    Table,
    NumberedList,
    BulletedList,
    TodoList,
    Embed,
    Blockquote,
    Accordion,
    Divider,
    Image,
    Link,
    File,
    Callout,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
];
const marks = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

const tools = {
    Toolbar: {
        tool: Toolbar,
        render: DefaultToolbarRender,
    },
    ActionMenu: {
        tool: ActionMenuList,
        render: DefaultActionMenuRender,
    },
    LinkTool: {
        tool: LinkTool,
        render: DefaultLinkToolRender,
    },
};

export default function Editor({
    content,
    editable = true,
    onChange,
    title,
    onTitleChange,
    className,
    replacements = {},
}: {
    content: YooptaContentValue;
    editable: boolean;
    onChange: (data: YooptaContentValue) => void;
    title: string;
    onTitleChange: (newTitle: string) => void;
    replacements?: Record<string, string>;
    className?: string;
}) {
    const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // If the last content block is deleted, go back to the title
        if (Object.keys(content).length === 0) {
            titleRef?.current?.focus();
        }
    }, [content]);

    function createFirstBlock() {
        ParagraphCommands.insertParagraph(editor, { focus: true });
    }
    const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            // If there's no content on the editor, you're unable to focus. So you gotta create a Content Block first.
            if (editor.isEmpty()) {
                // console.log("CREATE");
                createFirstBlock();
            } else {
                editor.focus();
            }
        }
    };

    if (!editor) {
        return <Skeleton />;
    }
    return (
        <div
            className={cn(
                "my-4 flex w-full flex-col items-center justify-center",
                className,
            )}
        >
            <div className="w-1/2">
                <input
                    type="text"
                    placeholder={"Section Title"}
                    className="border-0 p-0 text-4xl font-semibold focus:border-0 focus:outline-none"
                    onChange={(e) => onTitleChange(e.target.value)}
                    value={title}
                    onKeyDown={handleEnterPress}
                    autoFocus={Object.keys(content).length === 0}
                    ref={titleRef}
                />
                {Object.keys(content).length === 0 && (
                    <div className="my-4 text-gray-700">
                        <div>
                            Press{" "}
                            <b
                                className="cursor-pointer rounded-sm bg-slate-200 px-2 py-1 text-sm font-semibold"
                                onClick={createFirstBlock}
                            >
                                Enter
                            </b>{" "}
                            to get started.
                        </div>
                        <div>
                            Type <b>/</b> to see what blocks are available.
                        </div>
                    </div>
                )}
                <YooptaEditor
                    key={editable ? "editable" : "readOnly"}
                    editor={editor}
                    placeholder="Type / to open menu"
                    value={content}
                    onChange={onChange}
                    // here we go
                    plugins={plugins}
                    tools={tools}
                    readOnly={!editable}
                    marks={marks}
                    style={{
                        width: "100%",
                    }}
                />
            </div>
        </div>
    );
}
