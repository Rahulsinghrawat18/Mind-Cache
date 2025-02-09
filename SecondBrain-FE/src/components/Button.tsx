import { ReactElement } from "react";


interface ButtonProps {
  variant: "primary" | "secondary" | "submit";
  text: string;
  startIcon: ReactElement;
  fullwidth?: boolean;
  loading?: boolean;
  onClick?:() => void;
}

const variantClasses = {
  "primary": "bg-green-950 text-green-200",
  "secondary": "bg-green-600 text-green-200",
  "submit": "bg-stone-900 text-stone-200"
};

const defaultStyles = "m-1 px-4 py-2 rounded-md font-light flex items-center";

export function Button({variant, text, startIcon, onClick,
  fullwidth, loading}: ButtonProps){

  return <button onClick={onClick} 
    className={variantClasses[variant] + " " + defaultStyles +
    `${fullwidth ? " w-full flex font-normal justify-center items-center" : ""}
     ${loading ? "opacity-45 " : ""}`} disabled={loading}>
    <div className="pr-2">
      {startIcon}
    </div>
      {text}
  </button>
}