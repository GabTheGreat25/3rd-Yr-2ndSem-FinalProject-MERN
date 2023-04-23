import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Pagination from '@mui/material/Pagination'
import { generateKey } from '../services/generateKey'
import { splitKey, deconstruct, manipulate } from '../services/dataTable'
import { Fragment } from 'react'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#2c3e50',
    color: '#f1f2f6',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function (props) {
  const { headers = [], data = [], keys = [], actions = [] } = props
  const [page, setPage] = React.useState(1)
  const [filteredData, setFilteredData] = React.useState(data)
  const [searchQuery, setSearchQuery] = React.useState('')
  const rowsPerPage = 2

  const hasActions = actions.length > 0

  const filter = (query) => {
    const newData = data.filter((row) => {
      return Object.values(row).some((column) => {
        if (typeof column !== 'string') {
          return false
        }
        return column.toLowerCase().includes(query.toLowerCase())
      })
    })

    setFilteredData(newData)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedData = filteredData && filteredData.slice(startIndex, endIndex)

  const handleSearch = () => {
    // Reset to first page when searching
    setPage(1)

    // Filter the data based on the search query
    filter(searchQuery)
  }

  return (
    <TableContainer component={Paper}>
      <div>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        {headers && headers.length > 0 && (
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <StyledTableCell key={generateKey(5)} align="center">
                  {header}
                </StyledTableCell>
              ))}

              {hasActions && (
                <StyledTableCell align="center">Actions</StyledTableCell>
              )}
            </TableRow>
          </TableHead>
        )}

        <TableBody>
          {filteredData &&
            filteredData.map((row) => {
              const rowKeys =
                keys.length > 0 ? splitKey(generateKey(), keys) : null
              const rowData = deconstruct(row, headers, rowKeys)
              return (
                <Fragment key={generateKey(5)}>
                  {paginatedData.map((paginatedRow) => {
                    return (
                      <StyledTableRow key={generateKey(5)}>
                        {keys.map((e) => {
                          const { key, operation } = e
                          const splitted = splitKey(key)
                          const hasOperation = operation
                          let tempValue = paginatedRow[key]

                          if (splitted.length > 1)
                            tempValue = deconstruct(splitted, paginatedRow)

                          return (
                            <StyledTableCell
                              key={generateKey(5)}
                              align="center"
                            >
                              {hasOperation
                                ? manipulate(
                                    tempValue,
                                    paginatedRow,
                                    hasOperation,
                                  )
                                : tempValue}
                            </StyledTableCell>
                          )
                        })}
                        {hasActions && (
                          <StyledTableCell align="center">
                            <ButtonGroup>
                              {actions.map((action) => (
                                <Button
                                  sx={{
                                    backgroundColor: '#2c3e50',
                                    marginRight: ' .5rem',
                                    color: '#dfe4ea',
                                    '&:hover': {
                                      backgroundColor: '#dfe4ea',
                                      color: '#2c3e50',
                                      transition: 'transform 0.2s ease-in-out',
                                      transform: 'scale(1.1)',
                                      borderColor: '#2c3e50',
                                    },
                                  }}
                                  key={generateKey(5)}
                                  onClick={() => {
                                    action.onClick(paginatedRow['_id'])
                                  }}
                                >
                                  {action.title}
                                </Button>
                              ))}
                            </ButtonGroup>
                          </StyledTableCell>
                        )}
                      </StyledTableRow>
                    )
                  })}
                </Fragment>
              )
            })}
        </TableBody>
      </Table>
      <Pagination
        count={Math.ceil(data.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem',
        }}
      />
    </TableContainer>
  )
}
