interface UnderlineProps {
    children: React.ReactNode;
    delay?: number;
}

function Underline({
    children,
    delay = 0,
}: UnderlineProps) {
    return (
        <span
            className="animated-underline text-[#171717]"
            style={
                {
                    "--underline-delay": `${delay}ms`,
                } as React.CSSProperties
            }
        >
            {children}
        </span>
    );
}

export default Underline;
