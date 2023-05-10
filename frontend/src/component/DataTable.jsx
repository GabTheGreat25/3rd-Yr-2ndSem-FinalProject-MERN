import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Pagination from "@mui/material/Pagination";
import { generateKey } from "@generateKey";
import { splitKey, deconstruct, manipulate } from "@dataTable";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { RESOURCE } from "@/constants";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2c3e50",
    color: "#f1f2f6",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: RESOURCE.NUMBER.FOURTEEN,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: RESOURCE.NUMBER.ZERO,
  },
}));

export default function (props) {
  const { headers = [], data = [], keys = [], actions = [] } = props;
  const [page, setPage] = React.useState(RESOURCE.NUMBER.ONE);
  const [filteredData, setFilteredData] = React.useState(data || []);

  const [searchQuery, setSearchQuery] = React.useState("");
  const rowsPerPage = RESOURCE.NUMBER.FOUR;
  const [sorting, setSorting] = React.useState({
    column: null,
    key: null,
    direction: null,
  });
  const hasActions = actions.length > RESOURCE.NUMBER.ZERO;

  const handleClickHeader = (column) => {
    const isAscending =
      sorting.column === column && sorting.direction === RESOURCE.ASCENDING;
    setSorting({
      column,
      direction: isAscending ? RESOURCE.DESCENDING : RESOURCE.ASCENDING,
    });
    const newFilteredData = filteredData.sort((a, b) => {
      if (isAscending) {
        return a[column] > b[column]
          ? RESOURCE.NUMBER.NEGATIVE_ONE
          : RESOURCE.NUMBER.ONE;
      } else
        return a[column] > b[column]
          ? RESOURCE.NUMBER.ONE
          : RESOURCE.NUMBER.NEGATIVE_ONE;
    });

    newFilteredData.sort((a, b) => {
      if (a[keys] < b[keys])
        return direction === RESOURCE.ASCENDING
          ? RESOURCE.NUMBER.NEGATIVE_ONE
          : RESOURCE.NUMBER.ONE;

      if (a[keys] > b[keys])
        return direction === RESOURCE.ASCENDING
          ? RESOURCE.NUMBER.ONE
          : RESOURCE.NUMBER.NEGATIVE_ONE;

      return RESOURCE.NUMBER.ZERO;
    });
    setFilteredData(newFilteredData);
  };

  const filter = (query) => {
    const newData = data?.filter((row) => {
      return Object.values(row)?.some((column) => {
        if (typeof column !== RESOURCE.STRING) {
          return false;
        }
        return column.toLowerCase().includes(query.toLowerCase());
      });
    });

    setFilteredData(newData);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - RESOURCE.NUMBER.ONE) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData =
    filteredData && filteredData.slice(startIndex, endIndex);

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Autocomplete
          freeSolo
          disableClearable
          options={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              variant="outlined"
              onChange={(event) => setSearchQuery(event.target.value)}
              onInput={(event) => {
                setSearchQuery(event.target.value);
                filter(event.target.value);
              }}
            />
          )}
          value={searchQuery}
        />
      </div>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: RESOURCE.NUMBER.SEVEN_HUNDRED }}
          aria-label="customized table"
        >
          {headers && headers.length > RESOURCE.NUMBER.ZERO && (
            <TableHead>
              <TableRow>
                {headers?.map((header) => (
                  <StyledTableCell
                    key={generateKey(RESOURCE.NUMBER.FIVE)}
                    align="center"
                    onClick={() => handleClickHeader(header)}
                  >
                    {header}
                    {sorting && sorting.column === header && (
                      <span>
                        {sorting.direction === RESOURCE.ASCENDING ? " ▲" : " ▼"}
                      </span>
                    )}
                  </StyledTableCell>
                ))}

                {hasActions && (
                  <StyledTableCell align="center">Actions</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {paginatedData &&
              paginatedData?.map((paginatedRow) => {
                const rowKeys =
                  keys.length > RESOURCE.NUMBER.ZERO
                    ? splitKey(generateKey(RESOURCE.NUMBER.FIVE), keys)
                    : null;
                deconstruct(paginatedRow, headers, rowKeys);
                return (
                  <StyledTableRow key={generateKey(RESOURCE.NUMBER.FIVE)}>
                    {keys?.map((e) => {
                      const { key, operation } = e;
                      const splitted = splitKey(key);
                      const hasOperation = operation;
                      let tempValue = paginatedRow[key];

                      if (splitted.length > RESOURCE.NUMBER.ONE)
                        tempValue = deconstruct(splitted, paginatedRow);

                      return (
                        <StyledTableCell
                          key={generateKey(RESOURCE.NUMBER.FIVE)}
                          align="center"
                        >
                          {hasOperation
                            ? manipulate(tempValue, paginatedRow, hasOperation)
                            : tempValue}
                        </StyledTableCell>
                      );
                    })}
                    {hasActions && (
                      <StyledTableCell align="center">
                        <ButtonGroup>
                          {actions?.map((action) => (
                            <Button
                              sx={{
                                backgroundColor: "#2c3e50",
                                marginRight: " .5rem",
                                color: "#dfe4ea",
                                "&:hover": {
                                  backgroundColor: "#dfe4ea",
                                  color: "#2c3e50",
                                  transition: "transform 0.2s ease-in-out",
                                  transform: "scale(1.1)",
                                  borderColor: "#2c3e50",
                                },
                              }}
                              key={generateKey(RESOURCE.NUMBER.FIVE)}
                              onClick={() => {
                                action.onClick(paginatedRow[RESOURCE.ID]);
                              }}
                            >
                              {action.title}
                            </Button>
                          ))}
                        </ButtonGroup>
                      </StyledTableCell>
                    )}
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(data.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
        }}
      />
    </>
  );
}
