import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";

const Dashboard = ({news}) => {
    return (
        <div className="twixera-page dashboard">
            <section className="twixera-settings-section section-news">
                <h1 className="title">News</h1>
                <div className="section-body">
                    <Markdown
                        children={news}
                        className="twixera-markdown-container"
                    />
                </div>
            </section>

            <section className="twixera-settings-section section-more">
                <h1 className="title">More</h1>
                <a
                    className="twixera-button"
                    href="https://paypal.me/R4ver"
                    target="_blank"
                >
                    Donate
                </a>
                <a
                    className="twixera-button discord"
                    href="https://discord.gg/2Y4ttRW"
                    target="_blank"
                >
                    Join discord!
                </a>
            </section>
        </div>
    );
}

export default Dashboard;