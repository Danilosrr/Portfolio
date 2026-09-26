import meImage from "../assets/me.png";

function Portrait() {
    return (
        <div className="portrait-module">
            <div className="portrait-frame">

                {/* Technical corner marks */}
                <span className="portrait-corner portrait-corner--tl" />
                <span className="portrait-corner portrait-corner--tr" />
                <span className="portrait-corner portrait-corner--bl" />
                <span className="portrait-corner portrait-corner--br" />

                {/* Portrait */}
                <div className="portrait-image-wrapper">
                    <img
                        src={meImage}
                        alt="Danilo"
                        className="portrait-image"
                    />
                </div>

                {/* Technical dimension line */}
                <div className="portrait-dimension">
                    <span className="portrait-dimension__tick" />
                    <span className="portrait-dimension__line" />
                    <span className="portrait-dimension__tick" />
                </div>

                {/* Blue reference marker */}
                <span className="portrait-reference-marker" />

                {/* Technical information */}
                <div className="portrait-info">
                    <span className="portrait-info__number">01</span>
                    <span className="portrait-info__label">PORTRAIT</span>
                </div>

            </div>
        </div>
    );
}

export default Portrait;
