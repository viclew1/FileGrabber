import { ButtonProps } from '@radix-ui/themes';
import DefaultButton from './default-button';

export default function SoftButton(props: Omit<ButtonProps, 'variant'>) {
    return <DefaultButton variant={'soft'} {...props} />;
}
