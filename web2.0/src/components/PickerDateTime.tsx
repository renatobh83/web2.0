import { useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


interface DateTimePickeProps {
    label: string
    onDateChange: (date: any) => void;  // Função callback passada pelo componente pai
}

export function PickerDateTime({ onDateChange, label }: DateTimePickeProps) {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (newValue: any) => {
        setSelectedDate(newValue);
        onDateChange(newValue);  // Passa o valor atualizado para o componente pai
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label={label}
                value={selectedDate}
                onChange={(newDate) => handleDateChange(newDate)}

            />
        </LocalizationProvider>
    );
}