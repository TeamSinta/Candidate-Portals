import { YooptaContentValue } from "@yoopta/editor";

export interface UrlContentData {
    url: string;
}
export type ContentDataType = YooptaContentValue | UrlContentData;

export function isUrlContentData(
    data: ContentDataType,
): data is UrlContentData {
    return "url" in data;
}

export function isYooptaContentData(
    data: ContentDataType,
): data is YooptaContentValue & { title: string } {
    const keys = Object.keys(data) as Array<keyof typeof data>;
    return (
        typeof data === "object" &&
        data !== null &&
        keys.every(
            (key) =>
                typeof data[key] === "object" &&
                "id" in data[key] &&
                typeof data[key].id === "string" &&
                "meta" in data[key] &&
                typeof data[key].meta === "object",
            // "align" in data[key].meta &&
            // typeof data[key].meta.align === "string" &&
            // "depth" in data[key].meta &&
            // typeof data[key].meta.depth === "number" &&
            // "order" in data[key].meta &&
            // typeof data[key].meta.order === "number",
        )
    );
}
