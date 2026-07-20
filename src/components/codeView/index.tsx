import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "../codeView";

interface Props {
    code: string;
    language: string;
};

export const CodeView = ({
    code,
    language
}:Props) => {
    useEffect(() => {
        Prism.highlightAll();
    },[code]);
    return(
        <pre className="p-2 bg-transparent border-none rounded-none m-0 text-xs">
            <code className={`language-${language}`}>
                {code}
            </code>
        </pre>
    );
};