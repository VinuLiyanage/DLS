import { createSlice } from '@reduxjs/toolkit'

export const receiptSlice = createSlice({
    name: 'receipts',
    initialState: {
        value: 0,
    },
    reducers: {
        getReceipts: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { getReceipts } = receiptSlice.actions
export const selectReceipts = (state) => state.receipts.value
export default receiptSlice.reducer