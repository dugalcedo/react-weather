import { Link } from 'react-router-dom'

export default function Nav({nav}) {
    return (
        <nav id="main-nav">
            <ul>
                {nav.map((navItem, i) => (
                    <li key={navItem.content}>
                        <Link to={navItem.to}>{navItem.content}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}