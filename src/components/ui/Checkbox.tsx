import { AriaAttributes, ComponentProps, ReactNode } from "react";

interface CheckboxProps extends ComponentProps<"input">, AriaAttributes {
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  children: ReactNode;
};

const Checkbox = ({name, onChange, children, ...props}: CheckboxProps) => {
  return (
    <label className="flex items-center gap-2">
        <input 
            className="w-4 h-4 rounded-full checked:border-brand focus:ring-2 focus:ring-brand-subtle border border-default"
            {...props}
            type="checkbox" 
            name="{name}" 
            onChange={onChange}
        ></input>
        {children}
    </label>
  )
}

export default Checkbox