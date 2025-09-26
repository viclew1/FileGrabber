import { ButtonProps } from '@radix-ui/themes';
import DefaultButton from './default-button';

export default function GhostButton(props: Omit<ButtonProps, 'variant'>) {
    return <DefaultButton variant={'ghost'} {...props} />;
}
