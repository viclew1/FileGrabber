import { Flex, IconButton, Text } from '@radix-ui/themes';
import { useSocketServer } from '../../../../../contexts/socket-server-context';
import VerticalFlex from '../../../../custom/base/flex/vertical-flex';
import { Cross1Icon } from '@radix-ui/react-icons';
import TooltipContainer from '../../../../custom/base/tooltip/tooltip-container';
import styles from './shared-folders-list.module.css';

const breakCharacter = '\u200B';

export default function SharedFoldersList() {
    const { sharedFolders, removeSharedFolder } = useSocketServer();
    return (
        <VerticalFlex gap={'1'}>
            {sharedFolders.map((sharedFolder) => (
                <TooltipContainer
                    tooltipContent={
                        <Flex maxWidth={'25rem'}>
                            <Text>{sharedFolder.absolutePath.replaceAll('/', `/${breakCharacter}`)}</Text>
                        </Flex>
                    }
                    key={`shared-folder-${sharedFolder.absolutePath}`}
                >
                    <Flex gap={'3'} align={'center'} className={styles.sharedFolderCard}>
                        <IconButton variant={'ghost'} onClick={() => removeSharedFolder(sharedFolder.absolutePath)}>
                            <Cross1Icon width={16} height={16} />
                        </IconButton>
                        <VerticalFlex>
                            <Text>{sharedFolder.fileName}</Text>
                        </VerticalFlex>
                    </Flex>
                </TooltipContainer>
            ))}
        </VerticalFlex>
    );
}
