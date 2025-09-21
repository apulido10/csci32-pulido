
import { getInputSizeStyles, Size } from "./size";
import {  HTMLInputTypeAttribute } from "react";
import { getVariantBorderStyles, getVariantInputTextStyles, getVariantOutlineStyles, Variant } from "./variant";

interface InputProps {
  variant?: Variant;
  size?: Size;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value?: any;
  setValue?: (newValue: any) => void;
  defaultValue?: any;
  name: string;
  id: string;
  className?: string;
}

export default function Input({
  className,
  variant = Variant.PRIMARY,
  size = Size.MEDIUM,
  value,
  name,
  id,
  defaultValue,
  setValue,
  type = "text",
  placeholder,
}: InputProps) {
  const sizeCssClasses = getInputSizeStyles(size);
  const variantOutlineCssClasses = getVariantOutlineStyles(variant);
  const variantBorderCssClasses = getVariantBorderStyles(variant);
  const variantInputTextCssClasses = getVariantInputTextStyles(variant);
  

const completedCssClasses =
<<<<<<< HEAD
    `${sizeCssClasses} ${variantBorderCssClasses}   ${variantOutlineCssClasses}  ${variantInputTextCssClasses} `;
=======
    `${sizeCssClasses} ${variantBorderCssClasses}  ${variantOutlineCssClasses} ${commonCssClasses} ${variantInputTextCssClasses} `;
>>>>>>> c03d709 (completed randomInt)

  return (
    <input
      className={completedCssClasses}
      name={name}
      id={id}
      defaultValue={defaultValue}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={setValue ? (newValue) => setValue(newValue.currentTarget.value) : () => {}}
    />
  );
}
