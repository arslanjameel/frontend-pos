import {
  Box,
  Button,
  Card,
  Typography,
} from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import AddReferenceModal from 'src/components/customers/AddReferenceModal'
import ReferenceForm from 'src/components/customers/ReferenceForm'
import { useModal } from 'src/hooks/useModal'
import { IReferenceNew } from 'src/models/IReference'
import {
  useCreateReferenceMutation,
  useGetReferencesQuery,
} from 'src/store/apis/customersSlice'

interface Props {
  customerId: number
}

const ReferencesTab = ({ customerId }: Props) => {
  const {
    openModal: openAddRefModal,
    closeModal: closeAddRefModal,
    isModalOpen: refModalStatus,
  } = useModal<any>()

  const { data: references } = useGetReferencesQuery()

  const [createReference] = useCreateReferenceMutation()

  const _createNewReference = (values: IReferenceNew) => {
    createReference({ ...values, customer: [customerId] })
      .unwrap()
      .then(() => {
        toast.success('Reference Added Successfully')
        closeAddRefModal()
      })
      .catch(() => toast.error('An error occured'))
  }

  return (
    <>
      <Card sx={{ pt: 3 }}>
        {(references ? references.results : []).map(
          (ref, id) => (
            <ReferenceForm
              key={ref.id}
              title={`Reference ${id + 1}`}
              defaultValues={ref}
            />
          ),
        )}

        {(references ? references.results : []).length ===
          0 && (
          <Typography mx={4} fontStyle='italic'>
            No References Added
          </Typography>
        )}

        <Box
          sx={{
            pb: 4,
            px: 4,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant='contained'
            startIcon={<Icon icon='tabler:plus' />}
            disabled={
              (references
                ? references.results.length
                : 3) >= 3
            }
            onClick={() => openAddRefModal(1)}
          >
            Add Reference
          </Button>
        </Box>
      </Card>

      <AddReferenceModal
        open={refModalStatus()}
        handleClose={closeAddRefModal}
        onSubmit={_createNewReference}
      />
    </>
  )
}

export default ReferencesTab
