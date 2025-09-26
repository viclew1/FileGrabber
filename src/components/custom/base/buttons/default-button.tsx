import { Button, ButtonProps } from '@radix-ui/themes';
import classNames from 'classnames';
import styles from './button.module.css';

export default function DefaultButton({ className, ...props }: ButtonProps) {
    return <Button className={classNames(styles.defaultButton, className)} {...props} />;
}
