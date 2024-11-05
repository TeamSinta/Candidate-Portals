import React from "react";

function UrlInput({ title, url }: { title: string; url: string }) {
    function InputField({
        label,
        placeholder,
    }: {
        label: string;
        placeholder: string;
    }) {
        return (
            <div className="flex flex-row items-center gap-4 text-sm">
                <label className="font-semibold">{label}</label>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="min-w-[30rem] rounded-md border-2 border-gray-200 p-2"
                />
            </div>
        );
    }

    return (
        <>
            <InputField
                label="Content Title"
                placeholder="Careers Page Overview"
            />
            <InputField
                label="Content Link"
                placeholder="https://www.aptible.com/culture-hub/careers"
            />
            <InputField label="Expected Engagement Time" placeholder="~5min" />
        </>
    );
}

export default UrlInput;
