// https://www.youtube.com/watch?v=DVqVQwg_6_4

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type Student = {
    id: string;
    day: DayOfWeek;
    name: string;
};

export type Column = {
    id: DayOfWeek;
    title: string;
};