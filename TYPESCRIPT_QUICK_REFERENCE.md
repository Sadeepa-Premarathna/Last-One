# TypeScript Quick Reference - Daily Licious

## 🎯 Quick Start

### Import Types
```typescript
import { Driver, Farmer, Payment, APIResponse } from '../../types';
```

### Component Template
```typescript
import React, { useState } from 'react';

const MyComponent: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  
  return <div>Content</div>;
};

export default MyComponent;
```

---

## 📝 Common Patterns

### State
```typescript
const [value, setValue] = useState<string>('');
const [items, setItems] = useState<Item[]>([]);
const [isOpen, setIsOpen] = useState<boolean>(false);
const [data, setData] = useState<DataType | null>(null);
```

### Event Handlers
```typescript
// Form submit
(e: React.FormEvent<HTMLFormElement>) => void

// Input change  
(e: ChangeEvent<HTMLInputElement>) => void

// Select change
(e: ChangeEvent<HTMLSelectElement>) => void

// Button click
(e: React.MouseEvent<HTMLButtonElement>) => void

// Generic handler
(e: React.SyntheticEvent) => void
```

### API Calls
```typescript
const response = await api.get<APIResponse<Payment[]>>('/payments');
const data = response.data.data || response.data;
setPayments(Array.isArray(data) ? data : []);
```

### Functions
```typescript
const fetchData = async (): Promise<void> => {
  // async logic
};

const handleSubmit = (e: React.FormEvent): void => {
  e.preventDefault();
};

const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};
```

---

## 🔧 Type Definitions

### Available Types
- Driver, Farmer, Delivery, MilkCollection
- Order, Payment, PaymentStats
- QualityMetrics, BankDetails
- OrderItem, DeliveryItem
- APIResponse<T>, FormErrors

### Usage
```typescript
import { Payment, PaymentStats } from '../../types';

const [payment, setPayment] = useState<Payment | null>(null);
const [stats, setStats] = useState<PaymentStats>({
  totalPaid: 0,
  totalPending: 0,
  completedPayments: 0,
  pendingPayments: 0
});
```

---

## ✅ Checklist for Conversion

- [ ] Rename file: .js → .tsx
- [ ] Import types from '../../types'
- [ ] Add React.FC to component
- [ ] Type all useState hooks
- [ ] Type all function parameters
- [ ] Type all function returns
- [ ] Type event handlers
- [ ] Type API responses
- [ ] Test the component
- [ ] Delete old .js file

---

## 📚 Full Documentation

**TYPESCRIPT_CONVERSION_GUIDE.md** - Complete patterns & examples
**TYPESCRIPT_CONVERSION_SUMMARY.md** - Progress & metrics

---

**TypeScript**: v5.9.3 | **React**: v19.2.0
