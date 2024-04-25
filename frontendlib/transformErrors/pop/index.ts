export function transformErrors(formData: any, errors: any) {
    const controlPoints = formData?.controlPoints;
    controlPoints?.map((cp: any, index: any) => {
        if (cp.days.end < cp.days.start) {
            errors.push({
                stack: `Start Day should be less than End day in control points`,
                property: `.controlPoints.[${index}].days.start`,
                schemaPath: '#/definitions/DaysRange/required',
                message: `Start Day should be less than End day in control points`,
            });
        }
        if (cp.activityType !== 'Plantation') {
            if (cp.days.start === 0 || cp.days.end === 0) {
                errors.push({
                    stack: `Start Day cannot be zero in control points`,
                    property: `.controlPoints.[${index}].days.start`,
                    schemaPath: '#/definitions/DaysRange/required',
                    message: `Start Day cannot be zero in control points`,
                });
                errors.push({
                    stack: `End Day cannot be zero in control points`,
                    property: `.controlPoints.[${index}].days.end`,
                    schemaPath: '#/definitions/DaysRange/required',
                    message: `End Day cannot be zero in control points`,
                });
            }
        }
    })
    return errors;
}