import VerticalFlex from '../custom/base/flex/vertical-flex';
import { FlexProps, Separator } from '@radix-ui/themes';
import Title from '../custom/base/text/title';
import classNames from 'classnames';

export default function FilesConfigContainer({ title, className, children, ...props }: { title: string } & FlexProps) {
    return (
        <VerticalFlex
            gap={'4'}
            p={'4'}
            width={'100%'}
            height={'100%'}
            minWidth={'0'}
            minHeight={'0'}
            className={classNames('darkerBackground', 'defaultBorder', className)}
            {...props}
        >
            <Title>{title}</Title>
            <Separator orientation={'horizontal'} size={'4'} />
            {children}
        </VerticalFlex>
    );
}
