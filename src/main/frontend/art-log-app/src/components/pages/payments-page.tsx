import { useState, useEffect, useRef } from "react"
import { Archive, Pencil } from "lucide-react"

// External imports
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

// Internal imports
import Layout from "@/components/navbar/layout"
import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"
import { SiteHeader } from "@/components/navbar/site-header"
import { getById } from "@/restAPI/entities"
import { getPaymentNum, addClass, convertTo12Hour } from "@/components/payment-tables/payment-funcs"
import PaymentTable from "@/components/payment-tables/payments-table-page"
import EditableText from "@/components/form-features/editable-text"

// UI components
import {
    Card,
    CardDescription,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

type Student = {
    student_id: number
    first_name: string
    last_name: string
    day: string
    class_id: string
    phone_number: string
    time_expected: string
    class_hours: number
    total_classes: number
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
    async function addClassHandler(paymentNumber: number) {    
        await addClass(paymentNumber, id)

        if (tableRefreshFunctions.current[paymentNumber]) {
            tableRefreshFunctions.current[paymentNumber]();
        }

        getStudent()
        loadCards()

        // Add toaster
        toast(`New class was created in Payment Table ${paymentNumber}`)
    }

    const handleTableReady = (paymentNumber: number) => (refreshFn: () => void) => {
        tableRefreshFunctions.current[paymentNumber] = refreshFn;
    };

    async function loadCards() {
        const num = await getPaymentNum(id)
        const student = await getById(studentUrl, id)
        console.log(student)
        let tempNum;
        if (num >= 2) {
            tempNum = 2;
        } else {
            tempNum = num;
        }
        const cards = Array.from({length: tempNum}).map((_, index) => {
            return (
                <div key={index} className="w-full max-w-7xl">
                    <Card>
                        <CardHeader className="justify-items-start">
                            <CardTitle>Payment Table {num - index}</CardTitle>
                            <CardDescription>
                                <div className="flex gap-2 mt-2">
                                    <EditableText
                                        initialText={student.total_classes + " classes"}
                                        index={5}
                                    />
                                    <EditableText
                                        initialText={student.payment_notes}
                                        index={6}
                                    />
                                </div>
                            </CardDescription>
                            <CardAction>
                                <Button variant="outline" onClick={() => addClassHandler(num - index)}>Add Class</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <PaymentTable studentId={id} paymentNumber={num - index} onClassAdded={handleTableReady(num - index)}/>
                        </CardContent>
                    </Card>
                </div>
            )
        })
        setCardList(cards);
    }

    return (
        <Layout
            children={(
                <div className="max-w-screen p-[2rem]">
                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
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
                    <div className="mt-4">
                        <SiteHeader heading={`${student?.first_name} ${student?.last_name}`}/>
                        <div className="flex justify-between items-center gap-4 pt-4">
                            <div className="flex gap-4">
                                <EditableText
                                    initialText={`${student?.day[0]}${student?.day.substring(1)}`}
                                    index={0}
                                />
                                <EditableText
                                    initialText={convertTo12Hour(student?.time_expected)}
                                    index={1}
                                />
                                <EditableText
                                    initialText={`${student?.class_hours} hr/class`}
                                    index={2}
                                />
                                <EditableText
                                    initialText={`${student?.class_id}`}
                                    index={3}
                                />
                                <EditableText
                                    initialText={student?.phone_number ? `(${student.phone_number.slice(0, 3)})-${student.phone_number.slice(3, 6)}-${student.phone_number.slice(6)}` : ""}
                                    index={4}
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
                        <div className="flex flex-wrap gap-4 pt-4">
                            {cardList}
                        </div>
                    </div>
                    <Toaster/>
                </div>
            )}
        />
    )
}