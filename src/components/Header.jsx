import { NavLink } from 'react-router-dom';
import styles from './Header.module.css'

const Header = () => {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to='/'>Home</NavLink>
                </li>
                <li>
                    <NavLink to='/dashboard'>Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to='/mapviewer'>Mapviewer</NavLink>
                </li>
                <li>
                    <NavLink to='/about'>About</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Header