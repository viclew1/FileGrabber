import styles from './home-page.module.css';
import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import { UnplugIcon } from 'lucide-react';

export default function HomePageContainer() {
    return (
        <Flex className={styles.homePageContainer}>
            <TextField.Root placeholder="Pear IP address">
                <TextField.Slot>
                    <UnplugIcon />
                </TextField.Slot>
            </TextField.Root>
            <Button>
                <Text>Connect</Text>
            </Button>
        </Flex>
    );
}
