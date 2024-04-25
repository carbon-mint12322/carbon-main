export function transformErrors(formData: any, errors: any) {
    const days = formData?.days;
        if (days.end < days.start) {
            errors.push({
                stack: `Start Day should be less than End day in control points`,
                property: `.days.start`,
                schemaPath: '#/definitions/DaysRange/required',
                message: `Start Day should be less than End day in control points`,
            });
        }
    if (formData.activityType !== 'Plantation') {
        if (days.start === 0 || days.end === 0) {
                errors.push({
                    stack: `Start Day cannot be zero in control points`,
                    property: `.days.start`,
                    schemaPath: '#/definitions/DaysRange/required',
                    message: `Start Day cannot be zero in control points`,
                });
                errors.push({
                    stack: `End Day cannot be zero in control points`,
                    property: `.days.end`,
                    schemaPath: '#/definitions/DaysRange/required',
                    message: `End Day cannot be zero in control points`,
                });
        }
    }
    return errors;
}