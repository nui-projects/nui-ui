import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export const Button = ( props: ButtonHTMLAttributes<PropsWithChildren> ) => {
    return ( 
        <button className='bg-red-400 p-4 inline-flex text-center justify-center items-center'>{ props.children }</button>
    )
}