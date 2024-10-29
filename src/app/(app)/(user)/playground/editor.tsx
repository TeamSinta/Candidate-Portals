"use client";
import YooptaEditor, {
    createYooptaEditor,
    YooptaContentValue,
    YooptaOnChangeOptions,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
// import Blockquote from '@yoopta/blockquote';
import { useMemo, useState } from "react";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import ActionMenuList, {
    DefaultActionMenuRender,
} from "@yoopta/action-menu-list";

const plugins = [Paragraph, NumberedList, BulletedList, TodoList];
const tools = {
    ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList,
    },
};

export default function Editor() {
    const editor = useMemo(() => createYooptaEditor(), []);
    const [value, setValue] = useState<YooptaContentValue>();

    const onChange = (
        value: YooptaContentValue,
        options: YooptaOnChangeOptions,
    ) => {
        setValue(value);
    };

    return (
        <div className="my-8 w-full border-2 bg-slate-200 p-4">
            <YooptaEditor
                editor={editor}
                placeholder="Type text.."
                value={value}
                onChange={onChange}
                // here we go
                plugins={plugins}
                tools={tools}
            />
        </div>
    );
}
