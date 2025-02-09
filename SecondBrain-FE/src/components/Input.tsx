interface Inputs {
  placeholder: string;
  ref?: any;
}

export function Input({placeholder, ref}: Inputs){
  return <div>
    <input ref={ref} placeholder={placeholder} type={"text"} className="
          px-4 py-2 border rounder m-2" 
          >
    </input>
  </div>
}
