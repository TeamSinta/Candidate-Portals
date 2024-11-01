"use client";
import YooptaEditor, {
    createYooptaEditor,
    YooptaContentValue,
    YooptaEventChangePayload,
    YooptaOnChangeOptions,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
// import Blockquote from '@yoopta/blockquote';
import { useEffect, useMemo, useState } from "react";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import ActionMenuList, {
    DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Embed, { EmbedCommands, EmbedElement } from "@yoopta/embed";
import { useDebounce } from "@/hooks/use-debounce";
import { updateSectionContent } from "@/server/actions/template/mutations";
import { Button } from "@/components/ui/button";

const plugins = [Paragraph, NumberedList, BulletedList, TodoList, Embed];
const tools = {
    ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList,
    },
};

export default function Editor({
    content,
    editable = true,
}: {
    content: YooptaContentValue;
    editable: boolean;
}) {
    const editor = useMemo(() => createYooptaEditor(), []);
    const [value, setValue] = useState<YooptaContentValue>(content);

    const handleSave = async () => {
        await updateSectionContent({
            id: "1",
            templateId: "a2710960-129a-4823-aaa8-ee26afbeba77",
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
