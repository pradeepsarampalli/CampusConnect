function SettingsCard({ title, description, isOpen, onClick, children }) {
    return (
        <section className={`settings-card ${isOpen ? 'open' : ''}`}>
            <button
                type="button"
                className="settings-card-header"
                onClick={onClick}
                aria-expanded={isOpen}
                aria-controls={`settings-${title.toLowerCase().replace(/\s/g, '-')}`}
            >
                <div className="settings-card-title-wrap">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
                <span className="settings-card-chevron">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
                <div id={`settings-${title.toLowerCase().replace(/\s/g, '-')}`} className="settings-card-body">
                    {children}
                </div>
            )}
        </section>
    );
}

export default SettingsCard;
