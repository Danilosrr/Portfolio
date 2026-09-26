interface WordFlipProps {
    word: string;
    color?: "blue";
}

function WordFlip({ word }: WordFlipProps) {
    return (
        <span className="word-flip text-[#2563EB]">
            <span
                key={word}
                className="word-flip__word inline-block"
            >
                {word}
            </span>
        </span>
    );
}

export default WordFlip;
