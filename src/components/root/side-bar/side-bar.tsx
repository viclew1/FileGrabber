import { Book, Settings } from 'lucide-react';
import SideBarButton from './side-bar-button';
import styles from './side-bar.module.css';
import React, { ComponentType } from 'react';
import VerticalFlex from '../../custom/base/flex/vertical-flex';
import { Flex } from '@radix-ui/themes';

type Tab = {
    path: string;
    icon: ComponentType<{ size?: number }>;
};

const tabs: Tab[] = [
    { path: '/', icon: Book },
    { path: '/settings', icon: Settings },
];

export default function SideBarContainer() {
    return (
        <Flex className={styles.sideBarContainer}>
            <VerticalFlex>
                {tabs.map(({ path, icon: Icon }) => (
                    <SideBarButton key={path} path={path}>
                        <Icon size={32} />
                    </SideBarButton>
                ))}
            </VerticalFlex>
        </Flex>
    );
}
