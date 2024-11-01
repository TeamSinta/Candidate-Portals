"use client";
import YooptaEditor, {
    createYooptaEditor,
    YooptaContentValue,
    YooptaOnChangeOptions,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
// import Blockquote from '@yoopta/blockquote';
import { Button } from "@/components/ui/button";
import { updateSectionContent } from "@/server/actions/template/mutations";
import ActionMenuList, {
    DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Embed from "@yoopta/embed";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import { useMemo, useState } from "react";

const plugins = [Paragraph, NumberedList, BulletedList, TodoList, Embed];
const tools = {
    ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList,
    },
};

export default function Editor({
    content,
    templateId,
    sectionId,
    editable = true,
}: {
    content: YooptaContentValue;
    templateId: string;
    sectionId: string;
    editable: boolean;
}) {
    const editor = useMemo(() => createYooptaEditor(), []);
    const [value, setValue] = useState<YooptaContentValue>(content);

    const handleSave = async () => {
        await updateSectionContent({
            id: sectionId,
            templateId: templateId,
            title: "title",
            content: editor.getEditorValue(),
        });
    };

    const onChange = (
        value: YooptaContentValue,
        options: YooptaOnChangeOptions,
    ) => {
        setValue(value);
    };

    return (
        <div className="my-8 flex w-full items-center justify-center border-2 bg-slate-200 p-4">
            <YooptaEditor
                editor={editor}
                placeholder="Type text.."
                value={value}
                onChange={onChange}
                // here we go
                plugins={plugins}
                tools={tools}
                readOnly={!editable}
            />
            {editable && <Button onClick={handleSave}>Save</Button>}
        </div>
    );
}
