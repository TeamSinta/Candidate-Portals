"use client";
import { cn } from "@/lib/utils";
import ActionMenuList, {
    DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import YooptaEditor, {
    createYooptaEditor,
    YooEditor,
    YooptaContentValue,
} from "@yoopta/editor";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import {
    Bold,
    CodeMark,
    Highlight,
    Italic,
    Strike,
    Underline,
} from "@yoopta/marks";
import { ParagraphCommands } from "@yoopta/paragraph";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import { useEffect, useMemo, useRef } from "react";
import { Skeleton } from "./ui/skeleton";
import Accordion from "@yoopta/accordion";
import Blockquote from "@yoopta/blockquote";
import Callout from "@yoopta/callout";
import Divider from "@yoopta/divider";
import Embed from "@yoopta/embed";
import File from "@yoopta/file";
import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import Paragraph from "@yoopta/paragraph";
import Table from "@yoopta/table";
export const plugins = [
    Paragraph,
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
}: {
    content: YooptaContentValue;
    editable: boolean;
    onChange: (data: YooptaContentValue) => void;
    title: string;
    onTitleChange: (newTitle: string) => void;
    className?: string;
}) {
    const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
    const titleRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // If the last content block is deleted, go back to the title
        if (Object.keys(content).length === 0) {
            titleRef?.current?.focus();
        }
    }, [content]);

    useEffect(() => {
        if (titleRef.current) {
            const textarea = titleRef.current;
            textarea.style.height = "auto"; // Reset height to auto for correct calculation
            textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to fit content
        }
    }, [title]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onTitleChange(e.target.value);
    };

    function createFirstBlock() {
        ParagraphCommands.insertParagraph(editor, { focus: true });
    }
    const handleEnterPress = (
        event: React.KeyboardEvent<HTMLTextAreaElement>,
    ) => {
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
                <textarea
                    // type="text"
                    placeholder={"Section Title"}
                    className="w-full resize-none overflow-hidden text-pretty border-0 p-0 text-4xl font-semibold focus:border-0 focus:outline-none"
                    // onChange={(e) => onTitleChange(e.target.value)}
                    onChange={handleInputChange}
                    value={title}
                    onKeyDown={handleEnterPress}
                    autoFocus={Object.keys(content).length === 0}
                    ref={(el) => {
                        titleRef.current = el;
                    }}
                />
                {Object.keys(content).length === 0 && (
                    <div className="my-4 text-sm  text-gray-700">
                        <div>
                            Press{" "}
                            <b
                                className="cursor-pointer rounded-sm bg-slate-200 px-2 py-1 text-xs font-semibold"
                                onClick={createFirstBlock}
                            >
                                Enter
                            </b>{" "}
                            to get started.
                        </div>
                        <div>
                            Type <b>/</b> to see what blocks are available.
                        </div>
                        <div className="mt-4">
                            Type{" "}
                            <b className=" rounded-sm bg-gray-200 px-2 py-1 font-mono text-xs font-bold text-gray-500">{`{{name}}`}</b>{" "}
                            or{" "}
                            <b className="rounded-sm bg-gray-200 px-2 py-1 font-mono text-xs font-bold text-gray-500">{`{{email}}`}</b>{" "}
                            to personalize your content with your
                            candidate&apos;s details.
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
                {/* {JSON.stringify(content)} */}
            </div>
        </div>
    );
}
