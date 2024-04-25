function numberFormatter(value: number) {
    if (value === null || value === undefined) {
        return '-';
    }
    return "" + value;
}

export default numberFormatter;