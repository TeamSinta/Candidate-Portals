"use client";
import Accordion from "@yoopta/accordion";
import ActionMenuList, {
    DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Blockquote from "@yoopta/blockquote";
import Callout from "@yoopta/callout";
import Divider from "@yoopta/divider";
import YooptaEditor, {
    createYooptaEditor,
    YooptaContentValue,
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
import NextLink from "next/link";
import { Button } from "./ui/button";
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
    sectionId,
    editable = true,
    onChange,
    title,
    onTitleChange,
}: {
    content: YooptaContentValue;
    sectionId: string;
    editable: boolean;
    onChange: (data: YooptaContentValue) => void;
    title: string;
    onTitleChange: (value: string) => void;
}) {
    const editor = useMemo(() => createYooptaEditor(), []);

    return (
        <div className="mt-4">
            <div className="flex flex-row items-center justify-end gap-4 text-sm">
                <label className="font-semibold">Content Title</label>
                <input
                    type="text"
                    placeholder={"Title"}
                    className="min-w-[30rem] rounded-md border-2 border-gray-200 p-2 disabled:border-0 disabled:bg-transparent"
                    onChange={(e) => onTitleChange(e.target.value)}
                    value={title}
                    disabled={!editable}
                />
            </div>
            <NextLink href={`/editor/${sectionId}`}>
                <Button variant={"outline"}>Create Block</Button>
            </NextLink>
            <div className="my-4 flex w-full flex-col items-center justify-center border-2 p-4">
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
                />
            </div>
        </div>
    );
}
