import {React , useEffect, useState} from 'react';

const MessagesList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
        <h1>Messages List</h1>
        <ul>
            {messages.map((message) => (
            <li key={message.id}>{message.text}</li>
            ))}
        </ul>
        </div>
    );
}

export default MessagesList;