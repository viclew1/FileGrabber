import styles from './home-page.module.css';
import { Box, Button, Container, TextField } from '@radix-ui/themes';

export default function HomePageContainer() {
    return (
        <div className={styles.homePageContainer}>
            <TextField.Root placeholder="Search the docs…">
                <TextField.Slot></TextField.Slot>
            </TextField.Root>
            <Button variant={'solid'}>test</Button>
            <Box>
                <Container size="1">
                    <p>lol</p>
                </Container>
            </Box>
        </div>
    );
}
