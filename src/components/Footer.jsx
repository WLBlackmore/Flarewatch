import logo from '../assets/footerlogo.svg';
import styles from './Footer.module.css';

const Footer = () => {
    return(
        <section className={styles.footer}>
        <div className={styles.footerFlex}>
            <div className={styles.lineLeft}></div>
            <div className={styles.logo}>
                <img src={logo} alt="logo"></img>
                <h5>© William Blackmore</h5>
            </div>
            <div className={styles.lineRight}></div>
        </div>
    </section>
    )
};

export default Footer;