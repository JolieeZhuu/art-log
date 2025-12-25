import { useState, useEffect, useRef } from "react"
import { Archive } from "lucide-react"

// External imports
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

// Internal imports
import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"
import { getById, getTermTableByStudentIdAndTableNum } from "@/restAPI/entities"
import { getTableNum, addClass, convertTo12Hour } from "@/components/payment-tables/payment-funcs"
import PaymentTable from "@/components/payment-tables/payments-table-page"
import EditableText from "@/components/form-features/editable-text"

// UI components
import { AppSidebar } from "@/components/navbar/app-sidebar"
import {
    Card,
    CardDescription,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DialogPaymentForm } from "@/components/form-features/dialog-payment-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Toaster } from '@/components/ui/sonner'
import { toast } from "sonner"
import { Separator } from "../ui/separator"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"


type Student = {
    student_id: number
    first_name: string
    last_name: string
    day: string
    class_id: string
    phone_number: string
    time_expected: string
    class_hours: number
    general_notes: string
}

export function PaymentsPage() {
    const { id: idParam } = useParams()
    // Check if idParam is valid
    if (!idParam) {
        return <div>Invalid ID parameter.</div>
    }

    const id = parseInt(idParam)
    const [student, setStudent] = useState<Student | null>(null)
    const [cardList, setCardList] = useState<React.ReactElement[]>([])
    const tableRefreshFunctions = useRef<{ [paymentNumber: number]: () => void }>({});

    const studentUrl = "http://localhost:8080/student/"
    const termUrl = "http://localhost:8080/term/"

    useEffect(() => {
        getStudent()
        loadCards()
    }, [id])

    async function getStudent() {
        const storeStudent = await getById(studentUrl, id)
        setStudent(storeStudent)
    }

    // Function to handle adding a class to a payment table
    // This function will be passed to the PaymentTable component
    // and will be called when a new class is added (so no page refresh is needed)
    async function addClassHandler(tableNum: number) {
        console.log("tablenum", tableNum) 
        await addClass(tableNum, id)

        if (tableRefreshFunctions.current[tableNum]) {
            tableRefreshFunctions.current[tableNum]();
        }

        getStudent()
        loadCards()

        // Add toaster
        toast(`New class was created in Payment Table ${tableNum}`)
    }

    const handleTableReady = (tableNum: number) => (refreshFn: () => void) => {
        tableRefreshFunctions.current[tableNum] = refreshFn;
    };

    async function loadCards() {
        const num = await getTableNum(id)
        const student = await getById(studentUrl, id)
        console.log("student:", student)
        const termTable = await getTermTableByStudentIdAndTableNum(termUrl, id, student.curr_table);
        // [[payment, term], [payment, term]]
        
        console.log(student)
        let tempNum;
        let storeNotesAndIds;
        if (num >= 2) {
            tempNum = 2;
            const termTable2 = await getTermTableByStudentIdAndTableNum(termUrl, id, student.curr_table - 1)
            storeNotesAndIds = [[termTable.payment_notes, termTable.term_notes, termTable.term_id], 
                                [termTable2.payment_notes, termTable2.term_notes, termTable2.term_id]]
        } else {
            tempNum = num;
            storeNotesAndIds = [[termTable.payment_notes, termTable.term_notes, termTable.term_id]]
        }
        const cards = Array.from({length: tempNum}).map((_, index) => {
            return (
                <div key={index} className="w-full">
                    <Card>
                        <CardHeader className="justify-items-start">
                            <CardTitle>Payment Table {num - index}</CardTitle>
                            <CardDescription>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="secondary" className="text-sm font-normal">{termTable.total_classes} classes</Badge>
                                    <EditableText
                                        initialText={storeNotesAndIds[index][0] === null ? "Payment Notes" : storeNotesAndIds[index][0]}
                                        index={6}
                                        optionalEnding=""
                                        id={id}
                                        getStudent={getStudent}
                                        termId={storeNotesAndIds[index][2]}
                                    />
                                    <EditableText
                                        initialText={storeNotesAndIds[index][1] === null ? "Term Notes" : storeNotesAndIds[index][1]}
                                        index={7}
                                        optionalEnding=""
                                        id={id}
                                        getStudent={getStudent}
                                        termId={storeNotesAndIds[index][2]}
                                    />
                                </div>
                            </CardDescription>
                            <CardAction>
                                <Button variant="outline" onClick={() => addClassHandler(num - index)}>Add Class</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <PaymentTable studentId={id} tableNum={num - index} onClassAdded={handleTableReady(num - index)}/>
                        </CardContent>
                    </Card>
                </div>
            )
        })
        setCardList(cards);
    }

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header className="flex h-20 shrink-0 items-center gap-2 border-b px-4">
                    <div className="space-y-2">
                        <div className="flex gap-5">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/students">Students</Link>
                                    </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                    <BreadcrumbPage>{`${student?.first_name} ${student?.last_name}`}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <Separator
                                orientation="vertical"
                                className="data-[orientation=vertical]:h-5"
                            />
                            <p className="text-sm">Go to <Link to={`/day/${student?.day}`}>{student?.day} Checkout</Link></p>
                        </div>
                        <p className="text-base font-medium">{student?.first_name} {student?.last_name}</p>
                    </div>
                </header>
                <div className="w-full p-4">
                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                    <div>
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex gap-2 flex-wrap">
                                <EditableText
                                    initialText={`${student?.day[0]}${student?.day.substring(1)}`}
                                    index={0}
                                    optionalEnding=""
                                    id={id}
                                    getStudent={getStudent}
                                    termId={-1}
                                />
                                <EditableText
                                    initialText={convertTo12Hour(student?.time_expected)}
                                    index={1}
                                    optionalEnding=""
                                    id={id}
                                    getStudent={getStudent}
                                    termId={-1}
                                />
                                <EditableText
                                    initialText={`${student?.class_hours}`}
                                    index={2}
                                    optionalEnding=" hr/class"
                                    id={id}
                                    getStudent={getStudent}
                                    termId={-1}
                                />
                                <EditableText
                                    initialText={`${student?.class_id}`}
                                    index={3}
                                    optionalEnding=""
                                    id={id}
                                    getStudent={getStudent}
                                    termId={-1}
                                />
                                <EditableText
                                    initialText={student?.phone_number ? `(${student.phone_number.slice(0, 3)})-${student.phone_number.slice(3, 6)}-${student.phone_number.slice(6)}` : ""}
                                    index={4}
                                    optionalEnding=""
                                    id={id}
                                    getStudent={getStudent}
                                    termId={-1}
                                />
                                <EditableText
                                    initialText={student?.general_notes ? student.general_notes : "General Notes"}
                                    index={8}
                                    optionalEnding=""
                                    id={id}
                                    getStudent={getStudent}
                                    termId={-1}
                                />
                            </div>
                            <div className="flex gap-4">
                                <DialogPaymentForm id={id} onPaymentAdded={loadCards}/>
                                <Button variant="outline" size="icon" asChild>
                                    <Link to={`/students/${id}/archives`}>
                                        <Archive className="h-[1.2rem] w-[1.2rem]"/>
                                        <span className="sr-only">Payment table archives</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-4 w-full">
                            {cardList}
                        </div>
                    </div>
                    <Toaster/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}