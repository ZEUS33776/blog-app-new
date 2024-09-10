import React from "react";
 import { useForm } from "react-hook-form";
export default function InputBox({ name, type, id, value, placeholder, icon, isRequired,register ,regex,errmsg}) {
    
    return(
        <div className="relative w-[100%] mb-4">
            <input
            name={name}
            type={type}
            placeholder={placeholder}
                defaultValue={value}
                {
                ...register(name, {
                    required: { isRequired },
                    
                        
                        pattern: regex && {
                            value: regex,
                            message: errmsg
                        }
                    
                    
                    
                })
                }

                
            id={id}
            className="input-box"
             />
             <i className={"fi "+icon+ " input-icon"}  ></i>

        </div>
    )
}