import React from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { format } from 'date-fns'

import { IComment } from 'src/models/IComment'
import { useGetSingleUserQuery } from 'src/store/apis/accountSlice'
import { getFullName } from 'src/utils/dataUtils'

interface Props {
  comment: IComment
}

const Comment = ({ comment }: Props) => {
  const { data } = useGetSingleUserQuery(comment.commentBy)

  return (
    <Box
      key={comment.id}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        borderTop: '1.5px solid #ccccccb6',
        p: 2,
        px: 4,
        my: 2,
      }}
    >
      <Avatar src='add-img-link' />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>
          {data ? getFullName(data) : '--'}
        </Typography>
        <Typography
          sx={{ color: '#6f6b7d', fontWeight: 400 }}
        >
          {comment.comment}
        </Typography>
        <Typography sx={{ color: '#979797' }}>
          {format(
            new Date(comment.createdAt),
            'HH:mm, dd MMM yyyy',
          )}
        </Typography>
      </Box>
    </Box>
  )
}

export default Comment
