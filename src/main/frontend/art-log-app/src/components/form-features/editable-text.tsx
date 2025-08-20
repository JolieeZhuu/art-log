import React from "react";

// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { dayOptions, classIdOptions, timeExpectedOptions } from "./options";

// UI Components
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ComboboxOptions } from "./combobox-options";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const editSchema = z.object({
    input: z.string().min(1, {
        message: "This field cannot be empty."
    })
})

export default function EditableText({ initialText, index }: { initialText: string, index: number }) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [text, setText] = React.useState(initialText)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const form = useForm<z.infer<typeof editSchema>>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            input: initialText
        },
    })

    // Update form and local state when initialText changes
    React.useEffect(() => {
        setText(initialText);
        form.setValue("input", initialText);
    }, [initialText, form.setValue]);

    // Handle click outside to cancel editing
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                if (isEditing) {
                    // Cancel editing and revert to original text
                    setText(initialText);
                    form.reset({ input: initialText });
                    setIsEditing(false);
                }
            }
        }

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing, initialText, form]);

    function handleOnBlur() {
        setText(initialText)
        setIsEditing(false)
    }

    // Handle combobox selection and auto-submit
    function handleComboboxChange(value: string) {
        form.setValue("input", value);
        setText(value);
        setIsEditing(false);
    }

    function handleDoubleClick() {
        setIsEditing(true)
        // Reset form with current text value when starting to edit
        form.reset({ input: text });
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
        }
        if (e.key === "Escape") {
            // Cancel editing and revert to original text
            setIsEditing(false);
            form.reset({ input: text });
        }
    }

    function onSubmit(values: z.infer<typeof editSchema>) {
        console.log(values.input)
        setText(values.input);
        setIsEditing(false);
    }

    // dayOfWeek, timeExpected, classHours, classId, phoneNumber, totalClasses, paymentNotes
    const inputsToDisplay = [
        <Form {...form}>
            { /* dayOfWeek */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="input"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <ComboboxOptions
                                    options={dayOptions}
                                    value={String(field.value)} 
                                    onChange={handleComboboxChange} 
                                    selectPhrase="Select..."
                                    commandEmpty="Selection not found."
                                    autoFocus={true}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                            setText(initialText);
                                            form.reset({ input: initialText });
                                            setIsEditing(false);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>,
        <Form {...form}>
            { /* timeExpected */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="input"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <ComboboxOptions
                                    options={timeExpectedOptions}
                                    value={String(field.value)} 
                                    onChange={handleComboboxChange} 
                                    selectPhrase="Select..."
                                    commandEmpty="Selection not found."
                                    autoFocus={true}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                            setText(initialText);
                                            form.reset({ input: initialText });
                                            setIsEditing(false);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>,
        <Form {...form} >
            { /* classHours */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="input"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} 
                                    value={field.value?.toString() || ""}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        field.onChange(value === "" ? "" : Number(value))
                                    }}
                                    type="number" 
                                    step="any" 
                                    min="1"
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleOnBlur}
                                    autoFocus
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>,
        <Form {...form}>
            { /* classId */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="input"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <ComboboxOptions
                                    options={classIdOptions}
                                    value={String(field.value)} 
                                    onChange={handleComboboxChange} 
                                    selectPhrase="Select..."
                                    commandEmpty="Selection not found."
                                    autoFocus={true}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                            setText(initialText);
                                            form.reset({ input: initialText });
                                            setIsEditing(false);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>,
        <Form {...form}>
            { /* phoneNumber */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="input"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} 
                                    type="text"
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleOnBlur}
                                    autoFocus
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>,
        <Form {...form}>
            { /* totalClasses */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="input"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} 
                                    value={field.value?.toString() || ""}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        field.onChange(value === "" ? undefined : Number(value))
                                    }}
                                    className="w-full" 
                                    placeholder="ex: 10"
                                    type="number"
                                    min="1"
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleOnBlur}
                                    autoFocus
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>,
        <Form {...form}>
            { /* paymentNotes */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="input"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} 
                                    type="text"
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleOnBlur}
                                    autoFocus
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>,
    ]

    return (
        <div onDoubleClick={handleDoubleClick}>
            {
                isEditing ? (
                    <div>
                        {inputsToDisplay[index]}
                    </div>
                ) : (
                    <Badge variant="secondary" className="cursor-pointer">
                        {text || "Click to add text"}
                    </Badge>
                )
            }
        </div>
    )
};