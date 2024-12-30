import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    return (
        <nav className={styles.nav}>
            <NavLink to='/' className={styles.logoLink}>
                {/* Inline the SVG directly */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 79.536 79.536"
                    className={styles.logo}
                >
                    <g>
                        <path
                            d="M69.511,73.363h-9.103c-0.29-2.029-0.673-4.577-1.191-7.86c-1.149-7.301-2.837-17.833-5.085-31.615
                                V15.265h3.324L39.315,0L22.098,15.265h3.42v18.973h0.111c-3.456,19.439-5.641,32.466-6.542,39.125h-9.062
                                c-1.708,0-3.076,1.378-3.076,3.097c0,1.699,1.367,3.076,3.076,3.076h59.486c1.699,0,3.076-1.377,3.076-3.076
                                C72.587,74.741,71.21,73.363,69.511,73.363z M54.287,66.611L43.121,53.977l7.438-8.43L54.287,66.611z M40.004,51.243L29.95,40.037
                                l0.753-5.085l18.038-0.041l0.87,5.344L40.004,51.243z M29.637,15.309h20.27v6.398h-20.27V15.309z M28.747,44.563l8.681,9.662
                                L24.283,68.858L28.747,44.563z M25.194,73.363L39.941,57.28l14.527,16.083H25.194z"
                        />
                    </g>
                </svg>
            </NavLink>
            <ul className={styles.navItems}>
                <li>
                    <NavLink to='/'>Home</NavLink>
                </li>
                <li>
                    <NavLink to='/mapviewer'>Mapviewer</NavLink>
                </li>
                <li>
                    <NavLink to='/dashboard'>Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to='/news'>News</NavLink>
                </li>
                <li>
                    <NavLink to='/about'>About</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Header;
