import * as React from "react";
import { useState } from "react";
import { base16AteliersulphurpoolLight } from "react-syntax-highlighter/dist/styles/prism";

const SyntaxHighlighter =
    require("react-syntax-highlighter/dist/prism").default;

const CodeBlock: React.FC = ({ children }) => {
    const [showCode, setShowCode] = useState(false);
    const toggleShowCode = () => setShowCode(state => !state);
    const toggleLabel = showCode ? "Hide code" : "Show code";

    return (
        <div>
            <a
                href=""
                onClick={e => {
                    e.preventDefault();
                    toggleShowCode();
                }}
            >
                {toggleLabel}
            </a>
            {showCode && (
                <SyntaxHighlighter
                    language="jsx"
                    style={base16AteliersulphurpoolLight}
                    customStyle={{ fontSize: 13 }}
                    showLineNumbers={true}
                >
                    {children}
                </SyntaxHighlighter>
            )}
        </div>
    );
};

export default CodeBlock;
