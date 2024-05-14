import {
  Box,
  Breadcrumbs,
  SxProps,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import React from 'react'

interface IBreadcrumb {
  label: string
  to: string
}

interface Props {
  title?: string
  breadcrumbs?: IBreadcrumb[]
  children: React.ReactNode
  actionBtns?: React.ReactNode
  sx?: SxProps
}

const PageContainer = ({
  title,
  breadcrumbs,
  children,
  actionBtns,
  sx = {},
}: Props) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 5,
        }}
      >
        {title && (
          <Box>
            <Typography
              sx={{ fontWeight: 600, fontSize: 18 }}
            >
              {title}
            </Typography>
          </Box>
        )}

        {breadcrumbs && (
          <Breadcrumbs>
            {breadcrumbs.map((_breadcrumb, i) =>
              breadcrumbs.length !== i + 1 ? (
                <Link
                  key={_breadcrumb.label}
                  href={_breadcrumb.to}
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  <Typography variant='h5'>
                    {_breadcrumb.label}
                  </Typography>
                </Link>
              ) : (
                <Typography
                  key={_breadcrumb.label}
                  variant='h5'
                >
                  {_breadcrumb.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>
        )}
        {actionBtns && <Box>{actionBtns}</Box>}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default PageContainer
