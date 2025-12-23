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
                    <img src={assets.menu_icon} alt="Menu"/>
                </div>

                {/* New Search / New Trip */}
                <div onClick={() => newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="New Trip"/>
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
                                    <img src={assets.history_icon} alt=""/>
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
                    <img src={assets.question_icon} alt="Help"/>
                    {extended && <p>Help & FAQ</p>}
                </div>

                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="My Trips"/>
                    {extended && <p>My Trips</p>}
                </div>

                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="Settings"/>
                    {extended && <p>Settings</p>}
                </div>
            </div>
        </aside>
        {extended && <div className="sidebar-overlay" onClick={() => setExtended(false)}></div>}
    </>
    );
};

export default Sidebar;