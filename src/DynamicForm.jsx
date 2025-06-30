import { useState } from 'react'

const formSchema = [
    { label: 'Name', type: 'text', name: 'name', required: true, minLength: 3 },
    { label: 'Email', type: 'email', name: 'email', required: true },
    { label: 'Age', type: 'number', name: 'age', required: false, min: 18, max: 100 },
    { label: 'Gender', type: 'select', name: 'gender', required: true, options: ['Male', 'Female', 'Other'] },
    { label: 'Subscribe to newsletter', type: 'checkbox', name: 'subscribe', required: false }
]

function DynamicForm() {
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})
    const [submittedData, setSubmittedData] = useState(null)

    const validateField = (field, value) => {
        if (field.required && !value) return field.label + ' is required'
        if (value) {
            if ((field.type === 'text' || field.type === 'email') && field.minLength && value.length < field.minLength) return field.label + ' must be at least ' + field.minLength + ' characters'
            if ((field.type === 'text' || field.type === 'email') && field.maxLength && value.length > field.maxLength) return field.label + ' must be at most ' + field.maxLength + ' characters'
            if (field.type === 'email' && !/\S+@\S+\.\S+/.test(value)) return 'Invalid email address'
            if (field.type === 'number') {
                const numValue = Number(value)
                if (field.min && numValue < field.min) return field.label + ' must be at least ' + field.min
                if (field.max && numValue > field.max) return field.label + ' must be at most ' + field.max
            }
        }
        return ''
    }

    const handleChange = e => {
        const { name, value, type, checked } = e.target
        const fieldValue = type === 'checkbox' ? checked : value
        setFormData(prev => ({ ...prev, [name]: fieldValue }))
        const field = formSchema.find(f => f.name === name)
        const error = validateField(field, fieldValue)
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        const newErrors = {}
        let isValid = true
        formSchema.forEach(field => {
            const value = formData[field.name]
            const error = validateField(field, value)
            if (error) {
                newErrors[field.name] = error
                isValid = false
            }
        })
        setErrors(newErrors)
        if (isValid) setSubmittedData(formData)
    }

    const renderField = field => {
        const commonProps = {
            name: field.name,
            id: field.name,
            value: formData[field.name] || '',
            onChange: handleChange,
            required: field.required
        }
        if (field.type === 'select') {
            return (
                <select {...commonProps}>
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            )
        }
        if (field.type === 'checkbox') {
            return (
                <input type="checkbox" checked={formData[field.name] || false} {...commonProps} />
            )
        }
        return (
            <input
                type={field.type}
                {...commonProps}
                {...(field.min && { min: field.min })}
                {...(field.max && { max: field.max })}
                {...(field.minLength && { minLength: field.minLength })}
                {...(field.maxLength && { maxLength: field.maxLength })}
            />
        )
    }

    return (
        <div className="form-container">
            <h1 className="text-2xl font-bold mb-4 text-center">Dynamic Form Generator</h1>
            <form onSubmit={handleSubmit}>
                {formSchema.map(field => (
                    <div key={field.name} className="form-field">
                        <label htmlFor={field.name}>
                            {field.label}
                            {field.required && <span className="required">*</span>}
                        </label>
                        {renderField(field)}
                        {errors[field.name] && <span className="error">{errors[field.name]}</span>}
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
            {submittedData && (
                <div className="submitted-data">
                    <h2>Submitted Data:</h2>
                    <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}

export default DynamicForm
