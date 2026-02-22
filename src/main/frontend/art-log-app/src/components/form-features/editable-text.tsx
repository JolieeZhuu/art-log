import React from "react";

// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { dayOptions, classIdOptions, timeExpectedOptions } from "./options";
import { getById, edit, getByTermIdAndStudentIdAndClassNumber } from "../../restAPI/entities";
import { convertTo24Hour } from "../payment-tables/payment-funcs";

// UI Components
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { ComboboxOptions } from "./combobox-options";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../../components/ui/form"

const editSchema = z.object({
    input: z.string().min(1, {
        message: "This field cannot be empty."
    }).optional(),
    inputNumber: z.number().min(1, {
        message: "This field cannot be empty."
    }).optional(),
})

// Hook that alerts clicks outside of the passed ref
function useOutsideAlerter(ref: any, setText: (value: React.SetStateAction<string | number>) => void, initialText: string | number, setIsEditing: (value: React.SetStateAction<boolean>) => void) {
    React.useEffect(() => {
        // Alert if clicked on outside of element
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                const isDropdownClick = event.target.closest('[role="option"]') || 
                                       event.target.closest('[data-radix-popper-content-wrapper]') ||
                                       event.target.closest('[cmdk-list]') ||
                                       event.target.closest('.cmdk-list');
                
                if (!isDropdownClick) {
                    setText(initialText);
                    setIsEditing(false);
                }
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setText, initialText, setIsEditing]);
}


export default function EditableText({ initialText, index, optionalEnding, id, getStudent, termId }: { initialText: string, index: number, optionalEnding: string, id: number, getStudent: () => void, termId: number }) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [text, setText] = React.useState<string | number>(initialText)
    const isNumberField = index === 2 || index === 5; // classHours and totalClasses
    
    const studentUrl = "http://localhost:8080/student/"
    const attendanceUrl = "http://localhost:8080/attendance/"
    const termUrl = "http://localhost:8080/term/"

    const form = useForm<z.infer<typeof editSchema>>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            input: initialText,
            inputNumber: isNumeric(initialText) ? toNumber(initialText) : 1
        },
    })

    const wrapperRef = React.useRef(null)
    useOutsideAlerter(wrapperRef, setText, initialText, setIsEditing)

    // Update form and local state when initialText changes
    React.useEffect(() => {
        setText(initialText);
        
        if (isNumberField && isNumeric(initialText)) {
            const numValue = toNumber(initialText);
            form.setValue("inputNumber", numValue);
        } else {
            const stringValue = initialText;
            form.setValue("input", stringValue);
        }
    }, [initialText, form, isNumberField]);


    // Helper function to check if a value is numeric
    function isNumeric(value: any): boolean {
        if (typeof value === 'number') return !isNaN(value);
        if (typeof value === 'string') {
            const num = Number(value);
            return !isNaN(num) && !isNaN(parseFloat(value)) && value.trim() !== '';
        }
        return false;
    }

    // Helper function to safely convert to number
    function toNumber(value: string | number): number {
        if (typeof value === 'number') return value;
        return parseFloat(value);
    }

    function handleOnBlur() {
        setText(initialText)
        setIsEditing(false)
    }

    // Handle combobox selection and auto-submit
    function handleComboboxChange(value: string) {
        form.setValue("input", value);
        onSubmit(form.getValues())
        setText(value);
        setIsEditing(false);
    }

    function handleDoubleClick() {
        setIsEditing(true)
        // Reset form with current text value when starting to edit
        if (isNumberField && isNumeric(text)) {
            form.reset({ 
                input: "",
                inputNumber: toNumber(text)
            });
        } else {
            form.reset({ 
                input: typeof text === 'number' ? text.toString() : text,
                inputNumber: 1
            });
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            
            // Get the current form values
            // Check because of aync issues
            const currentValues = form.getValues();
            
            // Validate and submit
            const isValid = form.formState.isValid;
            console.log("Form is valid:", isValid); // DEBUG
            
            if (isNumberField) {
                const numValue = currentValues.inputNumber;
                if (numValue && numValue >= 1) {
                    onSubmit(currentValues);
                } else {
                    console.log("Invalid number value:", numValue); // DEBUG
                }
            } else {
                const stringValue = currentValues.input;
                if (stringValue && stringValue.trim() !== '') {
                    onSubmit(currentValues);
                } else {
                    console.log("Invalid string value:", stringValue); // DEBUG
                }
            }
        }
        if (e.key === "Escape") {
            // Cancel editing and revert to original text
            setIsEditing(false);
            setText(initialText);
        }
    }

    async function onSubmit(values: z.infer<typeof editSchema>) {
        const student = await getById(studentUrl, id)
        
        if (isNumberField) {
            const data = {
                student_id: id,
                first_name: student.first_name,
                last_name: student.last_name,
                class_id: student.class_id,
                day: student.day,
                phone_number: student.phone_number,
                time_expected: student.time_expected,
                general_notes: student.general_notes,
                curr_table: student.curr_table,
                curr_class: student.curr_class, 
                class_hours: index == 2 ? values.inputNumber : student.class_hours, //
            }
            await edit(studentUrl, data)
            setText(values.inputNumber ?? 1);
        } else {
            const storeClass = await getByTermIdAndStudentIdAndClassNumber(attendanceUrl, termId, id, student.class_number)
            const termTable = await getById(termUrl, termId)
            if (index == 6 || index == 7) {
                const data2 = {
                    term_id: termId,
                    student_id: id,
                    total_classes: termTable.total_classes,
                    payment_notes: index == 6 ? values.input : termTable.payment_notes,
                    term_notes: index == 7 ? values.input : termTable.term_notes,
                    table_num: termTable.table_num
                }
                await edit(termUrl, data2)
            } else {
                const data1 = {
                    student_id: id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    class_id: index == 3 ? values.input : student.class_id,
                    day: index == 0 ? values.input : student.day,
                    phone_number: index == 4 ? values.input: student.phone_number,
                    time_expected: index == 1 ? convertTo24Hour(values.input) : student.time_expected,
                    general_notes: index == 8 ? values.input : student.general_notes,
                    curr_table: student.curr_table,
                    curr_class: student.curr_class, 
                    class_hours: index == 5 ? values.inputNumber : student.class_hours, //
                }
                await edit(studentUrl, data1)
            }
            setText(values.input ?? "");
        }
        getStudent()
        setIsEditing(false);
    }

    // dayOfWeek, timeExpected, classHours, classId, phoneNumber, totalClasses, paymentNotes
    const inputsToDisplay = [
        <div key={0} ref={wrapperRef}>
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
            </Form>
        </div>,
        <div key={1} ref={wrapperRef}>
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
            </Form>
        </div>,
        <div key={2} ref={wrapperRef}>
            <Form {...form} >
                { /* classHours */}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="inputNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        value={field.value?.toString() || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === "") {
                                                field.onChange("");
                                            } else {
                                                const numValue = parseFloat(value);
                                                field.onChange(isNaN(numValue) ? "" : numValue);
                                            }
                                        }}
                                        type="number" 
                                        step="0.5" 
                                        min="1"
                                        placeholder="Enter hours (e.g., 1.5)"
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
            </Form>
        </div>,
        <div key={3} ref={wrapperRef}>
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
            </Form>
        </div>,
        <div key={4} ref={wrapperRef}>
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
            </Form>
        </div>,
        <div key={5} ref={wrapperRef}>
            <Form {...form}>
                { /* totalClasses */}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="inputNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        value={field.value?.toString() || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === "") {
                                                field.onChange(10);
                                            } else {
                                                const numValue = parseInt(value);
                                                field.onChange(isNaN(numValue) ? 10 : numValue);
                                            }
                                        }}
                                        className="w-full"
                                        type="number"
                                        step="1"
                                        min="1"
                                        placeholder="Total classes (e.g., 10)"
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
            </Form>
        </div>,
        <div key={6} ref={wrapperRef}>
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
            </Form>
        </div>,
        <div key={7} ref={wrapperRef}>
            <Form {...form}>
                { /* termNotes */}
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
            </Form>
        </div>,
        <div key={8} ref={wrapperRef}>
            <Form {...form}>
                { /* generalNotes */}
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
            </Form>
        </div>,
    ]

    return (
        <div onDoubleClick={handleDoubleClick}>
            {
                isEditing ? (
                    <div>
                        {inputsToDisplay[index]}
                    </div>
                ) : (
                    <Badge variant="secondary" className="cursor-pointer text-sm font-normal py-2 px-3">
                        {`${text}${optionalEnding}` || "Click to add text"}
                    </Badge>
                )
            }
        </div>
    )
};