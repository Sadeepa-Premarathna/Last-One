# Form Validation Guide

## Overview
Comprehensive client-side validation has been added to all forms in the Daily Licious application to ensure data quality and improve user experience.

## Validation Features

### ✅ Real-time Validation
- **Instant Feedback**: Errors are displayed immediately when validation fails
- **Clear on Type**: Error messages disappear as users start correcting the field
- **Visual Indicators**: Invalid fields are highlighted with red borders and backgrounds
- **Submit Prevention**: Forms cannot be submitted until all errors are fixed

### 🎨 Visual Styling
- **Error State**: Red border (#ef4444) and light red background (#fef2f2)
- **Error Messages**: Displayed below each field in red text with clear explanations
- **Error Banner**: Overall error message at top of form when validation fails

---

## 1. Driver Form Validation

### Required Fields
- ✅ Driver ID
- ✅ First Name
- ✅ Last Name
- ✅ NIC
- ✅ License Number
- ✅ Contact Number
- ✅ Street Address
- ✅ City
- ✅ District
- ✅ Vehicle Number

### Validation Rules

#### NIC (National Identity Card)
- **Format**: 9 digits + V/X OR 12 digits
- **Pattern**: `^([0-9]{9}[vVxX]|[0-9]{12})$`
- **Examples**: 
  - Valid: `923456789V`, `199312345678`
  - Invalid: `12345`, `ABC123456V`

#### Contact Number
- **Format**: Sri Lankan phone number (10 digits)
- **Pattern**: `^(\+94|0)?[0-9]{9}$`
- **Examples**: 
  - Valid: `0771234567`, `+94771234567`, `771234567`
  - Invalid: `12345`, `077-123-4567`

#### Email
- **Format**: Standard email format
- **Pattern**: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- **Optional**: This field is not required but must be valid if provided

#### Vehicle Number
- **Required**: Must be provided
- **Example**: `ABC-1234`

---

## 2. Farmer Form Validation

### Required Fields
- ✅ Farmer ID
- ✅ First Name
- ✅ Last Name
- ✅ NIC
- ✅ Contact Number
- ✅ Street Address
- ✅ City
- ✅ District
- ✅ Number of Cows
- ✅ Bank Name
- ✅ Account Number
- ✅ Account Holder Name
- ✅ Branch

### Validation Rules

#### NIC & Contact Number
- Same rules as Driver Form (see above)

#### Number of Cows
- **Rule**: Must be greater than 0
- **Type**: Positive integer
- **Min Value**: 1

#### Bank Details
All bank fields are **required**:
- Bank Name
- Account Number
- Account Holder Name
- Branch

---

## 3. Delivery Form Validation

### Required Fields
- ✅ Delivery ID
- ✅ Driver (Selection)
- ✅ Delivery Date
- ✅ Customer Name
- ✅ Customer Contact Number
- ✅ Customer Street Address
- ✅ Customer City
- ✅ Product Name (for each product)
- ✅ Quantity > 0 (for each product)
- ✅ Price Per Unit > 0 (for each product)

### Validation Rules

#### Customer Contact Number
- Same validation as Driver/Farmer contact numbers
- Sri Lankan format: 10 digits

#### Product Validation
Each product in the order must have:
- **Product Name**: Non-empty string
- **Quantity**: Greater than 0
- **Price Per Unit**: Greater than 0
- **Total Price**: Auto-calculated (quantity × price per unit)

#### Multiple Products
- Can add multiple products
- Each product validated independently
- Must have at least one product
- Cannot remove the last product

---

## 4. Milk Collection Form Validation

### Required Fields
- ✅ Collection ID
- ✅ Farmer (Selection)
- ✅ Driver (Selection)
- ✅ Collection Date
- ✅ Quantity > 0
- ✅ Price Per Liter > 0

### Validation Rules

#### Quantity
- **Rule**: Must be greater than 0
- **Type**: Positive number (decimals allowed)
- **Unit**: Liters

#### Price Per Liter
- **Rule**: Must be greater than 0
- **Type**: Positive number (decimals allowed)

#### Quality Metrics (Optional but Validated)
If provided, these must be valid:
- **Fat Content**: Cannot be negative
- **SNF (Solids Not Fat)**: Cannot be negative
- **Temperature**: Cannot be negative

---

## Error Messages

### Common Error Messages

#### Required Field Errors
- "Driver ID is required"
- "First name is required"
- "Contact number is required"

#### Format Errors
- "Invalid NIC format (9 digits + V or 12 digits)"
- "Invalid phone number (10 digits)"
- "Invalid email format"

#### Value Errors
- "Quantity must be greater than 0"
- "Number of cows must be greater than 0"
- "Price must be greater than 0"

#### General Error
- "Please fix the errors in the form" (shown at top when validation fails)

---

## User Experience

### How Validation Works

1. **On Submit**: All fields are validated
2. **On Change**: Individual field errors are cleared as user types
3. **Visual Feedback**: Invalid fields are highlighted immediately
4. **Error Text**: Clear messages explain what's wrong
5. **Prevention**: Cannot submit until all errors are fixed

### Example Workflow

```
User fills form → Submits → Validation runs → Errors shown (if any)
                                              ↓
User fixes field → Error clears → Submits again → Success!
```

---

## CSS Classes Used

### Input States
```css
/* Normal state */
.form-group input { border: 2px solid #e5e7eb; }

/* Focus state */
.form-group input:focus { border-color: #667eea; }

/* Error state */
.form-group input.error { 
  border-color: #ef4444; 
  background: #fef2f2; 
}
```

### Error Messages
```css
/* Error text below field */
.error-text { 
  color: #dc2626; 
  font-size: 0.8rem; 
}

/* Error banner at top */
.error-message { 
  background: #fef2f2; 
  border: 1px solid #fecaca; 
  color: #dc2626; 
}
```

---

## Implementation Details

### State Management
Each form now has:
```javascript
const [errors, setErrors] = useState({});
```

### Validation Function
Each form has a `validateForm()` function that:
1. Creates a `newErrors` object
2. Checks each field against rules
3. Adds error messages to the object
4. Returns `true` if no errors, `false` if errors exist

### Example Validation
```javascript
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.firstName.trim()) {
    newErrors.firstName = 'First name is required';
  }
  
  const nicPattern = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
  if (!nicPattern.test(formData.nic)) {
    newErrors.nic = 'Invalid NIC format';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## Testing Checklist

### For Each Form, Test:
- [ ] All required fields show errors when empty
- [ ] NIC validation (try invalid formats)
- [ ] Phone number validation (try invalid formats)
- [ ] Email validation (if applicable)
- [ ] Numeric fields accept only valid numbers
- [ ] Errors clear when field is corrected
- [ ] Form submits successfully when all fields are valid
- [ ] Error banner shows when validation fails
- [ ] Visual highlighting works (red borders)

---

## Future Enhancements

### Potential Additions
1. **Server-side Validation**: Backend validation to complement frontend
2. **Async Validation**: Check if Driver ID/Farmer ID already exists
3. **Password Strength**: If authentication is added
4. **Date Validation**: Ensure dates are not in past (for deliveries)
5. **Custom Rules**: Business-specific validation rules
6. **Tooltips**: Hover hints for complex validation rules

---

## Summary

✅ **All 4 forms** now have comprehensive validation
✅ **Sri Lankan formats** supported (NIC, phone numbers)
✅ **Real-time feedback** for better UX
✅ **Visual indicators** for errors
✅ **Clear error messages** to guide users
✅ **Submit prevention** until valid

The validation system ensures data quality while providing a smooth user experience!
