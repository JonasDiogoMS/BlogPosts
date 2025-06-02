import { createSlice } from '@reduxjs/toolkit';

type FakeUserState = {
  name: string;
  username: string;
  avatar: string;
  userId: number;
};

const initialState: FakeUserState = {
  name: 'Jonas Diogo',
  username: '@jonasdiogo',
  avatar: `https://ui-avatars.com/api/?name=Jonas%20Diogo&size=150&background=random`,
  userId: 0,
};

const fakeUserSlice = createSlice({
  name: 'fakeUser',
  initialState,
  reducers: {
    setFakeUser(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setFakeUser } = fakeUserSlice.actions;
export default fakeUserSlice.reducer;
