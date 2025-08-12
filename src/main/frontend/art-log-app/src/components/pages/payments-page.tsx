import { useState, useEffect, useRef } from "react"
import { Archive } from "lucide-react"

// External imports
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

// Internal imports
import Layout from "@/components/navbar/layout"
import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"
import { SiteHeader } from "@/components/navbar/site-header"
import { getById } from "@/restAPI/entities"
import { getPaymentNum, addClass } from "@/components/payment-tables/payment-funcs"
import PaymentTable from "@/components/payment-tables/payments-table-page"

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

type Student = {
    student_id: number
    first_name: string
    last_name: string
    day: string
    class_id: string
    phone_number: string
    time_expected: string
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
                                    <Badge variant="secondary">{student.total_classes} classes</Badge>
                                    <Badge variant="secondary">{student.class_hours} h/class</Badge>
                                    <Badge variant="secondary">{student.payment_notes}</Badge>
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
                    <div className="mt-4">
                        <SiteHeader heading={`${student?.first_name} ${student?.last_name}`}/>
                        <div className="flex justify-between items-center gap-4 pt-4">
                            <div className="flex gap-4">
                                <Badge variant="secondary">{student?.day[0]}{student?.day.substring(1)}</Badge>
                                <Badge variant="secondary">{student?.time_expected}</Badge>
                                <Badge variant="secondary">{student?.class_id}</Badge>
                                <Badge variant="secondary">{student?.phone_number}</Badge>
                            </div>
                            <div className="flex gap-4">
                                <DialogPaymentForm id={id} onPaymentAdded={loadCards}/>
                                <Button variant="outline" size="icon" asChild>
                                    <a href={`#/students/${id}/archives`}>
                                        <Archive className="h-[1.2rem] w-[1.2rem]"/>
                                        <span className="sr-only">Payment table archives</span>
                                    </a>
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