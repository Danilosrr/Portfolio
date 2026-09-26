function Background() {
    return (
        <>
            {/* Engineering drawing grid */}
            < div className="engineering-grid pointer-events-none absolute inset-0" />

            {/* Soft fade towards the edges */}
            < div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,245,242,0)_0%,rgba(245,245,242,0.35)_55%,rgba(245,245,242,0.92)_100%)]" />

        </>
    )
}

export default Background