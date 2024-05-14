import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'

const fakeRolesPageData = [
  {
    id: 1,
    name: 'Snow',
    assignedTo: ['Administrator'],
    createdDate: new Date().toDateString(),
  },
  {
    id: 2,
    name: 'Lannister',
    assignedTo: ['Administrator', 'Manager'],
    createdDate: new Date().toDateString(),
  },
  {
    id: 3,
    name: 'Lannister',
    assignedTo: ['Administrator', 'Manager'],
    createdDate: new Date().toDateString(),
  },
  {
    id: 4,
    name: 'Stark',
    assignedTo: ['Administrator', 'Manager'],
    createdDate: new Date().toDateString(),
  },
  {
    id: 5,
    name: 'Targaryen',
    assignedTo: ['Administrator', 'Manager'],
    createdDate: new Date().toDateString(),
  },
]

interface IUsersRoles {
  id: number
  name: string
  assignedTo: string[]
  createdDate: string
}

interface InitialState {
  usersRoles: IUsersRoles[]
}

const initialState: InitialState = {
  usersRoles: fakeRolesPageData,
}

const rolesPermissions = createSlice({
  name: 'rolesPermissions',
  initialState,
  reducers: {
    deleteUserPermission: (
      state,
      action: PayloadAction<number>,
    ) => {
      return {
        ...state,
        usersRoles: [
          ...state.usersRoles.filter(
            ur => ur.id !== action.payload,
          ),
        ],
      }
    },
  },
})

export const { deleteUserPermission } =
  rolesPermissions.actions
export default rolesPermissions.reducer
