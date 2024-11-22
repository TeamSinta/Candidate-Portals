import Accordion from "@yoopta/accordion";
import Blockquote from "@yoopta/blockquote";
import Callout from "@yoopta/callout";
import Divider from "@yoopta/divider";
import Embed from "@yoopta/embed";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import Image, { ImageUploadResponse } from "@yoopta/image";
import Link from "@yoopta/link";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import Paragraph from "@yoopta/paragraph";
import Table from "@yoopta/table";
import { toast } from "sonner";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const sampleDictionary = {
    name: "James Bob",
    email: "james.bob@teamsinta.com",
};
export function replaceText(
    text: string,
    dictionary?: Record<string, string>, // Make dictionary optional
): string {
    if (!dictionary) return text;
    // Iterate through the dictionary entries and replace placeholders in the text
    for (const [key, value] of Object.entries(dictionary)) {
        // Create a regular expression to match the placeholder
        const regex = new RegExp(`{{${key}}}`, "g");
        text = text.replace(regex, value);
    }
    return text;
}

export const plugins = [
    Paragraph,
    Table,
    NumberedList,
    BulletedList,
    TodoList,
    Embed,
    Blockquote,
    Accordion,
    Divider,
    Link,
    Callout,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
];

export function getExtendedImage(uploadFunction: any) {
    return Image.extend({
        options: {
            onUpload: async (file: File) => {
                if (!uploadFunction) {
                    toast.error("Image could not be uploaded");
                    return { src: "", alt: "" };
                }
                if (file.size > MAX_FILE_SIZE) {
                    toast.error(
                        "Image size is too large. Maximum size is 10MB",
                    );
                    return { src: "", alt: "" };
                }
                const formData = new FormData();
                formData.append(
                    "file",
                    new Blob([file], {
                        type: file.type,
                    }),
                );
                formData.append("fileName", file.name);
                formData.append("size", file.size.toString());
                formData.append("type", file.type);
                const { url, id, title } = await uploadFunction(formData);
                return {
                    src: url,
                    alt: title,
                } as ImageUploadResponse;
            },
        },
    });
}
// OBSOLETE
// export function getExtendedParagraph(
//     replacementDictionary: Record<string, string>,
// ) {
//     return Paragraph.extend({
//         renders: {
//             paragraph: ({ attributes, children, element }) => {
//                 const newChildren = children.map((child, index) => {
//                     const text = child.props?.text?.text as string;
//                     if (text) {
//                         const replacedText = replaceText(
//                             text,
//                             replacementDictionary,
//                         );
//                         console.log("Original text:", text);
//                         console.log("Replaced text:", replacedText);
//                         if (text !== replacedText) {
//                             return cloneElementDeep(child, {
//                                 ...child.props,
//                                 text: replacedText,
//                             });
//                         }
//                     }
//                     return child;
//                 });

//                 return (
//                     <p {...attributes} {...element}>
//                         {newChildren}
//                     </p>
//                 );
//             },
//         },
//     });
// }

// function cloneElementDeep(
//     element: React.ReactElement,
//     props: React.ComponentProps<any>,
// ): React.ReactElement {
//     if (React.isValidElement(element)) {
//         const { props: _, ref, ...restElementProps } = element.props;
//         const newProps = { ...props, ...restElementProps };
//         if (
//             ref &&
//             typeof ref !== "function" &&
//             typeof ref !== "string" &&
//             !(ref instanceof Object) &&
//             ref !== null
//         ) {
//             delete newProps.ref;
//         }
//         if (element.props.children) {
//             if (Array.isArray(element.props.children)) {
//                 return (
//                     <element.type {...newProps}>
//                         {element.props.children.map((child) =>
//                             cloneElementDeep(child, newProps),
//                         )}
//                     </element.type>
//                 );
//             } else {
//                 return (
//                     <element.type {...newProps}>
//                         {cloneElementDeep(element.props.children, newProps)}
//                     </element.type>
//                 );
//             }
//         } else {
//             return <element.type {...newProps} />;
//         }
//     }
//     return element;
// }
// export function getExtendedParagrph(
//     replacementDictionary: Record<string, string>,
// ) {
//     return Paragraph.extend({
//         renders: {
//             paragraph: ({ attributes, children, element }) => {
//                 console.log("CHILDREN", children);
//                 if (!children || !children.length || children.length === 0) {
//                     return <p {...attributes}>{children}</p>;
//                 }
//                 children.forEach((child: any, index: number) => {
//                     const text = child.props?.text?.text as string;
//                     if (text) {
//                         console.log("text", text, typeof text);
//                         const replacedText = replaceText(
//                             text,
//                             replacementDictionary,
//                         );
//                         if (text !== replacedText)
//                             children[index].props.text.text = replacedText;
//                     }
//                 });

//                 return (
//                     <p {...attributes} {...element}>
//                         {children}
//                     </p>
//                 );

//                 return <p {...attributes}>{children}</p>;
//             },
//         },
//     });
// }
