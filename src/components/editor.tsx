"use client";
import { cn } from "@/lib/utils";
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
import Paragraph from "@yoopta/paragraph";
import Table from "@yoopta/table";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import { useMemo } from "react";

const TitlePlugin = new YooptaPlugin({
    type: "title",
    render: ({}) => <input value={data.title} />, // Render title as read-only
    properties: {
        isDraggable: false, // Disable drag
        isEditable: false, // Disable edit
        isDeletable: false,
    },

    options: {},
});
const plugins = [
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
                    className="border-0 p-0 text-6xl font-semibold focus:border-0 active:border-0"
                    onChange={(e) => onTitleChange(e.target.value)}
                    value={title}
                />
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
                ></YooptaEditor>
            </div>
        </div>
    );
}
