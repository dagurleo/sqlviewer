import React from 'react'
import styled from 'styled-components'
export const TableContainer = ({ data }) => {
  const headers = data?.fields.map(f => f.name)
  const rows = data?.rows
  return (
    <TableWrapper>
      <TableHead>
        <TableRow>{headers && headers.map(h => <th>{h}</th>)}</TableRow>
      </TableHead>
      <TableBody>
        {rows &&
          rows.map(r => (
            <TableRow>
              {headers &&
                headers.map(h => (
                  <TableCell>
                    {r[h] === true
                      ? 'True'
                      : r[h] === false
                      ? 'False'
                      : r[h] === null
                      ? 'Null'
                      : r[h]}
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </TableWrapper>
  )
}

export const TableWrapper = styled.table``
export const TableHead = styled.thead``
export const TableBody = styled.tbody``
export const TableRow = styled.tr`
  height: 48px;
`
export const TableCell = styled.td`
  heigth: 48px;
  font-size: 16px;
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
  padding: 5px;
`
