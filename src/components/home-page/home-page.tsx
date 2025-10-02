import styles from './home-page.module.css';
import ConnectionInput from './connection/connection-input';
import ConnectionStatus from './connection/connection-status';
import VerticalFlex from '../custom/base/flex/vertical-flex';

export default function HomePageContainer() {
    return (
        <VerticalFlex gap={'1'} className={styles.homePageContainer}>
            <ConnectionInput />
            <ConnectionStatus />
        </VerticalFlex>
    );
}
