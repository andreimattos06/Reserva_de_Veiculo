import * as CheckboxRadix from '@radix-ui/react-checkbox';
import { Check } from '@phosphor-icons/react'

export default function Checkbox(props) {
    return (
        <CheckboxRadix.Root className="flex items-center justify-center w-5 h-5 bg-black border-[1px] border-emerald-600 rounded-md" {...props}>
            <CheckboxRadix.Indicator className='text-emerald-600'>
                <Check size={14} />
            </CheckboxRadix.Indicator>
        </CheckboxRadix.Root>
    )
}