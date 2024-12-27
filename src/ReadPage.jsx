import { useLocation } from 'react-router-dom';

export function ReadPage() {

    const location = useLocation();
    const { content } = location.state || {};

    return(<>
        <h1>{content}</h1>
    </>)
}