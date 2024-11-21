"use client"; // Mark this as a client-side component
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { updatePortalData } from "@/server/actions/portal/queries";

function TitleEditorClient({
    initialTitle,
    portalId,
}: {
    initialTitle: string;
    portalId: string;
}) {
    const [title, setTitle] = useState(initialTitle || "");
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus the input automatically when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    async function handleSave() {
        if (!title.trim()) {
            toast("Title is required");
            setTitle(initialTitle); // Revert to the initial title if empty
            return;
        }

        try {
            await updatePortalData(portalId, { title });
            toast.success("Title updated successfully");
        } catch {
            toast.error("Failed to update title");
        }
    }

    function handleBlur() {
        setIsEditing(false);
        handleSave(); // Save when the user clicks away
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            setIsEditing(false);
            handleSave(); // Save when the user presses Enter
        }
    }

    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    className="rounded border-2 border-gray-200 p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter title here"
                />
            ) : (
                <div
                    className="cursor-pointer text-xl font-semibold"
                    onDoubleClick={() => setIsEditing(true)}
                >
                    {title || "Untitled"}{" "}
                    {/* Show "Untitled" if title is empty */}
                </div>
            )}
        </div>
    );
}

export default TitleEditorClient;
