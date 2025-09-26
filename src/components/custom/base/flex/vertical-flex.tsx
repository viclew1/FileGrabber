import { Flex, FlexProps } from '@radix-ui/themes';
import classNames from 'classnames';
import styles from './vertical-flex.module.css';

export default function VerticalFlex({ className, children, ...props }: FlexProps) {
    return (
        <Flex className={classNames(styles.verticalFlex, className)} {...props}>
            {children}
        </Flex>
    );
}
