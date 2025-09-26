import { ReactNode } from 'react';
import { Tooltip } from 'radix-ui';

export default function TooltipContainer({
    children,
    tooltipProps,
    tooltipContent,
}: {
    children: ReactNode;
    tooltipProps?: any;
    tooltipContent?: ReactNode;
}) {
    <Tooltip.Provider>
        <Tooltip.Root>
            <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content sideOffset={5} {...tooltipProps}></Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    </Tooltip.Provider>;
}
