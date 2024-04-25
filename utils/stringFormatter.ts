function stringFormatter(value: any) {
    if (value === null || value === undefined) {
        return '-';
    }
    return "" + value;
}

export default stringFormatter;