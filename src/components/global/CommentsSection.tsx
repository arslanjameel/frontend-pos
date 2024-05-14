import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import { useWindowSize } from 'src/hooks/useWindowSize'
import BoxIconButton from './BoxIconButton'
import { IComment } from 'src/models/IComment'
import { useCreateCommentMutation } from 'src/store/apis/customersSlice'
import { useAuth } from 'src/hooks/useAuth'
import Comment from '../customers/Comment'

interface Props {
  comments?: IComment[]
  customerId?: number
}

const CommentsSection = ({
  comments = [],
  customerId,
}: Props) => {
  const { user } = useAuth()
  const { isMobileSize } = useWindowSize()

  const [createComment, { isLoading }] =
    useCreateCommentMutation()

  const [newComment, setNewComment] = useState('')

  const onSend = () => {
    if (newComment.trim() !== '') {
      createComment({
        comment: newComment,
        commentBy: user?.id || 0,
        customer: customerId || 1,
      })
        .unwrap()
        .then(() => {
          toast.success('Comment sent')
          setNewComment('')
        })
        .catch(() => toast.error('An error occured'))
    }
  }

  return (
    <Card sx={{ pt: 4 }}>
      <Typography
        variant='h5'
        sx={{ fontWeight: 600, pb: 2, px: 3 }}
      >
        Comments
      </Typography>

      <Box>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          borderTop: '1.5px solid #ccccccb6',
          position: 'relative',
          height: 50,
        }}
      >
        <input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder='Type your message here...'
          style={{
            border: 'none',
            flex: 1,
            fontSize: 16,
            paddingLeft: 10,
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            pr: 2,
            gap: 1,
          }}
        >
          <IconButton>
            <Icon icon='tabler:photo' />
          </IconButton>

          {isMobileSize ? (
            <BoxIconButton
              disabled={isLoading}
              icon='tabler:send'
              onClick={onSend}
            />
          ) : (
            <Button
              disabled={isLoading}
              variant='contained'
              onClick={onSend}
            >
              Send
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  )
}

export default CommentsSection
