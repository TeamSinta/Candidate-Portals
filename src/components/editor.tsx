"use client";
import YooptaEditor, {
    createYooptaEditor,
    YooptaContentValue,
    YooptaOnChangeOptions,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
// import Blockquote from '@yoopta/blockquote';
import { Button } from "@/components/ui/button";
import { updateSectionContent } from "@/server/actions/portal/mutations";
import ActionMenuList, {
    DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Embed from "@yoopta/embed";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import { useMemo, useState } from "react";
import { SectionContentType } from "@/server/db/schema";

const plugins = [Paragraph, NumberedList, BulletedList, TodoList, Embed];
const tools = {
    ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList,
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
                placeholder="Type text.."
                value={content}
                onChange={onChange}
                // here we go
                plugins={plugins}
                tools={tools}
                readOnly={!editable}
            />
            {/* {editable && <Button onClick={handleSave}>Save</Button>} */}
        </div>
    );
}
