import React, {useContext, useState} from 'react';
import './Sidebar.css';
import {assets} from '../../assets/assets';
import {Context} from '../../context/Context';

const Sidebar = () => {
    const {onSent, prevPrompts, setRecentPrompt, newChat, extended, setExtended} = useContext(Context);

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    };

    return (
        <>
        <aside className={`sidebar ${extended ? 'extended' : 'collapsed'}`}>
            <div className={`top ${extended ? '' : 'centered'}`}>
                {/* Menu Toggle */}
                <div className="menu" onClick={() => setExtended(prev => !prev)}>
                    <i className="ri-menu-line"></i>
                </div>

                {/* New Search / New Trip */}
                <div onClick={() => newChat()} className="new-chat">
                    <i className="ri-add-line"></i>
                    {extended && <p>New Trip</p>}
                </div>

                {/* Recent Searches - Only visible when extended */}
                {extended && (
                    <div className="recent">
                        <p className="recent-title">Recent Searches</p>
                        {prevPrompts.length > 0 ? (
                            prevPrompts.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => loadPrompt(item)}
                                    className="recent-entry"
                                >
                                    <i className="ri-chat-history-line"></i>
                                    <p className="recent-entry-p">
                                        {item.length > 30 ? `${item.slice(0, 30)}...` : item}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="no-recent">No recent searches yet</p>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Section */}
            <div className={`bottom ${extended ? '' : 'centered'}`}>
                <div className="bottom-item recent-entry">
                    <i className="ri-question-line"></i>
                    {extended && <p>Help & FAQ</p>}
                </div>

                <div className="bottom-item recent-entry">
                    <i className="ri-history-line"></i>
                    {extended && <p>My Trips</p>}
                </div>

                <div className="bottom-item recent-entry">
                    <i className="ri-settings-3-line"></i>
                    {extended && <p>Settings</p>}
                </div>
            </div>
        </aside>
        {extended && <div className="sidebar-overlay" onClick={() => setExtended(false)}></div>}
    </>
    );
};

export default Sidebar;