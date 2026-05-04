import { AriaAttributes, ComponentPropsWithoutRef, ReactNode } from "react";

interface RadioButtonProps extends ComponentPropsWithoutRef<"input">, AriaAttributes {
  name: string;
  value: string | number | readonly string[] | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  children: ReactNode;
};

const RadioButton = ({name, value, onChange, children}: RadioButtonProps) => {
  return (
    <label className="flex items-center gap-2">
        <input
        className="w-4 h-4 rounded-full checked:border-brand focus:ring-2 focus:ring-brand-subtle border border-default"
        type="radio"
        name={name}
        onChange={onChange}
        value={value}
        ></input>
        {children}
    </label>
  )
}

export default RadioButton
