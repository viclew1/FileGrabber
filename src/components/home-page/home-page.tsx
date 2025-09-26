import styles from './home-page.module.css';
import { Flex, Text, TextField } from '@radix-ui/themes';
import { UnplugIcon } from 'lucide-react';
import TooltipContainer from '../custom/base/tooltip/tooltip-container';
import SolidButton from '../custom/base/buttons/solid-button';

export default function HomePageContainer() {
    return (
        <Flex className={styles.homePageContainer}>
            <TextField.Root placeholder="Pear IP address">
                <TextField.Slot>
                    <UnplugIcon />
                </TextField.Slot>
            </TextField.Root>
            <TooltipContainer tooltipContent={'Connect'}>
                <SolidButton>
                    <Text>Connect</Text>
                </SolidButton>
            </TooltipContainer>
        </Flex>
    );
}
