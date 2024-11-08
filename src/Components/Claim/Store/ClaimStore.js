import { configureStore } from '@reduxjs/toolkit';
import receiptReducer  from "../Slice/ClaimSlice";

export default configureStore({
    reducer: {
        receipts: receiptReducer,
    },
});