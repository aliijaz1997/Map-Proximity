import { createSlice } from "@reduxjs/toolkit";

const presenceChannelSlice = createSlice({
  name: "presenceChannel",
  initialState: {
    activeDrivers: [],
  },
  reducers: {
    setActiveDrivers: (state, { payload }) => {
      const newMembers = payload.filter((newMember) =>
        state.activeDrivers.every(
          (existingMember) => existingMember.id !== newMember.id
        )
      );

      state.activeDrivers = [...state.activeDrivers, ...newMembers];
    },

    changeDriverStatus: (state, { payload }) => {
      const { id, status } = payload;
      const memberIndex = state.activeDrivers.findIndex(
        (member) => member.id === id
      );

      if (memberIndex !== -1) {
        const updatedMembers = [...state.activeDrivers];
        updatedMembers[memberIndex].info.driverStatus = status;
        state.activeDrivers = updatedMembers;
      }
    },
  },
});

export default presenceChannelSlice.reducer;

export const { changeDriverStatus, setActiveDrivers } =
  presenceChannelSlice.actions;
