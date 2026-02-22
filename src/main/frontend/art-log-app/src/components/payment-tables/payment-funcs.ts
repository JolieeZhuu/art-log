// External imports
import dayjs from 'dayjs'

// Internal imports
import { getById, edit, add, getByTermIdAndStudentIdAndClassNumber, getTermTableByStudentIdAndTableNum } from '../../restAPI/entities'

// Initializations
const studentUrl = "http://localhost:8080/student/"
const attendanceUrl = "http://localhost:8080/attendance/"
const termUrl = "http://localhost:8080/term/"

export async function getTableNum(id: number) {

    const student = await getById(studentUrl, id)

    return student.curr_table
}

export async function addTableNum(id: number) {
    const student = await getById(studentUrl, id)
    const currTerm = student.curr_table + 1 // Payment made, thus new table
    const data = {
        student_id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        class_id: student.class_id,
        day: student.day,
        phone_number: student.phone_number,
        time_expected: student.time_expected,
        general_notes: student.general_notes,
        curr_table: currTerm,
        curr_class: 0,
        class_hours: student.class_hours,
    }

    await edit(studentUrl, data)
    return currTerm
}

export async function addNewPaymentTable(id: number, date: Date, tableNum: number, numOfClasses: number) {
    const student = await getById(studentUrl, id)

    const data1 = {
        student_id: id,
        total_classes: numOfClasses,
        table_num: tableNum
    } // Term entity

    await add(termUrl, data1);
    const termTable = await getTermTableByStudentIdAndTableNum(termUrl, id, tableNum);

    const data2 = {
        student_id: id,
        term_id: termTable.term_id,
        class_number: 1,
        date_expected: date,
        hours: 1
    } // create first class Attendance entity

    const data3 = {
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
        class_hours: student.class_hours
    } // Make changes to Student entity
    
    await add(attendanceUrl, data2)
    await generateClasses(id, termTable.term_id, date.toString(), numOfClasses) // generates remaining 

    await edit(studentUrl, data3)
}

async function generateClasses(id: number, termId: number, date: string, numOfClasses: number) {
    // Generates remaining classes after the first one
    // Classes are 7 days apart
    for (let i = 2; i <= numOfClasses; i++) {
        const nextClassDate = dayjs(date).add(7*(i-1), 'days').toDate()
        const data = {
            student_id: id,
            term_id: termId,
            class_number: i,
            date_expected: nextClassDate,
            hours: 1
        }

        await add(attendanceUrl, data)
    }
}

export async function getTotalClasses(studentId: number) {
    const student = await getById(studentUrl, studentId)
    return student.total_classes
}

export async function addClass(tableNum: number, id: number) {
    const termTable = await getTermTableByStudentIdAndTableNum(termUrl, id, tableNum)
    const lastClass = await getByTermIdAndStudentIdAndClassNumber(attendanceUrl, termTable.term_id, id, termTable.total_classes)
    

    // Generate the new class 7 days apart from the last class
    const lastDate = lastClass.date_expected
    const nextClassDate = dayjs(lastDate).add(7, 'days').toDate()
    const data1 = {
        student_id: id,
        term_id: termTable.term_id,
        class_number: termTable.total_classes + 1,
        date_expected: nextClassDate,
        hours: 1
    }

    await add(attendanceUrl, data1)

    // Edit the student so that total classes += 1

    const data2 = {
        term_id: termTable.term_id,
        student_id: id,
        total_classes: termTable.total_classes + 1,
        payment_notes: termTable.payment_notes,
        term_notes: termTable.term_notes,
        table_num: termTable.table_num
    }

    await edit(termUrl, data2)

    const toSend = await getByTermIdAndStudentIdAndClassNumber(attendanceUrl, termTable.term_id, id, termTable.total_classes + 1)
    return toSend
}

export function convertTo24Hour(timeStr: string | undefined) {
    // ex: 9:15 PM to 21:15:00
    if (timeStr === undefined) {
        return null
    }
    const converted = dayjs(`2025-01-01 ${timeStr}`).format("HH:mm:ss")
    return converted
}

export function convertTo12Hour(timeStr: string | undefined) {
    // ex: 21:15:00 to 9:15 PM 
    if (timeStr === undefined) {
        return ""
    }
    const converted = dayjs(`2025-01-01 ${timeStr}`).format("h:mm A")
    return converted
}