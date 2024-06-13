export interface SelectedItem<T = any> {
    label?: string;
    value?: T;
    styleClass?: string;
    icon?: string;
    title?: string;
    disabled?: boolean;
}