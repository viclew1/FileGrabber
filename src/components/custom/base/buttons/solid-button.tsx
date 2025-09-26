import { ButtonProps } from '@radix-ui/themes';
import DefaultButton from './default-button';

export default function SolidButton(props: Omit<ButtonProps, 'variant'>) {
    return <DefaultButton variant={'solid'} {...props} />;
}
