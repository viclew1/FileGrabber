import { ReactNode } from 'react';
import VerticalFlex from '../custom/base/flex/vertical-flex';
import { Separator } from '@radix-ui/themes';
import Title from '../custom/base/text/title';
import classNames from 'classnames';

export default function FilesConfigContainer({ title, children }: { title: string; children: ReactNode }) {
    return (
        <VerticalFlex
            gap={'4'}
            p={'4'}
            width={'100%'}
            height={'100%'}
            className={classNames('darkerBackground', 'defaultBorder')}
        >
            <Title>{title}</Title>
            <Separator orientation={'horizontal'} size={'4'} />
            {children}
        </VerticalFlex>
    );
}
