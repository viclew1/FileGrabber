import { ReactNode } from 'react';
import { Tooltip } from 'radix-ui';
import { TooltipContentProps, TooltipProviderProps } from '@radix-ui/react-tooltip';
import classNames from 'classnames';
import styles from './tooltip-container.module.css';

export default function TooltipContainer({
    tooltipProviderProps = {},
    children,
    tooltipProps = {},
    tooltipContent,
}: {
    tooltipProviderProps?: Omit<TooltipProviderProps, 'children'>;
    children: ReactNode;
    tooltipProps?: TooltipContentProps;
    tooltipContent?: ReactNode;
}) {
    const { className: tooltipContentClassName, ...tooltipPropsRest } = tooltipProps;
    return (
        <Tooltip.Provider delayDuration={300} {...tooltipProviderProps}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className={classNames(styles.defaultTooltipContent, tooltipContentClassName)}
                        side={'right'}
                        sideOffset={5}
                        {...tooltipPropsRest}
                    >
                        {tooltipContent}
                        <Tooltip.Arrow className={styles.arrow} />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
