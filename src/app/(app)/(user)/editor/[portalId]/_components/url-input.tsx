import React from "react";
import { UrlContentData } from "../utils/types";

function InputField({
    fieldKey,
    value,
    label,
    placeholder,
    onChange,
}: {
    fieldKey: string;
    value: string;
    label: string;
    placeholder: string;
    onChange: (key: string, value: string) => void;
}) {
    return (
        <div className="flex flex-row items-center gap-4 text-sm">
            <label className="font-semibold">{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                className="min-w-[30rem] rounded-md border-2 border-gray-200 p-2"
                onChange={(e) => onChange(fieldKey, e.target.value)}
                value={value}
            />
        </div>
    );
}

function UrlInput({
    title,
    url,
    onChange,
    onTitleChange,
}: {
    title: string;
    url: string;
    onChange: (key: string, value: string) => void;
    onTitleChange: (value: string) => void;
}) {
    return (
        <div className="my-4 flex flex-col items-end gap-4">
            <InputField
                fieldKey="title"
                value={title}
                label="Content Title"
                placeholder="Careers Page Overview"
                onChange={(key, value) => {
                    if (key === "title") onTitleChange(value);
                }}
            />
            <InputField
                fieldKey="url"
                value={url}
                label="Content Link"
                placeholder="https://www.aptible.com/culture-hub/careers"
                onChange={onChange}
            />
            <InputField
                fieldKey="engagement"
                value="0"
                label="Expected Engagement Time"
                placeholder="~5min"
                onChange={onChange}
            />
        </div>
    );
}

export default UrlInput;
