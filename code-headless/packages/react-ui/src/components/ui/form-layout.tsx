import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EasyFormFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
}

// 짧은 스타일 을 위한 컴포넌트
export function EasyFormField({ name, label, placeholder, type = "text" }: EasyFormFieldProps) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {/* field.value가 undefined일 경우 빈 문자열('')로 대체 */}
                        <Input 
                            type={type} 
                            placeholder={placeholder} 
                            {...field} 
                            value={field.value ?? ""} 
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}