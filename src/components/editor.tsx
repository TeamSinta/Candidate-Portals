"use client";
import YooptaEditor, {
    createYooptaEditor,
    YooptaContentValue,
    YooptaOnChangeOptions,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import { Button } from "@/components/ui/button";
import { updateSectionContent } from "@/server/actions/portal/mutations";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import ActionMenuList, {
    DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import Embed from "@yoopta/embed";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import { useMemo, useState } from "react";
import { SectionContentType } from "@/server/db/schema";
import Table from "@yoopta/table";
import Blockquote from "@yoopta/blockquote";
import Accordion from "@yoopta/accordion";
import Divider from "@yoopta/divider";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import File from "@yoopta/file";
import Callout from "@yoopta/callout";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import {
    Bold,
    Italic,
    CodeMark,
    Underline,
    Strike,
    Highlight,
} from "@yoopta/marks";
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
    // portalId,
    sectionId,
    editable = true,
    onChange,
    onTitleChange,
}: {
    content: YooptaContentValue;
    sectionId: string;
    editable: boolean;
    onChange: (data: YooptaContentValue) => void;
    onTitleChange: (value: string) => void;
}) {
    const editor = useMemo(() => createYooptaEditor(), []);
    // const handleSave = async () => {
    //     await updateSectionContent({
    //         id: sectionId,
    //         portalId: portalId,
    //         title: "title",
    //         content: editor.getEditorValue(),
    //         contentType: SectionContentType.YOOPTA,
    //         index: 1,
    //     });
    // };

    return (
        <div className="my-8 flex w-full items-center justify-center border-2 p-4">
            <YooptaEditor
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
            {/* {editable && <Button onClick={handleSave}>Save</Button>} */}
        </div>
    );
}
