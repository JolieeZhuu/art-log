// https://www.youtube.com/watch?v=DVqVQwg_6_4

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type Student = {
    id: string;
    day: DayOfWeek;
    name: string;
    phone_number: string;
    class_id: string;
    time_expected: string;
    class_hours: number;
};

export type Column = {
    id: DayOfWeek;
    title: string;
};