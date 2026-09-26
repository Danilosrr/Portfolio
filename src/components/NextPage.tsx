type NextPageProps = {
    onClick: () => void;
    label?: string;
};

function NextPage({ onClick, label = "EXPLORE" }: NextPageProps) {
    return (
        <button
            type="button"
            className="next-page"
            onClick={onClick}
            aria-label={label === "RETURN" ? "Return to landing page" : "Go to next page"}
        >
            <span className="next-page-label">
                {label}
            </span>
        </button>
    );
}

export default NextPage;